import mongoose, { Schema, Document, Model } from "mongoose";

// Define the interface for a student document
export interface IStudent extends Document {
  name: string;
  department: string;
  batch: string;
  section: string; // New field for section
  didInternship: boolean;
  registrationNumber: string;
}

// Define the schema for the student model
const studentSchema: Schema<IStudent> = new Schema({
  name: { type: String, required: true },
  department: { type: String, required: true },
  batch: { type: String, required: true },
  section: { type: String, required: true }, // Add section to schema
  didInternship: { type: Boolean, required: true },
  registrationNumber: { type: String, required: true },
});

// Create the model, using an existing model if already compiled
const Student: Model<IStudent> =
  mongoose.models.Student || mongoose.model<IStudent>("Student", studentSchema);

export default Student;
