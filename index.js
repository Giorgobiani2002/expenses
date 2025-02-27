const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
app.use(bodyParser.json());

const port = 5000;
const expensesFile = "expenses.json";

const readExpenses = () => {
  if (!fs.existsSync(expensesFile)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(expensesFile));
};

const writeExpenses = (expenses) => {
  fs.writeFileSync(expensesFile, JSON.stringify(expenses, null, 2));
};

app.post("/expenses", (req, res) => {
  const expenses = readExpenses();
  const newExpense = req.body;
  expenses.push(newExpense);
  writeExpenses(expenses);
  res.status(201).json(newExpense);
});

app.get("/expenses", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const take = parseInt(req.query.take) || 20;
  const expenses = readExpenses();
  const start = (page - 1) * take;
  const paginatedExpenses = expenses.slice(start, start + take);
  res.json(paginatedExpenses);
});

app.put("/expenses/:id", (req, res) => {
  const expenses = readExpenses();
  const id = req.params.id;
  const updatedExpense = req.body;
  const expenseIndex = expenses.findIndex((exp) => exp.id === id);

  if (expenseIndex !== -1) {
    expenses[expenseIndex] = updatedExpense;
    writeExpenses(expenses);
    res.json(updatedExpense);
  } else {
    res.status(404).json({ error: "expense not found" });
  }
});

app.delete("/expenses/:id", (req, res) => {
  const key = req.headers.key;
  if (key !== "key your") {
    return res.status(403).json({ error: "you are unauthorized" });
  }

  const expenses = readExpenses();
  const id = req.params.id;
  const expenseIndex = expenses.findIndex((exp) => exp.id === id);

  if (expenseIndex !== -1) {
    const deletedExpense = expenses.splice(expenseIndex, 1);
    writeExpenses(expenses);
    res.json(deletedExpense);
  } else {
    res.status(404).json({ error: "expense mnot found" });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "error" });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
