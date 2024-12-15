import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Department from "@/models/Department";

// GET: Fetch department by CoordinatorEmail
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const CoordinatorEmail = searchParams.get("CoordinatorEmail");

    if (!CoordinatorEmail) {
      return NextResponse.json(
        { error: "CoordinatorEmail is required." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const department = await Department.findOne({ CoordinatorEmail });

    if (!department) {
      return NextResponse.json(
        { error: "No department found with this CoordinatorEmail." },
        { status: 404 }
      );
    }

    return NextResponse.json(department);
  } catch (error) {
    console.error("Error fetching department:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

// POST: Create a new department
export async function POST(req: Request) {
  try {
    const {
      name,
      startDate,
      category,
      hodName,
      honorific,
      cnic,
      email,
      phone,
      landLine,
      focalPersonName,
      focalPersonHonorific,
      focalPersonCnic,
      focalPersonEmail,
      focalPersonPhone,
      CoordinatorName,
      CoordinatorHonorific,
      CoordinatorCnic,
      CoordinatorEmail,
      CoordinatorPhone,
    } = await req.json();

    if (!name || !startDate || !category || !hodName || !cnic || !email || !phone || !focalPersonName || !focalPersonCnic || !focalPersonEmail || !focalPersonPhone || !CoordinatorName || !CoordinatorCnic || !CoordinatorEmail || !CoordinatorPhone) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const newDepartment = new Department({
      name,
      startDate,
      category,
      hodName,
      honorific,
      cnic,
      email,
      phone,
      landLine,
      focalPersonName,
      focalPersonHonorific,
      focalPersonCnic,
      focalPersonEmail,
      focalPersonPhone,
      CoordinatorName,
      CoordinatorHonorific,
      CoordinatorCnic,
      CoordinatorEmail,
      CoordinatorPhone,
    });

    await newDepartment.save();

    return NextResponse.json(
      { message: "Department created successfully", department: newDepartment },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating department:", error);
    return NextResponse.json(
      { error: "Failed to create department." },
      { status: 500 }
    );
  }
}

// PUT: Update an existing department by ID
export async function PUT(req: Request) {
  try {
    const { id, ...updateData } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Department ID is required." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const updatedDepartment = await Department.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedDepartment) {
      return NextResponse.json(
        { error: "Department not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Department updated successfully", department: updatedDepartment }
    );
  } catch (error) {
    console.error("Error updating department:", error);
    return NextResponse.json(
      { error: "Failed to update department." },
      { status: 500 }
    );
  }
}

// DELETE: Remove a department by ID
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Department ID is required." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const deletedDepartment = await Department.findByIdAndDelete(id);

    if (!deletedDepartment) {
      return NextResponse.json(
        { error: "Department not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Department deleted successfully" });
  } catch (error) {
    console.error("Error deleting department:", error);
    return NextResponse.json(
      { error: "Failed to delete department." },
      { status: 500 }
    );
  }
}
