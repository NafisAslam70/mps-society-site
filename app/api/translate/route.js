import { NextResponse } from "next/server";
import * as deepl from "deepl-node";

const translator = new deepl.Translator(process.env.DEEPL_API_KEY);

export async function POST(req) {
  try {
    const { text, sourceLang, targetLang } = await req.json();
    
    if (!text || !text.title || !text.snippet || !sourceLang || !targetLang) {
      return NextResponse.json({ success: false, error: "Invalid input: Missing title, snippet, or languages" }, { status: 400 });
    }

    // Map 'en' to 'en-US' for DeepL compatibility
    const adjustedTargetLang = targetLang === "en" ? "en-US" : targetLang;

    try {
      const titleRes = await translator.translateText(text.title, sourceLang, adjustedTargetLang);
      const snippetRes = await translator.translateText(text.snippet, sourceLang, adjustedTargetLang);

      return NextResponse.json({
        success: true,
        translated: {
          title: titleRes.text,
          snippet: snippetRes.text,
        },
      });
    } catch (error) {
      console.error("DeepL translation error:", error);
      return NextResponse.json({ success: false, error: `Translation failed: ${error.message}` }, { status: 500 });
    }
  } catch (error) {
    console.error("Request parsing error:", error);
    return NextResponse.json({ success: false, error: "Invalid request: Malformed JSON or missing fields" }, { status: 400 });
  }
}