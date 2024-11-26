//models->internship.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IInternship extends Document {
  title: string;
  description: string;
  numberOfStudents: number;
  locationType: 'onsite' | 'oncampus';
  compensationType: 'paid' | 'unpaid';
  compensationAmount?: number;
  supervisorName: string;
  supervisorEmail: string;
  startDate: Date;
  endDate: Date;
  status: 'OPEN' | 'CLOSED';
  universityId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const InternshipSchema = new Schema<IInternship>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  numberOfStudents: { type: Number, required: true },
  locationType: { 
    type: String, 
    required: true,
    enum: ['onsite', 'oncampus']
  },
  compensationType: { 
    type: String, 
    required: true,
    enum: ['paid', 'unpaid']
  },
  compensationAmount: { 
    type: Number,
    required: function(this: IInternship) {
      return this.compensationType === 'paid';
    }
  },
  supervisorName: { type: String, required: true },
  supervisorEmail: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { 
    type: String, 
    required: true,
    enum: ['OPEN', 'CLOSED'],
    default: 'OPEN'
  },
  universityId: { 
    type: Schema.Types.ObjectId, 
    ref: 'University',
    required: true 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Create indexes for better query performance
InternshipSchema.index({ universityId: 1 });
InternshipSchema.index({ createdAt: -1 });

export const Internship = mongoose.models.Internship || mongoose.model<IInternship>('Internship', InternshipSchema);
