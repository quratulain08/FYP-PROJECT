import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb'; // Adjust the path as necessary
import User from '@/models/User'; // Adjust the path as necessary
import bcrypt from 'bcryptjs'; // Make sure to install bcryptjs for password hashing
import jwt from 'jsonwebtoken'; // Make sure to install jsonwebtoken for token generation

// POST: Authenticate user
export async function POST(req: Request) {
  try {
    const { email, password } = await req.json(); // Get email and password from the request body
    await connectToDatabase(); // Ensure the database is connected
    console.log(email); // Log the email for debugging

    // Find user by email
    console.log(email);
    const user = await User.findOne({ email });
    if (!user) {
        console.log(user);
      return NextResponse.json({ error: 'Invalid email' }, { status: 401 });
    }

    // Compare password with hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    // Generate a token (customize the secret and expiration as needed)
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: '1h',
    });

    // Respond with the token and user details (omit password)
    const { password: _, ...userDetails } = user.toObject();
    return NextResponse.json({ token, user: userDetails });
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json({ error: 'Login failed. Please try again.' }, { status: 500 });
  }
}
