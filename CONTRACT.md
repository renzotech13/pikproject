# PIK — CONTRATO TÉCNICO

> **Proyecto:** PIK · Ecosistema de Certificación de Motociclistas
> **Stack:** React 18 + Vite + Tailwind CSS · Mobile-first · SPA (React Router)
> **Naturaleza:** Demo navegable. Todas las integraciones reales (pagos, mapas, KYC, notificaciones) están **simuladas con datos mock** en `src/data/` y servidas por la capa `src/services/`.
> **Idioma del dominio:** Español (Perú). Los nombres de campos en JSON se mantienen en español para alinear con el negocio; el código (componentes/funciones) usa convención técnica habitual.

Este documento es la **fuente única de verdad**. Cualquier bloque (feature) puede desarrollarse en paralelo siempre que respete:
1. La forma de los datos (sección 2).
2. Los nombres y props de los componentes base (sección 3).
3. El mapa de rutas (sección 4).

---

## 0. Convenciones generales

| Tema | Regla |
|---|---|
| Lenguaje archivos | `.jsx` para componentes, `.js` para lógica/datos. |
| Nombres de componentes | `PascalCase` (`AppointmentCard.jsx`). |
| Nombres de hooks | `useCamelCase` (`useAppointments.js`). |
| Imports internos | Alias `@/` → `src/` (configurado en `vite.config.js` y `jsconfig.json`). |
| IDs en mock data | `string` con prefijo de entidad: `usr_`, `sede_`, `cita_`, `pago_`, `aliado_`, `reg_`. |
| Fechas | ISO 8601. Solo-fecha: `"YYYY-MM-DD"`. Con hora: `"YYYY-MM-DDTHH:mm:ssZ"`. |
| Dinero | `number` en **soles (PEN)**, 2 decimales. La UI formatea con `formatMoney()` (`src/lib/formatters.js`). |
| Enums | Definidos como constantes en `src/constants/`. **No** hardcodear strings de estado en componentes. |
| Estado global | React Context (`AuthContext`, `ToastContext`). Nada de Redux para la demo. |
| Datos | Componentes **nunca** importan JSON directo; siempre vía `src/services/*`. |

---

## 1. Estructura de archivos (definitiva)

```
PIK PROJECT/
├── public/
│   ├── favicon.svg
│   └── images/{logo,aliados,sedes,avatars}/
├── src/
│   ├── main.jsx                 # Punto de entrada React
│   ├── App.jsx                  # Providers globales + <RouterProvider>
│   ├── index.css                # Tailwind directives + capas base
│   │
│   ├── components/              # COMPARTIDO (sistema de diseño + chrome)
│   │   ├── ui/                  # Primitivas: Button, Card, Badge, Input… (sección 3.1)
│   │   ├── layout/              # AppShell, TopBar, BottomNav, AdminLayout… (sección 3.2)
│   │   └── charts/              # Wrappers de Recharts para el dashboard (sección 3.3)
│   │
│   ├── features/               # BLOQUES DE DOMINIO (independientes y escalables)
│   │   ├── home/               # Landing pública
│   │   ├── auth/               # Login, Registro, recuperación
│   │   ├── verification/       # Flujo de verificación KYC + inspección (Stepper)
│   │   ├── appointments/       # Citas (agendar, listar, detalle)
│   │   ├── payments/           # Pagos y comprobantes
│   │   ├── benefits/           # Beneficios y aliados
│   │   ├── sedes/              # Centros de certificación
│   │   ├── regulations/        # Regulaciones / normativa
│   │   ├── credential/         # Credencial digital (carnet + QR)
│   │   ├── profile/            # Perfil del motociclista
│   │   └── dashboard/          # Panel admin (analytics + gestión)
│   │       └── (cada feature) ── components/  hooks/  pages/  index.js
│   │
│   ├── data/                    # MOCK DATA (JSON) — contrato sección 2
│   │   ├── usuarios.json
│   │   ├── sedes.json
│   │   ├── citas.json
│   │   ├── pagos.json           # extensión (pilar "pagos")
│   │   ├── aliados.json
│   │   ├── regulaciones.json
│   │   ├── analytics.json
│   │   └── index.js             # re-exporta los JSON
│   │
│   ├── services/               # CAPA MOCK-API (Promesas con latencia simulada)
│   │   ├── api.js               # helper: simula fetch/latencia/errores
│   │   ├── authService.js
│   │   ├── usuariosService.js
│   │   ├── sedesService.js
│   │   ├── citasService.js
│   │   ├── pagosService.js
│   │   ├── beneficiosService.js
│   │   ├── regulacionesService.js
│   │   └── analyticsService.js
│   │
│   ├── context/                # AuthContext, ToastContext, AppContext
│   ├── hooks/                  # Globales: useAuth, useToast, useDisclosure, useAsync
│   ├── lib/                    # formatters.js, validators.js, cn.js, dates.js
│   ├── constants/             # routes.js, estados.js, categorias.js, theme.js
│   └── routes/
│       ├── router.jsx          # Árbol de rutas (sección 4)
│       └── guards.jsx          # <RequireAuth>, <RequireRole>
│
├── index.html
├── vite.config.js · tailwind.config.js · postcss.config.js
├── jsconfig.json · .eslintrc.cjs · .gitignore · .env.example
├── CONTRACT.md   ← (este archivo)
└── README.md
```

