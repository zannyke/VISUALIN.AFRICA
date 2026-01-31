import { sql } from '@vercel/postgres';

export default async function handler(request: any, response: any) {
    const adminPassword = process.env.ADMIN_PASSWORD;
    const authHeader = request.headers['authorization'];

    // Simple security check
    if (!adminPassword || authHeader !== adminPassword) {
        return response.status(401).json({ error: 'Unauthorized' });
    }

    try {
        if (request.method === 'GET') {
            // Fetch all messages, newest first
            const result = await sql`SELECT * FROM messages ORDER BY created_at DESC`;
            return response.status(200).json({ messages: result.rows });
        }

        else if (request.method === 'DELETE') {
            const { id } = request.body;
            if (!id) {
                return response.status(400).json({ error: 'Missing message ID' });
            }

            await sql`DELETE FROM messages WHERE id = ${id}`;
            return response.status(200).json({ success: true });
        }

        else {
            return response.status(405).json({ error: 'Method Not Allowed' });
        }

    } catch (error) {
        console.error('API Error:', error);
        return response.status(500).json({ error: 'Internal Server Error' });
    }
}
