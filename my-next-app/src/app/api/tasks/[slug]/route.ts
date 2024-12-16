import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb"; // Your DB connection function
import TaskModel from "@/models/task"; // Task Mongoose model

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  const { slug } = params;

  try {
    await connectToDatabase();

    const task = await TaskModel.findById(slug);
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(task, { status: 200 });
  } catch (error) {
    console.error("Error fetching task details:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
