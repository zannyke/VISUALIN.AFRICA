import { sql } from '@vercel/postgres';

export default async function handler(request: any, response: any) {
    try {
        const result = await sql`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255),
        subject VARCHAR(255),
        message TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
        return response.status(200).json({ result });
    } catch (error) {
        return response.status(500).json({ error });
    }
}
