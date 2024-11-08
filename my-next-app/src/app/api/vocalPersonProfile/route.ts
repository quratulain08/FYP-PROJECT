import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import VocalPerson from '@/models/vocalPerson';

// GET: Fetch the Vocal Person profile from the database by email.
export async function GET(req: Request) {
  try {
    // Get the email from the request's query string.
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Connect to the MongoDB database.
    await connectToDatabase();

    // Fetch the vocal person profile matching the provided email.
    const vocalPerson = await VocalPerson.findOne({ email });

    if (!vocalPerson) {
      return NextResponse.json({ error: 'Vocal Person not found' }, { status: 404 });
    }

    return NextResponse.json(vocalPerson);
  } catch (error) {
    console.error('Error fetching Vocal Person profile:', error);
    return NextResponse.json({ error: 'Failed to fetch Vocal Person profile' }, { status: 500 });
  }
}


// POST: Create or update the Vocal Person profile in the database.
export async function POST(req: Request) {
  try {
    const { name, email, phone, cnic, designation } = await req.json();

    // Connect to the MongoDB database.
    await connectToDatabase();

    let vocalPerson = await VocalPerson.findOne();

    if (vocalPerson) {
      // Update the existing profile.
      vocalPerson.name = name;
      vocalPerson.email = email;
      vocalPerson.phone = phone;
      vocalPerson.cnic = cnic;
      vocalPerson.designation = designation;
    } else {
      // Create a new profile.
      vocalPerson = new VocalPerson({ name, email, phone, cnic, designation });
    }

    await vocalPerson.save();

    return NextResponse.json({ message: 'Vocal Person profile saved successfully!' });
  } catch (error) {
    console.error('Error saving Vocal Person profile:', error);
    return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 });
  }
}

// PUT: Update the Vocal Person profile in the database.
export async function PUT(req: Request) {
  try {
    const { name, email, phone,cnic , designation } = await req.json();

    await connectToDatabase();

    // Use email or another unique identifier to find the profile
    const vocalPerson = await VocalPerson.findOneAndUpdate(
      { email }, // Adjust this line to match how you identify the profile
      { name, phone, designation },
      { new: true, runValidators: true } // Return the updated document
    );

    if (!vocalPerson) {
      return NextResponse.json({ error: 'Vocal Person not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Vocal Person profile updated successfully!' });
  } catch (error) {
    console.error('Error updating Vocal Person profile:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}


// DELETE: Remove the Vocal Person profile from the database.
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    // Connect to the MongoDB database.
    await connectToDatabase();

    // Delete the profile by its ID.
    await VocalPerson.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Vocal Person profile deleted successfully!' });
  } catch (error) {
    console.error('Error deleting Vocal Person profile:', error);
    return NextResponse.json({ error: 'Failed to delete profile' }, { status: 500 });
  }
}
