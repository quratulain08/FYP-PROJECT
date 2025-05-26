import { NextResponse } from 'next/server';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer
const storage = multer.memoryStorage();
// const upload = multer({ storage });

// Helper function to upload to Cloudinary
const uploadToCloudinary = (fileBuffer: Buffer) => {
  return new Promise<string>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: 'raw' }, // Use 'raw' for non-image files like PDFs
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );
    uploadStream.end(fileBuffer);
  });
};

// API Route handler
export async function POST(req: Request) {
  try {
    // Parse the incoming form data
    const formData = await req.formData();
    const file = formData.get('pdfStudent') as Blob;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' });
    }

    // Convert Blob to Buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Upload the file to Cloudinary
    const fileUrl = await uploadToCloudinary(fileBuffer);

    return NextResponse.json({ message: 'File uploaded successfully', fileUrl });
  } catch (error) {
    console.error('Error during file upload:', error);
    return NextResponse.json({ error: 'File upload failed', details: error.message });
  }
}
