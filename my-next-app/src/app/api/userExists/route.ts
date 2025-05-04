import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const universityId = searchParams.get("universityId");
  const role = searchParams.get("role");

  if (!universityId || !role) {
    return NextResponse.json(
      { error: "universityId and role query parameters are required" },
      { status: 400 }
    );
  }

  // Check existence
  const exists = await User.exists({
    university: universityId,
    role: role,
  });

  return NextResponse.json({ exists: Boolean(exists) });
}
