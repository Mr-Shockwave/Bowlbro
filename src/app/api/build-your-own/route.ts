import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const maxDuration = 60;

const MODEL = "gpt-5.4-mini";
const MAX_INGREDIENTS = 12;

const SUGGESTIONS_SCHEMA = {
  type: "object",
  properties: {
    suggestions: {
      type: "array",
      description: "Exactly three dish suggestions",
      items: {
        type: "object",
        properties: {
          name: { type: "string", description: "Appetizing dish name" },
          description: {
            type: "string",
            description: "One or two sentences describing the dish",
          },
          cooking_method: {
            type: "string",
            description: "Primary technique, e.g. 'Stir-fried', 'Oven-baked'",
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
          estimated_calories: { type: "integer" },
          price: {
            type: "number",
            description: "Fair menu price in USD, between 9 and 19",
          },
        },
        required: [
          "name",
          "description",
          "cooking_method",
          "cuisine",
          "emoji",
          "estimated_calories",
          "price",
        ],
        additionalProperties: false,
      },
    },
  },
  required: ["suggestions"],
  additionalProperties: false,
} as const;

export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      {
        error:
          "Recommendations are not configured. Add OPENAI_API_KEY to .env.local and restart the dev server.",
      },
      { status: 503 }
    );
  }

  let ingredients: unknown;
  try {
    ({ ingredients } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  if (
    !Array.isArray(ingredients) ||
    ingredients.length === 0 ||
    !ingredients.every((i) => typeof i === "string" && i.length <= 40)
  ) {
    return NextResponse.json(
      { error: "Pick at least one ingredient." },
      { status: 400 }
    );
  }
  if (ingredients.length > MAX_INGREDIENTS) {
    return NextResponse.json(
      { error: `Pick at most ${MAX_INGREDIENTS} ingredients.` },
      { status: 400 }
    );
  }

  const client = new OpenAI();

  try {
    const completion = await client.chat.completions.create({
      model: MODEL,
      max_completion_tokens: 4096,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "dish_suggestions",
          strict: true,
          schema: SUGGESTIONS_SCHEMA,
        },
      },
      messages: [
        {
          role: "user",
          content: `A restaurant customer picked these ingredients: ${ingredients.join(", ")}.

Suggest exactly 3 dishes — the most popular, widely loved ways to cook this combination. Each dish should use mainly the selected ingredients (pantry staples like oil, salt, and basic seasonings are fine to assume). Make the three dishes clearly different from each other in cooking method or cuisine. Keep names short and menu-friendly.`,
        },
      ],
    });

    const message = completion.choices[0]?.message;
    if (message?.refusal || !message?.content) {
      return NextResponse.json(
        { error: "No recommendations returned. Try again." },
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
        { error: `Recommendation failed (${err.status}). Try again.` },
        { status: 502 }
      );
    }
    return NextResponse.json(
      { error: "Recommendation failed. Check your connection and try again." },
      { status: 502 }
    );
  }
}
