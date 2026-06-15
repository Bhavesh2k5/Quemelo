import { Pool, Client } from 'pg';

const dbConfig = {
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
};

const targetDb = process.env.DB_DATABASE || 'quemelo';

let pool: Pool | null = null;
let isDbInitialized = false;
let dbInitPromise: Promise<void> | null = null;

export function getPool() {
  if (!pool) {
    pool = new Pool({
      ...dbConfig,
      database: targetDb,
    });
  }
  return pool;
}

/**
 * Executes a parameterized SQL query.
 * Automatically runs initDB() on the first query to guarantee database structures exist.
 */
export async function query(text: string, params?: unknown[]) {
  if (!isDbInitialized) {
    if (!dbInitPromise) {
      dbInitPromise = initDB().then(() => {
        isDbInitialized = true;
      });
    }
    await dbInitPromise;
  }
  
  const activePool = getPool();
  return activePool.query(text, params);
}

/**
 * Initializes the PostgreSQL database, tables, and partitions if they do not exist.
 */
export async function initDB() {
  console.log('Initializing database connection...');
  
  // 1. Check if database exists by connecting to default 'postgres' database
  const systemClient = new Client({
    ...dbConfig,
    database: 'postgres',
  });
  
  try {
    await systemClient.connect();
    const res = await systemClient.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [targetDb]
    );
    
    if (res.rowCount === 0) {
      console.log(`Database '${targetDb}' does not exist. Creating it...`);
      await systemClient.query(`CREATE DATABASE "${targetDb}"`);
      console.log(`Database '${targetDb}' created successfully.`);
    } else {
      console.log(`Database '${targetDb}' already exists.`);
    }
  } catch (error) {
    console.error('Error checking/creating database:', error);
    throw error;
  } finally {
    await systemClient.end();
  }
  
  // 2. Connect to the 'quemelo' database and create tables
  const appPool = getPool();
  const client = await appPool.connect();
  
  try {
    console.log('Creating tables...');
    
    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          username VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Ensure username column exists for older DBs
    await client.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(255);
    `);
    
    // Create scans history table
    await client.query(`
      CREATE TABLE IF NOT EXISTS scans (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          title VARCHAR(255),
          artist VARCHAR(255),
          album VARCHAR(255),
          cover_art TEXT,
          spotify_url TEXT,
          matched BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Add columns dynamically for extended Shazam data
    await client.query(`
      ALTER TABLE scans ADD COLUMN IF NOT EXISTS lyrics TEXT;
      ALTER TABLE scans ADD COLUMN IF NOT EXISTS youtube_url TEXT;
      ALTER TABLE scans ADD COLUMN IF NOT EXISTS genre TEXT;
      ALTER TABLE scans ADD COLUMN IF NOT EXISTS apple_music_url TEXT;
      ALTER TABLE scans ADD COLUMN IF NOT EXISTS shazam_url TEXT;
    `);

    // Create user favorites junction table (storing external ID/data since we don't have local songs)
    await client.query(`
      CREATE TABLE IF NOT EXISTS favorites (
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          external_id VARCHAR(255) NOT NULL,
          title VARCHAR(255),
          artist VARCHAR(255),
          cover_art TEXT,
          spotify_url TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (user_id, external_id)
      )
    `);
    
    console.log('Database initialization completed successfully.');
  } catch (error) {
    console.error('Error initializing tables:', error);
    throw error;
  } finally {
    client.release();
  }
}
