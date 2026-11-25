import { useEffect, useState } from 'react'
import { CalendarDays, CircleDollarSign, Home, PawPrint, Sparkles, Syringe, Users } from 'lucide-react'
import { currentUserId, storedUserId, supabase } from './lib/cloud'
import { useCloudSync } from './lib/useCloudSync'
import { Splash } from './ui/common'
import { Login } from './features/auth/Login'
import { Dashboard } from './features/home/Dashboard'
import type { Go, Tab } from './navigation'
import { Clients } from './features/pets/Clients'
import { Budgets } from './features/budgets/Budgets'
import { Agenda } from './features/agenda/Agenda'
import { Vaccines } from './features/vaccines/Vaccines'
import { Menu, BackupReminder } from './features/menu/Menu'
import { visible, unhide, purgePet, expired } from './lib/trash'
import { loadPdf } from './lib/pdfLazy'

const SPLASH_MIN_MS = 900

export default function App(){
 // Abre com a conta já salva no aparelho, sem esperar a internet; só volta ao login se a pessoa sair da conta.
 const [userId,setUserId]=useState<string|null|undefined>(undefined)
 useEffect(()=>{currentUserId().then(setUserId).catch(()=>setUserId(storedUserId()));const {data:sub}=supabase.auth.onAuthStateChange((e,s)=>{if(s)setUserId(s.user.id);else if(e==='SIGNED_OUT'||!storedUserId())setUserId(null)});return()=>sub.subscription.unsubscribe()},[])
 if(userId===undefined)return <Splash/>
 if(!userId)return <Login/>
 return <MainApp key={userId} userId={userId}/>
}

function MainApp({userId}:{userId:string}){
 const {data:full,setData:setFull,ready,sync,retry}=useCloudSync(userId)
 const data=visible(full),setData=(d:typeof full)=>setFull(unhide(full,d))
 useEffect(()=>{if(!ready)return;const old=full.pets.filter(p=>expired(p.trashedAt));if(old.length)setFull(old.reduce((d,p)=>purgePet(d,p.id),full))},[ready])
 const [tab,setTab]=useState<Tab>('inicio'),[splash,setSplash]=useState(true),[intent,setIntent]=useState<'pet'|'budget'|null>(null)
 useEffect(()=>{const t=setTimeout(()=>setSplash(false),SPLASH_MIN_MS);return()=>clearTimeout(t)},[])
 useEffect(()=>{if(!ready)return;const t=setTimeout(()=>{loadPdf().catch(()=>{})},3000);return()=>clearTimeout(t)},[ready])
 const go:Go=(t,i=null)=>{setIntent(i);setTab(t)}
 const clearIntent=()=>setIntent(null)
 if(splash||!ready)return <Splash text={!ready&&!splash?'Sincronizando seus dados…':undefined}/>
 return <div className="app"><header className="topbar"><div className="brandMark"><img src="/logo.jpeg"/></div><div className="brandName"><strong>Colônia de Férias da Tia Cí</strong><span><Sparkles/> Cuidado, carinho e diversão</span></div><div className="headerPaw"><PawPrint/></div></header><main>
  {tab==='inicio'&&<><BackupReminder data={full}/><Dashboard data={data} go={go}/></>} {tab==='clientes'&&<Clients data={data} setData={setData} openIntent={intent==='pet'} clearIntent={clearIntent}/>} {tab==='orcamentos'&&<Budgets data={data} setData={setData} openIntent={intent==='budget'} clearIntent={clearIntent}/>} {tab==='agenda'&&<Agenda data={data}/>} {tab==='vacinas'&&<Vaccines data={data} setData={setData}/>} {tab==='menu'&&<Menu data={data} setData={setData} full={full} setFull={setFull} sync={sync} retry={retry}/>}
 </main><nav>{([['inicio',Home,'Início'],['clientes',Users,'Hóspedes'],['orcamentos',CircleDollarSign,'Orçamento'],['agenda',CalendarDays,'Agenda'],['vacinas',Syringe,'Vacinas'],['menu',PawPrint,'Menu']] as const).map(([id,I,label])=><button key={id} className={tab===id?'active':''} onClick={()=>go(id)}><I/><span>{label}</span></button>)}</nav></div>
}
