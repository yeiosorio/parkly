import { Component, inject, output, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ParkingService } from '../../../core/services/parking.service';
import { VehicleType } from '../../../core/models/vehicle.model';

@Component({
  selector: 'app-entry-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './entry-modal.component.html',
  styleUrl: './entry-modal.component.scss'
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
