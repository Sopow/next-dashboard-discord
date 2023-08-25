import Redis from "ioredis";
import log from "../utils/logger";

export default class RedisHandler {
  client: Redis;
  connect: Promise<void>;
  connected: boolean;
  connectResolve: any;

  constructor() {
    this.connect = new Promise((resolve) => (this.connectResolve = resolve));
    this.client = new Redis({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
    });

    this.client.on("connect", () => {
      log("Connected.", "redis");
      if (this.connectResolve) this.connectResolve();
    });
  }

  async get(key: string, cb: (err: any, res: any) => void): Promise<string> {
    return await this.client.get(key, cb);
  }

  async set(key: string, value: string): Promise<string> {
    return await this.client.set(key, value);
  }

  async del(key: string): Promise<number> {
    return await this.client.del(key);
  }

  async exists(key: string): Promise<number> {
    return await this.client.exists(key);
  }
}
