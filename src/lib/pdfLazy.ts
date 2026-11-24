// O gerador de PDF é pesado: fica fora do carregamento inicial e é baixado em segundo plano logo depois que o app abre.
type Pdf = typeof import('./pdf')
let mod: Promise<Pdf> | undefined
export const loadPdf = () => (mod ??= import('./pdf'))
const lazy = <K extends keyof Pdf>(k: K) => ((...a: any[]) => loadPdf().then(m => (m[k] as any)(...a))) as Pdf[K]
export const budgetPdf = lazy('budgetPdf'), vaccinePdf = lazy('vaccinePdf'), termPdf = lazy('termPdf'), requestDataPdf = lazy('requestDataPdf'), standardAuthorizationPdf = lazy('standardAuthorizationPdf'), stayPdf = lazy('stayPdf')
