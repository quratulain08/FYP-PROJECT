import mongoose, { Schema, Document } from "mongoose";

export interface Internship extends Document {
  title: string;
  hostInstitution: string;
  location: string;
  category: string;
  startDate: string;
  endDate: string;
  description: string;
  assignedFaculty: mongoose.Types.ObjectId[]; // Array of ObjectId references to Faculty
  assignedStudents: mongoose.Types.ObjectId[]; // Array of ObjectId references to Students
  isApproved: boolean; // Indicates if the internship is approve
}

const internshipSchema = new Schema<Internship>({
  title: { type: String, required: true },
  hostInstitution: { type: String, required: true },
  location: { type: String, required: true },
  category: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  description: { type: String, required: true },
  assignedFaculty: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "faculty", // Reference to the Student model
    },
  ],
  assignedStudents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student", // Reference to the Student model
    },
  ],
  isApproved: { type: Boolean, default: false }, 
});

const InternshipModel = mongoose.models.Internship || mongoose.model<Internship>("Internship", internshipSchema);

export default InternshipModel; 