// routes/attendanceRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// ✅ Create - Mark attendance
router.post('/', (req, res) => {
  const { studentName, rollNo, class: className, status } = req.body;
  if (!studentName || !rollNo || !className || !status) {
    return res.status(400).json({ error: 'Please provide all required fields.' });
  }

  const sql = 'INSERT INTO attendance (studentName, rollNo, class, status) VALUES (?, ?, ?, ?)';
  db.query(sql, [studentName, rollNo, className, status], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Attendance marked', id: result.insertId });
  });
});

// ✅ Read - Get all attendance records
router.get('/', (req, res) => {
  db.query('SELECT * FROM attendance ORDER BY date DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ✅ Read - Get single record by ID
router.get('/:id', (req, res) => {
  db.query('SELECT * FROM attendance WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!results.length) return res.status(404).json({ error: 'Record not found' });
    res.json(results[0]);
  });
});

// ✅ Update - Update record by ID
router.put('/:id', (req, res) => {
  const { studentName, rollNo, class: className, status } = req.body;
  const sql = 'UPDATE attendance SET studentName=?, rollNo=?, class=?, status=? WHERE id=?';
  db.query(sql, [studentName, rollNo, className, status, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Record not found' });
    res.json({ message: 'Record updated' });
  });
});

// ✅ Delete - Delete record by ID
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM attendance WHERE id=?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Record not found' });
    res.json({ message: 'Record deleted' });
  });
});

module.exports = router;
