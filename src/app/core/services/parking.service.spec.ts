import { vi } from 'vitest';

vi.mock('@angular/fire/firestore', () => ({
  Firestore: class {},
  collection: vi.fn(),
  doc: vi.fn((_firestore: unknown, path: string) => ({ type: 'doc', path })),
  query: vi.fn(),
  where: vi.fn(),
  setDoc: vi.fn(() => Promise.resolve()),
  updateDoc: vi.fn(() => Promise.resolve()),
  deleteDoc: vi.fn(() => Promise.resolve()),
  onSnapshot: vi.fn((_q: unknown, callback: (snapshot: unknown) => void) => {
    (globalThis as Record<string, unknown>)['__onSnapshotCallback'] = callback;
    return () => {};
  }),
  collectionData: vi.fn(),
}));

import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { Firestore, setDoc } from '@angular/fire/firestore';
import { ParkingService } from './parking.service';
import type { Vehicle } from '../models/vehicle.model';

function simulateSnapshot(vehicles: Vehicle[]): void {
  const mockSnapshot = {
    forEach: (callback: (doc: { data: () => Vehicle }) => void) => {
      vehicles.forEach(v => callback({ data: () => v }));
    },
  };
  const callback = (globalThis as Record<string, unknown>)['__onSnapshotCallback'] as (
    s: typeof mockSnapshot
  ) => void;
  if (callback) callback(mockSnapshot);
  TestBed.flushEffects();
}

