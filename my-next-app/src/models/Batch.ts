import mongoose, { Schema, Document } from "mongoose";

// Define the Batch interface
interface IBatch extends Document {
  batchName: string; // Name of the batch
  departmentId: mongoose.Types.ObjectId[]; // Array of student Object IDs
}

// Define the Batch schema
const BatchSchema: Schema = new Schema(
  {
    batchName: {
      type: String,
      required: true,
      unique: false, // Ensure no duplicate batch names
      trim: true,
    },
    departmentId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department", // Reference to the Student model
      },
    ],
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

// Create the Batch model
const Batch = mongoose.models.Batch || mongoose.model<IBatch>("Batch", BatchSchema);

export default Batch;
