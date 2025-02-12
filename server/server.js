const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;
const photoRoutes = require('./routes/photos');
const healthRoutes = require('./routes/health');
require('dotenv').config();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, process.env.UPLOAD_PATH || 'uploads');
fs.mkdir(uploadsDir, { recursive: true }).catch(console.error);

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', // Frontend URL
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'Origin', 'X-Requested-With'],
    credentials: true
}));
app.use(express.json());

// Serve static files from uploads directory with absolute path
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Check if MONGO_URI is defined
if (!process.env.MONGO_URI) {
    console.error("Error: MONGO_URI is not defined in environment variables. Please create a .env file.");
    process.exit(1);
}

// Optional: Set strictQuery to false to avoid deprecation warning in Mongoose 7
mongoose.set("strictQuery", false);

// MongoDB connection
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error(err));

// Routes
app.use('/api/photos', photoRoutes);
app.use('/health', healthRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 