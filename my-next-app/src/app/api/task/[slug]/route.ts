import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Task from "@/models/task";

// GET: Fetch task by ID
export async function GET(req: Request, { params }: { params: { slug: string } }) {
    const taskId = params.slug;
  
    try {
    

    if (!taskId) {
      return NextResponse.json({ error: "Task ID is required." }, { status: 400 });
    }

    await connectToDatabase();

    const task = await Task.findById(taskId);

    if (!task) {
      return NextResponse.json({ error: "No task found with this ID." }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error("Error fetching task:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

// POST: Create a new task
export async function POST(req: Request) {
  try {
    const {
      internshipId,
      title,
      description,
      deadline,
      marks,
      time,
      weightage,
      createdBy,
    } = await req.json();

    if (!internshipId || !title || !description || !deadline || !marks || !weightage || !createdBy) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    await connectToDatabase();

    const newTask = new Task({
      internshipId,
      title,
      description,
      deadline,
      marks,
      time,
      weightage,
      createdBy,
    });

    await newTask.save();

    return NextResponse.json(
      { message: "Task created successfully", task: newTask },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json({ error: "Failed to create task." }, { status: 500 });
  }
}

// PUT: Update an existing task by ID
export async function PUT(req: Request) {
  try {
    const { id, ...updateData } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Task ID is required." }, { status: 400 });
    }

    await connectToDatabase();

    const updatedTask = await Task.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedTask) {
      return NextResponse.json({ error: "Task not found." }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Task updated successfully", task: updatedTask }
    );
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json({ error: "Failed to update task." }, { status: 500 });
  }
}

// DELETE: Remove a task by ID
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Task ID is required." }, { status: 400 });
    }

    await connectToDatabase();

    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return NextResponse.json({ error: "Task not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json({ error: "Failed to delete task." }, { status: 500 });
  }
}
