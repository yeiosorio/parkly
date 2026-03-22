import { Component, computed, inject, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ParkingService } from '../../../core/services/parking.service';
import { Vehicle } from '../../../core/models/vehicle.model';

@Component({
  selector: 'app-vehicle-card',
  standalone: true,
  imports: [DatePipe],
  template: `
    <div
      class="rounded-xl border transition-all duration-300 p-3 sm:p-4 flex flex-col gap-1.5"
      [class]="cardClasses()"
    >
      <!-- Top Row: Icon + Plate + Timer/Total -->
      <div class="flex items-center justify-between gap-3">
        <div class="flex items-center gap-3 min-w-0">
          <!-- Icon -->
          <div
            class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
            [class]="vehicle().type === 'Carro' ? 'bg-indigo-100 text-indigo-600' : 'bg-amber-100 text-amber-600'"
          >
            @if (vehicle().type === 'Carro') {
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
              </svg>
            } @else {
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 7c0-1.1-.9-2-2-2h-3l2 4h-3l-2-4H9L7 9H4C2.34 9 1 10.34 1 12v3h2c0 1.66 1.34 3 3 3s3-1.34 3-3h8c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5h-3l-2-3zM6 16.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
              </svg>
            }
          </div>

          <!-- Info: Plate + Badges -->
          <div class="min-w-0">
            <div class="flex items-center gap-1.5 flex-wrap">
              <span
                class="text-lg font-bold tracking-widest leading-none uppercase"
                [class]="vehicle().exitTime ? 'text-green-800' : 'text-slate-800'"
              >{{ vehicle().plate }}</span>
              
              <div class="flex gap-1 items-center">
                <span
                  class="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-md leading-none border shrink-0"
                  [class]="vehicle().type === 'Carro' ? 'bg-indigo-50 border-indigo-100 text-indigo-500' : 'bg-amber-50 border-amber-100 text-amber-500'"
                >{{ vehicle().type }}</span>
                
                @if (vehicle().allDay) {
                  <span class="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-md leading-none bg-blue-50 border border-blue-100 text-blue-500 shrink-0">Día</span>
                }
              </div>
            </div>
            
            <p class="text-[10px] text-slate-400 font-medium mt-1">
              Ingreso: <span class="text-slate-500 font-bold">{{ vehicle().entryTime | date:'h:mm a' }}</span>
            </p>
          </div>
        </div>

        <!-- Right Side: Money/Time + Action -->
        <div class="flex items-center gap-3 shrink-0">
          <div class="text-right flex flex-col items-end">
            @if (!vehicle().exitTime) {
              <span class="text-[9px] text-slate-400 uppercase font-black tracking-widest leading-none mb-1 opacity-60">Tiempo</span>
              <span class="text-lg font-black text-indigo-600 tabular-nums leading-none tracking-tight">{{ liveTimer() }}</span>
            } @else {
              <span class="text-[9px] text-green-600 uppercase font-black tracking-widest leading-none mb-1 opacity-60">Cobrado</span>
              <span class="text-xl font-black text-green-700 tabular-nums leading-none">&#36;{{ vehicle().totalToPay?.toLocaleString('es-CO') }}</span>
              <span class="text-[10px] text-slate-400 font-bold mt-0.5">{{ vehicle().totalTimeStr }}</span>
            }
          </div>

          <!-- Action Button -->
          @if (!vehicle().exitTime) {
            <button
              (click)="stop.emit(vehicle().plate)"
              title="Finalizar parqueo"
              class="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-red-500 text-slate-400 hover:text-white flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:shadow-red-200 group active:scale-95 shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 transition-transform group-hover:scale-125" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="6" width="12" height="12" rx="2"/>
              </svg>
            </button>
          } @else {
            <div class="w-10 h-10 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center shrink-0 border border-green-200">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            </div>
          }
        </div>
      </div>

      <!-- Bottom Line: Status Indicator -->
      @if (vehicle().exitTime) {
        <div class="flex items-center gap-1.5 mt-2 pt-2 border-t border-green-100">
          <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>
          <span class="text-[10px] text-green-600 font-bold uppercase tracking-wider">
            Finalizó a las {{ vehicle().exitTime | date:'h:mm a' }}
          </span>
        </div>
      }
    </div>

  `
})
export class VehicleCardComponent {
  private parking = inject(ParkingService);

  vehicle = input.required<Vehicle>();
  stop = output<string>();

  cardClasses = computed(() =>
    this.vehicle().exitTime
      ? 'bg-green-50 border-green-200 shadow-sm shadow-green-100'
      : 'bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300'
  );

  liveTimer = computed(() => {
    const diffMs = this.parking.now().getTime() - new Date(this.vehicle().entryTime).getTime();
    return this.parking.formatTimeDiff(diffMs);
  });
}
