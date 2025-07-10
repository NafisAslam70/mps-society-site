import { NextResponse } from "next/server";

// In-memory storage for demonstration (replace with a database in production)
let websiteData = {
  hero: { images: [], logo: null },
  about: { image: null },
  recent: { images: [] },
  education: {
    academics: { images: [] },
    sports: { images: [] },
    hostel: { images: [] },
    mosque: { images: [] },
    islamicEducation: { images: [] },
  },
  impact: { image: null },
};

// GET: Retrieve website data
export async function GET() {
  try {
    // In production, fetch from a database (e.g., MongoDB, PostgreSQL)
    return NextResponse.json(websiteData, { status: 200 });
  } catch (error) {
    console.error("GET /api/website-images error:", error);
    return NextResponse.json({ error: "Failed to fetch website data" }, { status: 500 });
  }
}

// PUT: Update website data
export async function PUT(request) {
  try {
    const { id, subId, images, logo } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Missing section ID" }, { status: 400 });
    }

    if (id === "education" && subId) {
      if (!websiteData.education[subId]) {
        return NextResponse.json({ error: "Invalid sub-section ID" }, { status: 400 });
      }
      websiteData.education[subId] = { images: images || [] };
    } else {
      websiteData[id] = {
        ...websiteData[id],
        images: id === "about" || id === "impact" ? images[0] || null : images || [],
        ...(id === "hero" && { logo: logo || null }),
      };
    }

    // In production, save to a database
    return NextResponse.json({ message: "Website data updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("PUT /api/website-images error:", error);
    return NextResponse.json({ error: "Failed to update website data" }, { status: 500 });
  }
}