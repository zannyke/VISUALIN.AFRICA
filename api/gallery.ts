import { put, del } from '@vercel/blob';
import { sql } from '@vercel/postgres';

export const config = {
    api: {
        bodyParser: false, // Disabling body parser to handle file stream manually if needed, or use blob upload via client? 
        // Actually, handling file upload securely usually involves generating a signed URL or handling multipart.
        // For simplicity with Vercel Blob, we can try client-side upload or server-side.
        // Let's use simpler JSON body with URL if user provides URL, or handle file upload in a separate way.
        // Wait, simpler approach: User sends a URL (e.g. from an external host) OR we use Vercel Blob SDK.
        // Let's try to stick to handling "add item" logic here.
    },
};

// Re-enable body parser for JSON
export default async function handler(request: any, response: any) {
    // Parsing JSON manually if bodyParser: false, but let's keep it true for now unless we do multipart.
    // Actually, for Vercel functions, better to let Next/Vercel handle it.

    const adminPassword = process.env.ADMIN_PASSWORD;
    const authHeader = request.headers['authorization'];

    if (!adminPassword || authHeader !== adminPassword) {
        return response.status(401).json({ error: 'Unauthorized' });
    }

    try {
        if (request.method === 'GET') {
            const { rows } = await sql`SELECT * FROM gallery ORDER BY created_at DESC`;
            return response.status(200).json({ items: rows });
        }

        if (request.method === 'POST') {
            const { url, title, category } = request.body; // Expect JSON body
            if (!url) return response.status(400).json({ error: 'URL required' });

            const result = await sql`
        INSERT INTO gallery (url, title, category, created_at)
        VALUES (${url}, ${title || ''}, ${category || 'general'}, NOW())
        RETURNING *;
      `;
            return response.status(200).json({ item: result.rows[0] });
        }

        if (request.method === 'DELETE') {
            const { id, url } = request.body;
            if (!id) return response.status(400).json({ error: 'ID required' });

            // If it is a vercel blob, delete it
            if (url && url.includes('public.blob.vercel-storage.com')) {
                try {
                    await del(url);
                } catch (e) {
                    console.error('Failed to delete blob', e);
                }
            }

            await sql`DELETE FROM gallery WHERE id = ${id}`;
            return response.status(200).json({ success: true });
        }

        return response.status(405).json({ error: 'Method Not Allowed' });

    } catch (error) {
        console.error(error);
        return response.status(500).json({ error: 'Internal Server Error' });
    }
}