describe('ParkingService', () => {
  let service: ParkingService;
  let store: Record<string, string> = {};

  const mockLocalStorage = {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };

  beforeEach(() => {
    store = {};
    vi.clearAllMocks();
    vi.stubGlobal('localStorage', mockLocalStorage);

    TestBed.configureTestingModule({
      providers: [
        ParkingService,
        { provide: Firestore, useValue: {} },
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    });

    service = TestBed.inject(ParkingService);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('registerVehicle', () => {
    it('debería registrar un vehículo con placa normalizada a mayúsculas', async () => {
      await service.registerVehicle('abc123', 'Carro');

      expect(service.activeVehicles().length).toBe(1);
      expect(service.activeVehicles()[0].plate).toBe('ABC123');
      expect(service.activeVehicles()[0].type).toBe('Carro');
      expect(setDoc).toHaveBeenCalledTimes(1);
    });

    it('debería registrar un vehículo allDay', async () => {
      await service.registerVehicle('XYZ789', 'Moto', true);

      expect(service.activeVehicles()[0].allDay).toBe(true);
    });

    it('debería alertar si la placa ya existe activa y no llamar a setDoc', async () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

      await service.registerVehicle('ABC123', 'Carro');
      await service.registerVehicle('ABC123', 'Moto');

      expect(alertSpy).toHaveBeenCalledWith('La placa ABC123 ya está registrada como activa.');
      expect(setDoc).toHaveBeenCalledTimes(1);

      alertSpy.mockRestore();
    });

    it('debería persistir en localStorage vía effect', async () => {
      await service.registerVehicle('ABC123', 'Carro');

      TestBed.flushEffects();

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'parkly_active',
        expect.stringContaining('ABC123')
      );
    });
  });

  describe('checkoutVehicle', () => {
    it('debería cobrar 1 hora (2500) para carro con menos de 60 min', async () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2026, 5, 14, 10, 45, 0));

      simulateSnapshot([
        { plate: 'ABC123', type: 'Carro', entryTime: new Date(2026, 5, 14, 10, 0, 0).toISOString() },
      ]);
      await service.checkoutVehicle('ABC123');

      expect(setDoc).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({ totalToPay: 2500, totalTimeStr: '00:45:00' })
      );
      vi.useRealTimers();
    });

    it('debería cobrar 1 hora (2500) para carro con 1h05 (gracia 10 min)', async () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2026, 5, 14, 11, 5, 0));

      simulateSnapshot([
        { plate: 'ABC123', type: 'Carro', entryTime: new Date(2026, 5, 14, 10, 0, 0).toISOString() },
      ]);
      await service.checkoutVehicle('ABC123');

      expect(setDoc).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({ totalToPay: 2500 })
      );
      vi.useRealTimers();
    });

    it('debería cobrar 2 horas (5000) para carro con 1h12', async () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2026, 5, 14, 11, 12, 0));

      simulateSnapshot([
        { plate: 'ABC123', type: 'Carro', entryTime: new Date(2026, 5, 14, 10, 0, 0).toISOString() },
      ]);
      await service.checkoutVehicle('ABC123');

      expect(setDoc).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({ totalToPay: 5000 })
      );
      vi.useRealTimers();
    });

    it('debería cobrar 2 horas (2000) para moto con 1h15', async () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2026, 5, 14, 11, 15, 0));

      simulateSnapshot([
        { plate: 'MOTO1', type: 'Moto', entryTime: new Date(2026, 5, 14, 10, 0, 0).toISOString() },
      ]);
      await service.checkoutVehicle('MOTO1');

      expect(setDoc).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({ totalToPay: 2000 })
      );
      vi.useRealTimers();
    });

    it('debería cobrar 15000 si es allDay', async () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2026, 5, 14, 18, 0, 0));

      simulateSnapshot([
        { plate: 'ALLDAY', type: 'Carro', entryTime: new Date(2026, 5, 14, 10, 0, 0).toISOString(), allDay: true },
      ]);
      await service.checkoutVehicle('ALLDAY');

      expect(setDoc).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({ totalToPay: 15000 })
      );
      vi.useRealTimers();
    });

    it('debería escribir en active y past collections', async () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2026, 5, 14, 11, 0, 0));

      simulateSnapshot([
        { plate: 'ABC123', type: 'Carro', entryTime: new Date(2026, 5, 14, 10, 0, 0).toISOString() },
      ]);
      await service.checkoutVehicle('ABC123');

      expect(setDoc).toHaveBeenCalledTimes(2);
      const calls = vi.mocked(setDoc).mock.calls;
      expect(calls[0][1]).toMatchObject({ totalToPay: 2500 });
      expect(calls[1][1]).toMatchObject({ totalToPay: 2500 });
      vi.useRealTimers();
    });

    it('debería retornar sin cambios si el vehículo no existe', async () => {
      await service.checkoutVehicle('NOEXIST');

      expect(setDoc).not.toHaveBeenCalled();
    });
  });

  describe('formatTimeDiff', () => {
    it('debería formatear 0 ms como 00:00:00', () => {
      expect(service.formatTimeDiff(0)).toBe('00:00:00');
    });

    it('debería formatear 3661000 ms como 01:01:01', () => {
      expect(service.formatTimeDiff(3661000)).toBe('01:01:01');
    });

    it('debería formatear 86399000 ms como 23:59:59', () => {
      expect(service.formatTimeDiff(86399000)).toBe('23:59:59');
    });

    it('debería devolver 00:00:00 para valores negativos', () => {
      expect(service.formatTimeDiff(-5000)).toBe('00:00:00');
    });
  });

  describe('carga desde localStorage', () => {
    it('debería cargar vehículos activos desde localStorage al iniciar', () => {
      TestBed.resetTestingModule();

      store = {};
      vi.clearAllMocks();
      vi.stubGlobal('localStorage', mockLocalStorage);

      const vehicles: Vehicle[] = [
        { plate: 'STORED1', type: 'Carro', entryTime: new Date(2026, 5, 14, 9, 0, 0).toISOString() },
      ];
      localStorage.setItem('parkly_active', JSON.stringify(vehicles));

      TestBed.configureTestingModule({
        providers: [
          ParkingService,
          { provide: Firestore, useValue: {} },
          { provide: PLATFORM_ID, useValue: 'browser' },
        ],
      });
      service = TestBed.inject(ParkingService);

      expect(service.activeVehicles().length).toBe(1);
      expect(service.activeVehicles()[0].plate).toBe('STORED1');
    });

    it('debería iniciar con lista vacía si no hay datos', () => {
      expect(service.activeVehicles().length).toBe(0);
      expect(service.pastVehicles().length).toBe(0);
    });
  });

  describe('setSelectedDate', () => {
    it('debería actualizar la fecha seleccionada', () => {
      service.setSelectedDate('2026-06-15');

      expect(service.selectedDate()).toBe('2026-06-15');
    });
  });
});
