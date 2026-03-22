import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParkingService } from '../../../core/services/parking.service';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center gap-2 w-full max-w-full overflow-hidden">
      <!-- Horizontal Scroll of Days -->
      <div class="flex-1 flex items-center gap-1.5 bg-slate-100/50 p-1 rounded-2xl border border-slate-200/60 transition-all duration-300 overflow-x-auto no-scrollbar min-w-0">
        @for (day of recentDays(); track day.full) {
          <button
            (click)="selectDate(day.full)"
            class="px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex flex-col items-center min-w-[48px] sm:min-w-[56px] shrink-0 relative overflow-hidden group"
            [class]="selectedDate() === day.full 
              ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200/50' 
              : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200/30'"
          >
            <span class="text-[9px] sm:text-[10px] uppercase tracking-tighter opacity-70 mb-0.5 group-hover:scale-95 transition-transform shrink-0">{{ day.weekday }}</span>
            <span class="text-xs sm:text-sm group-hover:scale-110 transition-transform shrink-0">{{ day.dayNum }}</span>
            
            @if (selectedDate() === day.full) {
              <span class="absolute bottom-1 w-1 h-1 rounded-full bg-indigo-500 animate-pulse"></span>
            }
          </button>
        }
      </div>

      <!-- Custom Date Picker Trigger -->
      <div class="relative items-center flex shrink-0">
         <input 
            type="date" 
            [value]="selectedDate()"
            (change)="onManualDateChange($event)"
            class="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
          >
          <button
            class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white border border-slate-200/60 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 flex items-center justify-center transition-all duration-200 hover:shadow-sm"
            title="Más fechas"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </button>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; max-width: 100%; }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    input[type="date"]::-webkit-calendar-picker-indicator {
      cursor: pointer;
    }
  `]
})
export class DatePickerComponent {
  private parking = inject(ParkingService);
  selectedDate = this.parking.selectedDate;

  recentDays = computed(() => {
    const days = [];
    const now = new Date();
    // Use local date calculation to avoid timezone shifts
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);

      // Manual local YYYY-MM-DD to match the input type="date"
      const y = d.getFullYear();
      const m = (d.getMonth() + 1).toString().padStart(2, '0');
      const dayNum = d.getDate().toString().padStart(2, '0');
      const localStr = `${y}-${m}-${dayNum}`;

      days.push({
        full: localStr,
        weekday: d.toLocaleDateString('es-CO', { weekday: 'short' }).replace('.', ''),
        dayNum: d.getDate(),
      });
    }
    return days;
  });

  selectDate(date: string) {
    this.parking.setSelectedDate(date);
  }

  onManualDateChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.value) {
      this.parking.setSelectedDate(input.value);
    }
  }
}
