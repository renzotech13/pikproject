# PIK — Ecosistema de Certificación de Motociclistas

> **Demo navegable · Mobile-first · React 18 + Vite + Tailwind CSS**

PIK es una plataforma que centraliza la **verificación de identidad, agendado de citas, pagos y beneficios** para motociclistas certificados. Este repositorio contiene el **demo funcional completo**: todas las pantallas, flujos e interacciones están operativas. Las integraciones con servicios externos (pasarelas de pago, APIs gubernamentales, notificaciones) se ejecutan sobre datos simulados de alta fidelidad.

---

## Inicio rápido

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev
# → Abre http://localhost:5173

# 3. Build de producción
npm run build
npm run preview
```

**Requisitos:** Node.js ≥ 18 · npm ≥ 9

---

## Credenciales del demo

> El demo **no requiere un formulario de login** — se abre directamente en la sesión activa del motociclista para maximizar el tiempo de exploración del cliente.

### Vista Motociclista (acceso inmediato)

| Campo           | Valor                        |
|-----------------|------------------------------|
| **Email**       | `demo@pik.mx`                |
| **Contraseña**  | `demo123`                    |
| **Usuario**     | Carlos Ramírez Herrera       |
| **Código PIK**  | `PIK-2026-004512`            |
| **Estado**      | Certificado Vigente ✅        |
| **Score PIK**   | 820 / 1000                   |
| **Membresía**   | Premium                      |
| **Vehículo**    | Honda CB 190R 2022 · MXA-234-B |

### Vista Administrador

| Campo           | Valor                        |
|-----------------|------------------------------|
| **Email**       | `admin@pik.mx`               |
| **Contraseña**  | `admin123`                   |
| **Usuario**     | Admin PIK                    |
| **Acceso**      | Panel completo de gestión    |

### Cómo alternar entre vistas

- **→ Admin:** toca el botón **⚙️ Admin** en la barra superior derecha
- **→ Rider:** toca el botón **🏍 Vista Rider** en el header del panel admin
- El cambio es instantáneo — no se requiere re-login

---

## Guía de navegación

### 🏍 Vista Motociclista — `/app`

Navega usando la **barra flotante inferior** (Inicio · Citas · Beneficios · Perfil).

| Ruta | Pantalla | Qué explorar |
|------|----------|--------------|
| `/app` | **Inicio** | Tarjeta de certificación con Score PIK, próxima cita, acciones rápidas |
| `/app/citas` | **Mis Citas** | Lista de próximas y pasadas, separadas por sección |
| `/app/citas/agendar` | **Agendar Cita** | Stepper de 3 pasos: sede → fecha/hora → confirmación |
| `/app/citas/:id` | **Detalle de Cita** | Información completa + checklist de requisitos |
| `/app/pagos` | **Mis Pagos** | Historial de transacciones con comprobantes |
| `/app/pagos/checkout` | **Pagar** | Tabs de método: Tarjeta · Mercado Pago · SPEI |
| `/app/pagos/:id` | **Comprobante** | Código de operación + descarga de comprobante |
| `/app/beneficios` | **Beneficios** | Red de aliados con descuentos y cashback |
| `/app/credencial` | **Credencial Digital** | Tarjeta PIK con QR y código único |
| `/app/perfil` | **Mi Perfil** | Datos personales y vehículo registrado |

#### Flujo recomendado para la demo

```
Inicio → "Agendar nueva cita"
  → Stepper: selecciona PIK Norte · Lindavista → elige fecha → selecciona 09:30
  → "Confirmar cita" → redirige al Checkout con el resumen de la cita
  → Paga con tarjeta (4111 1111 1111 1111) → comprobante de pago
  → "Ver mis citas" → la cita aparece como Confirmada
  (la cita NO es visible en el dashboard hasta completar el pago)

Inicio → Pagos → "Nuevo pago"
  → Tab Tarjeta: ingresa 4111 1111 1111 1111 / 12/28 / 123
  → "Pagar $850.00" → pantalla de comprobante con descarga
  → Tab Mercado Pago: click "Pagar" → se abre WebView simulado (3 seg)
  → Tab SPEI: copia CLABE → activa checkbox → confirma transferencia
