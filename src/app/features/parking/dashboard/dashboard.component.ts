import { Component, computed, inject, signal } from '@angular/core';
import { ParkingService } from '../../../core/services/parking.service';
import { Vehicle, VehicleType } from '../../../core/models/vehicle.model';
import { VehicleCardComponent } from '../../../shared/ui/vehicle-card/vehicle-card.component';
import { EntryModalComponent } from '../entry-modal/entry-modal.component';
import { DatePickerComponent } from '../../../shared/ui/date-picker/date-picker.component';

type TabFilter = 'all' | VehicleType;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [VehicleCardComponent, EntryModalComponent, DatePickerComponent],
  template: `
    <div class="min-h-screen bg-slate-50 font-sans">

      <!-- ── Header ─────────────────────────────────────────── -->
      <header class="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 overflow-hidden">
        <div class="max-w-2xl mx-auto px-4 sm:px-5 h-16 flex items-center justify-between gap-2 flex-nowrap">
          <!-- Logo -->
          <div class="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <div class="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z"/>
              </svg>
            </div>
            <span class="font-bold text-slate-800 text-lg tracking-tight">Parkly</span>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <!-- Daily Revenue -->
            <div class="flex items-center gap-1.5 sm:gap-2 bg-green-50 px-2 sm:px-3 py-1 rounded-xl border border-green-100 shadow-sm group hover:scale-105 transition-all duration-300 min-w-[125px] justify-center flex-nowrap shrink-0">
              <div class="w-6 h-6 rounded-lg bg-green-500 flex items-center justify-center text-white shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </div>
              <div class="flex flex-col leading-tight pt-0.5 shrink-0">
                <span class="text-[8px] text-green-600 uppercase font-black tracking-widest opacity-60 whitespace-nowrap">Recaudo</span>
                <span class="text-xs sm:text-sm font-bold text-green-700 tabular-nums whitespace-nowrap">
                  &#36;{{ totalRevenue().toLocaleString('es-CO') }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- ── Date Filter Bar ───────────────────────────────── -->
      <div class="sticky top-[64px] z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 py-2">
        <div class="max-w-2xl mx-auto px-4 sm:px-5">
          <app-date-picker />
        </div>
      </div>

      <!-- ── Main ───────────────────────────────────────────── -->
      <main class="max-w-2xl mx-auto px-4 sm:px-5 py-6 space-y-5 overflow-hidden">

        <!-- Stats -->
        <div class="grid grid-cols-3 gap-2 sm:gap-3">
          <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-2.5 sm:p-4 text-center min-w-0 flex flex-col items-center justify-center">
            <p class="text-lg sm:text-2xl font-bold text-slate-800 leading-tight">{{ vehicles().length }}</p>
            <p class="text-[10px] sm:text-xs text-slate-400 uppercase font-semibold tracking-wider truncate w-full mt-0.5">Total hoy</p>
          </div>
          <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-2.5 sm:p-4 text-center min-w-0 flex flex-col items-center justify-center">
            <p class="text-lg sm:text-2xl font-bold text-indigo-600 leading-tight">{{ activeCount() }}</p>
            <p class="text-[10px] sm:text-xs text-indigo-400 uppercase font-semibold tracking-wider truncate w-full mt-0.5">Dentro</p>
          </div>
          <div class="bg-white rounded-2xl border border-slate-100 shadow-sm p-2.5 sm:p-4 text-center min-w-0 flex flex-col items-center justify-center">
            <p class="text-lg sm:text-2xl font-bold text-green-600 leading-tight">{{ exitedCount() }}</p>
            <p class="text-[10px] sm:text-xs text-green-400 uppercase font-semibold tracking-wider truncate w-full mt-0.5">Salieron</p>
          </div>
        </div>

        <!-- Filter Tabs -->
        <div class="flex flex-wrap sm:flex-nowrap gap-1.5 bg-slate-100 rounded-2xl p-1">
          @for (tab of tabs; track tab.value) {
            <button
              (click)="activeTab.set(tab.value)"
              class="flex-1 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
              [class]="activeTab() === tab.value
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'"
            >
              {{ tab.label }}
              <span
                class="ml-1.5 text-xs font-bold"
                [class]="activeTab() === tab.value ? 'text-indigo-500' : 'text-slate-400'"
              >{{ tab.count() }}</span>
            </button>
          }
        </div>

        <!-- Vehicle List -->
        @if (filtered().length === 0) {
          <div class="flex flex-col items-center justify-center py-20 text-center">
            <div class="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-slate-300" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z"/>
              </svg>
            </div>
            <p class="text-slate-400 text-sm font-medium">Sin vehículos registrados</p>
            <p class="text-slate-300 text-xs mt-1">Usa el botón + para registrar uno</p>
          </div>
        } @else {
          <div class="flex flex-col gap-3">
            @for (v of filtered(); track v.plate) {
              <app-vehicle-card [vehicle]="v" (stop)="onStop($event)"/>
            }
          </div>
        }
      </main>

      <!-- ── Entry Modal ────────────────────────────────────── -->
      @if (showModal()) {
        <app-entry-modal (close)="showModal.set(false)"/>
      }

      <!-- ── Floating Action Button (FAB) ────────────────────── -->
      <button
        (click)="showModal.set(true)"
        title="Registrar vehículo"
        aria-label="Registrar vehículo"
        class="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-2xl shadow-indigo-300 hover:bg-indigo-700 hover:scale-110 active:scale-90 transition-all duration-300 z-50 group overflow-hidden"
      >
        <div class="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14M5 12h14"/>
        </svg>
      </button>
    </div>
  `
})
export class DashboardComponent {
  private parking = inject(ParkingService);

  showModal = signal(false);
  activeTab = signal<TabFilter>('all');

  vehicles = this.parking.activeVehicles;
  activeCount = computed(() => this.vehicles().filter(v => !v.exitTime).length);
  exitedCount = computed(() => this.vehicles().filter(v => !!v.exitTime).length);
  totalRevenue = computed(() => this.vehicles().reduce((acc, v) => acc + (v.totalToPay || 0), 0));

  allCount = computed(() => this.vehicles().length);
  carroCount = computed(() => this.vehicles().filter(v => v.type === 'Carro').length);
  motoCount = computed(() => this.vehicles().filter(v => v.type === 'Moto').length);

  filtered = computed<Vehicle[]>(() => {
    const tab = this.activeTab();
    return tab === 'all' ? this.vehicles() : this.vehicles().filter(v => v.type === tab);
  });

  tabs = [
    { value: 'all' as TabFilter, label: 'Todos', count: this.allCount },
    { value: 'Carro' as TabFilter, label: 'Carros', count: this.carroCount },
    { value: 'Moto' as TabFilter, label: 'Motos', count: this.motoCount },
  ];

  onStop(plate: string): void {
    this.parking.checkoutVehicle(plate);
  }
}
