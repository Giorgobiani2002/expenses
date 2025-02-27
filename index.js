const express = require("express");
const bodyParser = require("body-parser");
const {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
} = require("./service");

const app = express();
app.use(bodyParser.json());

const port = 5000;

const checkFieldsMiddleware = (req, res, next) => {
  const { id, description, amount, date } = req.body;
  if (id && description && amount && date) {
    next();
  } else {
    res.status(400).json({ error: "you must add all field" });
  }
};

app.post("/expenses", checkFieldsMiddleware, (req, res) => {
  const newExpense = addExpense(req.body);
  res.status(201).json(newExpense);
});

app.get("/expenses", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const take = parseInt(req.query.take) || 20;
  const expenses = getExpenses(page, take);
  res.json(expenses);
});

app.put("/expenses/:id", checkFieldsMiddleware, (req, res) => {
  const updatedExpense = updateExpense(req.params.id, req.body);
  if (updatedExpense) {
    res.json(updatedExpense);
  } else {
    res.status(404).json({ error: "Expense not found" });
  }
});

app.delete("/expenses/:id", (req, res) => {
  const key = req.headers.key;
  if (key !== "key") {
    return res.status(403).json({ error: "unauthorised" });
  }

  const deletedExpense = deleteExpense(req.params.id);
  if (deletedExpense) {
    res.json(deletedExpense);
  } else {
    res.status(404).json({ error: "not found expense" });
  }
});

app.get("/random", (req, res) => {
  const randomNumber = Math.random();
  if (randomNumber < 0.5) {
    res.status(200).json({ message: "all good" });
  } else {
    res.status(403).json({ message: "error " });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong" });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
