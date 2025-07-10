import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { projects } from "@/utils/schema";
import { v2 as cloudinary } from "cloudinary";
import { eq, desc } from "drizzle-orm";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(req) {
  console.log("GET request received at:", new Date().toISOString());
  console.log("DATABASE_URL:", process.env.DATABASE_URL);
  console.log("CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME);

  try {
    if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
    const sql = neon(process.env.DATABASE_URL);
    const dbClient = drizzle(sql);

    const url = new URL(req.url);
    const isRecent = url.searchParams.get("recent") === "true";

    let result;
    if (isRecent) {
      // Fetch 3 most recent projects for recent posts
      result = await dbClient
        .select()
        .from(projects)
        .orderBy(desc(projects.createdAt))
        .limit(3)
        .execute();
    } else {
      // Fetch all projects for main project data
      result = await dbClient.select().from(projects).execute();
    }
    console.log("Fetched projects:", result);

    if (!isRecent) {
      const projectData = {
        food: { titleEn: "Food Distribution", titleAr: "توزيع الطعام", descriptionEn: "Providing food to those in need.", descriptionAr: "توفير الطعام للمحتاجين.", projects: [] },
        education: { titleEn: "Education Initiatives", titleAr: "مبادرات التعليم", descriptionEn: "Empowering communities through education.", descriptionAr: "تمكين المجتمعات من خلال التعليم.", projects: [] },
        handpumps: { titleEn: "Handpump Installations", titleAr: "تركيب المضخات اليدوية", descriptionEn: "Ensuring access to clean water.", descriptionAr: "ضمان الوصول إلى المياه النظيفة.", projects: [] },
        wells: { titleEn: "Well Construction", titleAr: "بناء الآبار", descriptionEn: "Building sustainable water sources.", descriptionAr: "بناء مصادر مياه مستدامة.", projects: [] },
        mosques: { titleEn: "Mosque Projects", titleAr: "مشاريع المساجد", descriptionEn: "Supporting places of worship.", descriptionAr: "دعم أماكن العبادة.", projects: [] },
        general: { titleEn: "General Initiatives", titleAr: "مبادرات عامة", descriptionEn: "Diverse community projects.", descriptionAr: "مشاريع مجتمعية متنوعة.", projects: [] },
      };

      result.forEach((project) => {
        if (projectData[project.category]) {
          projectData[project.category].projects.push(project);
        } else {
          console.warn(`Unknown category: ${project.category}`);
        }
      });

      console.log("Returning projectData:", projectData);
      return new Response(JSON.stringify(projectData), { status: 200 });
    }

    console.log("Returning recent posts:", result);
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error("GET error:", error);
    return new Response(JSON.stringify({ error: "Internal server error: " + error.message }), { status: 500 });
  }
}

export async function POST(req) {
  console.log("POST request received at:", new Date().toISOString());
  const newActivity = await req.json();
  console.log("Received activity:", newActivity);

  try {
    if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
    const imageUrls = [];
    for (const [index, image] of newActivity.images.entries()) {
      if (image && image.startsWith("data:image/")) {
        console.log(`Uploading image ${index}:`, image.substring(0, 50) + "...");
        const result = await cloudinary.uploader.upload(image, {
          folder: `projects/${newActivity.category}`,
          public_id: `${Date.now()}_${index}`,
        });
        imageUrls.push(result.secure_url);
        console.log(`Uploaded to ${result.secure_url}`);
      }
    }

    const activityToSave = {
      ...newActivity,
      images: imageUrls.length > 0 ? imageUrls : ["/placeholder.png"],
    };

    const sql = neon(process.env.DATABASE_URL);
    const dbClient = drizzle(sql);
    await dbClient.insert(projects).values(activityToSave).execute();
    console.log("Project saved:", activityToSave);

    return new Response(JSON.stringify({ message: "Project added successfully" }), { status: 201 });
  } catch (error) {
    console.error("POST error:", error);
    return new Response(JSON.stringify({ error: "Internal server error: " + error.message }), { status: 500 });
  }
}

export async function PUT(req) {
  console.log("PUT request received at:", new Date().toISOString());
  const { id, ...updatedActivity } = await req.json();
  console.log("Received update:", { id, updatedActivity });

  try {
    if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");

    const imageUrls = [];
    for (const [index, image] of updatedActivity.images.entries()) {
      if (image && image.startsWith("data:image/")) {
        console.log(`Uploading image ${index}:`, image.substring(0, 50) + "...");
        const result = await cloudinary.uploader.upload(image, {
          folder: `projects/${updatedActivity.category}`,
          public_id: `${Date.now()}_${index}`,
        });
        imageUrls.push(result.secure_url);
        console.log(`Uploaded to ${result.secure_url}`);
      } else if (image) {
        imageUrls.push(image);
      }
    }

    const activityToSave = {
      ...updatedActivity,
      images: imageUrls.length > 0 ? imageUrls : updatedActivity.images,
      createdAt: updatedActivity.createdAt ? new Date(updatedActivity.createdAt) : undefined,
    };

    if (!activityToSave.createdAt) {
      delete activityToSave.createdAt;
    }

    const sql = neon(process.env.DATABASE_URL);
    const dbClient = drizzle(sql);
    const result = await dbClient
      .update(projects)
      .set(activityToSave)
      .where(eq(projects.id, id))
      .returning();

    if (!result.length) throw new Error("No project found with the provided ID");

    console.log("Project updated:", activityToSave);

    return new Response(JSON.stringify({ message: "Project updated successfully" }), { status: 200 });
  } catch (error) {
    console.error("PUT error:", error);
    return new Response(JSON.stringify({ error: "Internal server error: " + error.message }), { status: 500 });
  }
}

export async function DELETE(req) {
  console.log("DELETE request received at:", new Date().toISOString());
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  console.log("Received delete for id:", id);

  try {
    if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");

    const sql = neon(process.env.DATABASE_URL);
    const dbClient = drizzle(sql);

    const project = await dbClient
      .select({ images: projects.images })
      .from(projects)
      .where(eq(projects.id, id))
      .execute();

    if (!project.length) throw new Error("No project found with the provided ID");

    const images = project[0].images || [];
    for (const image of images) {
      if (image && !image.includes("placeholder.png")) {
        const publicId = image.split("/").slice(-2).join("/").split(".")[0];
        console.log(`Deleting Cloudinary image: ${publicId}`);
        await cloudinary.uploader.destroy(publicId);
      }
    }

    const result = await dbClient.delete(projects).where(eq(projects.id, id)).returning();

    if (!result.length) throw new Error("No project found with the provided ID");

    console.log("Project deleted from database:", id);

    return new Response(JSON.stringify({ message: "Project deleted successfully" }), { status: 200 });
  } catch (error) {
    console.error("DELETE error:", error);
    return new Response(JSON.stringify({ error: "Internal server error: " + error.message }), { status: 500 });
  }
}