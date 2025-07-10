 import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const category = formData.get("category") || "general";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (!process.env.CLOUDINARY_CLOUD_NAME) throw new Error("CLOUDINARY_CLOUD_NAME is not set");
    if (!process.env.CLOUDINARY_API_KEY) throw new Error("CLOUDINARY_API_KEY is not set");
    if (!process.env.CLOUDINARY_API_SECRET) throw new Error("CLOUDINARY_API_SECRET is not set");

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `projects/${category}`,
          public_id: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    console.log(`Uploaded to ${result.secure_url}, public_id: ${result.public_id}`);
    return NextResponse.json({ secure_url: result.secure_url }, { status: 200 });
  } catch (error) {
    console.error("Image upload error:", error.message, error.stack);
    return NextResponse.json({ error: `Failed to upload image: ${error.message}` }, { status: 500 });
  }
}