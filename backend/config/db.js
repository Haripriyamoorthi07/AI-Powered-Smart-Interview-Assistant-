const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai_interview_assistant';
    
    // Set a lower timeout so it doesn't hang forever if MongoDB is not running
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, 
    };

    console.log(`Connecting to MongoDB at: ${connUri}...`);
    const conn = await mongoose.connect(connUri, options);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn('====================================================================');
    console.warn(`WARNING: Could not connect to MongoDB: ${error.message}`);
    console.warn('The application will run in MOCK IN-MEMORY database mode.');
    console.warn('Ensure MongoDB is installed and running, or configure MONGODB_URI in your .env');
    console.warn('====================================================================');
    return false;
  }
};

module.exports = connectDB;
