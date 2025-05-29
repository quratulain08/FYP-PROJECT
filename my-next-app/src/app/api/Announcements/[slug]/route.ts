import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Announcement from '@/models/Announcement';
import { Types } from 'mongoose';



export async function GET(
    request: Request, 
    { params }: { params: { slug: string } }
  ) {
    try {  
      const universityId = params.slug;
  
      if (!Types.ObjectId.isValid(universityId)) {
        return NextResponse.json({ message: `Invalid university ID: ${universityId}` }, { status: 400 });
      }
  
      await connectToDatabase();
  
      const announcements = await Announcement.find({ university: universityId }).sort({ createdAt: -1 });
  
      return NextResponse.json(announcements);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      return NextResponse.json({ message: 'Failed to fetch announcements' }, { status: 500 });
    }
  }
// POST - Create a new announcement for a specific university

export async function POST(
    request: Request, 
    { params }: { params: { slug: string } }
  ) {
    try {  
      const universityId = params.slug;
      const body = await request.json();
  
      if (!Types.ObjectId.isValid(universityId)) {
        return NextResponse.json({ message: `Invalid university ID: ${universityId}` }, { status: 400 });
      }
  
      // Basic validation on body fields
      if (!body.title || !body.content) {
        return NextResponse.json({ message: 'Title and content are required' }, { status: 400 });
      }
  
      await connectToDatabase();
  
      const newAnnouncement = new Announcement({
        title: body.title,
        content: body.content,
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined,
        university: universityId,
        isActive: true,
      });
  
      await newAnnouncement.save();
  
      return NextResponse.json(newAnnouncement, { status: 201 });
    } catch (error) {
      console.error('Error creating announcement:', error);
      return NextResponse.json({ error: 'Failed to create announcement' }, { status: 500 });
    }
  }
  

// PUT - Update announcement by ID
export async function PUT(
  request: Request,
  { params }: { params: { announcementId: string } }
) {
  try {
    const { announcementId } = params;
    const updatedData = await request.json();

    if (!Types.ObjectId.isValid(announcementId)) {
      return NextResponse.json({ message: `Invalid ID: ${announcementId}` }, { status: 400 });
    }

    await connectToDatabase();

    const updated = await Announcement.findByIdAndUpdate(
      announcementId,
      updatedData,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json({ message: 'Announcement not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating announcement:', error);
    return NextResponse.json({ message: 'Failed to update' }, { status: 500 });
  }
}

// DELETE - Delete announcement by ID
export async function DELETE(
  request: Request,
  { params }: { params: { announcementId: string } }
) {
  try {
    const { announcementId } = params;

    if (!Types.ObjectId.isValid(announcementId)) {
      return NextResponse.json({ message: `Invalid ID: ${announcementId}` }, { status: 400 });
    }

    await connectToDatabase();

    const deleted = await Announcement.findByIdAndDelete(announcementId);
    if (!deleted) {
      return NextResponse.json({ message: 'Announcement not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    return NextResponse.json({ message: 'Failed to delete' }, { status: 500 });
  }
}
