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
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
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
