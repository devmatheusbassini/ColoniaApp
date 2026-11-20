import type { AppData } from '../types'
const KEY='tia-ci-data-v1'
const empty:AppData={pets:[],vaccines:[],budgets:[],incidents:[]}

// Normaliza qualquer objeto lido (localStorage ou backup) para o formato atual dos dados.
function normalize(raw:any):AppData{return {pets:Array.isArray(raw?.pets)?raw.pets:[],vaccines:Array.isArray(raw?.vaccines)?raw.vaccines:[],budgets:(Array.isArray(raw?.budgets)?raw.budgets:[]).map((b:any)=>({...b,payments:b.payments||[]})),incidents:Array.isArray(raw?.incidents)?raw.incidents:[]}}

export function loadData():AppData { try { return normalize(JSON.parse(localStorage.getItem(KEY)||'null')||empty) } catch { return empty } }

// Retorna false quando não foi possível gravar (ex.: armazenamento do aparelho cheio).
export function saveData(data:AppData):boolean { try { localStorage.setItem(KEY,JSON.stringify(data)); return true } catch { return false } }

export const uid=()=>crypto.randomUUID?.()||`${Date.now()}-${Math.random()}`

const BACKUP_APP='colonia-tia-ci'

export function backupFileName(){const d=new Date(),p=(n:number)=>String(n).padStart(2,'0');return `backup-colonia-tia-ci-${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}-${p(d.getHours())}h${p(d.getMinutes())}.json`}

export function backupJson(data:AppData){return JSON.stringify({app:BACKUP_APP,version:1,exportedAt:new Date().toISOString(),data},null,1)}

// Lê um arquivo de backup. Lança erro com mensagem amigável se o arquivo não for um backup válido.
export function parseBackup(text:string):AppData{let raw:any;try{raw=JSON.parse(text)}catch{throw new Error('O arquivo não é um backup válido.')}const payload=raw?.app===BACKUP_APP?raw.data:raw;if(!payload||!Array.isArray(payload.pets)||!Array.isArray(payload.budgets))throw new Error('O arquivo não contém dados da Colônia de Férias da Tia Cí.');return normalize(payload)}
