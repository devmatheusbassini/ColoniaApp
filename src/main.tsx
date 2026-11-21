import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/app.css'
import { registerSW } from 'virtual:pwa-register'

const updateSW=registerSW({immediate:true,onRegisteredSW(_u,r){if(!r)return;const check=()=>r.update().catch(()=>{});setInterval(check,60*1000);document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')check()})},onNeedRefresh(){updateSW(true)}})
let reloaded=false
navigator.serviceWorker?.addEventListener('controllerchange',()=>{if(reloaded)return;reloaded=true;location.reload()})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><App /></React.StrictMode>,
)
