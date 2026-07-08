# Parkly Testing Subagent Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create an OpenCode Skill + Agent specialized in testing for parkly (Angular 21 + Vitest + jsdom + Firebase).

**Architecture:** Skill at `.opencode/skills/parkly-testing/SKILL.md` as source of truth for patterns/conventions; Agent at `.opencode/agents/parkly-testing.md` as subagent that references the skill; `opencode.json` updated to register the skills path.

**Tech Stack:** Vitest 4, Angular 21, jsdom 28, Firebase 12, OpenCode

---

### Task 1: Create skill directory and SKILL.md

**Files:**
- Create: `.opencode/skills/parkly-testing/SKILL.md`

- [ ] **Step 1: Create directory**

```bash
New-Item -ItemType Directory -Path ".opencode/skills/parkly-testing" -Force
```

- [ ] **Step 2: Write SKILL.md**

```markdown
---
name: parkly-testing
description: Use when the user asks to write tests, run test suite, diagnose failures, check coverage, or any testing task in parkly. Keywords: test, spec, ng test, cobertura, fallo, vitest, spec.ts, unit test, Vitest, TestBed.
---

# Parkly Testing

Skill para escribir, ejecutar y corregir tests del proyecto parkly (Angular 21 + Vitest + jsdom + Firebase).

## Convenciones del proyecto

- **Runner**: Vitest via `ng test` (builder `@angular/build:unit-test`)
- **Entorno**: jsdom (sin browser real)
- **APIs globales**: `describe`, `it`, `expect`, `vi` desde vitest (tipadas via `vitest/globals` en `tsconfig.spec.json`)
- **Angular**: `TestBed`, `TestBed.flushEffects()` para effects/signals
- **Nombres en español**, descriptivos: `debería cobrar 2 horas si el vehículo excede la gracia`
- **Arrange-Act-Assert**: un comportamiento por `it`, agrupar por método/flujo en `describe`
- **Probar comportamiento observable** (signals, side effects, mocks) sobre detalles internos

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

Proveer en TestBed:

```typescript
TestBed.configureTestingModule({
  providers: [
    ParkingService,
    { provide: Firestore, useValue: {} },
    { provide: PLATFORM_ID, useValue: 'browser' },
  ],
});
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

Reset en `beforeEach`: `store = {}` y `mockClear()` en cada mock.

## Mock de timers

```typescript
afterEach(() => {
  vi.useRealTimers();
});

it('maneja tiempos correctamente', async () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 5, 14, 10, 0, 0));
  // ...
  vi.advanceTimersByTime(2000);
});
```

## Mock de window.alert

```typescript
const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
// ... assertions ...
alertSpy.mockRestore();
```

## Tarifas de negocio (referencia rápida)

| Caso | Esperado |
| ---- | -------- |
| Carro, < 60 min | 1 hora → 2500 |
| Carro, 1h05 (gracia 10 min) | 1 hora → 2500 |
| Carro, 1h12 | 2 horas → 5000 |
| Moto, 1h15 | 2 horas → 2000 |
| allDay | 15000 fijo |
| Placa duplicada activa | `alert`, sin `setDoc` |

Definidos en `src/app/core/models/vehicle.model.ts` (`TARIFFS`).

## Flujo de trabajo

1. Identificar SUT (servicio, componente, pipe, modelo)
2. Revisar spec existente o crear `*.spec.ts` junto al fuente
3. Escribir casos: happy path, bordes, errores
4. Ejecutar: `npx ng test --watch=false --include=<spec>`
5. Si falla → leer error → corregir código o spec (mínimo diff) → re-ejecutar hasta verde
6. Reportar: archivos tocados, tests pasados/fallidos

## Cuándo usar el Agent (@parkly-testing)

Tareas complejas que requieren iteraciones: crear tests para un servicio completo con mocks de Firebase, diagnosticar fallos en múltiples archivos.

Tareas simples para hacer directo: agregar un caso a un spec existente, corregir un mock.

## Edge cases

- Si `ng test` falla por error de compilación TypeScript, leer el error de TS, no el de Vitest
- Si no existe spec para un archivo, crear `*.spec.ts` junto al fuente
- Si hay spec existente pero vacío, corregirlo y ejecutar
- Restaurar timers y mocks en `afterEach`/`beforeEach`
- PowerShell: usar `;` en vez de `&&` para encadenar comandos

## Comandos de referencia

| Objetivo | Comando |
| -------- | ------- |
| Suite completa (CI) | `npx ng test --watch=false` |
| Un archivo | `npx ng test --watch=false --include=src/app/.../...spec.ts` |
| Filtrar por nombre | `npx ng test --watch=false -t "ParkingService"` |
| Cobertura | `npx ng test --watch=false --coverage` |
```

### Task 2: Create agent file

**Files:**
- Create: `.opencode/agents/parkly-testing.md`

- [ ] **Step 1: Write agent frontmatter and prompt**

```markdown
---
description: >
  Subagente especializado en escribir, ejecutar y corregir tests del proyecto
  parkly (Angular 21 + Vitest + jsdom + Firebase). Úsalo cuando necesites
  crear specs desde cero, diagnosticar fallos complejos, o iterar hasta
  que la suite pase.
mode: subagent
permission:
  edit: allow
  bash: allow
---

Eres un agente especializado en testing para el proyecto parkly.

## Instrucciones

1. **Carga la skill parkly-testing** y sigue todas sus convenciones (mock de Firestore, localStorage, timers, estilo AAA, nombres en español).
2. **Identifica el SUT**: busca el archivo fuente y su spec correspondiente.
3. **Si no existe spec**, créalo como `*.spec.ts` junto al fuente siguiendo los patrones de la skill.
4. **Ejecuta los tests** con:
   ```
   npx ng test --watch=false --include=<ruta-del-spec>
   ```
5. **Si fallan**: lee el output del error, corrige el código o el spec con el mínimo diff necesario, y re-ejecuta. Repite hasta verde.
6. **Si el error es de compilación** (TypeScript), corrige el tipo antes de asumir que es error de lógica.
7. **PowerShell**: usa `;` en vez de `&&` para encadenar comandos.
8. **Reporta al final**: archivos tocados, comando final ejecutado, N tests passed/fallidos, cobertura si aplica.
```

### Task 3: Update opencode.json

**Files:**
- Modify: `.opencode/opencode.json`

- [ ] **Step 1: Add skills.paths to opencode.json**

Current content:
```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": [
    "superpowers@git+https://github.com/obra/superpowers.git"
  ]
}
```

New content:
```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": [
    "superpowers@git+https://github.com/obra/superpowers.git"
  ],
  "skills": {
    "paths": [".opencode/skills"]
  }
}
```

### Task 4: Verify the setup

**Files:** (no changes)

- [ ] **Step 1: Verify skill is loadable**

Check that the skill directory structure is correct:
```
.opencode/
├── opencode.json
├── skills/
│   └── parkly-testing/
│       └── SKILL.md
└── agents/
    └── parkly-testing.md
```

- [ ] **Step 2: Verify tests still pass**

Run: `npx ng test --watch=false`
Expected: all existing tests pass (at minimum the App smoke test)
