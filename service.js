const fs = require('fs');

const expensesFile = 'expenses.json';

const readExpenses = () => {
    if (!fs.existsSync(expensesFile)) {
        return [];
    }
    return JSON.parse(fs.readFileSync(expensesFile));
};

const writeExpenses = (expenses) => {
    fs.writeFileSync(expensesFile, JSON.stringify(expenses, null, 2));
};

const addExpense = (expense) => {
    const expenses = readExpenses();
    expenses.push(expense);
    writeExpenses(expenses);
    return expense;
};

const getExpenses = (page, take) => {
    const expenses = readExpenses();
    const start = (page - 1) * take;
    return expenses.slice(start, start + take);
};

const updateExpense = (id, updatedExpense) => {
    const expenses = readExpenses();
    const expenseIndex = expenses.findIndex(exp => exp.id === id);
    
    if (expenseIndex !== -1) {
        expenses[expenseIndex] = updatedExpense;
        writeExpenses(expenses);
        return updatedExpense;
    }
    return null;
};

const deleteExpense = (id) => {
    const expenses = readExpenses();
    const expenseIndex = expenses.findIndex(exp => exp.id === id);
    
    if (expenseIndex !== -1) {
        const deletedExpense = expenses.splice(expenseIndex, 1);
        writeExpenses(expenses);
        return deletedExpense;
    }
    return null;
};

module.exports = {
    readExpenses,
    writeExpenses,
    addExpense,
    getExpenses,
    updateExpense,
    deleteExpense
};