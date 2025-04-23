

import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Industry from "@/models/Industry"; // make sure this exists and is correct

export async function GET(request: Request,
    { params }: { params: { slug: string } }
  ) {
    const name = params.slug;
  try {

    if (!name) {
      return NextResponse.json({ error: "Industry name is required." }, { status: 400 });
    }

    await connectToDatabase();

    const industry = await Industry.findOne({ name });

    if (!industry) {
      return NextResponse.json({ error: "Industry not found." }, { status: 404 });
    }

    return NextResponse.json({
      id: industry._id,
      name: industry.name,
    });
  } catch (error) {
    console.error("Error fetching industry by name:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
