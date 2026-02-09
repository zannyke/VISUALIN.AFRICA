# Migration to Cloudflare R2 Complete

**Status**: Success

The project has been successfully migrated to use Cloudflare R2 for file storage, while maintaining the ability to delete existing files from Vercel Blob.

## Summary of Changes
1.  **Dependencies**: Installed `@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner`.
2.  **Upload API**: `api/upload.ts` now uses R2 Presigned URLs for secure, direct uploads.
3.  **Frontend**: `src/pages/Admin.tsx` has been updated to upload directly to R2.
4.  **Deletion Logic**: `api/gallery.ts` now intelligently deletes files from either R2 or Vercel Blob based on the file URL.
5.  **Documentation**: `PROJECT_DOCUMENTATION.md` has been updated with the new architecture and pricing.

## ⚠️ Action Required

To make this work in production, you **MUST** set the following Environment Variables in your Vercel Project Settings:

| Variable | Description |
| :--- | :--- |
| `R2_ACCOUNT_ID` | `ac36c3bcd66bb79f417697448167f213` |
| `R2_ACCESS_KEY_ID` | Your R2 Access Key ID |
| `R2_SECRET_ACCESS_KEY` | Your R2 Secret Access Key |
| `R2_BUCKET_NAME` | The name of your R2 bucket |
| `R2_PUBLIC_DOMAIN` | The public URL of your bucket (e.g., `https://pub-xxxxxx.r2.dev`) |

Once these are set, trigger a new deployment (or redeploy the latest commit) for the changes to take effect.
