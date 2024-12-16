import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import TaskModel from "@/models/task";

import mongoose from "mongoose";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { internshipId, title, description, deadline, marks, weightage } = body;

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
    });

    // Attempt to save task
    await task.save();

    return NextResponse.json({ message: "Task created successfully!", task }, { status: 201 });
  } catch (error: unknown) {  // Use 'unknown' type for error
    if (error instanceof mongoose.Error.ValidationError) {
      // If it's a validation error, log all the validation errors
      console.error("Validation error:", error.errors);
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 });
    }

    if (error instanceof Error) {
      // If error is an instance of Error, log the message and stack trace
      console.error("Error creating task:", error.message);
      console.error("Stack trace:", error.stack);
    } else {
      // If error is not an instance of Error, log a generic message
      console.error("Unknown error occurred:", error);
    }

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
