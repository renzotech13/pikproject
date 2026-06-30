import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Fusiona clases Tailwind sin conflictos. Lo usan TODOS los componentes
// para combinar su `className` con los estilos internos. (CONTRACT.md §3)
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
