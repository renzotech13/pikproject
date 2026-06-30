import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { pageVariants } from '@/lib/motion'
import TopBar from './TopBar'
import BottomNav from './BottomNav'

// Contenedor principal de la app del motociclista.
// Sticky TopBar + contenido animado + BottomNav flotante.
export default function AppShell() {
  const location = useLocation()

  return (
    <div className="relative mx-auto flex min-h-dvh max-w-app flex-col bg-surface">
      <TopBar />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          variants={pageVariants}
          initial="initial"
          animate="enter"
          exit="exit"
          className="flex-1"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <BottomNav />
    </div>
  )
}
