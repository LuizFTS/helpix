# Helpix — Contexto Geral da Aplicação

## O que é

Helpix é um app de **controle financeiro pessoal**: o usuário
registra receitas e despesas por método de pagamento, acompanha
saldo/gastos por período, cria metas de economia ("caixinhas") e
visualiza análises de gastos ao longo do tempo.

## Stack

- **Expo + React Native** (`expo-router` para navegação por arquivos)
- **TypeScript**
- **NativeWind / Tailwind** para estilização (misturado com
  `StyleSheet` em várias telas — não há um padrão único adotado ainda)
- **Firebase** — Auth (e-mail/senha) + Firestore (dados)
- **React Query** (`@tanstack/react-query`) para cache/estado servidor
- **React Hook Form + Zod** para formulários e validação
- **Zustand** (`useFilterStore`) para estado global leve (período e
  filtro de método de pagamento, compartilhados entre Dashboard e
  Atividades)
- **expo-local-authentication** + **expo-secure-store** — biometria e
  guarda segura de credenciais (desde a etapa de login)

## Estrutura de pastas

```
app/                         → rotas (expo-router)
  (tabs)/                    → Início, Atividades, Economia, Mais
  transaction/                → novo / editar movimentação
  saving/[id]                 → detalhe de meta de economia
  login.tsx, analytics.tsx

src/
  core/
    providers/                → AuthProvider, AppProviders, useFilterStore
    services/                 → firebase.ts, firestoreUtils, currentUser, PaymentMethodService, seedFirestore
    theme/                    → colors, typography, metrics

  features/                   → um módulo por domínio, cada um com:
                                 components/ hooks/ mappers/ services/ types/ (nem todos têm todas as pastas)
    auth/
    dashboard/
    transactions/
    savings/
    paymentMethods/
    analytics/
    settings/                  → ainda vazia

  shared/
    components/                → Button, Input, Card, MoneyCard, BottomSheet, etc.
    hooks/                     → usePaymentMethods
    constants/                 → mockData
    types/                     → paymentMethod.types
    utils/                     → date.ts
```

Padrão consistente: cada feature isola sua lógica (hook + service +
mapper + types); UI genérica fica em `shared`. Services nunca expõem
detalhes do Firebase pro resto do app (interface própria).

## Lógica de negócio — pontos importantes

### Autenticação e sessão
- Login e cadastro são por e-mail/senha (`AuthService`,
  `useAuthForm`).
- **Sessão não persiste** entre aberturas do app —
  `initializeAuth(firebaseApp, { persistence: inMemoryPersistence })`
  em `src/core/services/firebase.ts`. Feche o app, a sessão some.
- **Login com biometria** é um atalho, não uma autenticação paralela:
  se o usuário marcar "Lembrar de mim" no login normal, e-mail/senha
  são salvos criptografados via `expo-secure-store`
  (`CredentialsStore`). O botão de biometria (`useBiometricLogin`)
  dispara o prompt nativo e, se aprovado, só **libera** essas
  credenciais salvas pra chamar `signInWithEmailAndPassword`
  normalmente — a biometria nunca autentica sozinha no servidor.
- Se a senha salva não for mais válida (ex: trocada em outro
  aparelho), a credencial local é apagada automaticamente e o atalho
  de biometria some.
- `AuthProvider` expõe `user`, `isLoading`, `emailVerified` e
  `displayName` como estados próprios (não lidos direto de
  `user.emailVerified`/`user.displayName`) porque `reload()` e
  `updateProfile()` do Firebase **mutam** o objeto `User` existente em
  vez de criar um novo — sem estados dedicados, o React não percebe a
  mudança e não re-renderiza.
- `app/_layout.tsx` usa `Stack.Protected` com `guard={!!user}` /
  `guard={!user}` pra separar rotas logadas de deslogadas — troca de
  tela é automática assim que `user` muda.
- Todo Service usa `requireUserId()` (`src/core/services/currentUser.ts`)
  pra saber de qual usuário são os dados — lança erro se chamado sem
  ninguém logado (não deveria acontecer na prática, já que as telas
  ficam atrás do `Stack.Protected`).

### Nome do usuário
- Capturado no cadastro (campo "Nome"), salvo como `displayName`
  nativo do Firebase Auth via `updateProfile` — sem coleção própria no
  Firestore pra isso.
- Usado na saudação do Dashboard (`"Olá, {primeiroNome}"`) e no card
  de conta da aba Mais. Contas antigas sem nome caem num "Olá"
  genérico.

### Métodos de pagamento
- `PaymentMethodType`: `'credit' | 'pix' | 'cash' | 'income' | 'expense'`.
  As três primeiras variantes eram só cosméticas dos métodos do seed
  (nunca influenciaram lógica de negócio); métodos **criados pelo
  usuário** só usam `'income'` ou `'expense'`.
- Só `type === 'income'` importa pra qualquer decisão de negócio (o
  resto é sempre tratado como saída).
- Usuário cadastra métodos próprios na aba Mais (nome + tipo + cor,
  ícone escolhido automaticamente pelo tipo).
- Excluir um método **não** afeta transações antigas que o usavam —
  elas continuam existindo, e a UI mostra "—" no lugar do nome quando
  o método não é mais encontrado.

### Transações (receitas/despesas)
- Uma transação tem `type` (`income`/`expense`), `description`,
  `amount`, `date`, `paymentMethodId`, `notes` opcionais, e campos de
  parcelamento (`installmentGroupId`, `installmentNumber`,
  `installmentTotal`) — parcelamento só existe pra despesas.
