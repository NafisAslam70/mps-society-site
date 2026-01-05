import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { projects } from "@/utils/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(req) {
  console.log("GET request received at:", new Date().toISOString());
  console.log("DATABASE_URL:", process.env.DATABASE_URL ? "Set" : "Not set");

  try {
    if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
    const sql = neon(process.env.DATABASE_URL);
    const dbClient = drizzle(sql);

    const url = new URL(req.url);
    const isRecent = url.searchParams.get("recent") === "true";
    const limit = parseInt(url.searchParams.get("limit") || "3", 10);

    let result;
    if (isRecent) {
      result = await dbClient
        .select()
        .from(projects)
        .orderBy(desc(projects.createdAt))
        .limit(limit)
        .execute();
    } else {
      result = await dbClient.select().from(projects).execute();
    }
    console.log("Fetched projects:", result);

    if (!isRecent) {
      const projectData = {
        food: { titleEn: "Food Distribution", titleAr: "توزيع الطعام", descriptionEn: "Providing food to those in need.", descriptionAr: "توفير الطعام للمحتاجين.", projects: [] },
        ramadan: { titleEn: "Ramadan Distributions", titleAr: "توزيعات رمضان", descriptionEn: "Delivering Ramadan-specific aid and meals.", descriptionAr: "تقديم المساعدات والوجبات الخاصة برمضان.", projects: [] },
        waterTanks: { titleEn: "Water Tanks", titleAr: "خزانات المياه", descriptionEn: "Supplying clean water through storage solutions.", descriptionAr: "توفير المياه النظيفة عبر الخزانات.", projects: [] },
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
    console.error("GET error:", error.message, error.stack);
    return new Response(JSON.stringify({ error: "Internal server error: " + error.message }), { status: 500 });
  }
}

export async function POST(req) {
  console.log("POST request received at:", new Date().toISOString());
  const newActivity = await req.json();
  console.log("Received activity:", newActivity);

  try {
    // Validate environment variables
    if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");

    // Validate input
    if (!newActivity.category || !newActivity.titleEn || !newActivity.titleAr || !newActivity.date || !newActivity.venue || !newActivity.snippetEn || !newActivity.snippetAr) {
      throw new Error("Missing required fields in activity data");
    }

    // Validate images (expect Cloudinary URLs or placeholder)
    const imageUrls = newActivity.images.filter(img => img && !img.startsWith("data:image/"));
    if (imageUrls.length === 0) {
      imageUrls.push("/placeholder.png");
    }

    const activityToSave = {
      ...newActivity,
      images: imageUrls,
      createdAt: new Date(),
    };

    const sql = neon(process.env.DATABASE_URL);
    const dbClient = drizzle(sql);
    const result = await dbClient.insert(projects).values(activityToSave).returning();

    if (!result.length) throw new Error("Failed to insert project into database");

    console.log("Project saved:", result[0]);

    return new Response(JSON.stringify({ message: "Project added successfully", project: result[0] }), { status: 201 });
  } catch (error) {
    console.error("POST error:", error.message, error.stack);
    return new Response(JSON.stringify({ error: "Failed to save project: " + error.message }), { status: 500 });
  }
}

export async function PUT(req) {
  console.log("PUT request received at:", new Date().toISOString());
  const { id, ...updatedActivity } = await req.json();
  console.log("Received update:", { id, updatedActivity });

  try {
    if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
    if (!process.env.CLOUDINARY_CLOUD_NAME) throw new Error("CLOUDINARY_CLOUD_NAME is not set");

    const sql = neon(process.env.DATABASE_URL);
    const dbClient = drizzle(sql);

    const existingProject = await dbClient
      .select({ images: projects.images, category: projects.category })
      .from(projects)
      .where(eq(projects.id, id))
      .execute();

    if (!existingProject.length) throw new Error("No project found with the provided ID");

    const currentImages = existingProject[0].images || [];
    const currentCategory = existingProject[0].category;
    const newImages = updatedActivity.images || [];

    const imagesToDelete = currentImages.filter(
      (image) => image && !image.includes("placeholder.png") && !newImages.includes(image)
    );

    const { v2: cloudinary } = require("cloudinary");
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    for (const image of imagesToDelete) {
      try {
        const publicId = `projects/${currentCategory}/${image.split("/").pop().replace(/\.[^/.]+$/, "")}`;
        console.log(`Deleting Cloudinary image: ${publicId} (from URL: ${image})`);
        const result = await cloudinary.uploader.destroy(publicId);
        console.log(`Cloudinary deletion result for ${publicId}:`, result);
      } catch (err) {
        console.error(`Failed to delete Cloudinary image ${image}:`, err.message);
      }
    }

    const imageUrls = newImages.filter(img => img && !img.startsWith("data:image/"));
    if (imageUrls.length === 0) {
      imageUrls.push("/placeholder.png");
    }

    const activityToSave = {
      ...updatedActivity,
      images: imageUrls,
      createdAt: updatedActivity.createdAt ? new Date(updatedActivity.createdAt) : undefined,
    };

    if (!activityToSave.createdAt) {
      delete activityToSave.createdAt;
    }

    const result = await dbClient
      .update(projects)
      .set(activityToSave)
      .where(eq(projects.id, id))
      .returning();

    if (!result.length) throw new Error("No project found with the provided ID");

    console.log("Project updated:", result[0]);

    return new Response(JSON.stringify({ message: "Project updated successfully", project: result[0] }), { status: 200 });
  } catch (error) {
    console.error("PUT error:", error.message, error.stack);
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
      .select({ images: projects.images, category: projects.category })
      .from(projects)
      .where(eq(projects.id, id))
      .execute();

    if (!project.length) throw new Error("No project found with the provided ID");

    const images = project[0].images || [];
    const category = project[0].category;

    const { v2: cloudinary } = require("cloudinary");
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    for (const image of images) {
      if (image && !image.includes("placeholder.png")) {
        try {
          const publicId = `projects/${category}/${image.split("/").pop().replace(/\.[^/.]+$/, "")}`;
          console.log(`Deleting Cloudinary image: ${publicId} (from URL: ${image})`);
          const result = await cloudinary.uploader.destroy(publicId);
          console.log(`Cloudinary deletion result for ${publicId}:`, result);
        } catch (err) {
          console.error(`Failed to delete Cloudinary image ${image}:`, err.message);
        }
      }
    }

    const result = await dbClient.delete(projects).where(eq(projects.id, id)).returning();

    if (!result.length) throw new Error("No project found with the provided ID");

    console.log("Project deleted from database:", id);

    return new Response(JSON.stringify({ message: "Project deleted successfully" }), { status: 200 });
  } catch (error) {
    console.error("DELETE error:", error.message, error.stack);
    return new Response(JSON.stringify({ error: "Internal server error: " + error.message }), { status: 500 });
  }
}
