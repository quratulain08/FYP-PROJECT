import mongoose, { Schema, model, models, Document } from 'mongoose';

// Define the Profile interface
interface IProfile extends Document {
  role: string;
  name: string;
  email: string;
  phone: string;
  cnic: string;
  department?: string;
  designation?: string;
  officeLocation?: string;
  tenureStart?: Date; // Changed to Date for consistency
  tenureEnd?: Date;   // Changed to Date for consistency
}

// Define the Profile schema
const ProfileSchema = new Schema<IProfile>({
  role: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  cnic: { type: String, required: true, unique: true },
  department: { type: String },
  designation: { type: String },
  officeLocation: { type: String },
  tenureStart: { type: Date },
  tenureEnd: { type: Date },
});

// Check if the model exists to avoid overwrite issues during development
const Profile = models.Profile || model<IProfile>('Profile', ProfileSchema);

export default Profile;
