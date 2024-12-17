import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import TaskModel from "@/models/task";
import mongoose from "mongoose";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { internshipId, title, description, deadline, marks, weightage } = body;

    // Assume "createdBy" is determined automatically
    const createdBy = "faculty"; // This value can come dynamically from a session, token, etc.

    // Validate required fields
    if (!internshipId || !title || !description || !deadline || marks == null || weightage == null) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    await connectToDatabase();

    const task = new TaskModel({
      internshipId,
      title,
      description,
      deadline,
      marks,
      weightage,
      createdBy, // Automatically set
    });

    await task.save();

    return NextResponse.json({ message: "Task created successfully!", task }, { status: 201 });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      console.error("Validation error:", error.errors);
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 });
    }

    console.error("Error creating task:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const internshipId = url.searchParams.get("internshipId");

    if (!internshipId) {
      return NextResponse.json({ error: "Internship ID is required." }, { status: 400 });
    }

    // Automatically set "createdBy" context for filtering tasks
    const createdBy = "faculty"; // This can be dynamic depending on who is fetching (e.g., session, token, role).

    await connectToDatabase();

    const tasks = await TaskModel.find({ internshipId, createdBy }).sort({ deadline: 1 });

    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
