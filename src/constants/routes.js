// Rutas centralizadas (evita strings sueltos en navegación). Ver CONTRACT.md §4.
export const ROUTES = {
  // Públicas
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/registro',
  FORGOT: '/recuperar',

  // App del motociclista
  APP: '/app',
  VERIFICATION: '/app/verificacion',
  VERIFICATION_RESULT: '/app/verificacion/resultado',
  APPOINTMENTS: '/app/citas',
  BOOK_APPOINTMENT: '/app/citas/agendar',
  APPOINTMENT_DETAIL: (id = ':citaId') => `/app/citas/${id}`,
  SEDES: '/app/sedes',
  SEDE_DETAIL: (id = ':sedeId') => `/app/sedes/${id}`,
  PAYMENTS: '/app/pagos',
  CHECKOUT: '/app/pagos/checkout',
  PAYMENT_RECEIPT: (id = ':pagoId') => `/app/pagos/${id}`,
  BENEFITS: '/app/beneficios',
  BENEFIT_DETAIL: (id = ':aliadoId') => `/app/beneficios/${id}`,
  CREDENTIAL: '/app/credencial',
  REGULATIONS: '/app/regulaciones',
  REGULATION_DETAIL: (id = ':regId') => `/app/regulaciones/${id}`,
  PROFILE: '/app/perfil',
  PROFILE_EDIT: '/app/perfil/editar',
  PROFILE_VEHICLE: '/app/perfil/vehiculo',

  // Panel admin
  ADMIN: '/admin',
  ADMIN_VERIFICATIONS: '/admin/verificaciones',
  ADMIN_APPOINTMENTS: '/admin/citas',
  ADMIN_SEDES: '/admin/sedes',
  ADMIN_ALLIES: '/admin/aliados',
  ADMIN_REGULATIONS: '/admin/regulaciones',
  ADMIN_USERS: '/admin/usuarios',
}
