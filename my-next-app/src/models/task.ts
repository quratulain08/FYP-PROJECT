import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  internshipId: { type: mongoose.Schema.Types.ObjectId, ref: "Internship", required: true },
  title: { type: String, required: true }, // Ensure the title field exists and is required
  description: { type: String, required: true },
  deadline: { type: Date, required: true },
  marks: { type: Number, required: true },
  time: { type: String }, // Optional
  weightage: { type: Number, required: true },
});

export default mongoose.models.Task || mongoose.model("Task", TaskSchema);
