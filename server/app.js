const express = require("express");
const app = express();
const port = 8888;

const transactionController = require("./controller/transaction");
const categoryController = require("./controller/category");

app.use(express.json()); // podpora pro application/json
app.use(express.urlencoded({ extended: true })); // podpora pro application/x-www-form-urlencoded

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/transaction", transactionController);
app.use("/category", categoryController);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
