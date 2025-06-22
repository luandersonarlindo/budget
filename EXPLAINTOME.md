# EXPLAINTOME.md

Este documento explica, de forma simples e direta, o funcionamento de cada parte do programa de orçamento pessoal em Node.js, de acordo com o script.js atual.

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
- `selectedBudget`: Guarda o orçamento atualmente selecionado (usado em funções auxiliares).
- `CATEGORIES`: Array de objetos com as categorias fixas de despesas, cada uma com nome e percentual do orçamento.

### 3. Funções de Arquivo
- `loadBudgets()`: Lê o arquivo `budget.json` e carrega os orçamentos para a variável `budgets`. Se o arquivo não existir ou estiver corrompido, inicializa como array vazio.
- `saveBudgets()`: Salva o array `budgets` no arquivo `budget.json` em formato JSON, garantindo persistência dos dados.

### 4. Funções de Orçamento
- `selectBudget()`: Exibe um menu para o usuário escolher um orçamento cadastrado. Retorna o orçamento selecionado ou null se não houver nenhum.
- `createOrUpdateBudget()`: Solicita nome e valor do orçamento. Se já existir um orçamento com o nome informado, sobrescreve o valor e as categorias; caso contrário, cria um novo orçamento.
- `listBudgets()`: Mostra todos os orçamentos cadastrados, exibindo nome e valor. Aguarda o usuário pressionar Enter para voltar ao menu.
- `updateBudget()`: Permite ao usuário selecionar um orçamento e alterar seu nome e valor total.
- `deleteBudget()`: Permite ao usuário selecionar um orçamento e excluí-lo após confirmação.

### 5. Funções de Despesa (por orçamento)
- `expenseMenu(budget)`: Exibe o menu de despesas para o orçamento selecionado, com opções para adicionar, listar, alterar e deletar despesas.
- `addExpenseForBudget(budget)`: Solicita categoria, descrição e valor da despesa, e adiciona ao orçamento informado.
- `listExpensesForBudget(budget)`: Exibe todas as despesas do orçamento, agrupadas por categoria, mostrando limites, gastos e disponíveis.
- `updateExpenseForBudget(budget)`: Permite selecionar uma despesa de uma categoria e alterar sua descrição e valor.
- `deleteExpenseForBudget(budget)`: Permite selecionar uma ou mais despesas de uma categoria para exclusão.

### 6. Função de Mensagem
- `showMessage()`: Limpa a tela e exibe a mensagem armazenada em `message`, se houver, e depois limpa a mensagem.

### 7. Função Principal
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
- Instalação: `npm install @inquirer/prompts`
- Uso: Basta importar e usar as funções `select`, `input` e `checkbox` para interagir com o usuário.

## Sobre a sintaxe utilizada
- Funções assíncronas (`async/await`) para leitura e escrita de arquivos e para menus interativos.
- Estruturas de repetição e condicionais para navegação dos menus.
- Manipulação de arrays e objetos para armazenar orçamentos e despesas.

---

## Detalhamento dos tópicos (1 ao 7)

O programa começa importando módulos essenciais: `@inquirer/prompts` para criar menus interativos no terminal, tornando o uso simples, intuitivo e visualmente amigável, e `fs.promises` para ler e salvar dados de forma assíncrona, sem travar o programa, garantindo que todas as operações de leitura e escrita em disco sejam feitas de maneira eficiente. Essas importações permitem que o usuário interaja com o sistema de forma fluida, respondendo perguntas, escolhendo opções e marcando itens diretamente pelo terminal, sem a necessidade de interfaces gráficas complexas.

As variáveis globais são fundamentais para manter o estado do programa durante toda a execução. O array `budgets` armazena todos os orçamentos cadastrados, sendo atualizado a cada operação de criação, edição ou exclusão. A variável `message` serve para fornecer feedback ao usuário após cada ação, seja de sucesso, erro ou instrução, tornando a experiência mais clara e didática. O array `CATEGORIES` define as categorias fixas de despesas, cada uma com um nome e um percentual do orçamento, o que ajuda a organizar e distribuir os gastos de forma equilibrada, promovendo uma gestão financeira mais consciente. Já a variável `selectedBudget` é usada para guardar temporariamente o orçamento escolhido pelo usuário em operações que exigem contexto.

As funções de arquivo são responsáveis por garantir a persistência dos dados. A função `loadBudgets()` é chamada no início do programa para carregar os orçamentos salvos no arquivo `budget.json`, permitindo que o usuário continue de onde parou na última execução. Caso o arquivo não exista ou esteja corrompido, o sistema inicializa com um array vazio, evitando travamentos. A função `saveBudgets()` é chamada após cada alteração relevante, salvando imediatamente o estado atual dos orçamentos no arquivo, o que previne perda de dados mesmo em caso de encerramento inesperado do programa.

As funções de orçamento permitem ao usuário criar novos orçamentos, visualizar todos os orçamentos cadastrados, editar nome e valor de orçamentos existentes e excluir orçamentos que não são mais necessários. O nome do orçamento funciona como um identificador único, evitando duplicidade. Ao editar um orçamento, as categorias são reiniciadas para garantir que a distribuição dos percentuais esteja sempre correta. A exclusão de um orçamento exige confirmação explícita do usuário, protegendo contra exclusões acidentais e perda de informações importantes.

O gerenciamento de despesas é feito por orçamento, ou seja, cada orçamento possui seu próprio menu de despesas. O usuário pode adicionar despesas em qualquer categoria, informando descrição e valor, visualizar todas as despesas agrupadas por categoria, editar despesas específicas (alterando descrição e valor) e excluir uma ou mais despesas de uma categoria. O sistema calcula automaticamente o limite, o total gasto e o valor disponível em cada categoria, ajudando o usuário a manter o controle e evitar extrapolar o orçamento planejado. O agrupamento por categoria facilita a análise dos gastos e a identificação de possíveis excessos em áreas específicas.

A função de mensagem, `showMessage()`, centraliza todo o feedback ao usuário. Ela limpa a tela antes de exibir qualquer mensagem, garantindo que a interface permaneça limpa, organizada e fácil de ler. Isso contribui para uma experiência de uso mais agradável e menos poluída visualmente, além de reforçar a comunicação entre o sistema e o usuário.

Por fim, a função principal `start()` é responsável por orquestrar todo o funcionamento do programa. Ela garante que os orçamentos sejam carregados ao iniciar, exibe o menu principal com as opções de CRUD de orçamentos, permite acessar o menu de despesas de um orçamento selecionado e garante que todas as operações sejam salvas imediatamente. O loop principal só é encerrado quando o usuário escolhe sair, momento em que uma mensagem de despedida é exibida. Todo o fluxo é pensado para ser intuitivo, seguro e eficiente, permitindo que qualquer pessoa consiga gerenciar seus orçamentos e despesas sem dificuldades, mesmo sem conhecimento técnico avançado.
