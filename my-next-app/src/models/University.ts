import mongoose from 'mongoose';

export interface IUniversity extends mongoose.Document {
  name: string;
  location: string;
  address: string;
  contactEmail: string;
}

const UniversitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  contactEmail: {
    type: String,
    required: true,
    trim: true
  }
}, { timestamps: true });

export default mongoose.models.University || mongoose.model<IUniversity>('University', UniversitySchema);