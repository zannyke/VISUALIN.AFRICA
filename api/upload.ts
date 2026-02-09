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
    // Debugging R2 Uploads - Force Redeploy 2026-02-09
    console.log('--- UPLOAD HANDLER START ---');
    console.log('Method:', request.method);
    console.log('Headers:', JSON.stringify(request.headers));

    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method not allowed' });
    }

    let body = request.body;

    // Safely parse body if it comes as a string
    try {
        if (typeof body === 'string') {
            console.log('Parsing string body...');
            body = JSON.parse(body);
        }
    } catch (e) {
        console.error('JSON Parse Error:', e);
        return response.status(400).json({ error: 'Invalid JSON body' });
    }

    const { filename, contentType, auth } = body || {};

    console.log('Upload Request Body Parsed:', {
        filename,
        contentType,
        authPresent: !!auth, // don't log the password
        bodyType: typeof request.body
    });

    // Check Auth
    if (!process.env.ADMIN_PASSWORD || auth !== process.env.ADMIN_PASSWORD) {
        console.error('Auth Check Failed.');
        return response.status(401).json({ error: 'Unauthorized' });
    }

    if (!filename || !contentType) {
        console.error('Validation failed: Missing filename or contentType');
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
