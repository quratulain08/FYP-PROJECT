import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import University from "@/models/University"; // make sure this exists and is correct

export async function GET(request: Request,
    { params }: { params: { slug: string } }
  ) {
    const name = params.slug;
  try {

    if (!name) {
      return NextResponse.json({ error: "University name is required." }, { status: 400 });
    }

    await connectToDatabase();

    const university = await University.findOne({ name });

    if (!university) {
      return NextResponse.json({ error: "University not found." }, { status: 404 });
    }

    return NextResponse.json({
      id: university._id,
      name: university.name,
    });
  } catch (error) {
    console.error("Error fetching university by name:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
