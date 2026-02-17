const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const Property = require('../models/Property');

// POST /api/expenses - Create a new expense
router.post('/', async (req, res) => {
  try {
    const { property_id, category, description, amount, expense_date, receipt_file_id, notes } = req.body;

    // Validate required fields
    if (!property_id || !category || !amount || !expense_date) {
      return res.status(400).json({ error: 'Missing required fields: property_id, category, amount, expense_date' });
    }

    // Verify property exists
    const property = await Property.getById(property_id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const expense = await Expense.create({
      property_id,
      category,
      description,
      amount,
      expense_date,
      receipt_file_id,
      notes
    });

    res.status(201).json({
      message: 'Expense created successfully',
      expense
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/expenses - Get all expenses (with optional filters)
router.get('/', async (req, res) => {
  try {
    const filters = {};

    if (req.query.property_id) filters.property_id = req.query.property_id;
    if (req.query.category) filters.category = req.query.category;
    if (req.query.start_date) filters.start_date = req.query.start_date;
    if (req.query.end_date) filters.end_date = req.query.end_date;

    const expenses = await Expense.getAll(filters);

    res.status(200).json({
      count: expenses.length,
      expenses
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/expenses/:id - Get a single expense
router.get('/:id', async (req, res) => {
  try {
    const expense = await Expense.getById(req.params.id);

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/expenses/:id - Update an expense
router.put('/:id', async (req, res) => {
  try {
    const { property_id, category, description, amount, expense_date, receipt_file_id, notes } = req.body;

    // Validate required fields
    if (!property_id || !category || !amount || !expense_date) {
      return res.status(400).json({ error: 'Missing required fields: property_id, category, amount, expense_date' });
    }

    const existingExpense = await Expense.getById(req.params.id);
    if (!existingExpense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    // Verify property exists
    const property = await Property.getById(property_id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const expense = await Expense.update(req.params.id, {
      property_id,
      category,
      description,
      amount,
      expense_date,
      receipt_file_id,
      notes
    });

    res.status(200).json({
      message: 'Expense updated successfully',
      expense
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/expenses/:id - Delete an expense
router.delete('/:id', async (req, res) => {
  try {
    const existingExpense = await Expense.getById(req.params.id);
    if (!existingExpense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    const result = await Expense.delete(req.params.id);

    res.status(200).json({
      message: 'Expense deleted successfully',
      ...result
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/expenses/property/:property_id - Get all expenses for a property
router.get('/property/:property_id', async (req, res) => {
  try {
    const property = await Property.getById(req.params.property_id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const expenses = await Expense.getByPropertyId(req.params.property_id);
    const categorySums = await Expense.getCategorySum(req.params.property_id);

    res.status(200).json({
      property_id: req.params.property_id,
      expense_count: expenses.length,
      total_expenses: expenses.reduce((sum, e) => sum + e.amount, 0),
      expenses,
      category_summary: categorySums
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
