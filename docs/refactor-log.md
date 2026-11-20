# Decision log — untangle (v1.9.x)

- Regras de orçamento num só módulo puro `src/domain/budget.ts` (preços, temporada, diárias, total, pago, saldo, nome do hóspede, "reserva válida").
  - `App.tsx:28` `totalBudget` mistura total salvo com fórmula legada (`dailyRate`, `seasonMode`, `timeExtraValue??30`).
  - `pdf.ts` repete `timeExtraValue??30` e tem sua própria `budgetName`.
  - "pago" = `payments.sum || paidValue` copiado em Dashboard, addPayment, confirmExit, Finance; PetDetails usa outra variante.
  - `!['Cancelado','Rascunho'].includes(status)` copiado 5x (Dashboard, Agenda, Finance, PetDetails).
  - Nome do hóspede com fallbacks diferentes: `nameOf`, `name` (Agenda), `budgetName` (pdf), `'Hóspede removido'` solto 4x.
  - `defaultItem` repete os preços de `rateFor` (80/90).
  - Validade de 7 dias calculada em `save` e de novo no pdf.
- Total legado migrado ao carregar (`storage.normalize`): orçamento sem `discountedTotal` ganha o valor calculado uma vez; `totalBudget` vira só leitura.
  - `App.tsx:28` ramo legado dentro de `totalBudget`.
- Datas e dinheiro em `src/domain/format.ts`, usados por App e PDF.
  - `pdf.ts:5-6` copia `money`/`dateBR` com implementação diferente (`new Date(v+'T12:00')`).
- Regras de hóspede em `src/domain/pet.ts` (duplicidade, idade, máscara de telefone, termo vazio, raças).
  - Detecção de duplicado copiada em `Clients.submit` e `Budgets.registerQuickPet`.
- Compartilhar/baixar arquivo num só helper `src/lib/share.ts`.
  - `pdf.ts deliver` e `Backup.exportBackup` repetem `navigator.share`/download.
- Sincronização como hook `useCloudSync` em `src/lib/useCloudSync.ts`.
  - `MainApp` mistura UI com timers de push, `skipNext`, e grava `saveData` em dois efeitos.
- Uma pasta por funcionalidade em `src/features/*`; peças de UI comuns em `src/ui/`.
  - `App.tsx` com 210 linhas de 86 KB juntando tudo.
- Formulário de pagamento vazio como `blankPayment()`.
  - `{value:'',method:'PIX',date:localDate(),notes:''}` copiado 6x.
- Formulário de orçamento novo como `newBudgetForm()`.
  - `setF({...blank,quoteItems:blank.quoteItems.map(...)})` copiado 2x.

Casos especiais
- Removido: `setTimeout(()=>setSignPet(pet),120)` — a troca de modal acontece no mesmo render.
- Mantido: splash mínimo de 900 ms (escolha visual).
- Mantido: fallback `paidValue` (dados antigos sem `payments`), agora num só lugar.
- Removido: parâmetro `identification` não usado em `addFooter`.

Testes: o projeto não tem testes; nada a remover.
