import { effect, Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Vehicle, TARIFFS, VehicleType } from '../models/vehicle.model';
import { 
  Firestore, 
  collection, 
  collectionData, 
  doc, 
  setDoc, 
  updateDoc, 
  query, 
  where,
  onSnapshot,
  deleteDoc
} from '@angular/fire/firestore';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ParkingService {
  private platformId = inject(PLATFORM_ID);
  private firestore = inject(Firestore);

  private readonly ACTIVE_COLLECTION = 'activeVehicles';
  private readonly PAST_COLLECTION = 'pastVehicles';

  // --- State ---
  private activeVehiclesSig = signal<Vehicle[]>([]);
  readonly activeVehicles = this.activeVehiclesSig.asReadonly();

  private pastVehiclesSig = signal<Vehicle[]>([]);
  readonly pastVehicles = this.pastVehiclesSig.asReadonly();

  // New: Current selected date for filtering (using Local Date YYYY-MM-DD)
  private selectedDateSig = signal<string>(this._getLocalISODate(new Date()));
  readonly selectedDate = this.selectedDateSig.asReadonly();

  // Global reactive clock — ticks every second, shared by ALL cards
  private _now = signal<Date>(new Date());
  readonly now = this._now.asReadonly();

  constructor() {
    this._loadFromStorage();
    
    // Initial sync will be triggered by effect if we use one, 
    // or manually here for the first time.
    this._initFirestoreSync();

    if (isPlatformBrowser(this.platformId)) {
      setInterval(() => this._now.set(new Date()), 1000);
    }

    // Persist to Storage whenever signals change (for local-first speed)
    effect(() => {
      const active = this.activeVehiclesSig();
      const past = this.pastVehiclesSig();
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('parkly_active', JSON.stringify(active));
        localStorage.setItem('parkly_past', JSON.stringify(past));
      }
    });
  }

  setSelectedDate(date: string): void {
    this.selectedDateSig.set(date);
    this._initFirestoreSync();
  }

  private _initFirestoreSync(): void {
    const dateStr = this.selectedDateSig();
    
    // To query correctly, we find the start and end of the local day in UTC
    const [y, m, d] = dateStr.split('-').map(Number);
    const localStart = new Date(y, m - 1, d, 0, 0, 0);
    const localEnd = new Date(y, m - 1, d, 23, 59, 59, 999);

    const startOfDay = localStart.toISOString();
    const endOfDay = localEnd.toISOString();

    // Sync vehicles from Firestore filtered by entryTime of the selected day
    const activeRef = collection(this.firestore, this.ACTIVE_COLLECTION);
    const q = query(
      activeRef, 
      where('entryTime', '>=', startOfDay),
      where('entryTime', '<=', endOfDay)
    );

    onSnapshot(q, (snapshot) => {
      const vehicles: Vehicle[] = [];
      snapshot.forEach((doc) => vehicles.push(doc.data() as Vehicle));
      // Sort by entryTime descending
      vehicles.sort((a, b) => new Date(b.entryTime).getTime() - new Date(a.entryTime).getTime());
      this.activeVehiclesSig.set(vehicles);
    });

    // Note: pastVehicles sync could be merged or handled similarly if needed, 
    // but for now we focus on the main list being filtered by day.
  }

  // --- Public API ---

  async registerVehicle(plate: string, type: VehicleType, allDay: boolean = false): Promise<void> {
    const p = plate.toUpperCase().trim();
    if (this.activeVehiclesSig().some(v => v.plate === p)) {
      alert(`La placa ${p} ya está registrada como activa.`);
      return;
    }
    const vehicle: Vehicle = { plate: p, type, entryTime: new Date().toISOString(), allDay };
    
    // Optimistic update (optional, since onSnapshot will catch it)
    this.activeVehiclesSig.update(list => [...list, vehicle]);

    // Firestore update
    const docRef = doc(this.firestore, `${this.ACTIVE_COLLECTION}/${p}`);
    await setDoc(docRef, vehicle);
  }

  async checkoutVehicle(plate: string): Promise<void> {
    const vehicle = this.activeVehiclesSig().find(v => v.plate === plate);
    if (!vehicle) return;

    const exitDate = new Date();
    const diffMs = exitDate.getTime() - new Date(vehicle.entryTime).getTime();
    const totalMinutes = Math.floor(diffMs / 60_000);

    let totalToPay = 0;

    if (vehicle.allDay) {
      totalToPay = 15000;
    } else {
      const fullHours = Math.floor(totalMinutes / 60);
      const extraMinutes = totalMinutes % 60;
      
      // Charge 1st hour always even if < 10min. 
      // Grace period of 10min only applies from 2nd hour onwards.
      let hoursToCharge = 0;
      if (totalMinutes < 60) {
        hoursToCharge = 1;
      } else {
        hoursToCharge = extraMinutes > 10 ? fullHours + 1 : fullHours;
      }
      totalToPay = hoursToCharge * TARIFFS[vehicle.type];
    }

    const updatedVehicle: Vehicle = {
      ...vehicle,
      exitTime: exitDate.toISOString(),
      totalTimeStr: this.formatTimeDiff(diffMs),
      totalToPay: totalToPay,
    };

    // Firestore: Update active document with exit info, and also add to past
    const activeDocRef = doc(this.firestore, `${this.ACTIVE_COLLECTION}/${plate}`);
    const pastDocRef = doc(this.firestore, `${this.PAST_COLLECTION}/${plate}_${exitDate.getTime()}`);

    // Update active document so it stays visible in the dashboard with the calculation
    await setDoc(activeDocRef, updatedVehicle);
    // Also record in history
    await setDoc(pastDocRef, updatedVehicle);
    
    // We dont call deleteDoc(activeDocRef) here because the user wants to see the result
  }

  formatTimeDiff(ms: number): string {
    const s = Math.max(0, Math.floor(ms / 1000));
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${this._pad(h)}:${this._pad(m)}:${this._pad(sec)}`;
  }

  // --- Private helpers ---

  private _loadFromStorage(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      const active = localStorage.getItem('parkly_active');
      const past = localStorage.getItem('parkly_past');
      if (active) this.activeVehiclesSig.set(JSON.parse(active));
      if (past) this.pastVehiclesSig.set(JSON.parse(past));
    } catch {
      // Malformed storage — start fresh
    }
  }

  private _getLocalISODate(date: Date): string {
    const y = date.getFullYear();
    const m = this._pad(date.getMonth() + 1);
    const d = this._pad(date.getDate());
    return `${y}-${m}-${d}`;
  }

  private _pad(n: number): string {
    return n.toString().padStart(2, '0');
  }
}
