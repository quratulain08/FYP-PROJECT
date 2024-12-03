import mongoose, { Schema, Document } from "mongoose";

export interface Internship extends Document {
  title: string;
  hostInstitution: string;
  location: string;
  category: string;
  supervisorName :string;
  supervisorEmail :string;
  compensationType: string;
  compensationAmount: number;
  startDate: Date;
  endDate: Date;
  description: string;
  assignedFaculty: mongoose.Types.ObjectId[]; // Array of ObjectId references to Faculty
  assignedStudents: mongoose.Types.ObjectId[]; // Array of ObjectId references to Students
  isApproved: boolean; // Indicates if the internship is approve
  universityId: mongoose.Types.ObjectId; // Reference to the University model
  numberOfStudents: number;




}

const internshipSchema = new Schema<Internship>({
  numberOfStudents :{ type: Number, required: true },
  supervisorName :{ type: String, required: true },
  supervisorEmail :{ type: String, required: true },
  compensationAmount :{ type: Number, required: true },
  compensationType :{ type: String, required: true },
  title: { type: String, required: true },
  hostInstitution: { type: String, required: true },
  location: { type: String, required: true },
  category: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  description: { type: String, required: true },
  assignedFaculty: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "faculty", // Reference to the Student model
    },
  ],
  universityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "University", // Reference to the University model
    required: true,
  },
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