**Anatomía de un feature** (todos siguen el mismo patrón → desarrollo en paralelo):

```
features/appointments/
├── components/        # piezas propias del dominio (AppointmentCard, SlotPicker…)
├── hooks/             # useAppointments.js
├── pages/             # pantallas-ruta (AppointmentsList.jsx, BookAppointment.jsx…)
└── index.js           # API pública del feature (lo que el router consume)
```

---

## 2. Contrato de datos (`src/data/*.json`)

Reglas: campos `?` son opcionales; los demás son **obligatorios**. Los valores entre `«»` son enums (ver sección 2.8).

### 2.1 `usuarios.json` — `Usuario[]`

```jsonc
{
  "id": "usr_001",                         // string · PK
  "rol": "motociclista",                   // «RolUsuario»
  "nombres": "Carlos",
  "apellidos": "Quispe Mamani",
  "dni": "44556677",                       // 8 dígitos
  "email": "carlos.quispe@example.com",
  "telefono": "+51 987654321",
  "fechaNacimiento": "1995-03-12",
  "avatarUrl": "/images/avatars/usr_001.jpg",  // ? fallback a iniciales
  "estadoCertificacion": "certificado",    // «EstadoCertificacion»
  "nivelVerificacion": 3,                  // number 0–3 (niveles KYC)
  "scorePIK": 820,                         // number 0–1000 (reputación/confianza)
  "membresia": "premium",                  // «Membresia»
  "codigoPIK": "PIK-2026-004512",          // ? código de credencial (si certificado)
  "fechaCertificacion": "2026-01-15",      // ?
  "fechaVencimiento": "2027-01-15",        // ?
  "vehiculo": {
    "placa": "1234-AB",
    "marca": "Honda",
    "modelo": "CB 190R",
    "anio": 2022,
    "cilindrada": 190,                     // cc
    "color": "Rojo",
    "soatVigente": true,
    "soatVencimiento": "2026-09-30"
  },
  "documentos": {
    "dniVerificado": true,
    "licenciaConducir": {
      "numero": "Q44556677",
      "categoria": "B-IIa",                // categoría licencia MTC
      "vencimiento": "2028-05-20",
      "verificado": true
    },
    "antecedentes": "limpio"               // «EstadoAntecedentes»
  },
  "direccion": {
    "departamento": "Lima",
    "provincia": "Lima",
    "distrito": "Miraflores"
  },
  "fechaRegistro": "2025-11-02"
}
```

### 2.2 `sedes.json` — `Sede[]`

