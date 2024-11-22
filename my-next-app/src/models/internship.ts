// models/Internship.ts
import mongoose, { Schema, Document } from "mongoose";

export interface Internship extends Document {
  title: string;
  hostInstitution: string;
  location: string;
  category: string;
  startDate: string;
  endDate: string;
  description: string;
}

const internshipSchema = new Schema<Internship>({
  title: { type: String, required: true },
  hostInstitution: { type: String, required: true },
  location: { type: String, required: true },
  category: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  description: { type: String, required: true },
});

const InternshipModel = mongoose.models.Internship || mongoose.model<Internship>("Internship", internshipSchema);

export default InternshipModel;
