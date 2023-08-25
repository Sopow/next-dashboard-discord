import prisma from "./prisma";
import redis from "./redis";
import { Collection, User } from "discord.js";
import Client from "../base/Client";
import * as Functions from "../utils/functions";

export default class DatabaseHandler {
  prisma: prisma;
  redis: redis;
  cache: Collection<string, any>;
  _functions: any;
  _client: Client;

  constructor(client: Client) {
    this.cache = new Collection();
    this.prisma = new prisma();
    this.redis = new redis();
    this._client = client;
    this._functions = Functions;
  }

  checkCooldown = (
    userId: string,
    commandName: string,
    cooldownSeconds: number,
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      this.redis.get(`cooldown:${userId}:${commandName}`, (err, reply) => {
        if (err) {
          console.error("Error checking cooldown:", err);
          resolve(false);
        } else {
          if (reply !== null) {
            const cooldownEndTime = parseInt(reply);
            const currentTime = Math.floor(Date.now() / 1000);
            if (currentTime < cooldownEndTime) {
              resolve(true);
            } else {
              resolve(false);
            }
          } else {
            resolve(false);
          }
        }
      });
    });
  };

  applyCooldown = (
    userId: string,
    commandName: string,
    cooldownSeconds: number,
  ) => {
    const cooldownEndTime = Math.floor(Date.now() / 1000) + cooldownSeconds;
    this.redis.set(
      `cooldown:${userId}:${commandName}`,
      cooldownEndTime.toString(),
    );
  };
}
