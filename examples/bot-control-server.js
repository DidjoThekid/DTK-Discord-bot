const express = require("express");
const { Client, GatewayIntentBits } = require("discord.js");

const app = express();
const PORT = process.env.CONTROL_PORT || 4000;
const CONTROL_API_KEY = process.env.CONTROL_API_KEY;
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

let client = null;

function checkAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (CONTROL_API_KEY && auth !== `Bearer ${CONTROL_API_KEY}`) {
    return res.status(401).json({ error: "Non autorisé" });
  }
  next();
}

app.post("/start", checkAuth, async (_req, res) => {
  if (client) return res.json({ status: "already_running" });

  client = new Client({ intents: [GatewayIntentBits.Guilds] });
  await client.login(DISCORD_TOKEN);
  res.json({ status: "started" });
});

app.post("/stop", checkAuth, async (_req, res) => {
  if (client) {
    await client.destroy();
    client = null;
  }
  res.json({ status: "stopped" });
});

app.get("/status", checkAuth, (_req, res) => {
  res.json({ status: client?.isReady() ? "online" : "offline" });
});

app.listen(PORT, () => console.log(`API de contrôle du bot en écoute sur le port ${PORT}`));
