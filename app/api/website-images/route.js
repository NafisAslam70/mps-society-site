import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { websiteContent } from "@/utils/schema";
import { eq } from "drizzle-orm";

// Initialize Neon and Drizzle
let sql;
try {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set in environment variables");
  }
  sql = neon(process.env.DATABASE_URL);
} catch (error) {
  console.error("Failed to initialize Neon database:", error.message, error.stack);
  throw new Error(`Database connection initialization failed: ${error.message}`);
}
const db = drizzle(sql);

// Configure Cloudinary
try {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error("Cloudinary environment variables are missing");
  }
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
} catch (error) {
  console.error("Failed to configure Cloudinary:", error.message, error.stack);
  throw new Error(`Cloudinary configuration failed: ${error.message}`);
}

const uploadToCloudinary = async (base64Data, folder, attempt = 1, maxAttempts = 3) => {
  try {
    const result = await cloudinary.uploader.upload(base64Data, {
      folder: folder || "meed-homepage", // Default to meed-homepage if folder is not provided
      timeout: 10000,
    });
    console.log("Cloudinary upload success:", result.secure_url);
    return result.secure_url;
  } catch (error) {
    console.error(`Cloudinary upload attempt ${attempt} failed for folder ${folder}:`, error.message, error.stack);
    if (attempt < maxAttempts) {
      console.log(`Retrying Cloudinary upload (attempt ${attempt + 1})...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return uploadToCloudinary(base64Data, folder, attempt + 1, maxAttempts);
    }
    throw new Error(`Failed to upload image to Cloudinary after ${maxAttempts} attempts: ${error.message}`);
  }
};

const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId, { invalidate: true });
    console.log("Cloudinary delete success for public ID:", publicId);
  } catch (error) {
    console.error("Cloudinary delete failed for public ID:", publicId, error.message, error.stack);
    // Log failure but continue; deletion is best-effort
  }
};

const extractPublicId = (url) => {
  if (!url) return null;
  const parts = url.split("/");
  const publicId = parts.pop().split(".")[0]; // Extract public ID before file extension
  return `${parts.slice(-2).join("/")}/${publicId}`; // Include folder in public ID
};

export async function GET() {
  try {
    console.log("Fetching website content from database...");
    const result = await db.select().from(websiteContent).where(eq(websiteContent.id, "singleton")).execute();
    console.log("Database query result for singleton:", result);
    const data = result[0]?.data || {
      mainPage: {
        hero: { images: [], logo: null },
        about: { images: [] },
        education: {
          academics: { images: [] },
          islamicEducation: { images: [] },
          sports: { images: [] },
          hostel: { images: [] },
          others: { images: [] },
        },
        video: { videos: [] },
      },
    };
    console.log("Returning data:", data);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("GET /api/website-images error:", error.message, error.stack);
    return NextResponse.json({ error: `Failed to fetch website data: ${error.message}` }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    console.log("Processing PUT request for /api/website-images...");
    const { pageId = "mainPage", sectionId, subId, images, logo, videos } = await request.json();
    console.log("Request payload:", { pageId, sectionId, subId, images, logo, videos });

    if (pageId !== "mainPage") {
      console.warn("Invalid pageId received:", pageId);
      return NextResponse.json({ error: "Only mainPage is supported currently" }, { status: 400 });
    }

    if (!sectionId) {
      console.warn("Missing sectionId in request");
      return NextResponse.json({ error: "Missing section ID" }, { status: 400 });
    }

    console.log("Fetching current website content from database...");
    const currentData = (await db.select().from(websiteContent).where(eq(websiteContent.id, "singleton")).execute())[0]?.data || {
      mainPage: {
        hero: { images: [], logo: null },
        about: { images: [] },
        education: {
          academics: { images: [] },
          islamicEducation: { images: [] },
          sports: { images: [] },
          hostel: { images: [] },
          others: { images: [] },
        },
        video: { videos: [] },
      },
    };
    console.log("Current database data:", currentData);

    let updatedData = { ...currentData };

    // Identify and delete old Cloudinary resources only from meed-homepage
    const deleteOldResources = async (oldImages, oldLogo) => {
      const oldPublicIds = (oldImages || []).map(extractPublicId).filter(id => id && id.startsWith("meed-homepage/"));
      if (oldLogo) {
        const logoPublicId = extractPublicId(oldLogo);
        if (logoPublicId && logoPublicId.startsWith("meed-homepage/")) oldPublicIds.push(logoPublicId);
      }
      if (oldPublicIds.length > 0) {
        console.log("Deleting old Cloudinary resources from meed-homepage:", oldPublicIds);
        await Promise.allSettled(oldPublicIds.map(publicId => deleteFromCloudinary(publicId)));
      } else {
        console.log("No old Cloudinary resources to delete from meed-homepage.");
      }
    };

    if (sectionId === "education" && subId) {
      if (!updatedData.mainPage.education[subId]) {
        console.warn("Invalid education sub-section ID:", subId);
        return NextResponse.json({ error: `Invalid sub-section ID: ${subId}` }, { status: 400 });
      }
      const oldImages = updatedData.mainPage.education[subId].images || [];
      await deleteOldResources(oldImages, null);
      console.log("Uploading images to Cloudinary for education section:", subId);
      const uploadedImages = Array.isArray(images) ? await Promise.all(images.filter(img => img && img.startsWith("data:")).map(img => uploadToCloudinary(img, `meed-homepage/education/${subId}`))) : [];
      updatedData.mainPage.education[subId] = { images: uploadedImages.length > 0 ? uploadedImages : (images || []) };
    } else if (sectionId === "video") {
      console.log("Updating video section with videos:", videos);
      await deleteOldResources([], null); // No images to delete for video
      updatedData.mainPage.video = { videos: videos || [] };
    } else {
      const oldImages = updatedData.mainPage[sectionId]?.images || [];
      const oldLogo = updatedData.mainPage[sectionId]?.logo;
      await deleteOldResources(oldImages, oldLogo);
      console.log("Uploading images to Cloudinary for section:", sectionId);
      const uploadedImages = Array.isArray(images) ? await Promise.all(images.filter(img => img && img.startsWith("data:")).map(img => uploadToCloudinary(img, `meed-homepage/${sectionId}`))) : [];
      const uploadedLogo = logo && logo.startsWith("data:") ? await uploadToCloudinary(logo, `meed-homepage/${sectionId}`) : logo;
      updatedData.mainPage[sectionId] = {
        ...updatedData.mainPage[sectionId],
        images: uploadedImages.length > 0 ? uploadedImages : (images || []),
        ...(sectionId === "hero" && { logo: uploadedLogo }),
      };
    }

    console.log("Saving updated data to database:", updatedData);
    await db
      .insert(websiteContent)
      .values({ id: "singleton", data: updatedData, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: websiteContent.id,
        set: { data: updatedData, updatedAt: new Date() },
      })
      .execute();

    console.log("Website data updated successfully");
    return NextResponse.json({ message: "Website data updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("PUT /api/website-images error:", error.message, error.stack);
    return NextResponse.json({ error: `Failed to update website data: ${error.message}` }, { status: 500 });
  }
}