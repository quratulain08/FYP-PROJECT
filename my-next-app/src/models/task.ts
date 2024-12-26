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
  createdBy: string;
  assignedStudents: mongoose.Types.ObjectId[], // Array of ObjectId references to Faculty
  comments: {
    commenterName: string; // Name of the user who commented (can be a Student or Faculty)
    content: string; // The comment content
    commentCreatedAt: Date; // Date the comment was created
  }[]; // Array of comments
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
  createdBy: { type: String, required: true },
  assignedStudents: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    default: [], // Initialize as empty array
  },
  comments: [
    {
      commenterName: { type: String, required: false },
      content: { type: String, required: false },
      commentCreatedAt: { type: Date, required: false },
    },
  ], // Array of comments
});

// Model export
export default mongoose.models.Task || mongoose.model<ITask>("Task", TaskSchema);
