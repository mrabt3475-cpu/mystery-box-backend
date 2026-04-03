import mongoose from 'mongoose';

const abuseReportSchema = new mongoose.Schema({
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reported: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['cheating', 'spam', 'harassment', 'fraud', 'other'],
    required: true
  },
  description: String,
  evidence: [String],
  status: {
    type: String,
    enum: ['pending', 'investigating', 'resolved', 'dismissed'],
    default: 'pending'
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  resolution: String
}, {
  timestamps: true
});

export default mongoose.model('AbuseReport', abuseReportSchema);
