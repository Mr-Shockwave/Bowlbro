import { NextRequest, NextResponse } from "next/server";

const COMMONS_API = "https://commons.wikimedia.org/w/api.php";

interface CommonsPage {
  index?: number;
  title?: string;
  imageinfo?: { thumburl?: string; descriptionurl?: string }[];
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  const params = new URLSearchParams({
    action: "query",
    format: "json",
    generator: "search",
    gsrsearch: `filetype:bitmap ${q}`,
    gsrnamespace: "6",
    gsrlimit: "9",
    prop: "imageinfo",
    iiprop: "url",
    iiurlwidth: "640",
  });

  try {
    const res = await fetch(`${COMMONS_API}?${params}`, {
      headers: { "User-Agent": "EmberEats-demo/0.1 (food ordering demo)" },
      next: { revalidate: 86400 },
    });
    if (!res.ok) {
      return NextResponse.json({ images: [] }, { status: 502 });
    }
    const data = await res.json();
    const pages: CommonsPage[] = Object.values(data?.query?.pages ?? {});
    const images = pages
      .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
      .flatMap((p) => {
        const info = p.imageinfo?.[0];
        return info?.thumburl
          ? [
              {
                url: info.thumburl,
                title: p.title ?? "",
                pageUrl: info.descriptionurl ?? "",
              },
            ]
          : [];
      });
    return NextResponse.json({ images });
  } catch {
    return NextResponse.json({ images: [] }, { status: 502 });
  }
}
