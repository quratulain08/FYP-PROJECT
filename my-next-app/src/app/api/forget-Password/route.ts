import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

// POST: Handle forgot password
export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    await connectToDatabase();

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate a temporary reset token (valid for 15 mins)
    const resetToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "15m" }
    );

    // Create password reset link
    const resetLink = `http://localhost:3001/Login/reset-password?token=${resetToken}`;

    // Configure Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    

    // Send the email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      html: `
        <h1>Password Reset Request</h1>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}" target="_blank">${resetLink}</a>
        <p>This link is valid for 15 minutes.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Password reset link sent to email" });
  } catch (error) {
    console.error("Error handling forgot password:", error);
    return NextResponse.json(
      { error: "Failed to process forgot password" },
      { status: 500 }
    );
  }
}
