import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import industryModel from '@/models/Industry';
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
  
      const Industry = await industryModel.findOne({contactEmail:email });
  
      if (!Industry) {
        return NextResponse.json({ error: 'Industry not found' }, { status: 404 });
      }
  
      return NextResponse.json(Industry);
    } catch (error) {
      console.error('Error fetching industryModel:', error);
      return NextResponse.json({ error: 'Failed to fetch Industry' }, { status: 500 });
    }
  }
