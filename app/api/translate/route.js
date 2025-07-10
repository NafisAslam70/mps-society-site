import { NextResponse } from "next/server";
  import translate from "google-translate-api"; // Install: npm install google-translate-api

  export async function POST(req) {
    const { text, targetLang } = await req.json();
    try {
      const res = await translate(text, { to: targetLang === "ar" ? "ar" : "en" });
      return NextResponse.json({ translatedText: res.text });
    } catch (error) {
      console.error("Translation error:", error);
      return NextResponse.json({ error: "Translation failed" }, { status: 500 });
    }
  }