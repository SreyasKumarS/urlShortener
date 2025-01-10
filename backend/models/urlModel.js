import mongoose from 'mongoose';

const urlSchema = mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortUrl: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('URL', urlSchema); // Ensure the name matches
