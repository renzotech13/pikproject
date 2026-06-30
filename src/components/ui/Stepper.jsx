import { Fragment } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/cn'

// steps: [{ key: string, label: string }]
// current: índice del paso activo (0-based)
export default function Stepper({ steps, current }) {
  return (
    <div className="flex items-start">
      {steps.map((step, i) => {
        const done   = i < current
        const active = i === current

        return (
          <Fragment key={step.key}>
            <div className="flex flex-col items-center gap-1">
              {/* Círculo numérico */}
              <div
                className={cn(
                  'grid h-7 w-7 place-items-center rounded-full text-xs font-bold transition-all duration-200',
                  done   && 'bg-primary text-white',
                  active && 'bg-primary text-white ring-4 ring-primary/20',
                  !done && !active && 'bg-slate-100 text-slate-400'
                )}
              >
                {done ? <Check size={13} strokeWidth={2.5} /> : i + 1}
              </div>

              {/* Etiqueta */}
              <span
                className={cn(
                  'whitespace-nowrap text-[10px] font-semibold',
                  (active || done) ? 'text-primary' : 'text-slate-400'
                )}
              >
                {step.label}
              </span>
            </div>

            {/* Conector entre pasos */}
            {i < steps.length - 1 && (
              <div
                className={cn(
                  'mt-3.5 h-0.5 flex-1 transition-colors duration-200',
                  i < current ? 'bg-primary' : 'bg-slate-100'
                )}
              />
            )}
          </Fragment>
        )
      })}
    </div>
  )
}
