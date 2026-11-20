import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'br.com.coloniatia.ci',
  appName: 'Colônia de Férias da Tia Cí',
  webDir: 'dist',
  android: { allowMixedContent: false, backgroundColor: '#fffaf7' }
}
export default config
