export type VehicleType = 'Carro' | 'Moto';

export interface Vehicle {
  plate: string;
  type: VehicleType;
  entryTime: string; // ISO string
  exitTime?: string;
  totalTimeStr?: string; // HH:MM:SS
  totalToPay?: number;
  allDay?: boolean;
}

export const TARIFFS: Record<VehicleType, number> = {
  Carro: 2500,
  Moto: 1000
};
