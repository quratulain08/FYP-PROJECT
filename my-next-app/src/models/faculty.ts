import mongoose, { Schema, Document, Model } from 'mongoose';

interface LastAcademicQualification {
  degreeName: string;
  degreeType: string;
  fieldOfStudy: string;
  degreeAwardingCountry: string;
  degreeAwardingInstitute: string;
  degreeStartDate: Date;
  degreeEndDate: Date;
}

interface Faculty extends Document {
  departmentId: mongoose.Types.ObjectId; // Explicitly define it as ObjectId
  name: string;
  honorific: string;
  cnic: string;
  gender: string;
  address: string;
  province: string;
  city: string;
  contractType: string;
  academicRank: string;
  joiningDate: Date;
  leavingDate?: Date;
  isCoreComputingTeacher: boolean;
  lastAcademicQualification: LastAcademicQualification;
  email: string; // Add email attribute
  university: mongoose.Schema.Types.ObjectId; // University reference

}

const lastAcademicQualificationSchema = new Schema<LastAcademicQualification>({
  degreeName: { type: String, required: true },
  degreeType: { type: String, required: true },
  fieldOfStudy: { type: String, required: true },
  degreeAwardingCountry: { type: String, required: true },
  degreeAwardingInstitute: { type: String, required: true },
  degreeStartDate: { type: Date, required: true },
  degreeEndDate: { type: Date, required: true },
});

const facultySchema = new Schema<Faculty>({
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true,
  },
  name: { type: String, required: true },
  honorific: { type: String, required: true },
  cnic: { type: String, required: true, unique: true },
  gender: { type: String, required: true },
  address: { type: String, required: true },
  province: { type: String, required: true },
  city: { type: String, required: true },
  contractType: { type: String, required: true },
  academicRank: { type: String, required: true },
  joiningDate: { type: Date, required: true },
  leavingDate: { type: Date },
  isCoreComputingTeacher: { type: Boolean, required: true },
  lastAcademicQualification: { type: lastAcademicQualificationSchema, required: true },
  email: { type: String, required: true, unique: true }, // Email attribute added
  university: { type: mongoose.Schema.Types.ObjectId, ref: "University", required: true }, // University reference

});

const FacultyModel: Model<Faculty> =
  mongoose.models.Faculty || mongoose.model<Faculty>('Faculty', facultySchema);

export default FacultyModel;
