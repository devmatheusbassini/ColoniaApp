import { useEffect, useRef, useState } from 'react'

import {  PawPrint, Plus, X } from 'lucide-react'
import type {  Pet } from '../types'

export function Splash({text='Preparando o cantinho dos Aumigos…'}:{text?:string}){
 const [pct,setPct]=useState(0)
 useEffect(()=>{const t=setInterval(()=>setPct(p=>p<90?p+6:p<99?p+1:99),60);return()=>clearInterval(t)},[])
 return <div className="splash" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}><div className="splashLogo"><img src="/logo.jpeg" alt=""/></div><h1>Colônia de Férias da Tia Cí</h1><p>{text}</p><div className="splashProgress"><div className="splashBar"><span style={{width:pct+'%'}}/></div><b>{pct}%</b></div></div>
}
export function YesNoField({label,value,set}:{label:string,value:'Sim'|'Não'|'',set:(v:'Sim'|'Não')=>void}){return <div className="yesNoField"><span>{label}</span><div><button type="button" className={value==='Sim'?'active':''} onClick={()=>set('Sim')}><i/>Sim</button><button type="button" className={value==='Não'?'active no':''} onClick={()=>set('Não')}><i/>Não</button></div></div>}
export function Info({label,value}:{label:string,value?:string}){return <div className="infoItem"><span>{label}</span><b>{value||'Não informado'}</b></div>}
export function Avatar({pet}:{pet?:Pet}){return <div className={'avatar'+(pet?.deceasedAt?' deceased':'')}>{pet?.photo?<img src={pet.photo}/>:<PawPrint/>}</div>}
export function Title({title,sub,action,actionLabel}:{title:string,sub:string,action?:()=>void,actionLabel?:string}){return <div className="title"><div><h1>{title}</h1><p>{sub}</p></div>{action&&<button className="newButton" onClick={action}><Plus/>{actionLabel}</button>}</div>}
// Se algo foi digitado ou marcado, pede confirmação antes de fechar (toque fora ou no X), para não perder o cadastro.
export function Modal({children,close,title}:{children:React.ReactNode,close:()=>void,title:string}){
 const dirty=useRef(false)
 const mine=(e:React.SyntheticEvent)=>(e.target as HTMLElement).closest('.modal')===e.currentTarget
 const touch=(e:React.SyntheticEvent)=>{if(mine(e))dirty.current=true}
 const ask=()=>{if(!dirty.current||confirm('Descartar o que foi preenchido?'))close()}
 const clicked=(e:React.MouseEvent)=>{if((e.target as HTMLElement).closest('form button[type=button]'))touch(e)}
 return <div className="overlay" onMouseDown={e=>e.target===e.currentTarget&&ask()}><div className="modal" onInputCapture={touch} onChangeCapture={touch} onClickCapture={clicked} onPointerDownCapture={e=>(e.target as HTMLElement).tagName==='CANVAS'&&touch(e)}><div className="modalHead"><h2>{title}</h2><button className="icon" onClick={ask}><X/></button></div>{children}</div></div>
}
export function Field({label,value,set,inputMode}:{label:string,value:string,set:(v:string)=>void,inputMode?:React.HTMLAttributes<HTMLInputElement>['inputMode']}){return <label>{label}<input value={value} inputMode={inputMode} onChange={e=>set(e.target.value)}/></label>}
export function Empty({text}:{text:string}){return <div className="empty"><PawPrint/><p>{text}</p></div>}
