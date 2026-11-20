# Colônia de Férias da Tia Cí — V1.4.0

Aplicativo PWA/WebApp com prioridade para Android, desenvolvido em React, TypeScript e Vite.

## Executar no VSCode

```powershell
npm install
npm run dev
```

Acesse `http://localhost:8088`.

## Gerar projeto Android

Com Android Studio instalado:

```powershell
npm run android:add
npm run android:open
```

Após alterações futuras:

```powershell
npm run android:sync
npm run android:open
```

## Principais recursos desta versão

- Página de Orçamentos restaurada.
- Novo orçamento em assistente de 4 etapas.
- Cálculo de diárias pela diferença real entre entrada e saída.
- Aprovação, confirmação de entrada e cancelamento.
- Registro de um ou mais valores recebidos após confirmar a entrada.
- Formas de pagamento, data e observação.
- Saldo restante calculado automaticamente.
- Comprovante PDF com total, recebimentos e saldo.
- Menu inferior com patinha personalizada.
- Dentro da patinha: Financeiro e crédito do desenvolvedor.
- Dashboard financeira exclusiva com filtro mensal.
- Vacinação preservada no menu principal.
- Dados anteriores preservados e migrados automaticamente.

## Observação

Os dados são armazenados localmente no aparelho. Faça cópias de segurança antes de limpar dados do navegador ou desinstalar o aplicativo.


## Versão 1.4.0

- Dashboard operacional com card ampliado de hóspedes no hotel.
- Entradas, saídas e hóspedes atuais em uma tela única.
- Atalhos rápidos centralizados, sem título adicional.
- Ficha do hóspede com Resumo, Hospedagens, Vacinas, Financeiro e Documentos.
- Linha do tempo automática do hóspede.
- Financeiro com todos os meses em português do Brasil e seleção de ano.
- PDFs de orçamento e comprovante identificados por hóspede, data e horário de entrada.

## Versão 1.5.1 — Saída confirmada

- Botão **Confirmar saída** disponível após a entrada confirmada.
- A saída somente é concluída quando o valor total estiver pago.
- Caso exista saldo, o pagamento final pode ser registrado no mesmo fluxo.
- A data e a hora reais da saída são gravadas automaticamente.
- A linha do tempo do hóspede mostra **Saída confirmada**, data e hora.
- Após a saída, a hospedagem muda para **Finalizado** e o comprovante final em PDF fica disponível.


## Versão 1.5.1
- Busca de orçamentos pelo nome do pet.
- Filtros Ativos, Aprovados e Cancelados.
- Confirmação antes de cancelar.
- Cancelamentos permanecem no histórico do hóspede com data e hora.


## Versão 1.5.2
- Cancelamentos registram data e hora reais em `cancelledAt`.
- Orçamentos cancelados podem ser removidos somente da lista, preservando o histórico do pet.

## Versão 1.6.0

- Orçamento rápido sem cadastro prévio e orçamento para hóspedes existentes.
- Comparação de valor normal e condição especial com desconto.
- Tabela automática de diárias para cães, gatos e outros animais.
- Alta temporada automática em dezembro e janeiro.
- Serviços de banho e tosa no orçamento.
- Cadastro completo do hóspede, tutor, contato emergencial e veterinário.
- Prevenção de cadastros duplicados por pet, tutor e telefone.
- Termo de hospedagem ampliado.
- Anexo da foto da carteirinha de vacinação.
- PDF para solicitar os dados do hóspede e do tutor.

## Atualização 1.6.2

- Orçamentos possuem validade automática de 7 dias, exibida na lista e no PDF.
- Menu da patinha ganhou a área **Arquivos Padrões** com Termo de Autorização e Ficha de Dados para pré-cadastro.
- Cadastro do hóspede possui listas de raças específicas para cães e gatos, com opção “Outra”.
- Termo usa apenas **Quantidade da alimentação** e **Horário das refeições**.
- Orçamento rápido abre o cadastro de hóspede ao confirmar a entrada e vincula o novo cadastro automaticamente.


## Intercorrências (v1.6.2)

A ficha do hóspede possui uma aba de Intercorrências para registrar eventos com descrição, data, horário, indicação de tutor avisado, observação do contato e foto opcional. Cada evento aparece automaticamente na linha do tempo do hóspede.