```jsonc
{
  "id": "sede_001",                        // string · PK
  "nombre": "PIK Centro · San Isidro",
  "tipo": "centro_certificacion",          // «TipoSede»
  "direccion": "Av. Javier Prado Este 123, San Isidro",
  "distrito": "San Isidro",
  "departamento": "Lima",
  "coordenadas": { "lat": -12.0931, "lng": -77.0465 },  // para mapa mock
  "telefono": "+51 1 4567890",
  "horario": {
    "lunesViernes": "08:00 - 18:00",
    "sabado": "09:00 - 13:00",
    "domingo": "Cerrado"
  },
  "servicios": ["verificacion_identidad", "inspeccion_tecnica", "emision_credencial"], // «ServicioSede»[]
  "capacidadDiaria": 80,                   // number
  "disponibilidad": "alta",                // «Disponibilidad»
  "calificacion": 4.7,                     // 0–5
  "totalResenas": 312,
  "imagenUrl": "/images/sedes/sede_001.jpg",  // ?
  "activa": true
}
```

### 2.3 `citas.json` — `Cita[]`

```jsonc
{
  "id": "cita_001",                        // string · PK
  "usuarioId": "usr_001",                  // FK → Usuario.id
  "sedeId": "sede_001",                    // FK → Sede.id
  "tipo": "verificacion_inicial",          // «TipoCita»
  "fecha": "2026-07-05",
  "hora": "10:30",
  "duracionMin": 45,
  "estado": "confirmada",                  // «EstadoCita»
  "codigoReserva": "CITA-7K2P9",
  "costo": 85.00,                          // PEN
  "pagada": true,
  "pagoId": "pago_001",                    // ? FK → Pago.id (si pagada)
  "notas": "Traer DNI físico, licencia y tarjeta de propiedad.",  // ?
  "checklist": [                           // documentos/requisitos a presentar
    { "item": "DNI vigente", "obligatorio": true, "completado": false },
    { "item": "Licencia de conducir", "obligatorio": true, "completado": false },
    { "item": "SOAT vigente", "obligatorio": true, "completado": false }
  ],
  "creadaEn": "2026-06-20T14:23:00Z"
}
```

### 2.4 `pagos.json` — `Pago[]`  *(extensión — pilar "pagos")*

```jsonc
{
  "id": "pago_001",                        // string · PK
  "usuarioId": "usr_001",                  // FK → Usuario.id
  "concepto": "Certificación inicial PIK", // texto
  "referencia": "cita_001",                // ? FK polimórfica (cita/membresía)
  "tipo": "certificacion",                 // «TipoPago»
  "monto": 85.00,                          // PEN
  "moneda": "PEN",
  "metodo": "tarjeta",                     // «MetodoPago»  (mock)
  "estado": "completado",                  // «EstadoPago»
  "codigoOperacion": "OP-2026-88412",
  "comprobante": {
    "tipo": "boleta",                      // «TipoComprobante»
    "serie": "B001",
    "numero": "0004512",
    "url": "/comprobantes/B001-0004512.pdf"  // ? mock
  },
  "fecha": "2026-06-20T14:25:30Z"
}
```

### 2.5 `aliados.json` — `Aliado[]`

```jsonc
{
  "id": "aliado_001",                      // string · PK
  "nombre": "MotoRepuestos Lima",
  "categoria": "repuestos",                // «CategoriaAliado»
  "logoUrl": "/images/aliados/aliado_001.png",
  "descripcion": "Cadena de repuestos y accesorios para motos.",
  "beneficio": {
    "titulo": "15% de descuento en repuestos",
    "tipo": "descuento_porcentaje",        // «TipoBeneficio»
    "valor": 15,                           // % o monto, según tipo
    "codigoCupon": "PIK15MOTO",            // ?
    "condiciones": "Válido presentando credencial PIK vigente. No acumulable.",
    "vigenciaDesde": "2026-01-01",
    "vigenciaHasta": "2026-12-31"
  },
  "membresiaRequerida": "free",            // «Membresia» — nivel mínimo para canjear
  "ubicaciones": ["Lima", "Callao"],       // string[]
  "destacado": true,                       // aparece en carrusel home
  "totalCanjes": 1248,
  "calificacion": 4.5,                     // 0–5
  "activo": true
}
```

### 2.6 `regulaciones.json` — `Regulacion[]`

