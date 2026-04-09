# **tests** — Capa Centralizada de Pruebas Unitarias

Este directorio contiene **todas** las pruebas unitarias del proyecto, organizadas
siguiendo la misma estructura de capas que `src/`.

---

## 📁 Estructura

```
__tests__/
├── __mocks__/                    ← Fábricas de mocks compartidos
│   ├── mockHttpClient.ts         ← Mock reutilizable de IHttpClient
│   └── mockStorage.ts            ← Mock reutilizable de IStorage
│
├── Domain/
│   └── Ploc.test.ts              ← Tests del patrón Observer base
│
├── Application/
│   ├── Auth/
│   │   ├── LoginUseCase.test.ts
│   │   ├── RegisterUseCase.test.ts
│   │   ├── RefreshTokenUseCase.test.ts
│   │   └── GetSessionUserUseCase.test.ts
│   └── Health/
│       └── GetHealthUseCase.test.ts
│
└── Controllers/
    ├── Auth/
    │   └── AuthPloc.test.ts      ← Prueba todas las transiciones de estado
    └── Health/
        └── HealthPloc.test.ts
```

---

## 🧪 Comandos

```bash
# Ejecutar todos los tests una vez
npm test

# Modo watch (se re-ejecutan al guardar)
npm run test:watch

# Con reporte de cobertura
npm run test:coverage
```

---

## 📏 Reglas y Convenciones

1. **Sin archivos `.test.ts` dentro de `src/`** — todos los tests viven aquí.
2. **Los tests son de caja negra** — prueban la interfaz pública de cada clase.
3. **Mocks compartidos en `__mocks__/`** — nunca duplicar la definición de un mock.
4. **Un archivo de test por clase** que espeja exactamente la ruta de `src/`.
5. **Sin dependencias de React** en los tests de `Domain`, `Application` y `Controllers`.
