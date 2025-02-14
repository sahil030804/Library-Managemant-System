import { createClient } from "redis";
import env from "../src/config/index.js";

class Redis {
  constructor() {
    this.redisClient = null;
  }

  async createClient() {
    const redisClient = createClient({
      username: env.redis.REDIS_USERNAME,
      password: env.redis.REDIS_PASSWORD,
      socket: {
        host: env.redis.REDIS_HOST,
        port: env.redis.REDIS_PORT,
      },
    });
    redisClient.on("error", (err) => console.log("Redis Client Error", err));
    redisClient.on("connect", () => console.log("Redis Server Connected"));

    await redisClient.connect();
    return redisClient;
  }

  async getClient() {
    if (!this.redisClient) {
      this.redisClient = await this.createClient();
      return this.redisClient;
    }
    return this.redisClient;
  }
}

const redis = new Redis();
export default redis;
