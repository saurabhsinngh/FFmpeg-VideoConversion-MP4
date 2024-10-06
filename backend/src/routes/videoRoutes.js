const express = require("express");
const {
  uploadVideo,
  getVideoStatus,
} = require("../controllers/videoController");
const router = express.Router();

// Video Upload Route
router.post("/upload", uploadVideo);

// Get Video Status Route
router.get("/:id/status", getVideoStatus);

module.exports = router;
