import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Gift, Star, ChevronRight } from 'lucide-react'
import { Card, Badge, EmptyState, Skeleton } from '@/components/ui'
import { useAsync } from '@/hooks/useAsync'
import { listAliados } from '@/services/beneficiosService'
import { getIniciales } from '@/lib/formatters'
import { listContainer, listItem } from '@/lib/motion'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/lib/cn'

const CATEGORIA_LABELS = {
  repuestos:    'Repuestos',
  combustible:  'Combustible',
  seguros:      'Seguros',
  talleres:     'Talleres',
  indumentaria: 'Equipo',
  gastronomia:  'Comida',
}

const CATEGORIA_COLOR = {
  repuestos:    'bg-primary/10 text-primary',
  combustible:  'bg-amber-100 text-amber-600',
  seguros:      'bg-sky-100 text-sky-600',
  talleres:     'bg-slate-100 text-slate-600',
  indumentaria: 'bg-purple-100 text-purple-600',
  gastronomia:  'bg-rose-100 text-rose-600',
}

export default function BenefitsList() {
  const navigate = useNavigate()
  const [categoria, setCategoria] = useState('todos')

  const { data: aliados, loading } = useAsync(() => listAliados({ activo: true }), [])
  const lista = aliados ?? []

  const categorias = ['todos', ...new Set(lista.map((a) => a.categoria))]
  const filtrados  = categoria === 'todos' ? lista : lista.filter((a) => a.categoria === categoria)

  return (
    <div className="space-y-4 px-4 pb-28 pt-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-ink">Beneficios</h2>
        <Badge variant="info">DEMO</Badge>
      </div>
      <p className="-mt-2 text-sm text-slate-500">
        Descuentos exclusivos por ser motociclista certificado PIK.
      </p>

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} height={92} className="w-full" />)}
        </div>
      )}

      {!loading && lista.length === 0 && (
        <EmptyState
          Icon={Gift}
          title="Sin beneficios disponibles"
          description="Pronto sumaremos aliados comerciales a la red PIK."
        />
      )}

      {!loading && lista.length > 0 && (
        <>
          {/* Filtro por categoría */}
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {categorias.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategoria(c)}
                className={cn(
                  'shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold transition-colors',
                  categoria === c
                    ? 'bg-primary text-white'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                )}
              >
                {c === 'todos' ? 'Todos' : (CATEGORIA_LABELS[c] ?? c)}
              </button>
            ))}
          </div>

          {/* Lista de aliados */}
          <motion.div
            key={categoria}
            variants={listContainer}
            initial="hidden"
            animate="show"
            className="space-y-3"
          >
            {filtrados.map((aliado) => (
              <motion.div key={aliado.id} variants={listItem}>
                <Card
                  variant="interactive"
                  padding="md"
                  onClick={() => navigate(ROUTES.BENEFIT_DETAIL(aliado.id))}
                >
                  <div className="flex items-center gap-3">
                    {/* Logo (iniciales) */}
                    <div className={cn(
                      'grid h-11 w-11 shrink-0 place-items-center rounded-xl text-xs font-bold',
                      CATEGORIA_COLOR[aliado.categoria] ?? 'bg-slate-100 text-slate-600'
                    )}>
                      {getIniciales(aliado.nombre)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <p className="truncate text-sm font-semibold text-ink">{aliado.nombre}</p>
                        {aliado.membresiaRequerida === 'premium' && (
                          <Badge variant="primary" size="sm">PRO</Badge>
                        )}
                        {aliado.destacado && (
                          <Badge variant="warning" size="sm">★ Destacado</Badge>
                        )}
                      </div>
                      <p className="mt-0.5 truncate text-xs font-medium text-primary">
                        {aliado.beneficio.titulo}
                      </p>
                      <div className="mt-0.5 flex items-center gap-2 text-[11px] text-slate-400">
                        <span className="flex items-center gap-0.5">
                          <Star size={10} className="fill-amber-400 text-amber-400" />
                          {aliado.calificacion}
                        </span>
                        <span>· {aliado.totalCanjes.toLocaleString('es-MX')} canjes</span>
                      </div>
                    </div>

                    <ChevronRight size={16} className="shrink-0 text-slate-300" />
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </>
      )}
    </div>
  )
}
