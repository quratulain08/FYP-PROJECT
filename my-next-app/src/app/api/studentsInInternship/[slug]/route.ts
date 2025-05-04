import dbConnect from '@/lib/mongodb';
import Internship from '@/models/internship';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const internshipId = params.slug;
  await dbConnect();

  try {
    const internship = await Internship.findById(internshipId).populate('assignedStudents');

    if (!internship) {
      return NextResponse.json({ error: 'Internship not found' }, { status: 404 });
    }

    return NextResponse.json(internship.assignedStudents, { status: 200 });
  } catch (err) {
    console.error('Error fetching assigned students:', err);
    return NextResponse.json({ error: 'Server error while fetching students' }, { status: 500 });
  }
}
