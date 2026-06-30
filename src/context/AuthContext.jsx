import { createContext, useContext, useState } from 'react'

// Usuarios demo — cargados automáticamente para la demo del cliente.
// No requieren login. Ver CONTRACT.md §0 (AuthContext).
const DEMO_MOTO = {
  id: 'usr_001',
  rol: 'motociclista',
  nombres: 'Carlos',
  apellidos: 'Quispe Mamani',
  email: 'carlos.quispe@example.com',
  avatarUrl: null,
  estadoCertificacion: 'certificado',
  nivelVerificacion: 3,
  scorePIK: 820,
  membresia: 'premium',
  codigoPIK: 'PIK-2026-004512',
  fechaVencimiento: '2027-01-15',
  vehiculo: { placa: '1234-AB', marca: 'Honda', modelo: 'CB 190R', anio: 2022 },
}

const DEMO_ADMIN = {
  id: 'usr_900',
  rol: 'admin',
  nombres: 'Admin',
  apellidos: 'PIK',
  email: 'admin@pik.pe',
  avatarUrl: null,
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(DEMO_MOTO)

  function switchDemoUser(rol) {
    setCurrentUser(rol === 'admin' ? DEMO_ADMIN : DEMO_MOTO)
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoggedIn: !!currentUser,
        isAdmin: currentUser?.rol === 'admin' || currentUser?.rol === 'operador',
        switchDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}
