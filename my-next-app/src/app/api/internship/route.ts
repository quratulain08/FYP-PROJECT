import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb"; // Adjust the path if necessary
import Internship from "@/models/internship"; // Adjust the path if necessary

// Helper to safely extract error message
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

// GET: Fetch all internships.
export async function GET(req: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const location = searchParams.get("location");

    const filter: Record<string, any> = {};
    if (category) filter.category = category;
    if (location) filter.location = location;

    const internships = await Internship.find(filter);
    return NextResponse.json(internships);
  } catch (error) {
    console.error("Error fetching internships:", getErrorMessage(error));
    return NextResponse.json(
      { error: "Failed to fetch internships", details: getErrorMessage(error) },
      { status: 500 }
    );
  }
}

// POST: Add a new internship.
export async function POST(req: Request) {
  try {
    const internshipData = await req.json();

    if (!internshipData || typeof internshipData !== "object") {
      return NextResponse.json(
        { error: "Invalid internship data format" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const { title, hostInstitution, location, category, startDate, endDate, description } = internshipData;

    if (!title || !hostInstitution || !location || !category || !startDate || !endDate || !description) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          missingFields: { title, hostInstitution, location, category, startDate, endDate, description },
        },
        { status: 400 }
      );
    }

    const newInternship = new Internship(internshipData);
    await newInternship.save();

    return NextResponse.json({ message: "Internship added successfully!" });
  } catch (error) {
    console.error("Error adding internship:", getErrorMessage(error));
    return NextResponse.json(
      { error: "Failed to add internship", details: getErrorMessage(error) },
      { status: 500 }
    );
  }
}

// PUT: Update an internship by ID.
export async function PUT(req: Request) {
  try {
    const { id, ...updateData } = await req.json();
    await connectToDatabase();

    if (!id) {
      return NextResponse.json({ error: "Missing internship ID" }, { status: 400 });
    }

    const updatedInternship = await Internship.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedInternship) {
      return NextResponse.json({ error: "Internship not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Internship updated successfully!" });
  } catch (error) {
    console.error("Error updating internship:", getErrorMessage(error));
    return NextResponse.json(
      { error: "Failed to update internship", details: getErrorMessage(error) },
      { status: 500 }
    );
  }
}

// DELETE: Remove an internship by ID.
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await connectToDatabase();

    if (!id) {
      return NextResponse.json({ error: "Missing internship ID" }, { status: 400 });
    }

    const deletedInternship = await Internship.findByIdAndDelete(id);

    if (!deletedInternship) {
      return NextResponse.json({ error: "Internship not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Internship deleted successfully!" });
  } catch (error) {
    console.error("Error deleting internship:", getErrorMessage(error));
    return NextResponse.json(
      { error: "Failed to delete internship", details: getErrorMessage(error) },
      { status: 500 }
    );
  }
}