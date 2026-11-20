export type Tab='inicio'|'clientes'|'orcamentos'|'agenda'|'vacinas'|'menu'
export type Go=(t:Tab,intent?:null|'pet'|'budget')=>void
