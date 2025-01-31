import redisLib from "../../lib/redis.js";

const redisInstance = await redisLib.getClient();
class RedisHelper {
  async setBookData(bookKey, data) {
    await redisInstance.set(bookKey, JSON.stringify(data));
  }

  async getBookData(bookKey) {
    const data = await redisInstance.get(bookKey);
    return JSON.parse(data);
  }

  async deleteBookData(bookKey) {
    await redisInstance.del(bookKey);
  }
 
}

export default new RedisHelper();
