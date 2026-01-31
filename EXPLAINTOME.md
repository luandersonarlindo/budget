# EXPLAINTOME.md

Este documento explica, de forma simples e direta, o funcionamento de cada parte do programa de orçamento pessoal em Node.js, de acordo com o script.js atual.

## Novidades e Alterações Recentes

### 1. Personalização de Categorias
- Agora é possível escolher entre categorias padrão (50% / 20% / 30%) ou personalizar completamente.
- O usuário pode selecionar quais das 3 categorias disponíveis deseja incluir no orçamento (1, 2 ou todas).
- Para cada categoria selecionada, define-se uma porcentagem customizada.
- A última categoria tem sua porcentagem calculada automaticamente para totalizar 100%.
- Exemplos suportados:
  - Gastos Essenciais 80% + Prioridades Financeiras 20%
  - Gastos Essenciais 50% + Prioridades Financeiras 50%
  - Gastos Essenciais 30% + Prioridades Financeiras 20% + Estilo de Vida 50%

### 2. Alteração de Categorias em Orçamentos Existentes
- Ao alterar um orçamento, além de nome e valor, agora é possível alterar as categorias.
- Opções disponíveis:
  - Manter categorias atuais
  - Usar categorias padrão (50% / 20% / 30%)
  - Personalizar categorias
- **Proteção contra perda de dados**: Quando categorias são alteradas, o sistema avisa que todas as despesas serão apagadas e solicita confirmação digitando "SIM".

### 3. Opção de Copiar Orçamento Existente
- Agora é possível copiar um orçamento já cadastrado, incluindo todas as despesas e categorias.
- Ao selecionar "Copiar orçamento existente" no menu principal, o usuário escolhe um orçamento, define novo nome e valor, e a cópia é criada com todas as despesas do original.

### 4. Mover Despesas Entre Categorias
- Nova funcionalidade que permite mover uma despesa de uma categoria para outra dentro do mesmo orçamento.
- Útil para reclassificar despesas sem precisar deletar e recriar.
- Requer pelo menos 2 categorias no orçamento.
- A despesa mantém descrição e valor ao ser movida.

### 5. Opção de Voltar em Todos os Menus
- Todos os menus de seleção (orçamento, categoria, despesa) agora possuem a opção "Voltar".
- Isso permite retornar ao menu anterior sem realizar nenhuma alteração, tornando a navegação mais segura e intuitiva.

---

## Estrutura e Sintaxe
- **Linguagem:** JavaScript (Node.js)
- **Extensão utilizada:** `@inquirer/prompts` para menus interativos no terminal
- **Armazenamento:** Arquivo local `budget.json` (JSON)
- **Execução:** `node script.js`

## Principais Conteúdos e Funções

### 1. Importação de módulos
```js
const { select, input, checkbox } = require('@inquirer/prompts')
const fs = require('fs').promises
```
- `@inquirer/prompts`: Cria menus, inputs e checkboxes no terminal.
- `fs.promises`: Manipula arquivos de forma assíncrona.

### 2. Variáveis Globais
- `message`: Mensagem exibida ao usuário em cada operação.
- `budgets`: Array que armazena todos os orçamentos cadastrados.
- `CATEGORIES`: Array de objetos com as categorias padrão de despesas (50% / 20% / 30%), usado quando o usuário escolhe não personalizar.
- `AVAILABLE_CATEGORIES`: Array de objetos com todas as categorias disponíveis, incluindo nome e descrição detalhada de cada uma. Usado no processo de personalização.

### 3. Funções de Arquivo
- `loadBudgets()`: Lê o arquivo `budget.json` e carrega os orçamentos para a variável `budgets`. Se o arquivo não existir ou estiver corrompido, inicializa como array vazio.
- `saveBudgets()`: Salva o array `budgets` no arquivo `budget.json` em formato JSON, garantindo persistência dos dados.

### 4. Funções de Orçamento
- `customizeCategories()`: (NOVA) Permite ao usuário personalizar completamente as categorias do orçamento:
  - Exibe todas as categorias disponíveis com descrições detalhadas
  - Permite selecionar quais categorias incluir (mínimo 1)
  - Solicita a porcentagem para cada categoria selecionada
  - Calcula automaticamente a porcentagem da última categoria para totalizar 100%
  - Valida se a soma não excede 100%
  - Retorna o array de categorias personalizadas ou null em caso de erro

- `createOrUpdateBudget()`: Solicita nome e valor do orçamento. Oferece escolha entre categorias padrão ou personalizadas. Se já existir um orçamento com o nome informado, sobrescreve o valor e as categorias; caso contrário, cria um novo orçamento.

