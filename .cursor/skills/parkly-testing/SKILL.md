---
name: parkly-testing
description: Escribe, ejecuta y corrige tests unitarios de parkly con Vitest, Angular TestBed y mocks de Firebase. Usar cuando el usuario pida tests, specs, cobertura, ng test, arreglar tests fallidos o validar cambios con pruebas.
---

# Parkly Testing

Skill para delegar trabajo de testing a un subagente especializado en este proyecto Angular 21 + Firebase + Vitest.

## Cuándo usar

- Escribir o ampliar archivos `*.spec.ts`
- Ejecutar la suite o un archivo concreto
- Diagnosticar y corregir tests fallidos
- Validar regresiones tras cambios en servicios o componentes

## Subagente de ejecución

Para **correr tests** o **iterar hasta que pasen**, lanza exactamente un subagente `shell`:

- `subagent_type`: `"shell"`
- `description`: `"Parkly tests"`
- `run_in_background`: `false` salvo que el usuario pida modo watch
- `working_directory`: raíz absoluta de parkly (donde está `package.json`)

Prompt obligatorio:

```text
Proyecto: parkly (Angular 21 + Vitest + jsdom)
Directorio: <ruta absoluta a parkly>

Tarea: <ejecutar tests | corregir tests fallidos | ambos>

Archivos objetivo (opcional): <glob o rutas, ej. src/app/core/services/parking.service.spec.ts>

Comandos permitidos:
- npx ng test --watch=false
- npx ng test --watch=false --include=<glob>
- npx ng test --watch=false --filter=<regex>
- npx ng test --watch=false --coverage

Reglas:
1. Ejecutar desde el directorio del proyecto.
2. Si hay fallos, leer el output, corregir código o spec (mínimo diff), y re-ejecutar.
3. No usar Karma; el runner por defecto es Vitest.
4. PowerShell: usar `;` en lugar de `&&`.
5. Reportar: archivos tocados, comando final, N tests passed/failed.
```

## Subagente de escritura (opcional)

Si el alcance es **solo diseñar tests nuevos** sin ejecutarlos aún, el agente principal puede escribirlos directamente. Si el alcance es grande (servicio + varios componentes), usa `generalPurpose` con `readonly: false` y el mismo directorio de trabajo; al terminar, lanza el subagente `shell` para verificar.

## Comandos de referencia

| Objetivo | Comando |
| -------- | ------- |
| Suite completa (CI) | `npx ng test --watch=false` |
| Un archivo | `npx ng test --watch=false --include=src/app/core/services/parking.service.spec.ts` |
| Filtrar por nombre | `npx ng test --watch=false --filter="ParkingService"` |
| Cobertura | `npx ng test --watch=false --coverage` |
| Listar specs | `npx ng test --list-tests` |

## Convenciones del proyecto

### Stack

- Runner: **Vitest** (`ng test`, builder `@angular/build:unit-test`)
- Entorno: **jsdom** (sin browser real por defecto)
- APIs de test: `describe`, `it`, `expect`, `vi` desde `vitest`
- Angular: `TestBed`, `TestBed.flushEffects()` para effects/signals

### Estilo

- Nombres de tests en **español**, descriptivos: `debería cobrar 2 horas si...`
- Patrón **Arrange-Act-Assert**
- Un comportamiento por `it`; agrupar por método o flujo en `describe`
- Preferir probar **comportamiento observable** (signals, side effects, mocks) sobre detalles internos
- No añadir tests triviales que solo repiten el constructor

### Servicios con Firebase

Mock de `@angular/fire/firestore` con `vi.mock` **antes** de imports del SUT. Patrón completo en [patterns.md](patterns.md).

Puntos clave:

- Proveer `{ provide: Firestore, useValue: {} }` y `{ provide: PLATFORM_ID, useValue: 'browser' }` cuando aplique
- Capturar callback de `onSnapshot` vía `globalThis.__onSnapshotCallback` si el servicio lo usa
- `vi.useFakeTimers()` + `vi.setSystemTime()` para lógica dependiente del reloj; `vi.useRealTimers()` en `afterEach`

### Componentes

```typescript
await TestBed.configureTestingModule({
  imports: [MiComponente],
  providers: [/* mocks */],
}).compileComponents();

const fixture = TestBed.createComponent(MiComponente);
fixture.detectChanges();
```

- Standalone: importar el componente en `imports`, no declararlo
- Señales: leer con `component.miSignal()` tras cambios; usar `fixture.detectChanges()` si hay template
- Firebase en componentes: mockear el servicio inyectado, no Firestore directo salvo que el componente lo inyecte

### Qué no mockear sin necesidad

- Lógica pura de dominio (tarifas, formateo) — probar con datos reales
- Signals y computed del propio servicio bajo test

## Flujo recomendado

```
1. Identificar SUT (servicio, componente, pipe)
2. Revisar spec existente o crear *.spec.ts junto al archivo fuente
3. Escribir casos: happy path, bordes, errores
4. npx ng test --watch=false --include=<spec>
5. Si falla → corregir → re-ejecutar hasta verde
6. Resumir cobertura de comportamiento al usuario
```

## Checklist antes de dar por terminado

- [ ] `npx ng test --watch=false` pasa (o el `--include` acotado al cambio)
- [ ] Timers falsos restaurados en `afterEach`
- [ ] Mocks reseteados en `beforeEach`
- [ ] Sin `any` innecesario; tipos de dominio reutilizados (`Vehicle`, `VehicleType`, etc.)
- [ ] Tests en español y alineados con reglas de negocio del parking (tarifas, gracia 10 min, allDay)

## Recursos

- Patrones de mock Firebase y localStorage: [patterns.md](patterns.md)
