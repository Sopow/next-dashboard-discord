import Client from "../base/Client";
import type { Event, SlashCommand } from "../@types";
import "dotenv/config";

export const name: Event["name"] = "ready";
export const once: Event["once"] = true;

export const execute: Event["execute"] = async (client: Client) => {
  client._ready = true;
  client.log(`Ready! Logged in as ${client.user.tag} (${client.user.id})`);
  client.user.setActivity({
    name: "Connected to the dashboard",
    type: "STREAMING",
    url: "https://twitch.tv/kamet0",
  });

  try {
    // Load commands for all existing guilds
    await client.loadCommands();
    await client.onDBUpdateReloadCommands();

  } catch (error) {
    client.log(error);

    client.log(
      "An error has occurred while reloading application (/) commands.",
    );
  }
};
