// Importa prompts do inquirer e módulo de arquivos
const { select, input, checkbox } = require('@inquirer/prompts')
const fs = require('fs').promises

let message = "Bem vindo ao App de Metas";
let budgets = [] // Lista de orçamentos cadastrados
const CATEGORIES = [
    { name: 'Gastos Essenciais', percent: 50 },
    { name: 'Prioridades Financeiras', percent: 20 },
    { name: 'Estilo de Vida', percent: 30 }
]

// Definição das categorias disponíveis com descrições
const AVAILABLE_CATEGORIES = [
    {
        name: 'Gastos Essenciais',
        description: 'Despesas básicas e necessárias para manutenção da vida (alimentação, moradia, saúde, transporte essencial).'
    },
    {
        name: 'Prioridades Financeiras',
        description: 'Investimentos, poupança, quitação de dívidas e criação de reserva de emergência.'
    },
    {
        name: 'Estilo de Vida',
        description: 'Lazer, hobbies, entretenimento, viagens e outras despesas relacionadas à qualidade de vida.'
    }
]

// Carrega os orçamentos do arquivo budget.json
const loadBudgets = async () => {
    try {
        const data = await fs.readFile('budget.json', 'utf-8')
        const json = JSON.parse(data)
        budgets = Array.isArray(json) ? json : []
    } catch (error) {
        budgets = []
    }
}

// Salva os orçamentos no arquivo budget.json
const saveBudgets = async () => {
    await fs.writeFile('budget.json', JSON.stringify(budgets, null, 2))
}

// Função para selecionar e personalizar categorias
const customizeCategories = async () => {
    console.clear()
    console.log('\n=== Personalização de Categorias ===\n')
    console.log('Categorias disponíveis:\n')
    AVAILABLE_CATEGORIES.forEach((cat, idx) => {
        console.log(`${idx + 1}. ${cat.name}`)
        console.log(`   ${cat.description}\n`)
    })

    const selectedIndices = await checkbox({
        message: 'Selecione as categorias que deseja incluir no orçamento:',
        choices: AVAILABLE_CATEGORIES.map((cat, i) => ({
            name: cat.name,
            value: i
        })),
        instructions: false,
        validate: (answer) => {
            if (answer.length === 0) {
                return 'Selecione pelo menos uma categoria.'
            }
            return true
        }
    })

    if (selectedIndices.length === 0) {
        message = "Nenhuma categoria selecionada."
        return null
    }

    const customCategories = []
    let totalPercent = 0

    for (let i = 0; i < selectedIndices.length; i++) {
        const catIndex = selectedIndices[i]
        const catName = AVAILABLE_CATEGORIES[catIndex].name

        let percent
        if (i === selectedIndices.length - 1) {
            // Última categoria: calcula automaticamente para fechar 100%
            percent = 100 - totalPercent
            console.clear()
            console.log(`\nCategoria: ${catName}`)
            console.log(`Percentual automático (para totalizar 100%): ${percent}%\n`)
            await input({ message: 'Pressione Enter para continuar...' })
        } else {
            const percentStr = await input({
                message: `Percentual para '${catName}' (restante: ${100 - totalPercent}%):`
            })
            percent = parseFloat(percentStr.replace(',', '.'))

            if (isNaN(percent) || percent <= 0) {
                message = "Percentual inválido."
                return null
            }

            if (totalPercent + percent >= 100) {
                message = "A soma dos percentuais excedeu 100%."
                return null
            }
        }

        totalPercent += percent
        customCategories.push({
            name: catName,
            percent: percent,
            expenses: []
        })
    }

    return customCategories
}

