# Budget CLI - App de Metas Financeiras

Este é um aplicativo de linha de comando (CLI) para controle de orçamentos e despesas pessoais, desenvolvido em Node.js. O programa permite cadastrar múltiplos orçamentos, organizar despesas por categorias e gerenciar todas as informações de forma simples e interativa pelo terminal.

## Funcionalidades

- Cadastro de múltiplos orçamentos
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
   - Acessar menu de Orçamentos
   - Sair

2. **Menu de Orçamentos**
   - Cadastrar novo orçamento
   - Listar orçamentos (e acessar o menu de despesas de cada um)
   - Alterar orçamento
   - Deletar orçamento
   - Voltar

3. **Menu de Despesas** (após selecionar um orçamento)
   - Adicionar despesa
   - Listar despesas
   - Alterar despesa
   - Deletar despesa
   - Voltar

Todas as operações são feitas por menus interativos, bastando escolher a opção desejada e seguir as instruções na tela.

## Estrutura dos dados
- Os orçamentos e despesas são salvos automaticamente no arquivo `budget.json` na mesma pasta do script.
- Cada orçamento possui nome, valor total e categorias fixas, cada uma com suas despesas.

## Observações
- O programa é totalmente em português.
- Não há limite para a quantidade de orçamentos ou despesas.
- O arquivo `budget.json` pode ser editado manualmente, mas recomenda-se usar apenas o programa para evitar erros de formatação.

## Licença
Este projeto é livre para uso pessoal e educacional.
