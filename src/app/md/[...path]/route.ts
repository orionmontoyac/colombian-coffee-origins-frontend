import { allMdPages, findMdPage } from "@/lib/ai/pages";

export function generateStaticParams() {
  return allMdPages().map((p) => ({ path: p.mdPath.split("/").slice(2) }));
}

export async function GET(_req: Request, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  const page = findMdPage(path);
  if (!page) return new Response("Not found\n", { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  return new Response(page.body, {
    headers: { "Content-Type": "text/markdown; charset=utf-8", Link: '</llms.txt>; rel="describedby"' },
  });
}
