const Video = require("../models/video");
const { addVideoToQueue } = require("../queues/videoQueue");
const multer = require("multer");
const path = require("path");

// Set storage engine
const storage = multer.diskStorage({
  destination: path.join(__dirname, "../uploads"),
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
    // cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage }).array("file", 10);

// const upload = multer({ storage }).array('file');

exports.uploadVideo = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to upload video' });
    }

    try {
      const files = req.files;
      if (!files || files.length === 0) {
        return res.status(400).json({ error: 'No files were uploaded' });
      }

      const videos = await Promise.all(
        files.map(async (file) => {
          const video = new Video({
            filename: file.filename,
            filePath: file.path,
            status: 'Uploading',
          });
          await video.save();
          return video;
        })
      );

      videos.forEach((video) => addVideoToQueue(video));
      res.status(200).json({ message: 'Videos uploaded successfully', videos });
    } catch (error) {
      res.status(500).json({ error: 'Failed to upload videos' });
    }
  });
};


exports.getVideoStatus = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }
    res.status(200).json({ status: video.status });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch video status" });
  }
};
