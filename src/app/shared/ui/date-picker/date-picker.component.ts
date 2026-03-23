import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParkingService } from '../../../core/services/parking.service';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss'
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
