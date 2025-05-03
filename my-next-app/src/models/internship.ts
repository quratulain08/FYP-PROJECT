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
  assignedDepartment: mongoose.Types.ObjectId[];
  rejectionComment:  String; // New field for rejection reason
  AssigningIndustry: mongoose.Types.ObjectId[];
  isComplete: boolean; 

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
  assignedFaculty: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Faculty",
      },
    ],
    default: [], // Initialize as empty array
  },
  universityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "University", // Reference to the University model
    required: true,
  },
  assignedStudents: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    default: [], // Initialize as empty array
  },
  assignedDepartment: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
      },
    ],
    default: [], // Initialize as empty array
  },
  isComplete: { type: Boolean, default: false }, 
  isApproved: { type: Boolean, default: false }, 
  rejectionComment: { type: String, default: "" }, // New field for rejection reason
  AssigningIndustry: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Industry",
      },
    ],
    default: [], 
  },
});

const InternshipModel = mongoose.models.Internship || mongoose.model<Internship>("Internship", internshipSchema);

export default InternshipModel; 