import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb'; // Adjust the path if necessary
import Student from '@/models/student'; // Adjust the path if necessary
import * as XLSX from 'xlsx';

// Helper to safely extract error message
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as Blob;
    const studentsData = formData.get('students') as string;

    if (!file || !studentsData) {
      return NextResponse.json({ error: 'File or student data missing' }, { status: 400 });
    }

    // Log incoming data
    console.log('Received file:', file);
    console.log('Received students data:', studentsData);

    // Parse students data
    const studentsFromForm = JSON.parse(studentsData);

    // Log parsed students
    console.log('Parsed students:', studentsFromForm);

    // Connect to the database
    await connectToDatabase();
    console.log('Database connected successfully');

    const studentsToAdd = [];

    for (const studentData of studentsFromForm) {
      const { name, department, batch, didInternship, registrationNumber, section, email, university } = studentData;

      if (!name || !department || !batch || didInternship === undefined || !registrationNumber || !section || !email || !university) {
        console.log('Skipping invalid student data:', studentData);
        continue;
      }

      const student = new Student({
        name,
        department,
        batch,
        didInternship,
        registrationNumber,
        section,
        email,
        university,
      });

      studentsToAdd.push(student);
    }

    console.log('Students to add:', studentsToAdd);

    if (studentsToAdd.length > 0) {
      try {
        await Student.insertMany(studentsToAdd);
        console.log(`Added ${studentsToAdd.length} students to the database`);
      } catch (err) {
        console.error('Error inserting students:', err);
      }
    } else {
      console.log('No valid students to add');
    }

    return NextResponse.json({ message: 'Students uploaded successfully!' });
  } catch (error) {
    console.error('Error uploading students:', error);
    return NextResponse.json(
      { error: 'Failed to upload students', details: getErrorMessage(error) },
      { status: 500 }
    );
  }
}

  
