import { sql } from '@vercel/postgres';

export default async function handler(request: any, response: any) {
  try {
    // Gallery Table
    await sql`
      CREATE TABLE IF NOT EXISTS gallery (
        id SERIAL PRIMARY KEY,
        url TEXT NOT NULL,
        title TEXT,
        category TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;

    // Messages Table (Already exists, but good to keep here)
    await sql`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255),
        subject VARCHAR(255),
        message TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;

    return response.status(200).json({ message: 'Tables created directly' });
  } catch (error) {
    return response.status(500).json({ error });
  }
}
