import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Department from '../../../models/Department';



export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const parts = url.pathname.split('/');
    const _id = parts[parts.length - 1];

    await connectToDatabase();
    console.log(_id);
    if (_id && _id !== 'department') {
      const department = await Department.findById(_id);
      if (!department) {
        return NextResponse.json({ error: 'Department not found' }, { status: 404 });
      }
      return NextResponse.json(department);
    }

    const departments = await Department.find();
    return NextResponse.json(departments);
  } catch (error) {
    console.error('Error fetching departments: ', error);
    return NextResponse.json({ error: 'Failed to fetch departments' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const departmentData = await req.json();
    await connectToDatabase();

    if (!departmentData.name || !departmentData.hodName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newDepartment = new Department(departmentData);
    await newDepartment.save();

    return NextResponse.json(newDepartment, { status: 201 });
  } catch (error) {
    console.error('Error creating department:', error);
    return NextResponse.json({ error: 'Failed to create department' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, ...updatedData } = await req.json();
    await connectToDatabase();

    if (!id) {
      return NextResponse.json({ error: 'Missing department ID' }, { status: 400 });
    }

    const updatedDepartment = await Department.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedDepartment) {
      return NextResponse.json({ error: 'Department not found' }, { status: 404 });
    }

    return NextResponse.json(updatedDepartment);
  } catch (error) {
    console.error('Error updating department:', error);
    return NextResponse.json({ error: 'Failed to update department' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const parts = url.pathname.split('/');
    const id = parts[parts.length - 1];

    await connectToDatabase();

    const deletedDepartment = await Department.findByIdAndDelete(id);
    if (!deletedDepartment) {
      return NextResponse.json({ error: 'Department not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Department deleted successfully!' });
  } catch (error) {
    console.error('Error deleting department:', error);
    return NextResponse.json({ error: 'Failed to delete department' }, { status: 500 });
  }
}
