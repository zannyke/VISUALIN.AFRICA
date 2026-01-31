import { put, del } from '@vercel/blob';
import { sql } from '@vercel/postgres';

export const config = {
    api: {
        bodyParser: true,
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

        if (request.method === 'PUT') {
            const { id, url, title, category, oldUrl } = request.body;
            if (!id) return response.status(400).json({ error: 'ID required' });

            // If a new URL is provided (replacement), delete the old file
            if (url && oldUrl && url !== oldUrl && oldUrl.includes('public.blob.vercel-storage.com')) {
                try {
                    await del(oldUrl);
                } catch (e) {
                    console.error('Failed to delete old blob', e);
                }
            }

            // Update record
            // If url is provided, update it, otherwise keep existing
            const result = await sql`
                UPDATE gallery 
                SET 
                    title = ${title || ''}, 
                    category = ${category || 'general'},
                    url = COALESCE(${url || null}, url)
                WHERE id = ${id}
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
