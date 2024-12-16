import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import connectToDatabase from '@/lib/mongodb'; // Adjust the path as necessary

// Define the interface for the incoming request data
interface SendEmailRequest {
  focalPersonEmail: string;
  focalPersonPassword: string;
}

// POST: Send emails for Coordinator and Focal Person registration
export async function POST(req: Request) {
  try {
    // Parse the incoming JSON request body
    const { focalPersonPassword, focalPersonEmail}: SendEmailRequest = await req.json();

    // Connect to the database (if needed)
    await connectToDatabase();

    // Create a transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      service: 'gmail', // You can use other email services like SendGrid or AWS SES
      auth: {
        user: process.env.EMAIL_USER, // Use your email address
        pass: process.env.EMAIL_PASS, // Use your email password or app password
      },
    });

    // Define email options
    const emailOptions = {
      from: process.env.EMAIL_USER, // Sender address
      to: `${focalPersonEmail}`, // List of receivers
      subject: 'Registration Successful', // Subject line
      text: `Hello,

      Your account has been successfully registered as follows:

      Focalperson:
      Email: ${focalPersonEmail}
      Password: ${focalPersonPassword}

      Please login to the platform to get started.

      Best regards,
      Internship Log`,
    };

    // Send email
    await transporter.sendMail(emailOptions);

    // Respond with a success message
    return NextResponse.json({ message: 'Emails sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send emails' }, { status: 500 });
  }
}
