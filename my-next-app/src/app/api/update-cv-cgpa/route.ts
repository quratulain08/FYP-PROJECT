import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import mongoose from 'mongoose'
import Student from '@/models/Student' // Update this path to your actual Student model

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Upload PDF buffer to Cloudinary
const uploadToCloudinary = (fileBuffer: Buffer) => {
  return new Promise<string>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: 'raw' },
      (error, result) => {
        if (error) return reject(error)
        if (!result?.secure_url) return reject(new Error('No URL returned from Cloudinary'))
        resolve(result.secure_url)
      }
    )
    uploadStream.end(fileBuffer)
  })
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('cv') as Blob
    const email = formData.get('email') as string
    const cgpa = formData.get('cgpa') as string

    if (!email || !cgpa) {
      return NextResponse.json({ error: 'Email and CGPA are required' }, { status: 400 })
    }

    if (!file) {
      return NextResponse.json({ error: 'No CV file provided' }, { status: 400 })
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer())
    const fileUrl = await uploadToCloudinary(fileBuffer)

    // Connect to DB if not already
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI!)
    }

    // Update student record
    const updated = await Student.findOneAndUpdate(
  { email },
  { $set: { cv: fileUrl, cgpa } },
  { new: true, upsert: true }
)

    if (!updated) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    return NextResponse.json({
      message: 'CV and CGPA updated successfully',
      student: {
        email: updated.email,
        cgpa: updated.cgpa,
        cvUrl: updated.cv,
      },
    })
  } catch (error: any) {
    console.error('Error in updating CV & CGPA:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