// Cria um novo orçamento ou altera um existente
const createOrUpdateBudget = async () => {
    const name = (await input({ message: 'Nome do orçamento:' })).trim()
    if (!name) {
        message = "O nome não pode ser vazio."
        return
    }
    const valueStr = await input({ message: 'Valor total do orçamento:' })
    const value = parseFloat(valueStr.replace(',', '.'))
    if (isNaN(value) || value <= 0) {
        message = "Valor inválido."
        return
    }

    // Escolhe entre categorias padrão ou personalizadas
    const categoryOption = await select({
        message: 'Como deseja definir as categorias?',
        choices: [
            { name: 'Usar categorias padrão (50% / 20% / 30%)', value: 'default' },
            { name: 'Personalizar categorias', value: 'custom' },
            { name: 'Voltar', value: 'back' }
        ]
    })

    if (categoryOption === 'back') return

    let categories
    if (categoryOption === 'custom') {
        categories = await customizeCategories()
        if (!categories) return // Erro na personalização
    } else {
        categories = CATEGORIES.map(cat => ({
            name: cat.name,
            percent: cat.percent,
            expenses: []
        }))
    }

    // Verifica se já existe orçamento com esse nome
    let existing = budgets.find(b => b.name === name)
    if (existing) {
        existing.value = value
        existing.categories = categories
        message = "Orçamento alterado com sucesso!"
    } else {
        budgets.push({
            name,
            value,
            categories: categories
        })
        message = "Orçamento cadastrado com sucesso!"
    }
}

// Função para copiar um orçamento existente com todas as despesas
const copyBudget = async () => {
    if (budgets.length === 0) {
        message = "Nenhum orçamento disponível para copiar."
        return
    }
    const idx = await select({
        message: 'Selecione o orçamento para copiar:',
        choices: [
            ...budgets.map((b, i) => ({ name: b.name, value: i })),
            { name: 'Voltar', value: 'back' }
        ]
    })
    if (idx === 'back') return
    const original = budgets[idx]
    const name = (await input({ message: 'Nome do novo orçamento:', default: original.name + ' (Cópia)' })).trim()
    if (!name) {
        message = "O nome não pode ser vazio."
        return
    }
    const valueStr = await input({ message: 'Valor total do novo orçamento:', default: original.value.toString() })
    const value = parseFloat(valueStr.replace(',', '.'))
    if (isNaN(value) || value <= 0) {
        message = "Valor inválido."
        return
    }
    // Copia as categorias e despesas
    const categories = original.categories.map(cat => ({
        name: cat.name,
        percent: cat.percent,
        expenses: cat.expenses.map(exp => ({ ...exp }))
    }))
    budgets.push({ name, value, categories })
    message = "Orçamento copiado com sucesso!"
}

// Lista todos os orçamentos cadastrados
const listBudgets = async () => {
    if (budgets.length === 0) {
        message = "Nenhum orçamento cadastrado."
        return
    }
    let text = '\nOrçamentos cadastrados:'
    budgets.forEach((b, i) => {
        text += `\n${i + 1}. ${b.name} (R$ ${b.value.toFixed(2)})`
    })
    console.clear()
    console.log(text + '\n')
    await input({ message: 'Pressione Enter para voltar ao menu.' })
}

