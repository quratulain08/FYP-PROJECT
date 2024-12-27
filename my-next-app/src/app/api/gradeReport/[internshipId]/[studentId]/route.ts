import { NextResponse } from "next/server";
import { Types } from "mongoose";
import Task from "@/models/task";
import Submission from "@/models/submission";
import connectToDatabase from "@/lib/mongodb";

// Utility to check if a string is a valid MongoDB ObjectId
const isValidObjectId = (id: string) => Types.ObjectId.isValid(id);

// GET - Fetch all tasks and submissions for a student
export async function GET(
  request: Request,
  { params }: { params: { internshipId: string; studentId: string } }
) {
  const { internshipId, studentId } = params;

  if (!isValidObjectId(internshipId) || !isValidObjectId(studentId)) {
    return NextResponse.json(
      { message: "Invalid internship or student ID" },
      { status: 400 }
    );
  }

  try {
    await connectToDatabase();

    const tasks = await Task.find({ internshipId }).lean();
    const submissions = await Submission.find({ studentId }).lean();

    const result = tasks.map((task) => {
        const submission = submissions.find(
          (sub) =>(sub.taskId as string) === (task._id as string)
        );
      
        return {
          taskTitle: task.title,
          totalMarks: task.marks,
          obtainedMarks: submission ? submission.grade : "Not Submitted",
        };
      });
 

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Add a new submission
export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const { taskId, studentId, studentName, fileUrl, grade } = await request.json();

    if (!taskId || !studentId || !studentName || !fileUrl) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const newSubmission = await Submission.create({
      taskId,
      studentId,
      studentName,
      fileUrl,
      grade,
    });

    return NextResponse.json(newSubmission, { status: 201 });
  } catch (error) {
    console.error("Error creating submission:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update a submission by ID
export async function PUT(
  request: Request,
  { params }: { params: { submissionId: string } }
) {
  const { submissionId } = params;

  if (!isValidObjectId(submissionId)) {
    return NextResponse.json(
      { message: "Invalid submission ID" },
      { status: 400 }
    );
  }

  try {
    await connectToDatabase();
    const { grade } = await request.json();

    if (grade === undefined) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const updatedSubmission = await Submission.findByIdAndUpdate(
      submissionId,
      { grade },
      { new: true, runValidators: true }
    );

    if (!updatedSubmission) {
      return NextResponse.json(
        { message: "Submission not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedSubmission);
  } catch (error) {
    console.error("Error updating submission:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Remove a submission by ID
export async function DELETE(
  request: Request,
  { params }: { params: { submissionId: string } }
) {
  const { submissionId } = params;

  if (!isValidObjectId(submissionId)) {
    return NextResponse.json(
      { message: "Invalid submission ID" },
      { status: 400 }
    );
  }

  try {
    await connectToDatabase();

    const deletedSubmission = await Submission.findByIdAndDelete(submissionId);

    if (!deletedSubmission) {
      return NextResponse.json(
        { message: "Submission not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Submission deleted successfully",
      deletedSubmission,
    });
  } catch (error) {
    console.error("Error deleting submission:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
