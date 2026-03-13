import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * On-demand ISR revalidation endpoint.
 *
 * Usage 1 — Manual revalidation:
 *   POST /api/revalidate
 *   Header: x-revalidate-secret: <secret>
 *   Body: { "path": "/email-marketing/mailchimp" }
 *
 * Usage 2 — Supabase Database Webhook (auto):
 *   Supabase sends { type, table, record, old_record }
 *   Automatically determines which paths to revalidate.
 */
export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-revalidate-secret");
  const envSecret = process.env.REVALIDATE_SECRET;

  if (!envSecret || secret !== envSecret) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  const body = await request.json();

  // Check if this is a Supabase webhook payload
  if (body.table) {
    const { pagePaths, layoutPaths } = getPathsFromSupabaseWebhook(body);
    const allPaths = [...pagePaths, ...layoutPaths];
    if (allPaths.length === 0) {
      return NextResponse.json({ revalidated: false, reason: "No paths to revalidate" });
    }
    for (const p of pagePaths) {
      revalidatePath(p, "page");
    }
    for (const p of layoutPaths) {
      revalidatePath(p, "layout");
    }
    return NextResponse.json({
      revalidated: true,
      pagePaths,
      layoutPaths,
      source: "supabase-webhook",
      now: Date.now(),
    });
  }

  // Manual revalidation
  const { path, paths, type = "page" } = body;
  const pathsToRevalidate: string[] = paths || (path ? [path] : []);

  if (pathsToRevalidate.length === 0) {
    return NextResponse.json({ error: "Path or paths is required" }, { status: 400 });
  }

  for (const p of pathsToRevalidate) {
    revalidatePath(p, type as "page" | "layout");
  }

  return NextResponse.json({ revalidated: true, paths: pathsToRevalidate, type, now: Date.now() });
}

function getPathsFromSupabaseWebhook(body: {
  table: string;
  type: string;
  record?: Record<string, unknown>;
  old_record?: Record<string, unknown>;
}): { pagePaths: string[]; layoutPaths: string[] } {
  const { table, record, old_record } = body;
  const data = record || old_record;
  const pagePaths: string[] = [];
  const layoutPaths: string[] = [];

  // Always revalidate homepage
  pagePaths.push("/");

  if (table === "tools" && data) {
    const category = data.category_slug as string;
    const slug = data.tool_slug as string || data.slug as string;

    if (category && slug) {
      // Revalidate the specific tool pages
      pagePaths.push(`/${category}/${slug}`);
      pagePaths.push(`/${category}/${slug}/pricing`);
      pagePaths.push(`/${category}/${slug}/alternatives`);
    }

    if (category) {
      // Revalidate the ENTIRE category via layout — this covers:
      // - All alternatives pages (new tool = new alternative for every tool)
      // - Compare pages
      // - Category listing
      layoutPaths.push(`/${category}`);
    }

    // Best pages (new/updated tool affects "best" rankings)
    pagePaths.push("/best");
    layoutPaths.push("/best");

    // Search and sitemap
    pagePaths.push("/search");
    pagePaths.push("/sitemap-html");
  }

  if (table === "comparisons" && data) {
    const slug = data.slug as string;
    const category = data.category_slug as string;
    if (category && slug) {
      pagePaths.push(`/${category}/compare/${slug}`);
    }
    if (category) {
      pagePaths.push(`/${category}/compare`);
    }
  }

  if (table === "blog_posts" && data) {
    const slug = data.slug as string;
    if (slug) {
      pagePaths.push(`/blog/${slug}`);
    }
    pagePaths.push("/blog");
    pagePaths.push("/sitemap-html");
  }

  return {
    pagePaths: [...new Set(pagePaths)],
    layoutPaths: [...new Set(layoutPaths)],
  };
}
