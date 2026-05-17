const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');

// POST - Add Candidate
router.post('/', async (req, res) => {
  try {
    const { name, email, skills, experience, bio } = req.body;
    const candidate = new Candidate({ name, email, skills, experience, bio });
    await candidate.save();
    res.status(201).json({ success: true, candidate });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// GET - All Candidates
router.get('/', async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ createdAt: -1 });
    res.json({ success: true, candidates });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE - Remove Candidate
router.delete('/:id', async (req, res) => {
  try {
    await Candidate.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Candidate deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;