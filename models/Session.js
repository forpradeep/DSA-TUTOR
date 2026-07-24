const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'model'], required: true },
  content: { type: String, required: true }
}, { _id: false, timestamps: true });

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  problemText: { type: String, required: true },
  hintCount: { type: Number, default: 0 },
  skeletonProvided: { type: Boolean, default: false },
  conversationHistory: [messageSchema]
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);