```jsonc
{
  "id": "reg_001",                         // string · PK
  "titulo": "Certificación obligatoria para reparto en moto",
  "categoria": "delivery",                 // «CategoriaRegulacion»
  "entidad": "MTC",                        // «EntidadReguladora»
  "resumen": "Toda persona que realice reparto en motocicleta debe contar con certificación vigente.",
  "contenido": "Texto completo en **Markdown**…",  // render con react-markdown (futuro) o texto plano
  "nivelImportancia": "alta",              // «NivelImportancia»
  "vigenteDesde": "2025-06-01",
  "fuenteUrl": "https://www.gob.pe/mtc",   // ?
  "tags": ["delivery", "obligatorio", "moto"],
  "actualizadoEn": "2026-02-10"
}
```

### 2.7 `analytics.json` — `Analytics` *(objeto único, no array — alimenta el dashboard admin)*

```jsonc
{
  "resumen": {
    "totalUsuarios": 12480,
    "usuariosCertificados": 8932,
    "verificacionesEnProceso": 1203,
    "citasHoy": 156,
    "ingresosMes": 542300.00,              // PEN
    "tasaCertificacion": 0.716             // 0–1 (ratio)
  },
  "kpis": [                                // tarjetas de KPI del header del dashboard
    { "id": "certificaciones", "label": "Certificaciones", "valor": 8932, "variacion": 0.124, "tendencia": "up", "formato": "numero" },
    { "id": "ingresos", "label": "Ingresos del mes", "valor": 542300, "variacion": 0.083, "tendencia": "up", "formato": "moneda" }
  ],
  "certificacionesPorMes": [               // serie temporal → LineChart
    { "mes": "2026-01", "cantidad": 720 }
  ],
  "usuariosPorEstado": [                   // distribución → PieChart/Donut
    { "estado": "certificado", "cantidad": 8932 },
    { "estado": "en_proceso", "cantidad": 1203 }
  ],
  "citasPorSede": [                        // ranking → BarChart
    { "sedeId": "sede_001", "nombre": "San Isidro", "cantidad": 1820 }
  ],
  "ingresosPorMes": [                      // serie temporal → AreaChart
    { "mes": "2026-01", "monto": 480000 }
  ],
  "canjesPorAliado": [                     // ranking → BarChart
    { "aliadoId": "aliado_001", "nombre": "MotoRepuestos Lima", "canjes": 1248 }
  ],
  "distribucionGeografica": [              // mapa/lista
    { "distrito": "Lima", "usuarios": 3200 }
  ]
}
```

### 2.8 Catálogo de enums (`src/constants/estados.js` y `categorias.js`)

| Enum | Valores |
|---|---|
| `RolUsuario` | `motociclista` · `operador` · `admin` |
| `EstadoCertificacion` | `no_iniciado` · `en_proceso` · `pendiente_pago` · `certificado` · `vencido` · `rechazado` |
| `EstadoAntecedentes` | `limpio` · `con_observaciones` · `pendiente` |
| `Membresia` | `free` · `premium` |
| `TipoSede` | `centro_certificacion` · `punto_inspeccion` · `movil` |
| `ServicioSede` | `verificacion_identidad` · `inspeccion_tecnica` · `emision_credencial` · `renovacion` |
| `Disponibilidad` | `alta` · `media` · `baja` · `sin_cupo` |
| `TipoCita` | `verificacion_inicial` · `inspeccion_tecnica` · `renovacion` · `emision_credencial` |
| `EstadoCita` | `pendiente` · `confirmada` · `en_curso` · `completada` · `cancelada` · `no_asistio` · `reprogramada` |
| `TipoPago` | `certificacion` · `renovacion` · `membresia` · `inspeccion` |
| `MetodoPago` | `tarjeta` · `yape` · `plin` · `efectivo` · `transferencia` |
| `EstadoPago` | `pendiente` · `procesando` · `completado` · `fallido` · `reembolsado` |
| `TipoComprobante` | `boleta` · `factura` |
| `CategoriaAliado` | `repuestos` · `talleres` · `seguros` · `combustible` · `indumentaria` · `gastronomia` · `salud` |
| `TipoBeneficio` | `descuento_porcentaje` · `descuento_fijo` · `2x1` · `cashback` · `regalo` |
| `CategoriaRegulacion` | `delivery` · `licencias` · `soat` · `transito` · `municipal` · `general` |
| `EntidadReguladora` | `MTC` · `SUTRAN` · `Municipalidad` · `PNP` |
| `NivelImportancia` | `alta` · `media` · `baja` |

