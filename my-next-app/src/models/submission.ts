import mongoose from "mongoose";


interface IScheme extends Document {
  taskId: mongoose.Schema.Types.ObjectId;
  studentName: string;
  fileUrl: string;
  submittedAt: Date;
  grade: Number;
}

const SubmissionSchema = new mongoose.Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
  studentName: { type: String, required: true },
  fileUrl: { type: String, required: true }, // Store file URL or path
  submittedAt: { type: Date, default: Date.now },
  grade: { type: Number },

});

export default mongoose.models.Submission || mongoose.model<IScheme>('Submission', SubmissionSchema);

