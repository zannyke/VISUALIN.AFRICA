import { del } from '@vercel/blob';
import { sql } from '@vercel/postgres';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';

const R2 = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    },
});

export const config = {
    api: {
        bodyParser: true,
    },
};

async function deleteFile(url: string) {
    if (!url) return;

    try {
        if (url.includes('public.blob.vercel-storage.com')) {
            await del(url);
        } else if (process.env.R2_PUBLIC_DOMAIN && url.includes(process.env.R2_PUBLIC_DOMAIN)) {
            const key = url.split(process.env.R2_PUBLIC_DOMAIN + '/')[1];
            if (key) {
                await R2.send(new DeleteObjectCommand({
                    Bucket: process.env.R2_BUCKET_NAME,
                    Key: key
                }));
            }
        }
    } catch (e) {
        console.error('Failed to delete file:', url, e);
    }
}

// Re-enable body parser for JSON
export default async function handler(request: any, response: any) {
    const adminPassword = process.env.ADMIN_PASSWORD;
    const authHeader = request.headers['authorization'];

    if (request.method !== 'GET' && (!adminPassword || authHeader !== adminPassword)) {
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
            if (url && oldUrl && url !== oldUrl) {
                await deleteFile(oldUrl);
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

            await deleteFile(url);
            await sql`DELETE FROM gallery WHERE id = ${id}`;
            return response.status(200).json({ success: true });
        }

        return response.status(405).json({ error: 'Method Not Allowed' });

    } catch (error) {
        console.error(error);
        return response.status(500).json({ error: 'Internal Server Error' });
    }
}
