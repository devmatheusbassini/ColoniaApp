import { useEffect, useState } from 'react'

import {  PawPrint, Plus, X } from 'lucide-react'
import type {  Pet } from '../types'

export function Splash({text='Preparando o cantinho dos Aumigos…'}:{text?:string}){
 const [pct,setPct]=useState(0)
 useEffect(()=>{const t=setInterval(()=>setPct(p=>p<90?p+6:p<99?p+1:99),60);return()=>clearInterval(t)},[])
 return <div className="splash" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}><div className="splashLogo"><img src="/logo.jpeg" alt=""/></div><h1>Colônia de Férias da Tia Cí</h1><p>{text}</p><div className="splashProgress"><div className="splashBar"><span style={{width:pct+'%'}}/></div><b>{pct}%</b></div></div>
}
export function YesNoField({label,value,set}:{label:string,value:'Sim'|'Não'|'',set:(v:'Sim'|'Não')=>void}){return <div className="yesNoField"><span>{label}</span><div><button type="button" className={value==='Sim'?'active':''} onClick={()=>set('Sim')}><i/>Sim</button><button type="button" className={value==='Não'?'active no':''} onClick={()=>set('Não')}><i/>Não</button></div></div>}
export function Info({label,value}:{label:string,value?:string}){return <div className="infoItem"><span>{label}</span><b>{value||'Não informado'}</b></div>}
export function Avatar({pet}:{pet?:Pet}){return <div className="avatar">{pet?.photo?<img src={pet.photo}/>:<PawPrint/>}</div>}
export function Title({title,sub,action,actionLabel}:{title:string,sub:string,action?:()=>void,actionLabel?:string}){return <div className="title"><div><h1>{title}</h1><p>{sub}</p></div>{action&&<button className="newButton" onClick={action}><Plus/>{actionLabel}</button>}</div>}
export function Modal({children,close,title}:{children:React.ReactNode,close:()=>void,title:string}){return <div className="overlay" onMouseDown={e=>e.target===e.currentTarget&&close()}><div className="modal"><div className="modalHead"><h2>{title}</h2><button className="icon" onClick={close}><X/></button></div>{children}</div></div>}
export function Field({label,value,set,inputMode}:{label:string,value:string,set:(v:string)=>void,inputMode?:React.HTMLAttributes<HTMLInputElement>['inputMode']}){return <label>{label}<input value={value} inputMode={inputMode} onChange={e=>set(e.target.value)}/></label>}
export function Empty({text}:{text:string}){return <div className="empty"><PawPrint/><p>{text}</p></div>}
