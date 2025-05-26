import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb'; // Adjust the path as necessary
import User from '@/models/User'; // Adjust the path as necessary
import bcrypt from 'bcryptjs'; // Ensure bcryptjs is installed
import jwt from 'jsonwebtoken'; // Ensure jsonwebtoken is installed

// POST: Authenticate user
export async function POST(req: Request) {
  try {
    const { email, password } = await req.json(); // Extract email and password from the request body
    await connectToDatabase(); // Connect to the database

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 401 });
    }

    // Validate the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    // Generate a token
    const token = jwt.sign(
      { userId: user._id, role: user.role }, // Include role in the token payload
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    // Send response with token and user details (excluding sensitive fields)
    const { password: userDetails } = user.toObject(); // Omit the password from the response
    return NextResponse.json({ 
      token, 
      user: {
        ...userDetails,
        role: user.role, // Explicitly include role in the response
      } 
    });
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json({ error: 'Login failed. Please try again.' }, { status: 500 });
  }
}