- `copyBudget()`: Permite selecionar um orçamento existente, definir novo nome e valor, e criar uma cópia com todas as despesas e categorias do original.

- `listBudgets()`: Mostra todos os orçamentos cadastrados, exibindo nome e valor. Aguarda o usuário pressionar Enter para voltar ao menu.

- `updateBudget()`: Permite ao usuário selecionar um orçamento e alterar seu nome, valor total e opcionalmente suas categorias. Oferece opções para:
  - Manter categorias atuais
  - Usar categorias padrão (50% / 20% / 30%)
  - Personalizar categorias
  - Avisa sobre perda de despesas ao alterar categorias e solicita confirmação

- `deleteBudget()`: Permite ao usuário selecionar um orçamento e excluí-lo após confirmação.

### 5. Funções de Despesa (por orçamento)
- `expenseMenu(budget)`: Exibe o menu de despesas para o orçamento selecionado, com opções para adicionar, listar, alterar, mover e deletar despesas.
- `addExpenseForBudget(budget)`: Solicita categoria, descrição e valor da despesa, e adiciona ao orçamento informado.
- `listExpensesForBudget(budget)`: Exibe todas as despesas do orçamento, agrupadas por categoria, mostrando limites, gastos e disponíveis.
- `updateExpenseForBudget(budget)`: Permite selecionar uma despesa de uma categoria e alterar sua descrição e valor.
- `moveExpenseToCategory(budget)`: (NOVA) Permite mover uma despesa de uma categoria para outra:
  - Verifica se há pelo menos 2 categorias no orçamento
  - Solicita seleção da categoria de origem
  - Solicita seleção da despesa a ser movida
  - Solicita seleção da categoria de destino (excluindo a origem)
  - Move a despesa mantendo descrição e valor
  - Exibe confirmação da movimentação
- `deleteExpenseForBudget(budget)`: Permite selecionar uma ou mais despesas de uma categoria para exclusão.

### 6. Opção de Voltar em Menus
- Todos os menus de seleção (orçamento, categoria, despesa) possuem a opção "Voltar".
- Ao selecionar "Voltar", nenhuma alteração é feita e o usuário retorna ao menu anterior.

### 7. Função de Mensagem
- `showMessage()`: Limpa a tela e exibe a mensagem armazenada em `message`, se houver, e depois limpa a mensagem.

### 8. Função Principal
- `start()`: Controla todo o fluxo do programa. Carrega os orçamentos, exibe o menu principal (CRUD de orçamentos), chama o menu de despesas ao selecionar um orçamento e garante que todas as alterações sejam salvas.

## Como funciona o fluxo
1. O programa inicia e carrega os orçamentos do arquivo.
2. Exibe o menu principal para CRUD de orçamentos.
3. Ao criar ou alterar um orçamento, o usuário pode escolher entre categorias padrão ou personalizadas.
4. Na personalização, seleciona quais categorias usar e define porcentagens customizadas.
5. Ao listar orçamentos, o usuário pode escolher um para gerenciar despesas.
6. No menu de despesas, é possível adicionar, listar, alterar ou deletar despesas nas categorias configuradas.
7. Todas as ações são feitas por menus interativos.
8. As alterações são salvas automaticamente no arquivo `budget.json`.

## Categorias Disponíveis

O sistema oferece 3 categorias que podem ser utilizadas de forma flexível:

1. **Gastos Essenciais**
   - Descrição: Despesas básicas e necessárias para manutenção da vida (alimentação, moradia, saúde, transporte essencial)
   - Percentual padrão: 50%

2. **Prioridades Financeiras**
   - Descrição: Investimentos, poupança, quitação de dívidas e criação de reserva de emergência
   - Percentual padrão: 20%

3. **Estilo de Vida**
   - Descrição: Lazer, hobbies, entretenimento, viagens e outras despesas relacionadas à qualidade de vida
   - Percentual padrão: 30%

**Nota**: O usuário pode escolher usar todas as 3 categorias com percentuais padrão, ou selecionar apenas algumas com percentuais personalizados, desde que a soma totalize 100%.

## Sobre a extensão @inquirer/prompts
- Permite criar menus, inputs e checkboxes no terminal de forma amigável.

---

**Resumo das últimas melhorias:**
- Sistema completo de personalização de categorias com porcentagens flexíveis
- Alteração de categorias em orçamentos existentes com proteção contra perda de dados
- Adicionada função para copiar orçamento existente com todas as despesas
- **Nova funcionalidade para mover despesas entre categorias**
- Todos os menus de seleção agora possuem a opção de voltar
- Descrições detalhadas para cada categoria disponível