> **Mapa de color por estado** (lo consume `<Badge>` y `<StatusBadge>`): `success` → certificado/completado/confirmada/pagada · `warning` → en_proceso/pendiente/pendiente_pago/procesando · `danger` → rechazado/vencido/cancelada/fallido/no_asistio · `info` → en_curso/reprogramada. Definido en `src/constants/estados.js > ESTADO_COLOR`.

---

## 3. Contrato de componentes

> Reglas transversales: **todos** los componentes aceptan `className` (se fusiona con `cn()` de `src/lib/cn.js` = `clsx` + `tailwind-merge`) y `...rest`. Íconos: **`lucide-react`**. Sin librerías de UI externas: el sistema es propio sobre Tailwind.

### 3.1 Primitivas — `src/components/ui/`

| Componente | Props clave | Notas |
|---|---|---|
| `Button` | `variant` `'primary'\|'secondary'\|'outline'\|'ghost'\|'danger'\|'success'` (def. `primary`) · `size` `'sm'\|'md'\|'lg'` (def. `md`) · `fullWidth?` `bool` · `loading?` `bool` · `disabled?` `bool` · `leftIcon?` `ReactNode` · `rightIcon?` `ReactNode` · `as?` `'button'\|'a'` · `type?` · `onClick` · `children` | `loading` muestra `<Spinner>` y deshabilita. |
| `Card` | `variant` `'default'\|'elevated'\|'outlined'\|'interactive'` (def. `default`) · `padding` `'none'\|'sm'\|'md'\|'lg'` (def. `md`) · `onClick?` · `children` | `interactive` → hover/active + cursor pointer. |
| `Badge` | `variant` `'neutral'\|'success'\|'warning'\|'danger'\|'info'\|'primary'` (def. `neutral`) · `size` `'sm'\|'md'` · `dot?` `bool` · `children` | Píldora de texto. |
| `StatusBadge` | `estado` `string` (cualquier enum de la sección 2.8) · `size?` | Resuelve color+label vía `ESTADO_COLOR`/`ESTADO_LABEL`. **Usar este** para estados de dominio. |
| `Input` | `label?` · `type?` (def. `text`) · `value` · `onChange` · `placeholder?` · `name` · `error?` `string` · `helperText?` · `leftIcon?` · `rightIcon?` · `disabled?` · `required?` | Muestra `error` en rojo bajo el campo. |
| `Textarea` | `label?` · `value` · `onChange` · `rows?` · `error?` · `maxLength?` | |
| `Select` | `label?` · `options` `{value,label}[]` · `value` · `onChange` · `placeholder?` · `error?` | Nativo estilizado. |
| `Checkbox` | `label?` · `checked` · `onChange` · `disabled?` | |
| `RadioGroup` | `name` · `options` `{value,label}[]` · `value` · `onChange` | |
| `Switch` | `checked` · `onChange` · `label?` | Toggle on/off. |
| `Modal` | `open` `bool` · `onClose` · `title?` · `size` `'sm'\|'md'\|'lg'` · `footer?` `ReactNode` · `children` | Centrado + overlay. Cierra con ESC/overlay. |
| `BottomSheet` | `open` · `onClose` · `title?` · `children` | Variante mobile (sube desde abajo). Preferida en flujos del motociclista. |
| `Drawer` | `open` · `onClose` · `side` `'left'\|'right'` · `children` | Para filtros / menú admin. |
| `Tabs` | `tabs` `{key,label,icon?}[]` · `active` · `onChange` · `variant?` `'line'\|'pill'` | |
| `SegmentedControl` | `options` `{value,label}[]` · `value` · `onChange` | iOS-style. |
| `Stepper` | `steps` `{key,label}[]` · `current` `number` · `onStepClick?` | **Clave para el flujo de verificación.** |
| `ProgressBar` | `value` `number` · `max?` (def. 100) · `color?` `'primary'\|'success'\|'warning'` · `showLabel?` | |
| `Avatar` | `src?` · `name` (fallback a iniciales) · `size` `'sm'\|'md'\|'lg'\|'xl'` · `status?` `'online'\|'offline'` | |
| `Chip` | `label` · `selected?` · `onClick?` · `onRemove?` · `icon?` | Filtros/categorías. |
| `Rating` | `value` `0–5` · `readOnly?` · `onChange?` · `size?` | Estrellas (sedes/aliados). |
| `SearchBar` | `value` · `onChange` · `placeholder?` · `onClear?` | |
| `Spinner` | `size?` `'sm'\|'md'\|'lg'` · `color?` | |
| `Skeleton` | `variant` `'text'\|'rect'\|'circle'` · `width?` · `height?` · `count?` | Placeholders de carga. |
| `EmptyState` | `icon?` · `title` · `description?` · `action?` `ReactNode` | Listas vacías. |
| `ErrorState` | `title?` · `description?` · `onRetry?` | Fallback de error en servicios mock. |
| `Toast` | (no se usa directo) | Se dispara con `useToast().show({type,message})`. Render por `<ToastProvider>`. |
| `ListItem` | `leading?` · `title` · `subtitle?` · `trailing?` · `onClick?` | Fila genérica de lista. |
| `QRCode` | `value` `string` · `size?` | Wrapper de `qrcode.react` (credencial). |
| `Money` | `amount` `number` · `currency?` (def. `PEN`) | Formatea con `formatMoney()`. |

