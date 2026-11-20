import { useEffect, useState } from 'react'
import { CalendarDays, CircleDollarSign, Home, PawPrint, Sparkles, Syringe, Users } from 'lucide-react'
import type { Session } from '@supabase/supabase-js'
import { currentSession, supabase } from './lib/cloud'
import { useCloudSync } from './lib/useCloudSync'
import { Splash } from './ui/common'
import { Login } from './features/auth/Login'
import { Dashboard } from './features/home/Dashboard'
import type { Go, Tab } from './navigation'
import { Clients } from './features/pets/Clients'
import { Budgets } from './features/budgets/Budgets'
import { Agenda } from './features/agenda/Agenda'
import { Vaccines } from './features/vaccines/Vaccines'
import { Menu } from './features/menu/Menu'

const SPLASH_MIN_MS = 900

export default function App(){
 const [session,setSession]=useState<Session|null|undefined>(undefined)
 useEffect(()=>{currentSession().then(setSession).catch(()=>setSession(null));const {data:sub}=supabase.auth.onAuthStateChange((_e,s)=>setSession(s));return()=>sub.subscription.unsubscribe()},[])
 if(session===undefined)return <Splash/>
 if(!session)return <Login/>
 return <MainApp key={session.user.id} userId={session.user.id}/>
}

function MainApp({userId}:{userId:string}){
 const {data,setData,ready,sync,retry}=useCloudSync(userId)
 const [tab,setTab]=useState<Tab>('inicio'),[splash,setSplash]=useState(true),[intent,setIntent]=useState<'pet'|'budget'|null>(null)
 useEffect(()=>{const t=setTimeout(()=>setSplash(false),SPLASH_MIN_MS);return()=>clearTimeout(t)},[])
 const go:Go=(t,i=null)=>{setIntent(i);setTab(t)}
 const clearIntent=()=>setIntent(null)
 if(splash||!ready)return <Splash text={!ready&&!splash?'Sincronizando seus dados…':undefined}/>
 return <div className="app"><header className="topbar"><div className="brandMark"><img src="/logo.jpeg"/></div><div className="brandName"><strong>Colônia de Férias da Tia Cí</strong><span><Sparkles/> Cuidado, carinho e diversão</span></div><div className="headerPaw"><PawPrint/></div></header><main>
  {tab==='inicio'&&<Dashboard data={data} go={go}/>} {tab==='clientes'&&<Clients data={data} setData={setData} openIntent={intent==='pet'} clearIntent={clearIntent}/>} {tab==='orcamentos'&&<Budgets data={data} setData={setData} openIntent={intent==='budget'} clearIntent={clearIntent}/>} {tab==='agenda'&&<Agenda data={data}/>} {tab==='vacinas'&&<Vaccines data={data} setData={setData}/>} {tab==='menu'&&<Menu data={data} setData={setData} sync={sync} retry={retry}/>}
 </main><nav>{([['inicio',Home,'Início'],['clientes',Users,'Hóspedes'],['orcamentos',CircleDollarSign,'Orçamento'],['agenda',CalendarDays,'Agenda'],['vacinas',Syringe,'Vacinas'],['menu',PawPrint,'Menu']] as const).map(([id,I,label])=><button key={id} className={tab===id?'active':''} onClick={()=>go(id)}><I/><span>{label}</span></button>)}</nav></div>
}
