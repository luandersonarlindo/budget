# EXPLAINTOME.md

Este documento explica, de forma simples e direta, o funcionamento de cada parte do programa de orçamento pessoal em Node.js, de acordo com o script.js atual.

## Novidades e Alterações Recentes

### 1. Opção de Copiar Orçamento Existente
- Agora é possível copiar um orçamento já cadastrado, incluindo todas as despesas e categorias.
- Ao selecionar "Copiar orçamento existente" no menu principal, o usuário escolhe um orçamento, define novo nome e valor, e a cópia é criada com todas as despesas do original.

### 2. Opção de Voltar em Todos os Menus
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
- `CATEGORIES`: Array de objetos com as categorias fixas de despesas, cada uma com nome e percentual do orçamento.

### 3. Funções de Arquivo
- `loadBudgets()`: Lê o arquivo `budget.json` e carrega os orçamentos para a variável `budgets`. Se o arquivo não existir ou estiver corrompido, inicializa como array vazio.
- `saveBudgets()`: Salva o array `budgets` no arquivo `budget.json` em formato JSON, garantindo persistência dos dados.

### 4. Funções de Orçamento
- `createOrUpdateBudget()`: Solicita nome e valor do orçamento. Se já existir um orçamento com o nome informado, sobrescreve o valor e as categorias; caso contrário, cria um novo orçamento.
- `copyBudget()`: Permite selecionar um orçamento existente, definir novo nome e valor, e criar uma cópia com todas as despesas e categorias do original.
- `listBudgets()`: Mostra todos os orçamentos cadastrados, exibindo nome e valor. Aguarda o usuário pressionar Enter para voltar ao menu.
- `updateBudget()`: Permite ao usuário selecionar um orçamento e alterar seu nome e valor total.
- `deleteBudget()`: Permite ao usuário selecionar um orçamento e excluí-lo após confirmação.

### 5. Funções de Despesa (por orçamento)
- `expenseMenu(budget)`: Exibe o menu de despesas para o orçamento selecionado, com opções para adicionar, listar, alterar e deletar despesas.
- `addExpenseForBudget(budget)`: Solicita categoria, descrição e valor da despesa, e adiciona ao orçamento informado.
- `listExpensesForBudget(budget)`: Exibe todas as despesas do orçamento, agrupadas por categoria, mostrando limites, gastos e disponíveis.
- `updateExpenseForBudget(budget)`: Permite selecionar uma despesa de uma categoria e alterar sua descrição e valor.
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
3. Ao listar orçamentos, o usuário pode escolher um para gerenciar despesas.
4. No menu de despesas, é possível adicionar, listar, alterar ou deletar despesas.
5. Todas as ações são feitas por menus interativos.
6. As alterações são salvas automaticamente no arquivo `budget.json`.

## Sobre a extensão @inquirer/prompts
- Permite criar menus, inputs e checkboxes no terminal de forma amigável.

---

**Resumo das últimas melhorias:**
- Adicionada função para copiar orçamento existente com todas as despesas.
- Todos os menus de seleção agora possuem a opção de voltar.
