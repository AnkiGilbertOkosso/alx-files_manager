import { promisify } from 'util';
import { createClient } from 'redis';

/**
 * A Redis client for managing key-value data with expiration.
 */
class RedisClient {
  /**
   * Creates a new RedisClient instance.
   */
  constructor() {
    /**
     * The Redis client instance.
     * @type {RedisClient}
     * @private
     */
    this.client = createClient();

    /**
     * Indicates if the client is currently connected to the Redis server.
     * @type {boolean}
     * @private
     */
    this.isConnected = true;

    this.client.on('error', (err) => {
      console.error('Redis client connection error:', err.message || err.toString());
      this.isConnected = false;
    });

    this.client.on('connect', () => {
      this.isConnected = true;
    });
  }

  /**
   * Checks if the Redis client is connected to the server.
   * @returns {boolean} True if connected, false otherwise.
   */
  isAlive() {
    return this.isConnected;
  }

  /**
   * Retrieves the value associated with the given key from Redis.
   * @param {string} key The key to retrieve the value for.
   * @returns {Promise<string|null>} A promise that resolves
   * with the value associated
   * with the key, or null if the key does not exist.
   */
  async get(key) {
    return promisify(this.client.GET).bind(this.client)(key);
  }

  /**
   * Sets the value of a key in Redis with an optional expiration time.
   * @param {string} key The key to set.
   * @param {string|number|boolean} value The value to set for the key.
   * @param {number} [duration] The expiration time for the key-value pair
   * in seconds (optional).
   * @returns {Promise<void>} A promise that resolves when the operation is complete.
   */
  async set(key, value, duration) {
    if (duration) {
      await promisify(this.client.SETEX).bind(this.client)(key, duration, value);
    } else {
      await promisify(this.client.SET).bind(this.client)(key, value);
    }
  }

  /**
   * Removes a key and its associated value from Redis.
   * @param {string} key The key to delete.
   * @returns {Promise<void>} A promise that resolves when the operation is complete.
   */
  async del(key) {
    await promisify(this.client.DEL).bind(this.client)(key);
  }
}

/**
 * An instance of the RedisClient class.
 * @type {RedisClient}
 */
export const redisClient = new RedisClient();

export default redisClient;
