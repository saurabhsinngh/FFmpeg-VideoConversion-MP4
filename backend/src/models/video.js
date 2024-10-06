const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
    filename: String,
    status: {
        type: String,
        enum: ['Pending', 'Uploading', 'Converting', 'Completed','Failed'],  
        default: 'Pending'
    },
    filePath: String,
    convertedPath: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Video', VideoSchema);
