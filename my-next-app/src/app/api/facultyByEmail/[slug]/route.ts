import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
// import Student from '@/models/student';
import FacultyModel from '@/models/faculty';
// GET: Fetch a single student by registration number
export async function GET(
    request: Request,
    { params }: { params: { slug: string } }
  ) {
    const email = params.slug;
  
    if (!email) {
      return NextResponse.json({ error: 'email is required' }, { status: 400 });
    }
  
    try {
      await connectToDatabase();
  
      const faculty = await FacultyModel.findOne({ email });
  
      if (!faculty) {
        return NextResponse.json({ error: 'faculty not found' }, { status: 404 });
      }
  
      return NextResponse.json(faculty);
    } catch (error) {
      console.error('Error fetching FacultyModel:', error);
      return NextResponse.json({ error: 'Failed to fetch student' }, { status: 500 });
    }
  }