- Na tela de cadastro/edição, o seletor de método de pagamento é
  filtrado pelo `type` da transação (receita → só métodos `income`;
  despesa → só métodos `!== income`). Trocar o tipo limpa a seleção de
  método se ela não fizer mais sentido pro novo tipo.
- **Validação do formulário** (Zod, `transactionSchema.ts`): descrição
  min. 2 caracteres, valor positivo, data obrigatória, método de
  pagamento obrigatório, parcelas obrigatórias se `isInstallment` for
  `true`. `submit()` do `useTransactionForm` retorna
  `Promise<boolean>` indicando sucesso real — as telas só navegam de
  volta (`router.back()`) se o retorno for `true`. Erros de gravação
  (rede, Firestore) aparecem num banner próprio (`submitError`),
  separado dos erros de validação de campo.

### Dashboard e Análises — percentuais
- Cada card/linha de método de pagamento mostra um percentual — mas
  **dois denominadores separados**, nunca misturados:
  ```
  método tipo "income"  → (total do método / total de receitas do período) × 100
  método tipo "expense" → (total do método / total de despesas do período) × 100
  ```
  Um método de Entrada mostra sua fatia das receitas; um método de
  Saída mostra sua fatia das despesas — mesma lógica em
  `dashboard.mapper.ts` (período atual) e `analytics.mapper.ts`
  (histórico completo).

### Metas de economia (Economia / "caixinhas")
- `SavingGoal`: nome, valor-alvo, valor atual, prazo.
- Contribuições (`SavingContribution`) são lançamentos avulsos que
  incrementam o valor atual de uma meta.
- `SavingGoalWithProgress` adiciona `percentage` e `remaining`
  calculados pro card/detalhe.

### Isolamento de dados por usuário
- Transações, métodos de pagamento e metas de economia têm campo
  `userId` opcional no tipo — dado é sempre gravado/consultado
  amarrado ao usuário logado (`requireUserId()`), pra contas
  diferentes nunca verem dados umas das outras.

## O que já foi desenvolvido (histórico de etapas)

1. **Isolamento de dados por usuário** — cada Service passou a
   gravar/consultar dados amarrados ao `userId` do usuário logado.
2. **Gerenciar métodos de pagamento + correção do percentual** —
   cadastro de métodos próprios na aba Mais; correção do cálculo de
   percentual nos cards (antes misturava receita e despesa no mesmo
   denominador).
3. **Sessão não persistente + login com biometria** — sessão do
   Firebase passou a ser só em memória; adicionado atalho de login via
   Face ID/digital, condicionado a um login anterior com "Lembrar de
   mim" marcado.
4. **Nome do usuário no cadastro** — campo "Nome" no cadastro, salvo
   como `displayName` do Firebase; usado na saudação do Dashboard e no
   card de conta da aba Mais (fim do "Olá, Alex" hardcoded).
5. **Correção da validação no formulário de transação** — bug em que
   o formulário de nova/editar movimentação navegava de volta mesmo
   com erro de validação (ex: sem método de pagamento selecionado),
   sem mostrar nada pro usuário. Corrigido fazendo `submit()` retornar
   um booleano de sucesso real, sem depender de leitura de estado
   desatualizado.

(Ver os `CONTEXTO-etapa-*.md` de cada uma pra detalhes de
implementação, arquivos alterados e como validar.)

## Backlog / próximos passos conhecidos

Itens mencionados ao longo do desenvolvimento mas ainda não feitos,
além de lacunas identificadas na estrutura atual:

- [ ] **Login com Google** — cogitado e adiado quando o `AuthService`
      foi escrito (hoje só e-mail/senha).
- [ ] **`app.json`** ainda precisa do ajuste manual documentado em
      `CONTEXTO-etapa-login-biometria.md` (plugin
      `expo-local-authentication` + `NSFaceIDUsageDescription` pro
      iOS) — não foi possível editar porque o arquivo não fez parte
      dos pacotes entregues até agora. **Confirmar se já foi aplicado
      manualmente.**
- [ ] **`src/features/settings/`** existe mas está vazia — a aba Mais
      hoje concentra cadastro de métodos de pagamento, popular dados
      via seed e sair da conta; não há tela de configurações dedicada
      ainda (ex: editar nome/e-mail, preferências, trocar senha).
- [ ] **Trocar senha / editar perfil** — não existe fluxo pra usuário
      editar o próprio nome ou trocar a senha depois de criar a conta.
- [ ] liberar acesso após confirmação de e-mail
- [ ] **Limpeza de dependência não usada**: `@react-native-async-storage/async-storage`
      deixou de ser usado pelo Firebase (trocado por persistência em
      memória) e não é usado em mais nenhum lugar do código — candidato
      a remoção do `package.json` numa limpeza futura.
- [ ] **Tratamento de erro de mutação fora do formulário de
      transação** — o padrão de `submitError` (banner vermelho pra
      falha de gravação) só foi aplicado no formulário de
      transação. Outros fluxos de escrita (metas de economia,
      contribuições, métodos de pagamento) não têm o mesmo tratamento
      — hoje, falhas nesses fluxos podem passar batido pro usuário.
- [x] **Padronização de estilização** — o projeto mistura NativeWind
      (`className`) e `StyleSheet.create` na mesma tela em vários
      lugares; não há uma diretriz explícita de quando usar cada um.
- [x] **Seed de dados** (`seedFirestore.ts`) — usado hoje via botão na
      aba Mais pra popular dados de teste; avaliar se deve continuar
      acessível em produção ou ficar só em ambiente de desenvolvimento.