```

---

### ⚙️ Vista Administrador — `/admin`

Accede desde el botón **⚙️ Admin** del TopBar. Navega con las **tabs horizontales** del header.

| Tab | Ruta | Qué explorar |
|-----|------|--------------|
| **Dashboard** | `/admin` | KPIs · BarChart citas por sede · AreaChart ingresos MXN |
| **Verificaciones** | `/admin/verificaciones` | Tabla de usuarios, búsqueda live, filtros por estado |
| **Citas** | `/admin/citas` | Gestión de agenda de sedes |
| **Sedes** | `/admin/sedes` | Capacidad, disponibilidad y horarios |
| **Aliados** | `/admin/aliados` | Red de beneficios y canjes |
| **Regulaciones** | `/admin/regulaciones` | Marco normativo SICT / Semovi |
| **Usuarios** | `/admin/usuarios` | Base de motociclistas registrados |

#### Momentos clave en el panel Admin

- **Hover sobre barras del chart** → tooltip con sede y cantidad exacta de citas
- **Hover sobre área de ingresos** → tooltip con monto en MXN y mes
- **Botón `ⓘ`** junto al badge DEMO → abre el **Roadmap del Proyecto** (drawer animado)
- **Botón `↻ Actualizar`** en el header → simula scraping de fuentes externas (2 seg, animación)
- **Filas en Verificaciones** → click para expandir: Score PIK, fecha de registro, acciones

---

## Módulos implementados

| Módulo | Pantallas | Estado |
|--------|-----------|--------|
| Sistema de diseño | Button · Card · Badge · StatusBadge · Input · Stepper · Skeleton · EmptyState | ✅ |
| Layouts | AppShell · TopBar · BottomNav flotante · AdminLayout | ✅ |
| Autenticación | AuthContext · demo auto-login · switch Admin/Rider · guards | ✅ |
| Inicio (Rider) | HomeDashboard con Score PIK y acciones rápidas | ✅ |
| Citas | Lista · Stepper 3 pasos · Detalle con checklist | ✅ |
| Pagos | Checkout (Tarjeta/MP/SPEI) · Comprobante · Historial | ✅ |
| Dashboard Admin | KPIs · BarChart · AreaChart · Recharts con tooltips | ✅ |
| Verificaciones Admin | Tabla buscable · filtros · filas expandibles | ✅ |
| Roadmap | ProjectStatus drawer con MVP vs Producción | ✅ |
| Beneficios | Catálogo de aliados (placeholder) | 🔄 |
| Credencial digital | Tarjeta PIK con QR (placeholder) | 🔄 |
| Perfil | Datos personales y vehículo (placeholder) | 🔄 |

---

## ⚠️ Qué está simulado

Esta tabla distingue con precisión lo que es **código real** de lo que es **simulación de alta fidelidad**.

### ✅ Es código real (funciona de verdad)

| Qué | Por qué es real |
|-----|-----------------|
| Navegación completa entre pantallas | React Router v6 con `createBrowserRouter` |
| Validación de número de tarjeta | Algoritmo de Luhn implementado en `pagosService.js` |
| Stepper de citas (3 pasos) | Estado real con `useState`, slots calculados por fecha/sede |
| Persistencia de citas en sesión | `_store` en memoria — las nuevas citas aparecen inmediatamente |
| Tooltips interactivos en gráficos | Recharts `<Tooltip content={...}>` con componente personalizado |
| Animaciones de pantalla | Framer Motion `motion.main` con transiciones reales |
| WebView de Mercado Pago | Overlay real con máquina de estados (loading → form → processing → approved) |
| Descarga de comprobante | Genera un `Blob` de texto y dispara descarga nativa del browser |
| Búsqueda live en Verificaciones | Filtrado en memoria con `Array.filter` |
| Responsive / mobile-first | Tailwind CSS con `max-w-[480px]` como contenedor de app |

### 🔮 Está simulado (mock de alta fidelidad)

| Qué | Cómo se simula | En producción usará |
|-----|----------------|---------------------|
| Latencia de API | `delay(600ms)` configurable en `.env` | Endpoints REST / GraphQL reales |
| Base de datos | Archivos JSON en `src/data/` + `_store` en memoria | PostgreSQL vía Supabase |
| Cobro real con tarjeta | Luhn válida → animación de "Procesando" | Mercado Pago SDK · PCI DSS |
| Transferencia SPEI | CLABE mock + checkbox de confirmación | STP / Banxico API |
| Verificación de identidad (KYC) | Niveles de verificación hardcodeados | API SICT / Semovi + Google Vision (INE) |
| Notificaciones push | Toast local en el navegador | Firebase Cloud Messaging |
| Scraping de registros | Animación de 2 seg con "Actualizando…" | Bot Node.js + cron job |
| Geolocalización de sedes | Coordenadas estáticas en `sedes.json` | Google Maps Platform |
| Envío de email | Banner "Comprobante enviado a tu correo" | SendGrid / Resend |
| Autenticación real | `AuthContext` con usuario pre-cargado | Supabase Auth / JWT |

---

## Tarjeta de prueba

Para el flujo de **pago con tarjeta**, usa estos datos que pasan el algoritmo de Luhn:

```
Número:    4111 1111 1111 1111   (Visa)
Vencimiento: 12/28
CVV:       123
Titular:   DEMO PIK MX
```

Cualquier otro número de 16 dígitos que **no pase Luhn** mostrará el error de validación en rojo.

---

## Arquitectura

```
src/
├── components/
│   ├── layout/         # AppShell · TopBar · BottomNav · AdminLayout
│   └── ui/             # Button · Card · Badge · Input · Stepper · Skeleton · EmptyState
├── features/
│   ├── home/           # HomeDashboard
│   ├── auth/           # Login · Register · guards
│   ├── appointments/   # AppointmentsList · BookAppointment · AppointmentDetail
│   ├── payments/       # Checkout · PaymentReceipt · PaymentsHistory
│   ├── dashboard/      # Overview (Admin) · VerificationsManage · DashboardOverview · ProjectStatus
│   ├── benefits/       # Catálogo de aliados
│   ├── credential/     # Credencial digital PIK
│   ├── profile/        # Perfil y vehículo
│   ├── sedes/          # Directorio de sedes
│   ├── regulations/    # Marco normativo
│   └── verification/   # Flujo de verificación KYC
├── services/           # citasService · pagosService · sedesService · analyticsService
├── data/               # JSON seed: usuarios · citas · pagos · sedes · aliados · analytics
├── context/            # AuthContext · ToastContext
├── hooks/              # useAsync · useToast
├── lib/                # cn() · formatters (formatMXN · formatNumber)
├── constants/          # routes.js · estados.js (ESTADO_COLOR · ESTADO_LABEL)
└── routes/             # router.jsx (createBrowserRouter) · guards.jsx
```

**Patrón de servicios mock:**
```js
// Cada servicio sigue este patrón — cambiar a API real requiere solo reemplazar el cuerpo
export async function listCitas(usuarioId) {
  await delay(600)                         // ← en prod: fetch('/api/citas')
  return structuredClone(data)             // ← en prod: response.json()
}
```

---

## Stack tecnológico

| Categoría | Tecnología | Versión |
|-----------|-----------|---------|
| UI Framework | React | 18.3 |
| Build tool | Vite | 6.0 |
| Estilos | Tailwind CSS | 3.4 |
| Routing | React Router DOM | 6.28 |
| Animaciones | Framer Motion | 11.11 |
| Gráficos | Recharts | 2.13 |
| Íconos | Lucide React | 0.460 |
| Utilities | clsx + tailwind-merge | — |
| QR | qrcode.react | 4.1 |

**Variables de entorno** (ver `.env.example`):

```bash
VITE_DATA_SOURCE=mock          # 'mock' | 'api'
VITE_MOCK_LATENCY=600          # milisegundos de latencia simulada
VITE_API_BASE_URL=             # URL base del backend en producción
VITE_PAYMENTS_PROVIDER=        # mercadopago | culqi | niubiz
VITE_MAPS_API_KEY=             # Google Maps Platform
```

---

## Roadmap de producción

El drawer **ⓘ Roadmap** (botón junto al badge DEMO en el panel Admin) muestra la lista completa. Resumen:

**Fase 1 — Infraestructura (2–3 semanas)**
- Supabase (PostgreSQL + Auth + Storage + Edge Functions)
- CI/CD con GitHub Actions → Vercel / Railway

**Fase 2 — Integraciones de pago (1–2 semanas)**
- Mercado Pago SDK con PCI DSS
- SPEI automático vía STP/Banxico
- Webhooks de confirmación + conciliación

**Fase 3 — Integraciones gubernamentales (2–4 semanas)**
- APIs SICT y Semovi para validación de licencias
- Scraping de Repuve y padrón vehicular
- KYC con validación de identidad (INE/CURP)

**Fase 4 — Mobile nativo (4–6 semanas)**
- React Native + Expo (iOS + Android)
- Notificaciones push nativas (FCM)
- Geolocalización en tiempo real

---

## Notas técnicas

- **Sin pantalla de login:** el demo inicia directamente autenticado para eliminar fricción. La pantalla de login (`/login`) existe en el router pero no se activa en modo demo.
- **Persistencia en sesión:** las citas y pagos creados durante la demo se guardan en `_store` (módulo en memoria). Al refrescar la página, los datos vuelven al estado inicial del seed.
- **Responsive:** la app está optimizada para **375–480 px** (tamaño de teléfono). En escritorio se muestra centrada como columna de móvil — comportamiento intencional.
- **Sin backend:** 100% frontend. No se realizan llamadas de red en ningún flujo del demo.

---

> **Contrato técnico completo:** ver [`CONTRACT.md`](./CONTRACT.md) — esquemas de datos, props de componentes, mapa de rutas y tokens de diseño.
