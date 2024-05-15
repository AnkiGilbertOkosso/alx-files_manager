import mongodb from 'mongodb';
// eslint-disable-next-line no-unused-vars
import Collection from 'mongodb/lib/collection';
// eslint-disable-next-line import/no-unresolved, import/extensions
import envLoader from './env_loader';

/**
 * A MongoDB client for interacting with the database.
 */
class DBClient {
  /**
   * Creates a new DBClient instance.
   */
  constructor() {
    envLoader();
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';
    const dbURL = `mongodb://${host}:${port}/${database}`;

    /**
     * The MongoDB client instance.
     * @type {MongoClient}
     * @private
     */
    this.client = new mongodb.MongoClient(dbURL, { useUnifiedTopology: true });
    this.client.connect();
  }

  /**
   * Checks if this client's connection to the MongoDB server is active.
   * @returns {boolean} True if connected, false otherwise.
   */
  isAlive() {
    return this.client.isConnected();
  }

  /**
   * Retrieves the number of users in the database.
   * @returns {Promise<Number>} A promise that resolves with the number
   * of users in the database.
   */
  async nbUsers() {
    return this.client.db().collection('users').countDocuments();
  }

  /**
   * Retrieves the number of files in the database.
   * @returns {Promise<Number>} A promise that resolves with the number
   * of files in the database.
   */
  async nbFiles() {
    return this.client.db().collection('files').countDocuments();
  }

  /**
   * Retrieves a reference to the `users` collection.
   * @returns {Promise<Collection>} A promise that resolves with a reference
   * to the `users` collection.
   */
  async usersCollection() {
    return this.client.db().collection('users');
  }

  /**
   * Retrieves a reference to the `files` collection.
   * @returns {Promise<Collection>} A promise that resolves with a reference
   * to the `files` collection.
   */
  async filesCollection() {
    return this.client.db().collection('files');
  }
}

/**
 * An instance of the DBClient class.
 * @type {DBClient}
 */
export const dbClient = new DBClient();

export default dbClient;
