// Shared Framer Motion presets — import these instead of writing inline transitions.

// Page enter/exit — used in AppShell and AdminLayout with AnimatePresence mode="wait"
export const pageVariants = {
  initial: { opacity: 0, y: 12 },
  enter:   { opacity: 1, y: 0,  transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.14, ease: 'easeIn' } },
}

// Stagger container — apply to the wrapping motion.div of a list
export const listContainer = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
}

// Stagger item — apply to each motion.div inside listContainer
export const listItem = {
  hidden: { opacity: 0, y: 12 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] } },
}
