import { cn } from '@/lib/cn'

export default function EmptyState({ Icon, title, description, action, className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-4 px-6 py-14 text-center', className)}>
      {Icon && (
        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-slate-100">
          <Icon size={28} className="text-slate-400" strokeWidth={1.5} />
        </div>
      )}
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-ink">{title}</h3>
        {description && <p className="text-sm text-slate-500">{description}</p>}
      </div>
      {action}
    </div>
  )
}
