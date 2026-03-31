const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const Expense = require('../models/Expense');

// POST /api/properties - Create a new property
router.post('/', async (req, res) => {
  try {
    const { address, city, state, zip_code, property_type, acquisition_date, notes } = req.body;

    // Validate required fields
    if (!address || !city || !state || !zip_code) {
      return res.status(400).json({ error: 'Missing required fields: address, city, state, zip_code' });
    }

    const property = await Property.create({
      address,
      city,
      state,
      zip_code,
      property_type,
      acquisition_date,
      notes
    });

    res.status(201).json({
      message: 'Property created successfully',
      property
    });
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({ error: 'Property with this address already exists' });
    }
    res.status(500).json({ error: error.message });
  }
});

// GET /api/properties - Get all properties
router.get('/', async (req, res) => {
  try {
    const properties = await Property.getAll();
    res.status(200).json({
      count: properties.length,
      properties
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/properties/:id - Get a single property
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.getWithSummary(req.params.id);

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/properties/:id - Update a property
router.put('/:id', async (req, res) => {
  try {
    const { address, city, state, zip_code, property_type, acquisition_date, notes } = req.body;

    // Validate required fields
    if (!address || !city || !state || !zip_code) {
      return res.status(400).json({ error: 'Missing required fields: address, city, state, zip_code' });
    }

    const existingProperty = await Property.getById(req.params.id);
    if (!existingProperty) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const property = await Property.update(req.params.id, {
      address,
      city,
      state,
      zip_code,
      property_type,
      acquisition_date,
      notes
    });

    res.status(200).json({
      message: 'Property updated successfully',
      property
    });
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({ error: 'Property with this address already exists' });
    }
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/properties/:id - Delete a property
router.delete('/:id', async (req, res) => {
  try {
    const existingProperty = await Property.getById(req.params.id);
    if (!existingProperty) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const result = await Property.delete(req.params.id);

    res.status(200).json({
      message: 'Property deleted successfully',
      ...result
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/properties/:id/expenses - Get expenses for a specific property with summary
router.get('/:id/expenses', async (req, res) => {
  try {
    const property = await Property.getById(req.params.id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const expenses = await Expense.getByPropertyId(req.params.id);
    const categorySums = await Expense.getCategorySum(req.params.id);

    res.status(200).json({
      property_id: req.params.id,
      property_address: property.address,
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