// Altera o nome, valor e categorias de um orçamento existente
const updateBudget = async () => {
    if (budgets.length === 0) {
        message = "Nenhum orçamento cadastrado."
        return
    }
    const idx = await select({
        message: 'Selecione o orçamento para alterar:',
        choices: [
            ...budgets.map((b, i) => ({ name: b.name, value: i })),
            { name: 'Voltar', value: 'back' }
        ]
    })
    if (idx === 'back') return

    const name = (await input({ message: 'Novo nome do orçamento:', default: budgets[idx].name })).trim()
    if (!name) {
        message = "O nome não pode ser vazio."
        return
    }
    const valueStr = await input({ message: 'Novo valor total do orçamento:', default: budgets[idx].value.toString() })
    const value = parseFloat(valueStr.replace(',', '.'))
    if (isNaN(value) || value <= 0) {
        message = "Valor inválido."
        return
    }

    // Pergunta se deseja alterar as categorias
    const changeCategoriesOption = await select({
        message: 'Deseja alterar as categorias deste orçamento?',
        choices: [
            { name: 'Não, manter categorias atuais', value: 'keep' },
            { name: 'Sim, usar categorias padrão (50% / 20% / 30%)', value: 'default' },
            { name: 'Sim, personalizar categorias', value: 'custom' },
            { name: 'Voltar', value: 'back' }
        ]
    })

    if (changeCategoriesOption === 'back') return

    let categories = budgets[idx].categories
    if (changeCategoriesOption === 'custom') {
        const customCategories = await customizeCategories()
        if (!customCategories) return // Erro na personalização
        // Aviso sobre perda de despesas se as categorias mudarem
        const confirmChange = (await input({
            message: 'ATENÇÃO: Alterar categorias apagará todas as despesas registradas. Digite "SIM" para confirmar:'
        })).trim()
        if (confirmChange.toUpperCase() !== 'SIM') {
            message = "Alteração de categorias cancelada."
            return
        }
        categories = customCategories
    } else if (changeCategoriesOption === 'default') {
        // Aviso sobre perda de despesas se as categorias mudarem
        const confirmChange = (await input({
            message: 'ATENÇÃO: Alterar categorias apagará todas as despesas registradas. Digite "SIM" para confirmar:'
        })).trim()
        if (confirmChange.toUpperCase() !== 'SIM') {
            message = "Alteração de categorias cancelada."
            return
        }
        categories = CATEGORIES.map(cat => ({
            name: cat.name,
            percent: cat.percent,
            expenses: []
        }))
    }
    // Se 'keep', mantém as categorias atuais sem alteração

    budgets[idx].name = name
    budgets[idx].value = value
    if (changeCategoriesOption !== 'keep') {
        budgets[idx].categories = categories
    }
    message = "Orçamento alterado com sucesso!"
}

// Deleta um orçamento existente
const deleteBudget = async () => {
    if (budgets.length === 0) {
        message = "Nenhum orçamento cadastrado."
        return
    }
    const idx = await select({
        message: 'Selecione o orçamento para deletar:',
        choices: [
            ...budgets.map((b, i) => ({ name: b.name, value: i })),
            { name: 'Voltar', value: 'back' }
        ]
    })
    if (idx === 'back') return
    const confirm = (await input({ message: `Digite "SIM" para confirmar a exclusão de '${budgets[idx].name}':` })).trim()
    if (confirm.toUpperCase() === 'SIM') {
        budgets.splice(idx, 1)
        message = "Orçamento deletado com sucesso!"
    } else {
        message = "Exclusão cancelada."
    }
}

// Menu de despesas para um orçamento específico
const expenseMenu = async (budget) => {
    while (true) {
        showMessage()
        await saveBudgets()
        const option = await select({
            message: `Orçamento: ${budget.name} >`,
            choices: [
                { name: 'Adicionar despesa', value: 'add' },
                { name: 'Listar despesas', value: 'list' },
                { name: 'Alterar despesa', value: 'updateExpense' },
                { name: 'Mover despesa para outra categoria', value: 'moveExpense' },
                { name: 'Deletar despesa', value: 'delete' },
                { name: 'Voltar', value: 'back' }
            ]
        })
        switch (option) {
            case 'add':
                await addExpenseForBudget(budget)
                break
            case 'list':
                await listExpensesForBudget(budget)
                break
            case 'updateExpense':
                await updateExpenseForBudget(budget)
                break
            case 'moveExpense':
                await moveExpenseToCategory(budget)
                break
            case 'delete':
                await deleteExpenseForBudget(budget)
                break
            case 'back':
                return
        }
    }
}

