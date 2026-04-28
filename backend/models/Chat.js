const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sessionId: { type: String, required: true },
  messages: [{
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    action: { type: Object, default: null }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Chat', chatSchema);
