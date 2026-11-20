import { pl } from '../../lib/plural'
import { useEffect, useState } from 'react'
import type { Go } from '../../navigation'
import {  CalendarDays, ChevronRight, CircleDollarSign, Clock3, HousePlus, PawPrint, Users } from 'lucide-react'
import type { AppData, Budget } from '../../types'

import { money, localDate, dateBR } from '../../domain/format'
import { totalBudget, isBooked, paymentStatus, guestName } from '../../domain/budget'

import {  Avatar, Modal, Empty } from '../../ui/common'

export function Dashboard({data,go}:{data:AppData,go:Go}){
 const [now,setNow]=useState(new Date()),[showGuests,setShowGuests]=useState(false)
 useEffect(()=>{const t=setInterval(()=>setNow(new Date()),1000);return()=>clearInterval(t)},[])
 const today=localDate()
 const valid=data.budgets.filter(isBooked)
 const active=valid.filter(b=>b.status==='Entrada confirmada'&&b.entryDate<=today&&b.exitDate>=today)
 const entries=valid.filter(b=>b.entryDate===today)
 const exits=valid.filter(b=>b.exitDate===today)
 const hour=now.getHours(),greeting=hour<12?'Bom dia':hour<18?'Boa tarde':'Boa noite'
 const guestCard=(b:Budget,kind:'entry'|'exit'|'active')=>{const pet=data.pets.find(p=>p.id===b.petId),total=totalBudget(b),status=paymentStatus(b);return <article className="hotelGuestCard" key={`${kind}-${b.id}`}><Avatar pet={pet}/><div className="hotelGuestInfo"><b>{guestName(b,data.pets)}</b><span>{kind==='entry'?`Entrada: ${dateBR(b.entryDate)}`:kind==='exit'?`Saída: ${dateBR(b.exitDate)}`:`Saída prevista: ${dateBR(b.exitDate)}`}</span><strong>{money(total)}</strong></div><em className={`paymentTag ${status.toLowerCase()}`}>{status}</em></article>}
 return <section className="dashboardHome"><div className="welcome"><div><h1>{greeting}, Tia Cí! <PawPrint/></h1><p>{entries.length||exits.length?`Hoje: ${pl(entries.length,'entrada','entradas')} e ${pl(exits.length,'saída','saídas')}.`:'Tudo organizado para os hóspedes de hoje.'}</p></div><div className="datetime"><Clock3/><div><b>{now.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit',hour12:false})}</b><span>{now.toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'long',year:'numeric'})}</span></div></div></div>
 <button className="hotelOverviewCard" onClick={()=>setShowGuests(true)}><div className="hotelOverviewTop"><div className="hotelIcon"><HousePlus/></div><div><span>Hóspedes no Hotel</span><b>{active.length} {active.length===1?'Hospedado':'Hospedados'}</b></div><ChevronRight/></div><div className="hotelOverviewStats"><span><i className="dot in"/>Entradas hoje <b>{entries.length}</b></span><span><i className="dot out"/>Saídas hoje <b>{exits.length}</b></span></div></button>
 <div className="quick dashboardQuick"><button onClick={()=>go('clientes','pet')}><i><Users/></i><span><b>Novo hóspede</b><small>Cadastrar pet e tutor</small></span><ChevronRight className="chev"/></button><button onClick={()=>go('orcamentos','budget')}><i><CircleDollarSign/></i><span><b>Novo orçamento</b><small>Hospedagem e valores</small></span><ChevronRight className="chev"/></button><button onClick={()=>go('agenda')}><i><CalendarDays/></i><span><b>Abrir agenda</b><small>Entradas e saídas</small></span><ChevronRight className="chev"/></button></div>
 {showGuests&&<Modal close={()=>setShowGuests(false)} title="Movimentação do Hotel"><div className="hotelSections"><section><h3><i className="dot in"/>Entradas hoje</h3>{entries.length?entries.map(b=>guestCard(b,'entry')):<Empty text="Nenhuma entrada prevista para hoje."/>}</section><section><h3><i className="dot out"/>Saídas hoje</h3>{exits.length?exits.map(b=>guestCard(b,'exit')):<Empty text="Nenhuma saída prevista para hoje."/>}</section><section><h3><PawPrint/>Hóspedes no Hotel</h3>{active.length?active.map(b=>guestCard(b,'active')):<Empty text="Nenhum hóspede no hotel agora."/>}</section></div></Modal>}</section>
}
