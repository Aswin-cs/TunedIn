import mongoose from "mongoose";

/**
 * Global cache interface to persist the mongoose connection
 * across Next.js fast refreshes in development mode.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || {
  conn: null,
  promise: null,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

/**
 * Connects to MongoDB using Mongoose with connection caching.
 * Compatible with Next.js App Router and serverless routes.
 */
export async function connectDb(): Promise<typeof mongoose> {
  const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!MONGODB_URI) {
    throw new Error(
      "Missing MongoDB connection string. Please define MONGODB_URI or MONGO_URI in your .env.local file."
    );
  }

  // Return existing connection if already established
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongooseInstance) => {
        console.log("Connected to MongoDB successfully");
        return mongooseInstance;
      })
      .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
        cached.promise = null;
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

/**
 * Helper to access the underlying native MongoDB driver Db instance
 */
export function getDatabase() {
  if (mongoose.connection.readyState !== 1) {
    throw new Error("MongoDB is not connected. Call connectDb() first.");
  }
  return mongoose.connection.db;
}

/**
 * Helper to access the underlying native MongoDB driver MongoClient instance
 */
export function getMongoClient() {
  if (mongoose.connection.readyState !== 1) {
    throw new Error("MongoDB is not connected. Call connectDb() first.");
  }
  return mongoose.connection.getClient();
}

export default connectDb;
