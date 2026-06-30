/** @type {import('tailwindcss').Config} */
// Tokens de diseño PIK — fuente única de verdad para colores/spacing.
// Ver CONTRACT.md > "Sistema de Diseño" para el detalle semántico.
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Marca
        primary: {
          DEFAULT: '#4F46E5', // indigo-600 · confianza / tecnología
          50: '#EEF2FF',
          100: '#E0E7FF',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          900: '#312E81',
        },
        accent: {
          DEFAULT: '#F59E0B', // amber · energía / acción
          500: '#F59E0B',
          600: '#D97706',
        },
        ink: '#0F172A', // slate-900 · texto principal
        // Semánticos de estado (certificación, citas, pagos)
        success: '#16A34A', // verificado / certificado / pagado
        warning: '#F59E0B', // pendiente / en proceso
        danger: '#DC2626', // rechazado / vencido / cancelado
        info: '#0EA5E9', // informativo
        surface: '#F8FAFC', // fondo app
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
      },
      maxWidth: {
        app: '480px', // contenedor mobile-first
      },
      boxShadow: {
        card: '0 1px 3px rgba(15,23,42,0.08), 0 1px 2px rgba(15,23,42,0.04)',
        float: '0 8px 24px rgba(15,23,42,0.12)',
      },
    },
  },
  plugins: [],
}
