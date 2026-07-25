import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const maxDuration = 120;

const MODEL = "gpt-image-1-mini";

export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      {
        error:
          "Image generation is not configured. Add OPENAI_API_KEY to .env.local and restart the dev server.",
      },
      { status: 503 }
    );
  }

  let name: unknown, description: unknown;
  try {
    ({ name, description } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  if (
    typeof name !== "string" ||
    name.length === 0 ||
    name.length > 100 ||
    typeof description !== "string" ||
    description.length > 500
  ) {
    return NextResponse.json(
      { error: "Missing or invalid dish name/description" },
      { status: 400 }
    );
  }

  const client = new OpenAI();

  try {
    const result = await client.images.generate({
      model: MODEL,
      prompt: `Professional food photography of "${name}": ${description}. Plated in a modern casual restaurant style, overhead 45-degree angle, warm natural lighting, appetizing, shallow depth of field. No text, no people, no hands.`,
      size: "1024x1024",
      quality: "low",
      output_format: "webp",
      output_compression: 75,
    });

    const b64 = result.data?.[0]?.b64_json;
    if (!b64) {
      return NextResponse.json(
        { error: "No image returned. Try again." },
        { status: 502 }
      );
    }
    return NextResponse.json({ image: `data:image/webp;base64,${b64}` });
  } catch (err) {
    if (err instanceof OpenAI.AuthenticationError) {
      return NextResponse.json(
        { error: "Invalid OPENAI_API_KEY. Check the key in .env.local." },
        { status: 503 }
      );
    }
    if (err instanceof OpenAI.RateLimitError) {
      return NextResponse.json(
        { error: "Rate limited. Wait a moment and try again." },
        { status: 429 }
      );
    }
    if (err instanceof OpenAI.APIError) {
      return NextResponse.json(
        { error: `Image generation failed (${err.status}). Try again.` },
        { status: 502 }
      );
    }
    return NextResponse.json(
      { error: "Image generation failed. Try again." },
      { status: 502 }
    );
  }
}
