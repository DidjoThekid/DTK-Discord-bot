import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getDiscordOAuthUrl } from "@/lib/discord";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.redirect("/login");

  const url = getDiscordOAuthUrl(session.userId);
  return NextResponse.redirect(url);
}
