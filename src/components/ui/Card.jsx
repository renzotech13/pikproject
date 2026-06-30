import { cn } from '@/lib/cn'

const VARIANTS = {
  default:     'bg-white shadow-card',
  elevated:    'bg-white shadow-float',
  outlined:    'bg-white border border-slate-200',
  interactive: 'bg-white shadow-card cursor-pointer transition-all duration-150 hover:shadow-float active:scale-[0.98]',
}

const PADDING = {
  none: '',
  sm:   'p-3',
  md:   'p-4',
  lg:   'p-5',
}

// Renderiza como <button> cuando se pasa onClick, <div> en cualquier otro caso.
export default function Card({
  variant = 'default',
  padding = 'md',
  onClick,
  children,
  className,
  ...rest
}) {
  const Tag = onClick ? 'button' : 'div'

  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={cn(
        'rounded-2xl',
        VARIANTS[variant],
        PADDING[padding],
        onClick && 'w-full text-left',
        className
      )}
      {...rest}
    >
      {children}
    </Tag>
  )
}
