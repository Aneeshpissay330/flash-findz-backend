const mongoose = require('mongoose');
const { Schema } = mongoose;

const logSchema = new Schema({
  level: { 
    type: String, 
    required: true, 
    enum: ['info', 'warn', 'error', 'debug', 'fatal'], // Log levels
    default: 'info' 
  },
  message: { 
    type: String, 
    required: true 
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  },
  additionalData: { 
    type: Schema.Types.Mixed, // You can store any additional data in this field
    default: {} 
  },
  stackTrace: { 
    type: String, 
    default: '' 
  }
});

// Create a log entry
logSchema.statics.createLog = async function (level, message, additionalData = {}, stackTrace = '') {
  const log = new this({
    level,
    message,
    additionalData,
    stackTrace
  });
  
  await log.save();
};

// Optionally, you can add indexes to optimize querying logs by level or timestamp
logSchema.index({ timestamp: -1 });

module.exports = mongoose.model('Log', logSchema);
