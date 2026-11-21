import type { AppData } from '../types'
import { legacyTotal } from '../domain/budget'
const KEY='tia-ci-data-v1'
const empty:AppData={pets:[],vaccines:[],budgets:[],incidents:[]}

const UP=(v:any)=>typeof v==='string'?v.toLocaleUpperCase('pt-BR'):v
const upPet=(p:any)=>({...p,temperament:Array.isArray(p.temperament)?p.temperament.map((t:string)=>t==='Ciumento'?'Possessivo':t):p.temperament,name:UP(p.name),guardian:UP(p.guardian),emergencyName:UP(p.emergencyName),vetClinic:UP(p.vetClinic),veterinarianName:UP(p.veterinarianName)})
function normalize(raw:any):AppData{return {pets:Array.isArray(raw?.pets)?raw.pets.map(upPet):[],vaccines:Array.isArray(raw?.vaccines)?raw.vaccines:[],budgets:(Array.isArray(raw?.budgets)?raw.budgets:[]).map((b:any)=>({...b,quickPetName:UP(b.quickPetName),quickGuardianName:UP(b.quickGuardianName),payments:b.payments||[],discountedTotal:typeof b.discountedTotal==='number'?b.discountedTotal:legacyTotal(b),timeExtraValue:b.timeExtraValue??(b.timeExtra?30:undefined)})),incidents:Array.isArray(raw?.incidents)?raw.incidents:[]}}

export function loadData():AppData { try { return normalize(JSON.parse(localStorage.getItem(KEY)||'null')||empty) } catch { return empty } }

export function saveData(data:AppData):boolean { try { localStorage.setItem(KEY,JSON.stringify(data)); return true } catch { return false } }

export const uid=()=>crypto.randomUUID?.()||`${Date.now()}-${Math.random()}`

const BACKUP_APP='colonia-tia-ci'

export function backupFileName(){const d=new Date(),p=(n:number)=>String(n).padStart(2,'0');return `backup-colonia-tia-ci-${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}-${p(d.getHours())}h${p(d.getMinutes())}.json`}

export function backupJson(data:AppData){return JSON.stringify({app:BACKUP_APP,version:1,exportedAt:new Date().toISOString(),data},null,1)}

export function parseBackup(text:string):AppData{let raw:any;try{raw=JSON.parse(text)}catch{throw new Error('O arquivo não é um backup válido.')}const payload=raw?.app===BACKUP_APP?raw.data:raw;if(!payload||!Array.isArray(payload.pets)||!Array.isArray(payload.budgets))throw new Error('O arquivo não contém dados da Colônia de Férias da Tia Cí.');return normalize(payload)}
