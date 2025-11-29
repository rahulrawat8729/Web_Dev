// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables from .env file (used locally)
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// --- START CORS CONFIGURATION FOR PRODUCTION DEPLOYMENT ---

// The domain of your Vercel frontend. 
// You MUST set this as an environment variable (e.g., CLIENT_URL) in Render for production.
// For now, we'll hardcode the one you used in Vercel for a quick fix.
const CLIENT_URL = 'https://taskmanager-jet-chi.vercel.app'; 

if (process.env.NODE_ENV === 'production') {
    // Production settings: Only allow requests from the deployed frontend URL
    app.use(cors({
        origin: CLIENT_URL,
        credentials: true, // Important for cookies, tokens, etc.
    }));
    console.log(`CORS set to allow origin: ${CLIENT_URL}`);
} else {
    // Development settings: Allow all origins (e.g., http://localhost:3000)
    app.use(cors({
        origin: 'http://localhost:3000', // Allow local React dev server
        credentials: true,
    }));
    console.log("CORS set to allow http://localhost:3000");
}
// --- END CORS CONFIGURATION ---

// middleware
app.use(express.json()); // Body parser

// routes
app.use('/api/auth', require('./routes/authRoutes'));
// task routes
app.use('/api/tasks', require('./routes/taskRoutes'));


// test route
app.get('/', (req, res) => {
    res.send('Task Manager API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