### 3.2 Layout / navegación — `src/components/layout/`

| Componente | Props | Rol |
|---|---|---|
| `AppShell` | `children` | Contenedor **mobile-first** (`max-w-app`, centrado): `TopBar` + `<main>` scrollable + `BottomNav`. Envuelve rutas `/app/*`. |
| `TopBar` | `title?` · `showBack?` `bool` · `actions?` `ReactNode` · `transparent?` | Barra superior. `showBack` usa `navigate(-1)`. |
| `BottomNav` | — | Isla flotante inferior. Tabs: **Inicio · Citas · Beneficios · Perfil** (+ FAB central a "Verificación/Agendar"). |
| `PageHeader` | `title` · `subtitle?` · `action?` | Encabezado dentro del contenido. |
| `SafeArea` | `children` | Respeta `env(safe-area-inset-*)` (notch). |
| `AdminLayout` | `children` | Layout de escritorio para `/admin/*`: `Sidebar` + topbar admin + contenido. |
| `Sidebar` | `items` `{to,label,icon}[]` | Navegación lateral del panel admin. |
| `Section` | `title?` · `action?` · `children` | Bloque con título + "ver todo". |

### 3.3 Charts — `src/components/charts/` (wrappers de Recharts para `/admin`)

`LineChartCard`, `AreaChartCard`, `BarChartCard`, `DonutChartCard`, `KpiCard`.
Props comunes: `title` · `data` · `dataKey` · `xKey?` · `color?` · `loading?`. Aíslan Recharts del resto de la app.

---

## 4. Mapa de navegación (React Router v6)

Tres superficies: **Pública**, **App del Motociclista** (mobile-first, autenticada) y **Panel Admin**. Guards en `src/routes/guards.jsx`.

```
/                                  → home/Landing                 [pública]
/login                             → auth/Login                   [pública]
/registro                          → auth/Register                [pública]
/recuperar                         → auth/ForgotPassword          [pública]

/app                               ── AppShell ──                 [RequireAuth: motociclista]
  index            (/app)          → appointments+verification/HomeDashboard   (inicio del rider)
  /app/verificacion                → verification/VerificationFlow   (Stepper multi-paso)
      /app/verificacion/resultado  → verification/VerificationResult
  /app/citas                       → appointments/AppointmentsList
      /app/citas/agendar           → appointments/BookAppointment    (sede → fecha → pago)
      /app/citas/:citaId           → appointments/AppointmentDetail
  /app/sedes                       → sedes/SedesList                 (lista + mapa mock)
      /app/sedes/:sedeId           → sedes/SedeDetail
  /app/pagos                       → payments/PaymentsHistory
      /app/pagos/:pagoId           → payments/PaymentReceipt
      /app/pagos/checkout          → payments/Checkout               (mock Yape/tarjeta)
  /app/beneficios                  → benefits/BenefitsList
      /app/beneficios/:aliadoId    → benefits/BenefitDetail          (cupón + QR de canje)
  /app/credencial                  → credential/DigitalCredential    (carnet + QR)
  /app/regulaciones                → regulations/RegulationsList
      /app/regulaciones/:regId     → regulations/RegulationDetail
  /app/perfil                      → profile/Profile
      /app/perfil/editar           → profile/EditProfile
      /app/perfil/vehiculo         → profile/VehicleInfo

/admin                             ── AdminLayout ──              [RequireRole: admin|operador]
  index            (/admin)        → dashboard/Overview              (analytics + KPIs + charts)
  /admin/verificaciones            → dashboard/VerificationsManage
  /admin/citas                     → dashboard/AppointmentsManage
  /admin/sedes                     → dashboard/SedesManage
  /admin/aliados                   → dashboard/AlliesManage
  /admin/regulaciones              → dashboard/RegulationsManage
  /admin/usuarios                  → dashboard/UsersManage

*  (cualquier otra)                → routes/NotFound
```

