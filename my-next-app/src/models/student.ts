// models/student.model.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IStudent extends Document {
  name: string;
  department: string;
  batch: string;
  didInternship: boolean;
}

const studentSchema: Schema<IStudent> = new Schema({
  name: { type: String, required: true },
  department: { type: String, required: true },
  batch: { type: String, required: true },
  didInternship: { type: Boolean, required: true },
});

const Student: Model<IStudent> = mongoose.models.Student || mongoose.model<IStudent>("Student", studentSchema);

export default Student;
