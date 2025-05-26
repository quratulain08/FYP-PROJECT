import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Batch from "@/models/Batch";

// GET: Fetch all batches
export async function GET() {
  try {
    await connectToDatabase();
    const batches = await Batch.find();
    return NextResponse.json(batches);
  } catch (error) {
    console.error("Error fetching batches:", error);
    return NextResponse.json({ error: "Failed to fetch batches" }, { status: 500 });
  }
}

// POST: Create a new batch
export async function POST(req: Request) {
    try {
      const { batchName, departmentId } = await req.json();
  
      // Log the incoming request data
      console.log("Incoming request data:", { batchName, departmentId });
  
      if (!batchName || !departmentId) {
        console.error("Missing required fields: batchName or departmentId");
        return NextResponse.json(
          { error: "Batch name and department ID are required." },
          { status: 400 }
        );
      }
  
      // Log the database connection attempt
      console.log("Connecting to database...");
      await connectToDatabase();
      console.log("Database connected successfully");
  
      const newBatch = new Batch({ batchName, departmentId });
  
      // Log the batch data before saving
      console.log("New batch to save:", newBatch);
  
      await newBatch.save();
  
      console.log("Batch created successfully:", newBatch);
  
      return NextResponse.json(
        { message: "Batch created successfully", batch: newBatch },
        { status: 201 }
      );
    } catch (error) {
      console.error("Error creating batch:", error);
  
      // Log more details about the error
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      } else {
        console.error("Unknown error:", error);
      }
  
      return NextResponse.json(
        { error: "Failed to create batch" },
        { status: 500 }
      );
    }
  }
  

// PUT: Update an existing batch by ID
export async function PUT(req: Request) {
  try {
    const { id, batchName, departmentId } = await req.json();

    if (!id || !batchName || !departmentId) {
      return NextResponse.json(
        { error: "Batch ID, name, and department ID are required." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const updatedBatch = await Batch.findByIdAndUpdate(
      id,
      { batchName, departmentId },
      { new: true }
    );

    if (!updatedBatch) {
      return NextResponse.json({ error: "Batch not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "Batch updated successfully", batch: updatedBatch });
  } catch (error) {
    console.error("Error updating batch:", error);
    return NextResponse.json(
      { error: "Failed to update batch" },
      { status: 500 }
    );
  }
}

// DELETE: Remove a batch by ID
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Batch ID is required." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const deletedBatch = await Batch.findByIdAndDelete(id);

    if (!deletedBatch) {
      return NextResponse.json({ error: "Batch not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "Batch deleted successfully" });
  } catch (error) {
    console.error("Error deleting batch:", error);
    return NextResponse.json(
      { error: "Failed to delete batch" },
      { status: 500 }
    );
  }
}
