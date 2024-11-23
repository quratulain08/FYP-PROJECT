// models/Department.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface IDepartment extends Document {
  name: string;
  startDate: Date;
  category: string;
  hodName: string;
  honorific: string;
  cnic: string;
  email: string;
  phone: string;
  landLine?: string; // Optional field
  focalPersonName: string;
  focalPersonHonorific: string;
  focalPersonCnic: string;
  focalPersonEmail: string;
  focalPersonPhone: string;
}

const DepartmentSchema: Schema = new Schema({
  name: { type: String, required: true },
  startDate: { type: Date, required: true },
  category: { type: String, required: true },
  hodName: { type: String, required: true },
  honorific: { type: String, required: true, default: 'Mr.' },
  cnic: { type: String, required: true ,unique: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  landLine: { type: String },
  focalPersonName: { type: String, required: true },
  focalPersonHonorific: { type: String, required: true ,default: 'Mr.'},
  focalPersonCnic: { type: String, required: true ,unique: true },
  focalPersonEmail: { type: String, required: true , unique: true },
  focalPersonPhone: { type: String, required: true },
}, {
  timestamps: true,
});

export default mongoose.models.Department || mongoose.model<IDepartment>('Department', DepartmentSchema);
