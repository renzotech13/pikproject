import { createBrowserRouter } from 'react-router-dom'
import { RequireAuth, RequireRole } from './guards'
import AppShell from '@/components/layout/AppShell'
import AdminLayout from '@/components/layout/AdminLayout'

// ── Páginas públicas ──────────────────────────────────────────────────────────
import { Landing, NotFound } from '@/features/home'
import { Login, Register, ForgotPassword } from '@/features/auth'

// ── App del motociclista ──────────────────────────────────────────────────────
import { HomeDashboard } from '@/features/home'
import { VerificationFlow, VerificationResult } from '@/features/verification'
import { AppointmentsList, BookAppointment, AppointmentDetail } from '@/features/appointments'
import { PaymentsHistory, PaymentReceipt, Checkout } from '@/features/payments'
import { BenefitsList, BenefitDetail } from '@/features/benefits'
import { SedesList, SedeDetail } from '@/features/sedes'
import { RegulationsList, RegulationDetail } from '@/features/regulations'
import { DigitalCredential } from '@/features/credential'
import { Profile, EditProfile, VehicleInfo } from '@/features/profile'

// ── Panel admin ───────────────────────────────────────────────────────────────
import {
  Overview,
  VerificationsManage,
  AppointmentsManage,
  SedesManage,
  AlliesManage,
  RegulationsManage,
  UsersManage,
} from '@/features/dashboard'

export const router = createBrowserRouter([
  // ── Rutas públicas ──────────────────────────────────────────────────────────
  { path: '/', element: <Landing />, handle: { title: 'PIK' } },
  { path: '/login', element: <Login />, handle: { title: 'Iniciar Sesión' } },
  { path: '/registro', element: <Register />, handle: { title: 'Crear Cuenta' } },
  { path: '/recuperar', element: <ForgotPassword />, handle: { title: 'Recuperar Acceso' } },

  // ── App del motociclista /app/* ─────────────────────────────────────────────
  {
    path: '/app',
    element: (
      <RequireAuth>
        <AppShell />
      </RequireAuth>
    ),
    handle: { title: 'Inicio' },
    children: [
      { index: true, element: <HomeDashboard /> },

      {
        path: 'verificacion',
        handle: { title: 'Verificación' },
        children: [
          { index: true, element: <VerificationFlow /> },
          { path: 'resultado', element: <VerificationResult />, handle: { title: 'Resultado de Verificación' } },
        ],
      },

      {
        path: 'citas',
        handle: { title: 'Mis Citas' },
        children: [
          { index: true, element: <AppointmentsList /> },
          { path: 'agendar', element: <BookAppointment />, handle: { title: 'Agendar Cita' } },
          { path: ':citaId', element: <AppointmentDetail />, handle: { title: 'Detalle de Cita' } },
        ],
      },

      {
        path: 'sedes',
        handle: { title: 'Sedes' },
        children: [
          { index: true, element: <SedesList /> },
          { path: ':sedeId', element: <SedeDetail />, handle: { title: 'Detalle de Sede' } },
        ],
      },

      {
        path: 'pagos',
        handle: { title: 'Mis Pagos' },
        children: [
          { index: true, element: <PaymentsHistory /> },
          { path: 'checkout', element: <Checkout />, handle: { title: 'Pagar' } },
          { path: ':pagoId', element: <PaymentReceipt />, handle: { title: 'Comprobante' } },
        ],
      },

      {
        path: 'beneficios',
        handle: { title: 'Beneficios' },
        children: [
          { index: true, element: <BenefitsList /> },
          { path: ':aliadoId', element: <BenefitDetail />, handle: { title: 'Detalle de Beneficio' } },
        ],
      },

      { path: 'credencial', element: <DigitalCredential />, handle: { title: 'Mi Credencial' } },

      {
        path: 'regulaciones',
        handle: { title: 'Regulaciones' },
        children: [
          { index: true, element: <RegulationsList /> },
          { path: ':regId', element: <RegulationDetail />, handle: { title: 'Regulación' } },
        ],
      },

      {
        path: 'perfil',
        handle: { title: 'Mi Perfil' },
        children: [
          { index: true, element: <Profile /> },
          { path: 'editar', element: <EditProfile />, handle: { title: 'Editar Perfil' } },
          { path: 'vehiculo', element: <VehicleInfo />, handle: { title: 'Mi Vehículo' } },
        ],
      },
    ],
  },

  // ── Panel admin /admin/* ────────────────────────────────────────────────────
  {
    path: '/admin',
    element: (
      <RequireRole roles={['admin', 'operador']}>
        <AdminLayout />
      </RequireRole>
    ),
    children: [
      { index: true, element: <Overview />, handle: { title: 'Dashboard' } },
      { path: 'verificaciones', element: <VerificationsManage />, handle: { title: 'Verificaciones' } },
      { path: 'citas', element: <AppointmentsManage />, handle: { title: 'Gestión de Citas' } },
      { path: 'sedes', element: <SedesManage />, handle: { title: 'Gestión de Sedes' } },
      { path: 'aliados', element: <AlliesManage />, handle: { title: 'Gestión de Aliados' } },
      { path: 'regulaciones', element: <RegulationsManage />, handle: { title: 'Regulaciones' } },
      { path: 'usuarios', element: <UsersManage />, handle: { title: 'Usuarios' } },
    ],
  },

  // ── Fallback ────────────────────────────────────────────────────────────────
  { path: '*', element: <NotFound /> },
])
