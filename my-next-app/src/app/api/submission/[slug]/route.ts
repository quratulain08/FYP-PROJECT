import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb"; // DB connection
import SubmissionModel from "@/models/submission"; // Submission model
import { promises as fs } from "fs"; // To save files locally
import mongoose from "mongoose";
import path from "path";

// Directory where uploaded files will be saved
const UPLOAD_DIR = path.join(process.cwd(), "public/uploads");

export async function POST(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const taskId = params.slug;
  try {
    const formData = await req.json();
    console.log(formData)
    const file = formData.file as string | null;
    const studentName = formData.studentName as string | null;


    if (!file || !taskId || !studentName) {
      return NextResponse.json({ error: "File, Task ID, and Student Name are required." }, { status: 400 });
    }


 
    // Save submission to database
    await connectToDatabase();
    const submission = new SubmissionModel({
      taskId,
      studentName,
      fileUrl: file,
    });
    await submission.save();

    return NextResponse.json({ message: "File uploaded successfully!", submission }, { status: 201 });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const taskId = params.slug;
    try {
      if (!taskId) {
        return NextResponse.json({ error: "Task ID is required." }, { status: 400 });
      }
  
      await connectToDatabase();
  
      const submissions = await SubmissionModel.find({ taskId });
  
      return NextResponse.json(submissions, { status: 200 });
    } catch (error) {
      console.error("Error fetching submissions:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }


  export async function PUT( 
    req: Request,
    { params }: { params: { slug: string } }
  ) {
    const id = params.slug;
    const { grade } = await req.json();
  
    // Validate the grade input
    if (typeof grade !== "number" || isNaN(grade)) {
      return NextResponse.json({ error: "Invalid grade" }, { status: 400 });
    }
  
    // Validate the ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid submission ID format" }, { status: 400 });
    }
  
    try {
      // Connect to DB
      await connectToDatabase();
  
      // Find and update the submission
      const updatedSubmission = await SubmissionModel.findByIdAndUpdate(
        id,
        { grade },
        { new: true } // return the updated document
      );
  
      // If submission not found, return an error
      if (!updatedSubmission) {
        console.log("Submission not found for ID:", id);
        return NextResponse.json({ error: "Submission not found" }, { status: 404 });
      }
  
      // Return the updated submission
      return NextResponse.json(updatedSubmission, { status: 200 });
    } catch (error) {
      console.error("Error updating grade:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }