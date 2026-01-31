# Budget CLI - App de Metas Financeiras

Este é um aplicativo de linha de comando (CLI) para controle de orçamentos e despesas pessoais, desenvolvido em Node.js. O programa permite cadastrar múltiplos orçamentos, organizar despesas por categorias personalizáveis e gerenciar todas as informações de forma simples e interativa pelo terminal.

## Funcionalidades

- Cadastro de múltiplos orçamentos
- **Personalização de categorias com porcentagens flexíveis** (NOVO)
  - Escolha entre categorias padrão (50% / 20% / 30%) ou personalize
  - Selecione quais categorias incluir no orçamento
  - Defina porcentagens customizadas (sempre totalizando 100%)
- **Copiar orçamento existente com todas as despesas**
- **Alteração completa de orçamentos** (NOVO)
  - Alterar nome e valor
  - Alterar categorias (com opção de manter as atuais)
  - Proteção contra perda acidental de dados
- Exclusão de orçamentos
- Visualização de todos os orçamentos cadastrados
- Gerenciamento de despesas para cada orçamento:
  - Adicionar, listar, alterar e deletar despesas
  - **Mover despesas entre categorias** (NOVO)
  - Despesas organizadas por categorias customizáveis
  - Três categorias disponíveis: Gastos Essenciais, Prioridades Financeiras, Estilo de Vida
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
   - Cadastrar novo orçamento (com opção de categorias padrão ou personalizadas)
   - Copiar orçamento existente
   - Listar orçamentos (e acessar o menu de despesas de cada um)
   - Alterar orçamento (nome, valor e categorias)
   - Deletar orçamento
   - Sair

2. **Personalização de Categorias** (novo)
   - Visualize descrições detalhadas de cada categoria
   - Selecione quais categorias usar (1, 2 ou todas as 3)
   - Defina porcentagens personalizadas para cada categoria
   - A última categoria é calculada automaticamente para totalizar 100%
   - Exemplos possíveis:
     - 2 categorias: Gastos Essenciais 80% + Prioridades Financeiras 20%
     - 2 categorias: Gastos Essenciais 50% + Prioridades Financeiras 50%
     - 3 categorias: Gastos Essenciais 30% + Prioridades Financeiras 20% + Estilo de Vida 50%

3. **Menu de Despesas** (após selecionar um orçamento)
   - Adicionar despesa
   - Listar despesas (com limite, gasto e disponível por categoria)
   - Alterar despesa
   - **Mover despesa para outra categoria** (NOVO)
   - Deletar despesa
   - Voltar

**Todos os menus de seleção agora possuem a opção 'Voltar', permitindo retornar ao menu anterior sem realizar alterações.**

Todas as operações são feitas por menus interativos, bastando escolher a opção desejada e seguir as instruções na tela.

## Estrutura dos dados
- Os orçamentos e despesas são salvos automaticamente no arquivo `budget.json` na mesma pasta do script.
- Cada orçamento possui nome, valor total e categorias personalizáveis, cada uma com suas despesas.
- As categorias podem ser configuradas com porcentagens flexíveis, sempre totalizando 100%.

## Categorias Disponíveis

1. **Gastos Essenciais**
   - Despesas básicas e necessárias para manutenção da vida (alimentação, moradia, saúde, transporte essencial)

2. **Prioridades Financeiras**
   - Investimentos, poupança, quitação de dívidas e criação de reserva de emergência

3. **Estilo de Vida**
   - Lazer, hobbies, entretenimento, viagens e outras despesas relacionadas à qualidade de vida

## Observações
- O programa é totalmente em português.
- **Novidades:**
  - Personalização completa de categorias e porcentagens
  - Opção de copiar orçamento já existente, incluindo todas as despesas
  - Alteração de categorias em orçamentos existentes (com proteção contra perda de dados)
  - **Mover despesas entre categorias diferentes**
  - Todos os menus de seleção (orçamento, categoria, despesa) agora possuem a opção de voltar

## Licença
Este projeto é livre para uso pessoal e educacional.
