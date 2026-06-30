import { mockFetch } from './api'
import analyticsRaw from '@/data/analytics.json'

export async function getResumen()              { return mockFetch(analyticsRaw.resumen) }
export async function getKpis()                 { return mockFetch(analyticsRaw.kpis) }
export async function getIngresosPorMes()       { return mockFetch(analyticsRaw.ingresosPorMes) }
export async function getCertificacionesPorMes(){ return mockFetch(analyticsRaw.certificacionesPorMes) }
export async function getCitasPorSede()         { return mockFetch(analyticsRaw.citasPorSede) }
export async function getUsuariosPorEstado()    { return mockFetch(analyticsRaw.usuariosPorEstado) }
export async function getCanjesPorAliado()      { return mockFetch(analyticsRaw.canjesPorAliado) }
