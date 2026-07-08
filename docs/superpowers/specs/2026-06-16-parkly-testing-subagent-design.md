# Parkly Testing Subagent — Design Spec

## Goal

Crear un subagente OpenCode especializado en testing para el proyecto parkly (Angular 21 + Vitest + jsdom + Firebase), compuesto por:

- **Skill** (`SKILL.md`) — fuente de verdad con patrones, convenciones y flujo de testing
- **Agent** (`parkly-testing.md`) — subagente delegado que referencia la skill para ejecutar tareas complejas

## Files

```
.opencode/
├── opencode.json              ← + skills.paths
├── skills/
│   └── parkly-testing/
│       └── SKILL.md
└── agents/
    └── parkly-testing.md
```

## Skill: SKILL.md

Frontmatter:
- `name: parkly-testing`
- `description`: "Usar cuando el usuario pida escribir tests, ejecutar la suite, diagnosticar fallos, validar cobertura, o cualquier tarea relacionada con testing en parkly. Front-load keywords: test, spec, ng test, cobertura, fallo, vitest."

Body sections:
- **Convenciones del proyecto**: runner Vitest, entorno jsdom, APIs `describe`/`it`/`expect`/`vi` globales, Angular TestBed + `flushEffects()`, nombres en español, Arrange-Act-Assert
- **Mock de Firestore**: `vi.mock('@angular/fire/firestore')` con stubs de `collection`, `doc`, `query`, `where`, `setDoc`, `updateDoc`, `deleteDoc`, `onSnapshot`, `collectionData`; captura de callback via `globalThis.__onSnapshotCallback`
- **Mock de localStorage**: `vi.stubGlobal('localStorage', ...)` con store reset en `beforeEach`
- **Mock de timers**: `vi.useFakeTimers()` + `vi.setSystemTime()` + `vi.advanceTimersByTime()` + `vi.useRealTimers()` en `afterEach`
- **Mock de window.alert**: `vi.spyOn(window, 'alert').mockImplementation(() => {})`
- **Tarifas de negocio**: tabla Carro 2500/h, Moto 1000/h, gracia 10 min a partir 2da hora, allDay 15000
- **Flujo de trabajo**: 1. Identificar SUT → 2. Escribir spec → 3. `ng test --watch=false --include=<spec>` → 4. Corregir hasta verde → 5. Reportar
- **Cuándo usar Agent**: tareas complejas (ej. tests para servicio completo con mocks); **cuándo hacer directo**: cambios pequeños a specs existentes

## Agent: parkly-testing.md

Frontmatter:
- `description`: Subagente especializado en escribir, ejecutar y corregir tests del proyecto parkly (Angular 21 + Vitest + jsdom + Firebase).
- `mode`: subagent
- `permission`: `{ edit: allow, bash: allow }`

Prompt body:
- Cargar y seguir la skill `parkly-testing`
- Ejecutar tests, leer output, corregir código/spec con mínimo diff, re-ejecutar hasta verde
- PowerShell: usar `;` en vez de `&&`
- Reportar: archivos tocados, comando final, N tests passed/failed

## opencode.json changes

Agregar:
```json
"skills": {
  "paths": [".opencode/skills"]
}
```

## Testing commands reference

| Objetivo | Comando |
|----------|---------|
| Suite completa | `npx ng test --watch=false` |
| Archivo específico | `npx ng test --watch=false --include=<path>` |
| Filtrar por nombre | `npx ng test --watch=false --filter="<pattern>"` |
| Cobertura | `npx ng test --watch=false --coverage` |
| Listar tests | `npx ng test --list-tests` |

## Edge cases

- Si `ng test` falla por error de compilación, el agente debe leer el error de TypeScript, no el de Vitest
- Si no hay tests escritos para un archivo, crear `*.spec.ts` junto al fuente
- Si hay un spec existente pero vacío/no compila, corregirlo y ejecutar
- Recordar restaurar timers y mocks en `afterEach`/`beforeEach`
