# Budget CLI - App de Metas Financeiras

Este é um aplicativo de linha de comando (CLI) para controle de orçamentos e despesas pessoais, desenvolvido em Node.js. O programa permite cadastrar múltiplos orçamentos, organizar despesas por categorias e gerenciar todas as informações de forma simples e interativa pelo terminal.

## Funcionalidades

- Cadastro de múltiplos orçamentos
- **Copiar orçamento existente com todas as despesas** (NOVO)
- Alteração e exclusão de orçamentos
- Visualização de todos os orçamentos cadastrados
- Gerenciamento de despesas para cada orçamento:
  - Adicionar, listar, alterar e deletar despesas
  - Despesas organizadas por categorias (Gastos Essenciais, Prioridades Financeiras, Estilo de Vida)
- Armazenamento automático dos dados em arquivo local (`budget.json`)

## Como usar

### Pré-requisitos
- Node.js instalado (versão 18 ou superior recomendada)
- Instalar dependências do projeto:

```bash
npm install @inquirer/prompts
```

### Executando o programa

No terminal, execute:

```bash
node script.js
```

### Fluxo de uso

1. **Menu Principal**
   - Cadastrar novo orçamento
   - **Copiar orçamento existente** (NOVO)
   - Listar orçamentos (e acessar o menu de despesas de cada um)
   - Alterar orçamento
   - Deletar orçamento
   - Sair

2. **Menu de Orçamentos**
   - Cadastrar novo orçamento
   - Copiar orçamento existente
   - Listar orçamentos
   - Alterar orçamento
   - Deletar orçamento
   - Voltar

3. **Menu de Despesas** (após selecionar um orçamento)
   - Adicionar despesa
   - Listar despesas
   - Alterar despesa
   - Deletar despesa
   - Voltar

**Todos os menus de seleção agora possuem a opção 'Voltar', permitindo retornar ao menu anterior sem realizar alterações.**

Todas as operações são feitas por menus interativos, bastando escolher a opção desejada e seguir as instruções na tela.

## Estrutura dos dados
- Os orçamentos e despesas são salvos automaticamente no arquivo `budget.json` na mesma pasta do script.
- Cada orçamento possui nome, valor total e categorias fixas, cada uma com suas despesas.

## Observações
- O programa é totalmente em português.
- **Novidades:**
  - Opção de copiar orçamento já existente, incluindo todas as despesas.
  - Todos os menus de seleção (orçamento, categoria, despesa) agora possuem a opção de voltar.

## Licença
Este projeto é livre para uso pessoal e educacional.
