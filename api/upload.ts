import { put } from '@vercel/blob';

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(request: any, response: any) {
    const adminPassword = process.env.ADMIN_PASSWORD;
    // Basic query param auth for upload to keep it simple or header check?
    // Since this is being called likely from client directly or via fetch, let's check auth.
    // Wait, interacting with request stream directly for `put`.

    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { searchParams } = new URL(request.url, `http://${request.headers.host}`);
        const filename = searchParams.get('filename') || 'file';

        // We pass the request body (stream) directly to Vercel Blob
        const blob = await put(filename, request, {
            access: 'public',
            token: process.env.BLOB_READ_WRITE_TOKEN // Needs to be added to env
        });

        return response.status(200).json(blob);
    } catch (error) {
        console.error(error);
        return response.status(500).json({ error: 'Upload failed' });
    }
}
