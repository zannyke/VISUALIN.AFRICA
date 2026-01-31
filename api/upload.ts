import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';

export const config = {
    api: {
        bodyParser: true,
    },
};

export default async function handler(request: any, response: any) {
    const body = request.body as HandleUploadBody;

    try {
        const jsonResponse = await handleUpload({
            body,
            request,
            onBeforeGenerateToken: async (pathname) => {
                const { searchParams } = new URL(request.url, `http://${request.headers.host}`);
                const auth = searchParams.get('auth');

                if (!process.env.ADMIN_PASSWORD || auth !== process.env.ADMIN_PASSWORD) {
                    throw new Error('Unauthorized');
                }

                return {
                    allowedContentTypes: [
                        'image/jpeg',
                        'image/png',
                        'image/gif',
                        'image/webp',
                        'video/mp4',
                        'video/quicktime',
                        'video/webm',
                        'video/x-matroska'
                    ],
                    tokenPayload: JSON.stringify({}),
                };
            },
            onUploadCompleted: async ({ blob, tokenPayload }) => {
                // Webhook logic if needed
            },
        });

        return response.status(200).json(jsonResponse);
    } catch (error) {
        return response.status(400).json({ error: (error as Error).message });
    }
}
