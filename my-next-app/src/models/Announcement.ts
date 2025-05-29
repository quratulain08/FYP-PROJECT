import mongoose, { Schema, Document } from 'mongoose';

export interface IAnnouncement extends Document {
  title: string;
  content: string;
  university: mongoose.Types.ObjectId;
  expiresAt?: Date;
  isActive: boolean;
}

const AnnouncementSchema: Schema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  university: { type: mongoose.Schema.Types.ObjectId, ref: 'University', required: true },
  expiresAt: { type: Date }, // optional expiry time
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
});

export default mongoose.models.Announcement || mongoose.model<IAnnouncement>('Announcement', AnnouncementSchema);
