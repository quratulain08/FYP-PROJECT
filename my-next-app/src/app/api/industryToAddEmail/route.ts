import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Define the interface for the incoming request data
interface SendEmailRequest {
        id: string
        name: string
        sector: string
        location: string
        contactEmail: string
        employeeCount: string
 }  

// POST: Send email with form submission details
export async function POST(req: Request) {
  try {
    // Parse the incoming JSON request body
    const { id,name, contactEmail, location ,sector,employeeCount}: SendEmailRequest = await req.json();

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
      debug: true, // Output debug information
    });

    // Define email options
    const emailOptions = {
      from: process.env.EMAIL_USER, // Sender address
      to: "recipient@example.com", // Change this to your recipient email
      subject: 'New Form Submission', // Subject line
      text: `Hello,
Add a industry:
      A new form has been submitted with the following details:

      Name: ${name}
      Email: ${contactEmail}
      Location: ${location}
      id:${id}
      sector:${sector}
      employeeCount:${employeeCount}
      Best regards,
      Internship Log`,
    };

    // Send email
    await transporter.sendMail(emailOptions);

    // Respond with a success message
    return NextResponse.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send email' },
      { status: 500 }
    );
  }
}
