// server.js
const express = require('express');
const db = require('./config/db'); // ensures DB connection
const attendanceRoutes = require('./routes/attendanceRoutes');

const app = express();
app.use(express.json());

// test route
app.get('/', (req, res) => {
  res.send('Student Attendance API is running');
});

// attendance routes
app.use('/api/attendance', attendanceRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
