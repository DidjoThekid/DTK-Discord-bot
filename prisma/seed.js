const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const bots = [
  {
    discordClientId: "1511746763831247091",
    name: "Bot public 1",
    description: "",
    permissions: "8",
    isPrivate: false,
  },
  {
    discordClientId: "1536045457929674763",
    name: "Bot public 2",
    description: "",
    permissions: "8",
    isPrivate: false,
  },
  {
    discordClientId: "1535361445850648606",
    name: "Bot admin 1",
    description: "",
    permissions: "8",
    isPrivate: true,
  },
  {
    discordClientId: "1535940749466673222",
    name: "Bot admin 2",
    description: "",
    permissions: "8",
    isPrivate: true,
  },
];

async function main() {
  for (const bot of bots) {
    const existing = await prisma.bot.findFirst({
      where: { discordClientId: bot.discordClientId },
    });

    if (existing) {
      await prisma.bot.update({ where: { id: existing.id }, data: bot });
      console.log(`Mis à jour : ${bot.name} (${bot.discordClientId})`);
    } else {
      await prisma.bot.create({ data: bot });
      console.log(`Créé : ${bot.name} (${bot.discordClientId})`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
