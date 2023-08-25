// Import Structures
import Client from "./base/Client";
import { Intents } from "discord.js";
import { config } from "dotenv";
import Cluster from "discord-hybrid-sharding";
import fs from "fs";
import path from "path";

// Import types
import type { Event } from "../../../@types/index";

config();

const client = new Client({
  shards: "auto",
  shardCount: 1,
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_PRESENCES,
  ],
});

client.on('error', (err) => client.log(err.stack, "error"));
async function init() {
  const eventsFile = fs
    .readdirSync(path.resolve(__dirname, "events"))
    .filter((file) => file.endsWith(".js"));
  const commandsFile = fs
    .readdirSync(path.resolve(__dirname, "commands"))
    .filter((file) => file.endsWith(".js"));

  for (const eventFile of eventsFile) {
    const event: Event = await import(
      path.resolve(__dirname, "events", eventFile)
    );
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
    }
  }

  for (const commandFile of commandsFile) {
    const {
      default: command,
    } = await import(
      path.resolve(__dirname, "commands", commandFile)
    );
    client.commands.set(command.commandName.toLowerCase(), command);
  }
}

init();

process
  .on("unhandledRejection", (err: Error) => {
    client.log(err.stack, "error");
  })
  .on("uncaughtException", (err: Error) => {
    client.log(err.stack, "error");
    process.exit(1);
  });

client.login(process.env.CLIENT_TOKEN);