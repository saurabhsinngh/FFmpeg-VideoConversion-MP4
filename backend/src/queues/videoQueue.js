const Queue = require('bull');
const Video = require('../models/video');
const { sendUploadStatusEmail, sendCompleteStatusEmail } = require('../utils/email');
const config = require('../config');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const Redis = require('ioredis');

// Redis clients for publishing and subscribing to events
const redis = new Redis();
const pub = new Redis();

// Create a Bull queue for video processing
const videoQueue = new Queue('video processing', {
  redis: {
    host: config.redisHost,
    port: config.redisPort,
  },
});

// Process one video at a time
const processQueue = () => {
  videoQueue.process(1, async (job, done) => {
    const { videoId } = job.data;
    let video;

    try {
      video = await Video.findById(videoId);
      if (!video) throw new Error('Video not found');

      // Send "Converting" email
      video.status = 'Converting';
      await video.save();
      sendUploadStatusEmail(video.filename, video.status);
      pub.publish('videoStatus', JSON.stringify({ videoId: video._id, status: video.status }));

      ffmpeg.setFfmpegPath('C:\\ffmpeg\\ffmpeg.exe');
      const outputFilePath = video.filePath.replace(/\.\w+$/, '') + '.mp4';

      // Convert the video
      ffmpeg(video.filePath)
        .toFormat('mp4')
        .on('end', async () => {
          video.status = 'Completed';
          video.convertedPath = outputFilePath;
          await video.save();

          // Send "Conversion Completed" email
          const outputFilename = path.basename(outputFilePath);
          sendCompleteStatusEmail(outputFilename, video.status);
          pub.publish('videoStatus', JSON.stringify({ videoId: video._id, status: video.status }));

          done();  // Move to the next job in the queue
        })
        .on('error', async (err) => {
          video.status = 'Failed';
          await video.save();
          pub.publish('videoStatus', JSON.stringify({ videoId: video._id, status: video.status }));

          done(err);  
        })
        .save(outputFilePath);
    } catch (error) {
      if (video) {
        video.status = 'Failed';
        await video.save();
        pub.publish('videoStatus', JSON.stringify({ videoId: video._id, status: 'Failed' }));
      }

      done(error);  // Stop this job, move to the next
    }
  });
};

module.exports = {
  processQueue,
  addVideoToQueue: (video) => {
    videoQueue.add({ videoId: video._id });
  },
};



