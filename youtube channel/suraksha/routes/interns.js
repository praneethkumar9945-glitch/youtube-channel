const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('../database');
const { authenticateToken } = require('./auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage(); // Store in memory for base64 conversion
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

// Submit internship application
router.post('/submit', upload.single('resume'), (req, res) => {
  const { name, email, phone, college, domain, start, note } = req.body;

  if (!name || !email || !phone || !college || !domain || !start) {
    return res.status(400).json({ error: 'All required fields must be filled' });
  }

  if (!req.file) {
    return res.status(400).json({ error: 'Resume PDF is required' });
  }

  // Convert file to base64
  const base64 = req.file.buffer.toString('base64');
  const resumeData = `data:application/pdf;base64,${base64}`;

  const id = 'I' + Date.now().toString(36).slice(-6);

  db.run(`
    INSERT INTO interns (id, name, email, phone, college, domain, start_date, note, resume_name, resume_data, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [id, name, email, phone, college, domain, start, note, req.file.originalname, resumeData, 'pending'], function(err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to submit application' });
    }
    res.json({ message: 'Application submitted successfully', id });
  });
});

// Get all interns (for admin)
router.get('/', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  db.all("SELECT id, name, email, phone, college, domain, start_date, note, resume_name, resume_data, status, applied_at FROM interns ORDER BY applied_at DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ interns: rows });
  });
});

// Update intern status (admin only)
router.put('/:id/status', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const { status } = req.body;
  if (!['pending', 'approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  db.run("UPDATE interns SET status = ? WHERE id = ?", [status, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: 'Failed to update status' });
    if (this.changes === 0) return res.status(404).json({ error: 'Intern not found' });
    res.json({ message: 'Status updated' });
  });
});

// Delete intern (admin only)
router.delete('/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  db.run("DELETE FROM interns WHERE id = ?", [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: 'Failed to delete intern' });
    if (this.changes === 0) return res.status(404).json({ error: 'Intern not found' });
    res.json({ message: 'Intern deleted' });
  });
});

module.exports = router;
