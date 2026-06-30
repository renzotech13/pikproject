import { cn } from '@/lib/cn'

export default function Input({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  name,
  error,
  helperText,
  leftIcon,
  rightIcon,
  disabled = false,
  required = false,
  className,
  ...rest
}) {
  const id = name ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-slate-700">
          {label}
          {required && (
            <span className="ml-0.5 text-danger" aria-hidden="true">*</span>
          )}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-slate-400">
            {leftIcon}
          </span>
        )}

        <input
          id={id}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : helperText ? `${id}-hint` : undefined}
          className={cn(
            'w-full rounded-xl border bg-white py-2.5 text-sm text-ink placeholder:text-slate-400',
            'transition-colors duration-150',
            'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
            'disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400',
            leftIcon  ? 'pl-10'  : 'pl-3.5',
            rightIcon ? 'pr-10' : 'pr-3.5',
            error
              ? 'border-danger focus:ring-danger/30 focus:border-danger'
              : 'border-slate-200 hover:border-slate-300'
          )}
          {...rest}
        />

        {rightIcon && (
          <span className="absolute inset-y-0 right-3.5 flex items-center text-slate-400">
            {rightIcon}
          </span>
        )}
      </div>

      {error && (
        <p id={`${id}-error`} className="text-xs font-medium text-danger" role="alert">
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={`${id}-hint`} className="text-xs text-slate-500">
          {helperText}
        </p>
      )}
    </div>
  )
}
