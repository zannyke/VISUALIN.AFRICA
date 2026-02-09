import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const config = {
    api: {
        bodyParser: true,
    },
};

const R2 = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    },
});

export default async function handler(request: any, response: any) {
    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method not allowed' });
    }

    let body = request.body;

    // Safely parse body if it comes as a string (handling edge cases)
    try {
        if (typeof body === 'string') {
            body = JSON.parse(body);
        }
    } catch (e) {
        console.error('JSON Parse Error:', e);
        return response.status(400).json({ error: 'Invalid JSON body' });
    }

    const { filename, contentType: rawContentType, auth } = body || {};

    // Check Auth
    if (!process.env.ADMIN_PASSWORD || auth !== process.env.ADMIN_PASSWORD) {
        return response.status(401).json({ error: 'Unauthorized' });
    }

    // Fallback for missing content type (often happens with HEIC or specific video formats)
    let contentType = rawContentType;
    if (!contentType && filename) {
        const ext = filename.split('.').pop().toLowerCase();
        const mimeMap: { [key: string]: string } = {
            'heic': 'image/heic',
            'heif': 'image/heif',
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'gif': 'image/gif',
            'webp': 'image/webp',
            'mp4': 'video/mp4',
            'mov': 'video/quicktime',
            'webm': 'video/webm'
        };
        contentType = mimeMap[ext] || 'application/octet-stream';
    }

    if (!filename || !contentType) {
        return response.status(400).json({ error: 'Missing filename or contentType' });
    }

    try {
        const uniqueFilename = `${Date.now()}-${filename.replace(/\s+/g, '-')}`;
        const command = new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: uniqueFilename,
            ContentType: contentType,
            ACL: 'public-read',
        });

        const uploadUrl = await getSignedUrl(R2, command, { expiresIn: 3600 });
        const publicUrl = `${process.env.R2_PUBLIC_DOMAIN}/${uniqueFilename}`;

        console.log('Generated Upload URL successfully');
        return response.status(200).json({ uploadUrl, publicUrl });
    } catch (error) {
        console.error('R2 URL Generation Error:', error);
        return response.status(500).json({ error: (error as Error).message });
    }
}
