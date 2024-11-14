import mongoose, { Document, Schema, Model } from "mongoose";

// Define an interface for Program data structure
export interface IProgram extends Document {
  name: string;
  departmentId: mongoose.Types.ObjectId;
  startDate: Date;
  category: string;
  durationYears: number;
  description?: string;
  contactEmail: string;
  contactPhone?: string;
  programHead: string;
  programHeadContact?: {
    email?: string;
    phone?: string;
  };
  programObjectives?: string[];
}

// Define the schema for the Program model
const programSchema = new Schema<IProgram>(
  {
    name: { type: String, required: true },
    departmentId: { type: Schema.Types.ObjectId, ref: "Department", required: true },
    startDate: { type: Date, required: true },
    category: { type: String, required: true },
    durationYears: { type: Number, required: true },
    description: { type: String },
    contactEmail: { type: String, required: true },
    contactPhone: { type: String },
    programHead: { type: String, required: true },
    programHeadContact: {
      email: { type: String },
      phone: { type: String },
    },
    programObjectives: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

// Ensure mongoose.models is checked properly for TypeScript
const Program: Model<IProgram> = mongoose.models.Program || mongoose.model<IProgram>("Program", programSchema);

// Export the Program model
export default Program;
