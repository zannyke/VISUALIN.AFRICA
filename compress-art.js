
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const artDir = path.join(process.cwd(), 'public', 'art');

if (!fs.existsSync(artDir)) {
    console.log('Art directory not found');
    process.exit(0);
}

const files = fs.readdirSync(artDir);

async function processImages() {
    console.log(`Found ${files.length} files in ${artDir}`);

    for (const file of files) {
        if (file.toLowerCase().endsWith('.jpg') || file.toLowerCase().endsWith('.jpeg')) {
            const filePath = path.join(artDir, file);
            const stats = fs.statSync(filePath);

            // Compress if larger than 500KB or generally to ensure optimization
            // We used to check for 2MB, but 2MB is huge. Let's process anything > 1MB strictly, 
            // or just process all to ensure 1920px width cap.
            // Let's stick to > 1MB to avoid re-compressing small thumbnails repeatedly if run multiple times
            if (stats.size > 1 * 1024 * 1024) {
                console.log(`Optimizing ${file} (${(stats.size / 1024 / 1024).toFixed(2)} MB)...`);

                try {
                    const tempPath = filePath + '.tmp';

                    // Resize to max width 1920px, auto height, do not enlarge if smaller
                    await sharp(filePath)
                        .resize(1920, null, { withoutEnlargement: true })
                        .jpeg({ quality: 80, mozjpeg: true })
                        .toFile(tempPath);

                    // Verify the new file exists and is smaller (or at least valid)
                    const newStats = fs.statSync(tempPath);

                    if (newStats.size < stats.size) {
                        fs.unlinkSync(filePath);
                        fs.renameSync(tempPath, filePath);
                        console.log(`Saved ${file} (${(newStats.size / 1024 / 1024).toFixed(2)} MB) - Reduced by ${((1 - newStats.size / stats.size) * 100).toFixed(1)}%`);
                    } else {
                        console.log(`Optimization didn't reduce size for ${file} (New: ${newStats.size}, Old: ${stats.size}). Keeping original.`);
                        fs.unlinkSync(tempPath);
                    }

                } catch (err) {
                    console.error(`Error processing ${file}:`, err);
                    if (fs.existsSync(filePath + '.tmp')) {
                        try { fs.unlinkSync(filePath + '.tmp'); } catch (e) { }
                    }
                }
            } else {
                console.log(`Skipping ${file} (${(stats.size / 1024 / 1024).toFixed(2)} MB) - already small enough`);
            }
        }
    }
}

processImages().catch(console.error);
