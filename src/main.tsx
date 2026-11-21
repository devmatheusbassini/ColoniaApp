import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/app.css'
import { registerSW } from 'virtual:pwa-register'

// Atualização sem interromper: a nova versão só entra quando o app sai da tela ou quando a pessoa toca em "Atualizar".
let pending=false
const apply=()=>{pending=false;updateSW(true)}
const banner=()=>{if(document.getElementById('updBar'))return;const b=document.createElement('button');b.id='updBar';b.textContent='Nova versão disponível · Toque para atualizar';b.onclick=apply;document.body.appendChild(b)}
const updateSW=registerSW({immediate:true,onRegisteredSW(_u,r){if(!r)return;const check=()=>r.update().catch(()=>{});setInterval(check,60*1000);document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')check()})},onNeedRefresh(){pending=true;if(document.visibilityState==='hidden')apply();else banner()}})
document.addEventListener('visibilitychange',()=>{if(pending&&document.visibilityState==='hidden')apply()})

class Guard extends React.Component<{children:React.ReactNode},{err:boolean}>{state={err:false};static getDerivedStateFromError(){return {err:true}};componentDidCatch(e:unknown){console.error(e)};render(){if(this.state.err){setTimeout(()=>(window as any).__showFix?.('Ocorreu um erro ao abrir. Toque para recarregar.'),0);return null}return this.props.children}}
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><Guard><App /></Guard></React.StrictMode>,
)
