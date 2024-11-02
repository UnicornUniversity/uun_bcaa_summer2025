const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;
const ajv = new Ajv();
addFormats(ajv);

const transactionDao = require("../../dao/transaction-dao.js");
const categoryDao = require("../../dao/category-dao.js");

const schema = {
  type: "object",
  properties: {
    counterparty: { type: "string" },
    amount: { type: "number" },
    date: { type: "string", format: "date-time" },
    note: { type: "string" },
    categoryId: { type: "string" },
  },
  required: ["counterparty", "amount", "date", "categoryId"],
  additionalProperties: false,
};

async function CreateAbl(req, res) {
  try {
    let transaction = req.body;

    // validate input
    const valid = ajv.validate(schema, transaction);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    // check if categoryId exists
    const category = categoryDao.get(transaction.categoryId);
    if (!category) {
      res.status(400).json({
        code: "categoryDoesNotExist",
        message: `category with id ${transaction.categoryId} does not exist`,
        validationError: ajv.errors,
      });
      return;
    }
    transaction.category = category;

    // store transaction to persistent storage
    transaction = transactionDao.create(transaction);

    // return properly filled dtoOut
    res.json(transaction);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = CreateAbl;
