// routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

// Protected routes (only for logged-in users)
router.route('/')
  .get(protect, getTasks)     // GET all tasks
  .post(protect, createTask); // CREATE new task

router.route('/:id')
  .put(protect, updateTask)   // UPDATE task
  .delete(protect, deleteTask); // DELETE task

module.exports = router;
