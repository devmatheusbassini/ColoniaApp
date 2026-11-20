import type { Budget, Pet, PetSpecies, QuoteItem } from '../types'
import { dateKey, daysBetween, parseDateParts } from './format'

type Season = Budget['seasonType']

const DAILY: Record<PetSpecies, Record<Season, number>> = {
 'Cão': { 'Nenhum': 80, 'Feriado': 90, 'Data comemorativa': 90, 'Alta temporada': 95 },
 'Gato': { 'Nenhum': 90, 'Feriado': 100, 'Data comemorativa': 100, 'Alta temporada': 100 },
 'Outros': { 'Nenhum': 90, 'Feriado': 100, 'Data comemorativa': 100, 'Alta temporada': 100 },
}
const TIME_EXTRA: Record<PetSpecies, { normal: number; season: number }> = {
 'Cão': { normal: 40, season: 45 }, 'Gato': { normal: 45, season: 50 }, 'Outros': { normal: 45, season: 50 },
}
const HIGH_SEASON_MONTHS = [12, 1]
const VALID_DAYS = 7

export const rateFor = (species: PetSpecies, season: Season) => DAILY[species][season]
export const extraRate = (species: PetSpecies, season: Season) => season === 'Nenhum' ? TIME_EXTRA[species].normal : TIME_EXTRA[species].season
export const detectSeason = (entry: string, manual: Season): Season => manual !== 'Nenhum' ? manual : HIGH_SEASON_MONTHS.includes(parseDateParts(entry)?.month || 0) ? 'Alta temporada' : 'Nenhum'
export const quoteForPet = (species: PetSpecies, season: Season, quantity: number): QuoteItem => ({ species, quantity, normalRate: rateFor(species, season) })
const PLURAL: Record<PetSpecies, string> = { 'Cão': 'Cães', 'Gato': 'Gatos', 'Outros': 'Outros' }
export const speciesName = (n: number, species: PetSpecies) => n > 1 ? PLURAL[species] : species
export const speciesCount = (n: number, species: PetSpecies) => `${n} ${n > 1 ? PLURAL[species] : species}`
export const quickLabel = (items: QuoteItem[]) => items.filter(x => x.quantity > 0).map(x => speciesCount(x.quantity, x.species)).join(' + ') || 'Orçamento rápido'
export const validUntilFrom = (createdAt: Date) => dateKey(new Date(createdAt.getTime() + VALID_DAYS * 86400000))
export const budgetValidUntil = (b: Budget) => b.validUntil || validUntilFrom(new Date(b.createdAt))

// Manhã (<12h), tarde (12h–18h), noite (18h+). Saída em período posterior ao da entrada gera adicional de horário.
const dayPeriod = (t?: string) => { if (!t) return -1; const h = Number(t.split(':')[0]); return h < 12 ? 0 : h < 18 ? 1 : 2 }
export const autoExtra = (entry?: string, exit?: string) => { const a = dayPeriod(entry), b = dayPeriod(exit); return a >= 0 && b > a }

export const budgetDays = (b: Pick<Budget, 'entryDate' | 'exitDate' | 'days' | 'manualDays'>) => b.manualDays ? Math.max(1, Math.round(b.days || 1)) : daysBetween(b.entryDate, b.exitDate)
export const totalBudget = (b: Budget) => Math.max(0, b.discountedTotal ?? 0)

// Orçamentos antigos guardavam só os componentes do preço; calcula o total uma vez ao carregar.
export const legacyTotal = (b: Budget) => {
 const days = budgetDays(b)
 const season = b.seasonType === 'Nenhum' ? 0 : b.seasonMode === '%' ? b.dailyRate * days * b.seasonValue / 100 : b.seasonValue
 return Math.max(0, b.dailyRate * days + (b.timeExtra ? (b.timeExtraValue ?? 30) : 0) + season - b.discount + (b.services || []).reduce((s, x) => s + x.value * x.quantity, 0))
}

// Dados antigos registravam só `paidValue`, sem a lista de pagamentos.
export const amountPaid = (b: Budget) => (b.payments || []).reduce((s, p) => s + p.value, 0) || (b.paidValue || 0)
export const balanceDue = (b: Budget) => Math.max(0, totalBudget(b) - amountPaid(b))
export const paymentStatus = (b: Budget) => { const paid = amountPaid(b); return balanceDue(b) <= 0 ? 'Pago' : paid > 0 ? 'Parcial' : 'Pendente' }

export const isBooked = (b: Budget) => b.status !== 'Cancelado' && b.status !== 'Rascunho'

export const budgetPetIds = (b: Budget) => [b.petId, ...(b.petIds || [])].filter(Boolean) as string[]
export const joinNames = (n: string[]) => n.length > 1 ? `${n.slice(0, -1).join(', ')} e ${n[n.length - 1]}` : n[0] || ''
export const budgetPets = (b: Budget, pets: Pet[]) => budgetPetIds(b).map(id => pets.find(p => p.id === id)).filter(Boolean) as Pet[]
export const guestName = (b: Budget, pets: Pet[]) => joinNames(budgetPets(b, pets).map(p => p.name)) || b.quickPetName?.trim() || (b.quoteItems?.some(x => x.quantity > 0) ? quickLabel(b.quoteItems) : b.quickLabel) || (b.petId ? 'Hóspede removido' : 'Orçamento rápido')
