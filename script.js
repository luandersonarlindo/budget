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
    // Verifica se já existe orçamento com esse nome
    let existing = budgets.find(b => b.name === name)
    if (existing) {
        existing.value = value
        existing.categories = CATEGORIES.map(cat => ({
            name: cat.name,
            percent: cat.percent,
            expenses: []
        }))
        message = "Orçamento alterado com sucesso!"
    } else {
        budgets.push({
            name,
            value,
            categories: CATEGORIES.map(cat => ({
                name: cat.name,
                percent: cat.percent,
                expenses: []
            }))
        })
        message = "Orçamento cadastrado com sucesso!"
    }
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

// Altera o nome e valor de um orçamento existente
const updateBudget = async () => {
    if (budgets.length === 0) {
        message = "Nenhum orçamento cadastrado."
        return
    }
    const idx = await select({
        message: 'Selecione o orçamento para alterar:',
        choices: budgets.map((b, i) => ({ name: b.name, value: i }))
    })
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
    budgets[idx].name = name
    budgets[idx].value = value
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
        choices: budgets.map((b, i) => ({ name: b.name, value: i }))
    })
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
        choices: budget.categories.map((c, i) => ({ name: c.name, value: i }))
    })
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
        choices: budget.categories.map((c, i) => ({ name: c.name, value: i }))
    })
    const category = budget.categories[idxCat]
    if (category.expenses.length === 0) {
        message = 'Nenhuma despesa para alterar nesta categoria.'
        return
    }
    const idxExp = await select({
        message: 'Selecione a despesa para alterar:',
        choices: category.expenses.map((d, i) => ({ name: `${d.description} (R$ ${d.value.toFixed(2)})`, value: i }))
    })
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

// Deleta despesas de um orçamento (novo menu)
const deleteExpenseForBudget = async (budget) => {
    const idxCat = await select({
        message: 'Selecione a categoria:',
        choices: budget.categories.map((c, i) => ({ name: c.name, value: i }))
    })
    const category = budget.categories[idxCat]
    if (category.expenses.length === 0) {
        message = 'Nenhuma despesa para deletar nesta categoria.'
        return
    }
    const choices = category.expenses.map((d, i) => ({ name: `${d.description} (R$ ${d.value.toFixed(2)})`, value: i }))
    const selected = await checkbox({
        message: 'Selecione as despesas para deletar:',
        choices: choices,
        instructions: false
    })
    if (selected.length === 0) {
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