import { cn } from '@/lib/cn'

export default function Skeleton({ variant = 'rect', width, height, className }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'animate-pulse bg-slate-100',
        variant === 'circle' ? 'rounded-full' : 'rounded-xl',
        variant === 'text'   && 'h-4 rounded-md',
        className
      )}
      style={{ width, height }}
    />
  )
}
