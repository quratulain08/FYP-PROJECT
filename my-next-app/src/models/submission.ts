import mongoose from "mongoose";

const SubmissionSchema = new mongoose.Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
  studentName: { type: String, required: true },
  fileUrl: { type: String, required: true }, // Store file URL or path
  submittedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Submission || mongoose.model("Submission", SubmissionSchema);
