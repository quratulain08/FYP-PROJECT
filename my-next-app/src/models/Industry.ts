import mongoose from 'mongoose';

export interface IIndustry extends mongoose.Document {
  name: string;
  location: string;
  contactEmail: string;
}

const IndustrySchema = new mongoose.Schema({
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

  contactEmail: {
    type: String,
    required: true,
    trim: true
  }
}, { timestamps: true });

export default mongoose.models.Industry || mongoose.model<IIndustry>('Industry', IndustrySchema);