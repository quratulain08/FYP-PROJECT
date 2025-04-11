import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

// GET: Fetch university ID by email
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const email = params.slug;
  try {
   

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectToDatabase();

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ universityId: user.university });
  } catch (error) {
    console.error("Error fetching university ID:", error);
    return NextResponse.json(
      { error: "Failed to fetch university ID." },
      { status: 500 }
    );
  }
}
