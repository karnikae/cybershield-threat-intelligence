const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const threatRoutes = require('./routes/threatRoutes');
const logRoutes = require('./routes/logRoutes');
const vulnerabilityRoutes = require('./routes/vulnerabilityRoutes');

const authRoutes = require('./routes/authRoutes');
const { protect } = require('./middleware/authMiddleware');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/threats', protect, threatRoutes);
app.use('/api/logs', protect, logRoutes);
app.use('/api/vulnerabilities', protect, vulnerabilityRoutes);

// Test Route
app.get('/', (req, res) => {
    res.send('Cybersecurity Threat Intelligence System API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
