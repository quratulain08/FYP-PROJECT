import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import TaskModel from "@/models/task";
import mongoose from "mongoose";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { internshipId, title, description, deadline, marks, weightage } = body;

    // Dynamically set createdBy based on the logged-in user's role (e.g., faculty or industry)
    const createdBy = "faculty"; // This should be dynamically set (e.g., from session or token)

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
      createdBy, // Automatically set based on the user's role
    });

    await task.save();

    return NextResponse.json({ message: "Task created successfully!", task }, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const internshipId = url.searchParams.get("internshipId");
    const userRole = "faculty"; // Replace this with the actual role from session or token (e.g., faculty, industry)

    if (!internshipId) {
      return NextResponse.json({ error: "Internship ID is required." }, { status: 400 });
    }

    await connectToDatabase();

    // Filter tasks based on internshipId and user role (createdBy field should match the user role)
    const tasks = await TaskModel.find({ internshipId, createdBy: userRole }).sort({ deadline: 1 });

    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