// Adiciona uma despesa a um orçamento (novo menu)
const addExpenseForBudget = async (budget) => {
    const idxCat = await select({
        message: 'Selecione a categoria:',
        choices: [
            ...budget.categories.map((c, i) => ({ name: c.name, value: i })),
            { name: 'Voltar', value: 'back' }
        ]
    })
    if (idxCat === 'back') return
    const category = budget.categories[idxCat]
    const desc = await input({ message: 'Descrição da despesa:' })
    const valueStr = await input({ message: 'Valor da despesa:' })
    const value = parseFloat(valueStr.replace(',', '.'))
    if (!desc || isNaN(value) || value <= 0) {
        message = "Descrição ou valor inválido."
        return
    }
    category.expenses.push({ description: desc, value })
    message = "Despesa adicionada!"
}

// Lista as despesas de um orçamento (novo menu)
const listExpensesForBudget = async (budget) => {
    while (true) {
        let text = `\nOrçamento: ${budget.name} (R$ ${budget.value.toFixed(2)})\n`
        let hasExpense = false
        budget.categories.forEach(cat => {
            const allowedValue = budget.value * (cat.percent / 100)
            const spentValue = cat.expenses.reduce((sum, d) => sum + d.value, 0)
            const availableValue = allowedValue - spentValue
            text += `\n${cat.name} (${cat.percent}%):\n`
            text += `  Limite: R$ ${allowedValue.toFixed(2)} | Gasto: R$ ${spentValue.toFixed(2)} | Disponível: R$ ${availableValue.toFixed(2)}\n`
            if (cat.expenses.length === 0) {
                text += '  Nenhuma despesa.\n'
            } else {
                hasExpense = true
                cat.expenses.forEach(d => {
                    text += `  - ${d.description}: R$ ${d.value.toFixed(2)}\n`
                })
            }
        })
        if (!hasExpense) text += '\nNenhuma despesa registrada neste orçamento.\n'
        console.clear()
        console.log(text)
        const option = await select({
            message: 'Opções:',
            choices: [
                { name: 'Voltar', value: 'back' }
            ]
        })
        if (option === 'back') break
    }
}

// Altera uma despesa de um orçamento (novo menu)
const updateExpenseForBudget = async (budget) => {
    const idxCat = await select({
        message: 'Selecione a categoria:',
        choices: [
            ...budget.categories.map((c, i) => ({ name: c.name, value: i })),
            { name: 'Voltar', value: 'back' }
        ]
    })
    if (idxCat === 'back') return
    const category = budget.categories[idxCat]
    if (category.expenses.length === 0) {
        message = 'Nenhuma despesa para alterar nesta categoria.'
        return
    }
    const idxExp = await select({
        message: 'Selecione a despesa para alterar:',
        choices: [
            ...category.expenses.map((d, i) => ({ name: `${d.description} (R$ ${d.value.toFixed(2)})`, value: i })),
            { name: 'Voltar', value: 'back' }
        ]
    })
    if (idxExp === 'back') return
    const old = category.expenses[idxExp]
    const desc = (await input({ message: 'Nova descrição da despesa:', default: old.description })).trim()
    if (!desc) {
        message = 'Descrição não pode ser vazia.'
        return
    }
    const valueStr = await input({ message: 'Novo valor da despesa:', default: old.value.toString() })
    const value = parseFloat(valueStr.replace(',', '.'))
    if (isNaN(value) || value <= 0) {
        message = 'Valor inválido.'
        return
    }
    old.description = desc
    old.value = value
    message = 'Despesa alterada com sucesso!'
}

