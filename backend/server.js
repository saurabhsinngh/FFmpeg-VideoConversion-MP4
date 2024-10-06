const mongoose = require('mongoose');
const app = require('./app');
const { processQueue } = require('./src/queues/videoQueue');
const config = require('./src/config');

// Database Connection
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
    processQueue(); // Start processing the queue
  })
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
