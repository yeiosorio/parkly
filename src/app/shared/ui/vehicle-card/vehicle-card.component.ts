import { Component, computed, inject, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ParkingService } from '../../../core/services/parking.service';
import { Vehicle } from '../../../core/models/vehicle.model';

@Component({
  selector: 'app-vehicle-card',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './vehicle-card.component.html',
  styleUrl: './vehicle-card.component.scss'
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
