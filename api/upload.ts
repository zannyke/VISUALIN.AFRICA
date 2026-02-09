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

    const { filename, contentType, auth } = request.body;

    // Check Auth
    if (!process.env.ADMIN_PASSWORD || auth !== process.env.ADMIN_PASSWORD) {
        return response.status(401).json({ error: 'Unauthorized' });
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

        return response.status(200).json({ uploadUrl, publicUrl });
    } catch (error) {
        console.error('R2 URL Generation Error:', error);
        return response.status(500).json({ error: (error as Error).message });
    }
}
