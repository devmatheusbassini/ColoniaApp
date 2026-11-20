
export const money=(v:number)=>v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})
export const dateKey=(d:Date)=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
export const localDate=()=>dateKey(new Date())
export const dateBR=(v:string)=>{const [year,month,day]=v.split('-');return year&&month&&day?`${day}/${month}/${year}`:v}
export const dateLongBR=(v:string)=>{const [year,month,day]=v.split('-').map(Number);return new Intl.DateTimeFormat('pt-BR',{weekday:'long',day:'2-digit',month:'long',year:'numeric'}).format(new Date(year,month-1,day))}
export const parseDateParts=(value:string)=>{
 const clean=value.trim()
 if(/^\d{4}-\d{2}-\d{2}$/.test(clean)){const [year,month,day]=clean.split('-').map(Number);return {year,month,day}}
 if(/^\d{2}\/\d{2}\/\d{4}$/.test(clean)){const [day,month,year]=clean.split('/').map(Number);return {year,month,day}}
 return null
}
export const dateToUtc=(value:string)=>{const parts=parseDateParts(value);return parts?Date.UTC(parts.year,parts.month-1,parts.day):Number.NaN}
export const daysBetween=(entry:string,exit:string)=>{
 if(!entry||!exit)return 1
 const start=dateToUtc(entry),end=dateToUtc(exit),difference=(end-start)/86400000
 return Number.isFinite(difference)&&difference>=1?Math.round(difference):1
}
// Converte valores digitados no padrão brasileiro: "1.234,56", "R$ 80,00", "150", "150.5".
export const parseMoney=(text:string)=>{let s=text.replace(/R\$|\s/g,'');if(!s)return Number.NaN;if(s.includes(','))s=s.replace(/\./g,'').replace(',','.');else if(/^\d{1,3}(\.\d{3})+$/.test(s))s=s.replace(/\./g,'');return /^\d+(\.\d+)?$/.test(s)?Number(s):Number.NaN}
