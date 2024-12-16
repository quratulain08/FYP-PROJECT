import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import TaskModel from "@/models/task";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { internshipId, title, description, deadline, marks, weightage } = body;

    // Validate required fields
    if (!internshipId || !title || !description || !deadline || marks == null || weightage == null) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    await connectToDatabase();

    // Include the title field when saving
    const task = new TaskModel({ internshipId, title, description, deadline, marks, weightage });
    await task.save();

    return NextResponse.json({ message: "Task created successfully!", task }, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const internshipId = url.searchParams.get("internshipId");

  try {
    if (!internshipId) {
      return NextResponse.json({ error: "Internship ID is required." }, { status: 400 });
    }

    await connectToDatabase();

    const tasks = await TaskModel.find({ internshipId }).sort({ deadline: 1 });
    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
