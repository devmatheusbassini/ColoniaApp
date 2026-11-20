import {  useState } from 'react'
import { AlertTriangle, Eye, EyeOff, Lock, Mail, PawPrint } from 'lucide-react'

import {  supabase } from '../../lib/cloud'

export function Login(){
 const [email,setEmail]=useState(''),[password,setPassword]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState('')
 async function submit(e:React.FormEvent){e.preventDefault();setBusy(true);setError('');const {error}=await supabase.auth.signInWithPassword({email:email.trim(),password});setBusy(false);if(error)setError(navigator.onLine?'E-mail ou senha incorretos.':'Sem internet. Conecte-se para entrar.')}
 const [show,setShow]=useState(false)
 return <div className="loginScreen"><div className="loginHero"><div className="loginLogo"><img src="/logo.jpeg" alt="Colônia de Férias da Tia Cí"/></div></div><form className="loginCard" onSubmit={submit}><span className="loginKicker"><PawPrint size={14}/> Área da Tia Cí</span><h1>Bem-vinda de volta!</h1><p>Entre para cuidar dos seus hóspedes.</p><label>E-mail<div className="loginField"><Mail size={18}/><input type="email" inputMode="email" autoComplete="username" placeholder="seu@email.com" value={email} onChange={e=>setEmail(e.target.value)} required/></div></label><label>Senha<div className="loginField"><Lock size={18}/><input type={show?'text':'password'} autoComplete="current-password" placeholder="Sua senha" value={password} onChange={e=>setPassword(e.target.value)} required/><button type="button" className="eye" aria-label={show?'Ocultar senha':'Mostrar senha'} onClick={()=>setShow(!show)}>{show?<EyeOff size={18}/>:<Eye size={18}/>}</button></div></label>{error&&<p className="loginError" role="alert"><AlertTriangle size={16}/>{error}</p>}<button className="primary loginBtn" disabled={busy}>{busy?'Entrando…':'Entrar'}</button><small className="loginFoot">Cuidado, carinho e diversão</small></form></div>
}
