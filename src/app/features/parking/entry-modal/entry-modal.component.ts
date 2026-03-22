import { Component, inject, output, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ParkingService } from '../../../core/services/parking.service';
import { VehicleType } from '../../../core/models/vehicle.model';

@Component({
  selector: 'app-entry-modal',
  standalone: true,
  imports: [FormsModule],
  template: `
    <!-- Backdrop -->
    <div
      class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      (click)="close.emit()"
    >
      <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"></div>

      <!-- Panel -->
      <div
        class="relative z-10 w-full max-w-md bg-white rounded-t-[2.5rem] sm:rounded-3xl shadow-2xl p-8 flex flex-col gap-6 animate-in slide-in-from-bottom duration-300 sm:zoom-in-95"
        (click)="$event.stopPropagation()"
      >
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div>
            <h2 id="modal-title" class="text-xl font-bold text-slate-800">Registrar Vehículo</h2>
            <p class="text-sm text-slate-400 mt-0.5">Ingresa los datos de entrada</p>
          </div>
          <button
            (click)="close.emit()"
            class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Form -->
        <form (ngSubmit)="onSubmit()" class="flex flex-col gap-5" novalidate>

          <!-- Plate -->
          <div class="flex flex-col gap-1.5">
            <label for="plate" class="text-sm font-semibold text-slate-600">Placa</label>
            <input
              #plateInput
              id="plate"
              name="plate"
              type="text"
              [(ngModel)]="plate"
              required
              maxlength="8"
              placeholder="Ej: ABC 123"
              autocomplete="off"
              class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-mono text-lg tracking-widest uppercase placeholder:normal-case placeholder:tracking-normal placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
            />
          </div>

          <!-- Vehicle Type — radio cards -->
          <div class="flex flex-col gap-2">
            <p class="text-sm font-semibold text-slate-600">Tipo de vehículo</p>
            <div class="flex gap-3">
              <label class="flex-1 cursor-pointer">
                <input type="radio" name="type" value="Carro" [(ngModel)]="type" class="sr-only"/>
                <div
                  class="flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-semibold transition-all duration-200"
                  [class]="type === 'Carro'
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                  </svg>
                  Carro
                </div>
              </label>
              <label class="flex-1 cursor-pointer">
                <input type="radio" name="type" value="Moto" [(ngModel)]="type" class="sr-only"/>
                <div
                  class="flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-semibold transition-all duration-200"
                  [class]="type === 'Moto'
                    ? 'border-amber-500 bg-amber-50 text-amber-700'
                    : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 7c0-1.1-.9-2-2-2h-3l2 4h-3l-2-4H9L7 9H4C2.34 9 1 10.34 1 12v3h2c0 1.66 1.34 3 3 3s3-1.34 3-3h8c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5h-3l-2-3zM6 16.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                  </svg>
                  Moto
                </div>
              </label>
            </div>
          </div>

          <!-- All Day Checkbox -->
          <div class="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 flex items-center justify-between cursor-pointer group hover:bg-indigo-50 transition-colors"
               (click)="allDay = !allDay">
            <div class="flex flex-col">
              <span class="text-sm font-bold text-indigo-900 leading-none">Día completo (Tarifa Plana)</span>
              <span class="text-[11px] text-indigo-400 mt-1 font-medium italic">Se cobrará una tarifa fija de $15.000</span>
            </div>
            <div class="relative inline-flex items-center">
              <input type="checkbox" name="allDay" [(ngModel)]="allDay" class="sr-only"/>
              <div class="w-11 h-6 bg-slate-200 rounded-full transition-colors duration-200 group-hover:bg-slate-300 ring-4 ring-transparent"
                   [class]="allDay ? '!bg-indigo-500' : ''"></div>
              <div class="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 shadow-sm"
                   [class]="allDay ? 'translate-x-5' : ''"></div>
            </div>
          </div>

          <!-- Submit -->
          <button
            type="submit"
            [disabled]="!plate.trim()"
            class="w-full py-3.5 rounded-xl bg-indigo-600 text-white font-bold text-sm tracking-wide hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98]"
          >
            Registrar entrada
          </button>
        </form>
      </div>
    </div>
  `
})
export class EntryModalComponent implements AfterViewInit {
  private parking = inject(ParkingService);

  @ViewChild('plateInput') plateInput!: ElementRef<HTMLInputElement>;

  close = output<void>();
  plate = '';
  type: VehicleType = 'Carro';
  allDay = false;

  ngAfterViewInit(): void {
    // Small timeout to ensure modal animation is playing/done
    setTimeout(() => {
      this.plateInput.nativeElement.focus();
    }, 100);
  }

  onSubmit(): void {
    if (!this.plate.trim()) return;
    this.parking.registerVehicle(this.plate, this.type, this.allDay);
    this.close.emit();
  }
}
