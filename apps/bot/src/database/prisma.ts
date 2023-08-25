import { PrismaClient } from "!prisma/client";
import log from "../utils/logger";
import "dotenv/config";

export default class PrismaHandler {
  client: PrismaClient;

  constructor() {
    this.client = new PrismaClient();
    this.checkConnection();
  }

  async checkConnection() {
    try {
      await this.client.$connect();

      log("Connected.", "prisma");
    } catch (error) {
      console.error(error);
    }
  }
}
