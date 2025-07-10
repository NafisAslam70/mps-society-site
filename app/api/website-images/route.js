import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { websiteContent } from "@/schema";

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (base64Data) => {
  try {
    const result = await cloudinary.uploader.upload(base64Data, {
      folder: "meed-homepage",
    });
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload image to Cloudinary");
  }
};

export async function GET() {
  try {
    const result = await db.select().from(websiteContent).where({ type: "main" }).execute();
    const data = result[0]?.data || {
      type: "main",
      hero: { images: [], logo: null },
      about: { image: null },
      education: {
        academics: { images: [] },
        islamicEducation: { images: [] },
        sports: { images: [] },
        hostel: { images: [] },
        others: { images: [] },
      },
      video: { videos: [] },
    };
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("GET /api/website-images error:", error);
    return NextResponse.json({ error: "Failed to fetch website data" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { id, subId, images, logo, videos } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Missing section ID" }, { status: 400 });
    }

    const currentData = (await db.select().from(websiteContent).where({ type: "main" }).execute())[0]?.data || {
      type: "main",
      hero: { images: [], logo: null },
      about: { image: null },
      education: {
        academics: { images: [] },
        islamicEducation: { images: [] },
        sports: { images: [] },
        hostel: { images: [] },
        others: { images: [] },
      },
      video: { videos: [] },
    };

    let updatedData = { ...currentData };

    if (id === "education" && subId) {
      if (!updatedData.education[subId]) {
        return NextResponse.json({ error: "Invalid sub-section ID" }, { status: 400 });
      }
      const uploadedImages = images ? await Promise.all(images.filter(img => img).map(uploadToCloudinary)) : [];
      updatedData.education[subId] = { images: uploadedImages };
    } else if (id === "video") {
      updatedData.video = { videos: videos || [] };
    } else {
      const uploadedImages = images ? await Promise.all(images.filter(img => img).map(uploadToCloudinary)) : [];
      const uploadedLogo = logo ? await uploadToCloudinary(logo) : null;
      updatedData[id] = {
        ...updatedData[id],
        images: id === "about" ? uploadedImages[0] || null : uploadedImages,
        ...(id === "hero" && { logo: uploadedLogo }),
      };
    }

    await db
      .insert(websiteContent)
      .values({ id: "singleton", type: "main", data: updatedData, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: [websiteContent.id, websiteContent.type],
        set: { data: updatedData, updatedAt: new Date() },
      })
      .execute();

    return NextResponse.json({ message: "Website data updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("PUT /api/website-images error:", error);
    return NextResponse.json({ error: "Failed to update website data" }, { status: 500 });
  }
}