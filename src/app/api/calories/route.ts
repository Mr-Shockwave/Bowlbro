import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const maxDuration = 60;

const MODEL = "gpt-5.4-mini";

const ACCEPTED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]);
const MAX_BYTES = 8 * 1024 * 1024;

const CALORIE_SCHEMA = {
  type: "object",
  properties: {
    is_food: {
      type: "boolean",
      description: "Whether the image actually shows food or a drink",
    },
    dish_name: { type: "string", description: "Best guess at the dish name" },
    total_calories: {
      type: "integer",
      description: "Estimated total calories for the visible portion",
    },
    calorie_range: {
      type: "object",
      properties: {
        low: { type: "integer" },
        high: { type: "integer" },
      },
      required: ["low", "high"],
      additionalProperties: false,
    },
    items: {
      type: "array",
      description: "Component foods visible in the image",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          portion: {
            type: "string",
            description: "Estimated portion size, e.g. '1 cup', '150 g'",
          },
          calories: { type: "integer" },
        },
        required: ["name", "portion", "calories"],
        additionalProperties: false,
      },
    },
    confidence: { type: "string", enum: ["low", "medium", "high"] },
    notes: {
      type: "string",
      description:
        "Short caveats: hidden ingredients, oil, sauces, portion uncertainty",
    },
  },
  required: [
    "is_food",
    "dish_name",
    "total_calories",
    "calorie_range",
    "items",
    "confidence",
    "notes",
  ],
  additionalProperties: false,
} as const;

export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      {
        error:
          "Calorie analysis is not configured. Add OPENAI_API_KEY to .env.local and restart the dev server.",
      },
      { status: 503 }
    );
  }

  const formData = await req.formData();
  const image = formData.get("image");
  if (!(image instanceof File)) {
    return NextResponse.json({ error: "Missing image file" }, { status: 400 });
  }
  if (!ACCEPTED_TYPES.has(image.type)) {
    return NextResponse.json(
      { error: "Unsupported image type. Use JPEG, PNG, GIF, or WebP." },
      { status: 400 }
    );
  }
  if (image.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Image too large. Maximum size is 8 MB." },
      { status: 400 }
    );
  }

  const imageData = Buffer.from(await image.arrayBuffer()).toString("base64");
  const client = new OpenAI();

  try {
    const completion = await client.chat.completions.create({
      model: MODEL,
      max_completion_tokens: 4096,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "calorie_estimate",
          strict: true,
          schema: CALORIE_SCHEMA,
        },
      },
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: `data:${image.type};base64,${imageData}` },
            },
            {
              type: "text",
              text: "Estimate the calories in this dish photo. Identify the dish, break it into visible component foods with portion estimates, and give a total with a realistic low-high range. If the image does not show food or drink, set is_food to false.",
            },
          ],
        },
      ],
    });

    const message = completion.choices[0]?.message;
    if (message?.refusal) {
      return NextResponse.json(
        { error: "The analysis was declined for this image. Try another photo." },
        { status: 422 }
      );
    }
    if (!message?.content) {
      return NextResponse.json(
        { error: "No analysis returned. Try again." },
        { status: 502 }
      );
    }
    return NextResponse.json({ result: JSON.parse(message.content) });
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
        { error: `Analysis failed (${err.status}). Try again.` },
        { status: 502 }
      );
    }
    return NextResponse.json(
      { error: "Analysis failed. Check your connection and try again." },
      { status: 502 }
    );
  }
}
