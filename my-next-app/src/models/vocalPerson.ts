import mongoose, { Schema, model, models, Document } from 'mongoose';

// Define the Vocal Person interface
interface IVocalPerson extends Document {
  name: string;
  email: string; // Ensure unique emails
  phone: string;
  cnic: string; // Ensure unique CNICs
  designation: string;
}

// Define the Vocal Person schema
const VocalPersonSchema = new Schema<IVocalPerson>({
  name: { type: String, required: [true, 'Name is required'] },
  email: { type: String, required: [true, 'Email is required'], unique: true },
  phone: { type: String, required: [true, 'Phone number is required'] },
  cnic: { type: String, required: [true, 'CNIC is required'], unique: true },
  designation: { type: String, required: [true, 'Designation is required'] },
});

// Check if the model exists to avoid overwrite issues during development
const VocalPerson = models.VocalPerson || model<IVocalPerson>('VocalPerson', VocalPersonSchema);

export default VocalPerson;
