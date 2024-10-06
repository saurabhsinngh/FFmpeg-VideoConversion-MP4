const express = require("express");
const cors = require('cors');
require('dotenv').config();
const videoRoutes = require("./src/routes/videoRoutes");

const app = express();
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/videos", videoRoutes);

module.exports = app;
