import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/app.css'
import { registerSW } from 'virtual:pwa-register'

const updateSW=registerSW({immediate:true,onRegisteredSW(_u,r){if(!r)return;const check=()=>r.update().catch(()=>{});setInterval(check,60*1000);document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')check()})},onNeedRefresh(){updateSW(true)}})
let reloaded=false
navigator.serviceWorker?.addEventListener('controllerchange',()=>{if(reloaded)return;reloaded=true;location.reload()})

class Guard extends React.Component<{children:React.ReactNode},{err:boolean}>{state={err:false};static getDerivedStateFromError(){return {err:true}};componentDidCatch(e:unknown){console.error(e)};render(){if(this.state.err){setTimeout(()=>(window as any).__showFix?.('Ocorreu um erro ao abrir. Toque para recarregar.'),0);return null}return this.props.children}}
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><Guard><App /></Guard></React.StrictMode>,
)
