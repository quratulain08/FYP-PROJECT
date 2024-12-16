import mongoose, { Document, Schema } from "mongoose";

// Interface for type safety
interface ITask extends Document {
  internshipId: mongoose.Schema.Types.ObjectId;
  title: string;
  description: string;
  deadline: Date;
  marks: number;
  time?: string; // Optional
  weightage: number;
}

// Schema definition
const TaskSchema = new Schema<ITask>({
  internshipId: { type: mongoose.Schema.Types.ObjectId, ref: "Internship", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  deadline: { type: Date, required: true },
  marks: { type: Number, required: true },
  time: { type: String, required: false }, // Make time optional
  weightage: { type: Number, required: true },
});

// Model export
export default mongoose.models.Task || mongoose.model<ITask>("Task", TaskSchema);
