// src/app/api/internship/route.ts

import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { Internship } from '@/models/internship';
import connectToDatabase from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    await connectToDatabase();

    const data = await request.json();
    console.log('Received POST data:', data);

    // Validate required fields
    const requiredFields = [
      'title',
      'description',
      'numberOfStudents',
      'locationType',
      'compensationType',
      'supervisorName',
      'supervisorEmail',
      'startDate',
      'endDate',
      'universityId',
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        console.log(`Missing required field: ${field}`);
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Validate universityId format
    if (!mongoose.Types.ObjectId.isValid(data.universityId)) {
      console.log('Invalid universityId format:', data.universityId);
      return NextResponse.json(
        { error: 'Invalid university ID format' },
        { status: 400 }
      );
    }

    // Create new internship with explicit type conversion
    const internshipData = {
      ...data,
      numberOfStudents: parseInt(data.numberOfStudents, 10),
      compensationAmount: data.compensationType === 'paid' 
        ? parseFloat(data.compensationAmount) 
        : undefined,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      universityId: new mongoose.Types.ObjectId(data.universityId),
    };

    console.log('Creating internship with data:', internshipData);

    const internship = new Internship(internshipData);
    await internship.save();

    console.log('Successfully created internship:', {
      id: internship._id,
      title: internship.title
    });

    return NextResponse.json(internship, { status: 201 });
  } catch (error) {
    console.error('Detailed error in POST internship:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create internship' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const universityId = searchParams.get('universityId');

    console.log('Attempting to fetch internships with params:', {
      universityId,
    });

    // Check if universityId exists
    if (!universityId) {
      console.log('No universityId provided');
      return NextResponse.json(
        { error: 'University ID is required' },
        { status: 400 }
      );
    }

    // Now we know universityId is not null, check if it's valid
    if (!mongoose.Types.ObjectId.isValid(universityId)) {
      console.log('Invalid universityId format:', universityId);
      return NextResponse.json(
        { error: 'Invalid university ID format' },
        { status: 400 }
      );
    }

    const query = { universityId: new mongoose.Types.ObjectId(universityId) };
    console.log('MongoDB query:', JSON.stringify(query));

    const internships = await Internship.find(query)
      .sort({ createdAt: -1 })
      .lean();

    console.log('Query result:', {
      count: internships.length,
      firstInternship: internships[0] ? {
        id: internships[0]._id,
        title: internships[0].title,
        universityId: internships[0].universityId
      } : null
    });

    return NextResponse.json(internships);
  } catch (error) {
    console.error('Detailed error in GET internships:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch internships' },
      { status: 500 }
    );
  }
}