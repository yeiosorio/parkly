# Patrones de testing — parkly

## Mock de Firestore

Usar al inicio del spec, antes de importar el servicio bajo test:

```typescript
import { vi } from 'vitest';

vi.mock('@angular/fire/firestore', () => ({
  Firestore: class {},
  collection: vi.fn((firestore, path) => ({ type: 'collection', path })),
  doc: vi.fn((firestore, path) => ({ type: 'doc', path })),
  query: vi.fn((ref, ...constraints) => ({ type: 'query', ref, constraints })),
  where: vi.fn((field, op, value) => ({ type: 'where', field, op, value })),
  setDoc: vi.fn(() => Promise.resolve()),
  updateDoc: vi.fn(() => Promise.resolve()),
  deleteDoc: vi.fn(() => Promise.resolve()),
  onSnapshot: vi.fn((q, callback) => {
    (globalThis as Record<string, unknown>).__onSnapshotCallback = callback;
    return () => {};
  }),
  collectionData: vi.fn(),
}));
```

Simular datos entrando por snapshot:

```typescript
const mockSnapshot = {
  forEach: (callback: (doc: { data: () => Vehicle }) => void) => {
    mockVehicles.forEach(v => callback({ data: () => v }));
  },
};

const callback = (globalThis as Record<string, unknown>).__onSnapshotCallback as (s: typeof mockSnapshot) => void;
callback(mockSnapshot);
```

## Mock de localStorage

```typescript
let store: Record<string, string> = {};
const mockLocalStorage = {
  getItem: vi.fn((key: string) => store[key] ?? null),
  setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
  removeItem: vi.fn((key: string) => { delete store[key]; }),
  clear: vi.fn(() => { store = {}; }),
};
vi.stubGlobal('localStorage', mockLocalStorage);
```

Reset en `beforeEach`: `store = {}` y `mockClear()` en los mocks.

## TestBed para servicios

```typescript
import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';

beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [
      ParkingService,
      { provide: Firestore, useValue: {} },
      { provide: PLATFORM_ID, useValue: 'browser' },
    ],
  });
});
```

## Timers

```typescript
afterEach(() => {
  vi.useRealTimers();
});

it('...', async () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 5, 14, 10, 0, 0));
  // ...
  vi.advanceTimersByTime(2000);
});
```

## Effects y persistencia

Tras mutar signals vía callbacks externos:

```typescript
TestBed.flushEffects();
expect(mockLocalStorage.setItem).toHaveBeenCalledWith('parkly_active', expect.stringContaining('ABC123'));
```

## Tarifas de negocio (referencia rápida)

| Caso | Esperado |
| ---- | -------- |
| Carro, &lt; 60 min | 1 hora → 2500 |
| Carro, 1h05 (gracia 10 min) | 1 hora → 2500 |
| Carro, 1h12 | 2 horas → 5000 |
| Moto, 1h15 | 2 horas → 2000 |
| allDay | 15000 fijo |
| Placa duplicada activa | `alert`, sin `setDoc` |

Valores definidos en `src/app/core/models/vehicle.model.ts` (`TARIFFS`).

## Mock de window.alert

```typescript
const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
// ...
alertSpy.mockRestore();
```
