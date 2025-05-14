import mongoose, { Schema, Document, Model } from "mongoose";

// Define the interface for a student document
export interface IStudent extends Document {
  name: string;
  department:  mongoose.Types.ObjectId[];
  batch: string;
  section: string; // New field for section
  didInternship: boolean;
  registrationNumber: string;
  email: string;
  university: mongoose.Schema.Types.ObjectId; // University reference

}

// Define the schema for the student model
const studentSchema: Schema<IStudent> = new Schema({
  name: { type: String, required: true },
  department:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department", // Reference to the Student model
    },
  ],
  batch: { type: String, required: true },
  section: { type: String, required: true }, // Add section to schema
  didInternship: { type: Boolean, required: true },
  email: { type: String, required: true, unique: true }, // Add email to schema
  registrationNumber: { type: String, required: true },
  university: { type: mongoose.Schema.Types.ObjectId, ref: "University", required: true }, // University reference

});

// Create the model, using an existing model if already compiled
const Student: Model<IStudent> =
  mongoose.models.Student || mongoose.model<IStudent>("Student", studentSchema);

export default Student;
