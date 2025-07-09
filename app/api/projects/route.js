import { drizzle } from "drizzle-orm/neon-http";
    import { neon } from "@neondatabase/serverless";
    import { projects } from "@/utils/schema";
    import { v2 as cloudinary } from "cloudinary";

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    export async function GET(req) {
      console.log("GET request received");
      console.log("DATABASE_URL:", process.env.DATABASE_URL);
      console.log("CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME);

      try {
        if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
        const sql = neon(process.env.DATABASE_URL);
        const dbClient = drizzle(sql);
        const result = await dbClient.select().from(projects).execute();
        console.log("Fetched projects:", result);

        const projectData = {
          food: { titleEn: "Food Distribution", titleAr: "توزيع الطعام", projects: [] },
          education: { titleEn: "Education Initiatives", titleAr: "مبادرات التعليم", projects: [] },
          handpumps: { titleEn: "Handpump Installations", titleAr: "تركيب المضخات اليدوية", projects: [] },
          wells: { titleEn: "Well Construction", titleAr: "بناء الآبار", projects: [] },
          mosques: { titleEn: "Mosque Projects", titleAr: "مشاريع المساجد", projects: [] },
          general: { titleEn: "General Initiatives", titleAr: "مبادرات عامة", projects: [] },
        };

        result.forEach((project) => {
          projectData[project.category].projects.push(project);
        });

        return new Response(JSON.stringify(projectData), { status: 200 });
      } catch (error) {
        console.error("GET error:", error);
        return new Response(JSON.stringify({ error: "Internal server error: " + error.message }), { status: 500 });
      }
    }

    export async function POST(req) {
      console.log("POST request received");
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