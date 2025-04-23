import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import connectToDatabase from '@/lib/mongodb';

// Define the interface for the incoming request data
interface SendEmailRequest {
  Email: string;
  Password: string;
}

// POST: Send emails for Coordinator and Focal Person registration
export async function POST(req: Request) {
  try {
    // Parse the incoming JSON request body
    const { Email, Password }: SendEmailRequest = await req.json();

    // Connect to the database (if needed)
    await connectToDatabase();

    // Create a transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      logger: true, // Enable logging
      debug: true,  // Output debug information
    });

    // Define email options
    const emailOptions = {
      from: process.env.EMAIL_USER, // Sender address
      to: Email, // FIXED: Correctly assign the recipient
      subject: 'Registration Successful',
      text: `Hello,\n\nYour account has been successfully registered as follows:\n\nIndustry:\nEmail: ${Email}\nPassword: ${Password}\n\nPlease login to the platform to get started.\n\nBest regards,\nInternship Log`,
    };

    // Send email
    await transporter.sendMail(emailOptions);

    // Respond with a success message
    return NextResponse.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: error.message || 'Failed to send email' }, { status: 500 });
  }
}