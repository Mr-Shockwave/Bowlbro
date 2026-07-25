import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const maxDuration = 120;

const MODEL = "gpt-5.4-mini";

const ACCEPTED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]);
const MAX_BYTES = 10 * 1024 * 1024;

const MENU_SCAN_SCHEMA = {
  type: "object",
  properties: {
    is_menu: {
      type: "boolean",
      description: "Whether the image shows a restaurant menu",
    },
    restaurant_name: {
      type: "string",
      description: "Restaurant name if visible on the menu, else empty string",
    },
    dishes: {
      type: "array",
      description: "Every dish that can be read from the menu",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          description: {
            type: "string",
            description:
              "Description from the menu if printed, otherwise a plausible short description of the dish",
          },
          price: {
            type: "number",
            description:
              "Price from the menu in the menu's currency; 0 if unreadable",
          },
          category: {
            type: "string",
            enum: ["Appetizers", "Mains", "Desserts", "Drinks"],
          },
          cuisine: {
            type: "string",
            enum: ["Asian", "American", "Mexican", "Italian"],
            description: "Closest matching cuisine",
          },
          emoji: {
            type: "string",
            description: "A single food emoji that fits the dish",
          },
          vegetarian: { type: "boolean" },
          spicy: { type: "boolean" },
        },
        required: [
          "name",
          "description",
          "price",
          "category",
          "cuisine",
          "emoji",
          "vegetarian",
          "spicy",
        ],
        additionalProperties: false,
      },
    },
  },
  required: ["is_menu", "restaurant_name", "dishes"],
  additionalProperties: false,
} as const;

export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      {
        error:
          "Menu scanning is not configured. Add OPENAI_API_KEY to .env.local and restart the dev server.",
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
      { error: "Image too large. Maximum size is 10 MB." },
      { status: 400 }
    );
  }

  const imageData = Buffer.from(await image.arrayBuffer()).toString("base64");
  const client = new OpenAI();

  try {
    const completion = await client.chat.completions.create({
      model: MODEL,
      max_completion_tokens: 8192,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "menu_scan",
          strict: true,
          schema: MENU_SCAN_SCHEMA,
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
              text: "This is a photo of a restaurant's menu. Extract every readable dish into the schema. Translate non-English dish names into English (keep the original name in parentheses inside the description). If the image is not a menu, set is_menu to false and return an empty dishes array.",
            },
          ],
        },
      ],
    });

    const message = completion.choices[0]?.message;
    if (message?.refusal || !message?.content) {
      return NextResponse.json(
        { error: "Scan failed. Try another photo." },
        { status: 502 }
      );
    }
    return NextResponse.json(JSON.parse(message.content));
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
        { error: `Scan failed (${err.status}). Try again.` },
        { status: 502 }
      );
    }
    return NextResponse.json(
      { error: "Scan failed. Check your connection and try again." },
      { status: 502 }
    );
  }
}
