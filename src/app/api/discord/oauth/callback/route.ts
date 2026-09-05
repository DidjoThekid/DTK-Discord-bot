import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { exchangeDiscordCode, fetchDiscordUser, fetchManageableGuilds } from "@/lib/discord";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const userId = req.nextUrl.searchParams.get("state");

  if (!code || !userId) {
    return NextResponse.redirect(new URL("/dashboard?discord_error=1", req.url));
  }

  try {
    const { access_token } = await exchangeDiscordCode(code);
    const discordUser = await fetchDiscordUser(access_token);
    const guilds = await fetchManageableGuilds(access_token);

    await prisma.user.update({
      where: { id: userId },
      data: {
        discordId: discordUser.id,
        discordUsername: discordUser.username,
        discordGuilds: guilds,
      },
    });

    return NextResponse.redirect(new URL("/dashboard?discord_linked=1", req.url));
  } catch (err) {
    console.error(err);
    return NextResponse.redirect(new URL("/dashboard?discord_error=1", req.url));
  }
}