**Notas de routing:**
- Router con `createBrowserRouter`. Cada feature expone sus páginas vía su `index.js`; `router.jsx` solo importa y compone.
- `RequireAuth` redirige a `/login` si no hay sesión (mock en `AuthContext` con `localStorage`).
- `RequireRole` protege `/admin` (rol `admin`/`operador`).
- La demo arranca con un usuario mock "logueado" para hacerla navegable sin fricción (toggle en `AuthContext`).
- Transiciones de página con `framer-motion` (opcional) para sensación nativa.

---

## 5. Capa de servicios (mock-API)

Cada service expone funciones `async` que retornan **Promesas** resolviendo con datos de `src/data/`, simulando latencia (`VITE_MOCK_LATENCY`) vía `api.js`. Firma estándar por entidad:

```
listX(filtros?)        → Promise<X[]>
getXById(id)           → Promise<X | undefined>
createX(payload)       → Promise<X>          // muta copia en memoria (no persiste)
updateX(id, patch)     → Promise<X>
removeX(id)            → Promise<void>
```

| Service | Funciones destacadas |
|---|---|
| `authService` | `login(email)` · `logout()` · `getCurrentUser()` |
| `usuariosService` | `getUsuario(id)` · `listUsuarios(filtros)` · `updateUsuario(id, patch)` |
| `sedesService` | `listSedes(filtros)` · `getSede(id)` · `getDisponibilidad(sedeId, fecha)` |
| `citasService` | `listCitas(usuarioId)` · `getCita(id)` · `crearCita(payload)` · `cancelarCita(id)` · `reprogramarCita(id, {fecha,hora})` |
| `pagosService` | `listPagos(usuarioId)` · `getPago(id)` · `procesarPago(payload)` *(simula éxito/fallo)* |
| `beneficiosService` | `listAliados(filtros)` · `getAliado(id)` · `canjearBeneficio(aliadoId)` |
| `regulacionesService` | `listRegulaciones(filtros)` · `getRegulacion(id)` |
| `analyticsService` | `getAnalytics()` |

> Cuando se conecten servicios reales, **solo cambia el interior de `src/services/`**; componentes y datos-contrato no se tocan. Ese es el objetivo del contrato.

---

## 6. Sistema de diseño (tokens)

Definidos en `tailwind.config.js`. Resumen:

| Token | Valor | Uso |
|---|---|---|
| `primary` | `#4F46E5` (indigo) | Marca, CTA primario, links activos. |
| `accent` | `#F59E0B` (amber) | Acentos, FAB, highlights. |
| `ink` | `#0F172A` | Texto principal. |
| `surface` | `#F8FAFC` | Fondo de la app. |
| `success` / `warning` / `danger` / `info` | verde / ámbar / rojo / celeste | Estados de dominio (vía `StatusBadge`). |
| `max-w-app` | `480px` | Ancho del contenedor mobile-first. |
| `rounded-2xl` · `shadow-card` · `shadow-float` | — | Cards y elementos flotantes. |
| Tipografía | `Inter` | — |

> La paleta es la propuesta base; ajustable si el negocio define identidad de marca distinta. Mantener los **nombres semánticos** aunque cambien los hex.

---

_Fin del contrato. Actualizar este documento ante cualquier cambio de forma de datos, props públicas o rutas._
