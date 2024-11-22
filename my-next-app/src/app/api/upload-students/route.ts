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
  
      // Convert file to a buffer
      const fileBuffer = await file.arrayBuffer();
      
      // Parse the Excel file (you might not need this now, but can be useful for validation)
      const workbook = XLSX.read(fileBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert sheet to JSON (array of objects)
      const students: any[] = XLSX.utils.sheet_to_json(worksheet);
  
      // Parse the students data from the form data
      const studentsFromForm = JSON.parse(studentsData);
  
      // Connect to the database
      await connectToDatabase();
  
      const studentsToAdd = [];
  
      // Iterate over each student row and save to the database
      for (const studentData of studentsFromForm) {
        const { name, department, batch, didInternship, registrationNumber ,section} = studentData;
        
        if (!name || !department || !batch || didInternship === undefined || !registrationNumber || !section) {
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
        });
  
        studentsToAdd.push(student);
      }
  
      if (studentsToAdd.length > 0) {
        await Student.insertMany(studentsToAdd);
        console.log(`Added ${studentsToAdd.length} students to the database`);
      }
  
      return NextResponse.json({ message: 'Students uploaded successfully!' });
    } catch (error) {
      console.error('Error uploading students:', error);
      return NextResponse.json(
        { error: 'Failed to upload students', details: error.message },
        { status: 500 }
      );
    }
  }
  