// Move uma despesa para outra categoria
const moveExpenseToCategory = async (budget) => {
    if (budget.categories.length < 2) {
        message = 'É necessário ter pelo menos 2 categorias para mover despesas.'
        return
    }

    const idxCatFrom = await select({
        message: 'Selecione a categoria de origem:',
        choices: [
            ...budget.categories.map((c, i) => ({ name: c.name, value: i })),
            { name: 'Voltar', value: 'back' }
        ]
    })
    if (idxCatFrom === 'back') return

    const categoryFrom = budget.categories[idxCatFrom]
    if (categoryFrom.expenses.length === 0) {
        message = 'Nenhuma despesa nesta categoria para mover.'
        return
    }

    const idxExp = await select({
        message: 'Selecione a despesa para mover:',
        choices: [
            ...categoryFrom.expenses.map((d, i) => ({ name: `${d.description} (R$ ${d.value.toFixed(2)})`, value: i })),
            { name: 'Voltar', value: 'back' }
        ]
    })
    if (idxExp === 'back') return

    const idxCatTo = await select({
        message: 'Selecione a categoria de destino:',
        choices: [
            ...budget.categories
                .map((c, i) => ({ name: c.name, value: i }))
                .filter((_, i) => i !== idxCatFrom),
            { name: 'Voltar', value: 'back' }
        ]
    })
    if (idxCatTo === 'back') return

    const categoryTo = budget.categories[idxCatTo]
    const expense = categoryFrom.expenses[idxExp]

    // Remove da categoria de origem e adiciona na categoria de destino
    categoryFrom.expenses.splice(idxExp, 1)
    categoryTo.expenses.push(expense)

    message = `Despesa movida de '${categoryFrom.name}' para '${categoryTo.name}' com sucesso!`
}

// Deleta despesas de um orçamento (novo menu)
const deleteExpenseForBudget = async (budget) => {
    const idxCat = await select({
        message: 'Selecione a categoria:',
        choices: [
            ...budget.categories.map((c, i) => ({ name: c.name, value: i })),
            { name: 'Voltar', value: 'back' }
        ]
    })
    if (idxCat === 'back') return
    const category = budget.categories[idxCat]
    if (category.expenses.length === 0) {
        message = 'Nenhuma despesa para deletar nesta categoria.'
        return
    }
    const choices = [
        ...category.expenses.map((d, i) => ({ name: `${d.description} (R$ ${d.value.toFixed(2)})`, value: i })),
        { name: 'Voltar', value: 'back' }
    ]
    const selected = await checkbox({
        message: 'Selecione as despesas para deletar:',
        choices: choices,
        instructions: false
    })
    if (selected.includes('back') || selected.length === 0) {
        message = 'Nenhuma despesa selecionada para deletar.'
        return
    }
    selected.sort((a, b) => b - a).forEach(idx => {
        category.expenses.splice(idx, 1)
    })
    message = 'Despesa(s) deletada(s)!'
}

// Exibe mensagens e limpa a tela
const showMessage = () => {
    console.clear();
    if (message != "") {
        console.log(message)
        console.log("")
        message = ""
    }
}

// Menu principal do programa
const start = async () => {
    await loadBudgets()
    console.clear();
    while (true) {
        showMessage()
        await saveBudgets()
        const option = await select({
            message: 'Menu de Orçamentos >',
            choices: [
                { name: 'Cadastrar novo orçamento', value: 'create' },
                { name: 'Copiar orçamento existente', value: 'copy' },
                { name: 'Listar orçamentos', value: 'listBudgets' },
                { name: 'Alterar orçamento', value: 'updateBudget' },
                { name: 'Deletar orçamento', value: 'deleteBudget' },
                { name: 'Sair', value: 'exit' }
            ]
        })
        switch (option) {
            case 'create':
                await createOrUpdateBudget()
                break
            case 'copy':
                await copyBudget()
                break
            case 'listBudgets':
                if (budgets.length === 0) {
                    message = 'Nenhum orçamento cadastrado.'
                    break
                }
                const idx = await select({
                    message: 'Selecione o orçamento para gerenciar despesas:',
                    choices: [
                        ...budgets.map((b, i) => ({ name: b.name, value: i })),
                        { name: 'Voltar', value: 'back' }
                    ]
                })
                if (idx === 'back') break
                await expenseMenu(budgets[idx])
                break
            case 'updateBudget':
                await updateBudget()
                break
            case 'deleteBudget':
                await deleteBudget()
                break
            case 'exit':
                console.log('Até a próxima!')
                return
        }
    }
}

start()