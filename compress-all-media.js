import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import sharp from 'sharp';

const publicDir = path.join(process.cwd(), 'public');
const videosDir = path.join(publicDir, 'videos');
const artDir = path.join(publicDir, 'art');
const postersDir = path.join(publicDir, 'posters');

if (!fs.existsSync(postersDir)) {
    fs.mkdirSync(postersDir, { recursive: true });
}

// 1. Process and Compress Videos + Generate Posters
function processVideos(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);

    for (const file of files) {
        if (file.endsWith('.mp4') || file.endsWith('.mov')) {
            const filePath = path.join(dir, file);
            const baseName = path.basename(file, path.extname(file));
            const posterPath = path.join(postersDir, `${baseName}.jpg`);
            const stats = fs.statSync(filePath);
            const sizeMB = (stats.size / 1024 / 1024).toFixed(2);

            console.log(`\n--- Processing Video: ${file} (${sizeMB} MB) ---`);

            // Generate Poster Frame if missing or outdated
            if (!fs.existsSync(posterPath)) {
                try {
                    console.log(`Generating poster frame for ${file}...`);
                    const posterCmd = `ffmpeg -y -ss 00:00:01 -i "${filePath}" -vframes 1 -q:v 2 "${posterPath}"`;
                    execSync(posterCmd, { stdio: 'pipe' });
                    console.log(`Created poster: ${posterPath}`);
                } catch (e) {
                    console.error(`Failed poster extraction for ${file}:`, e.message);
                }
            }

            // Compress Video with ffmpeg (CRF 28, max 1080p, faststart, stereo AAC)
            const tempOut = filePath + '.tmp.mp4';
            try {
                console.log(`Compressing video with faststart H.264...`);
                const cmd = `ffmpeg -y -i "${filePath}" -vf "scale='min(1920,iw)':-2" -vcodec libx264 -crf 28 -preset fast -movflags +faststart -acodec aac -b:a 128k "${tempOut}"`;
                execSync(cmd, { stdio: 'inherit' });

                if (fs.existsSync(tempOut)) {
                    const newStats = fs.statSync(tempOut);
                    const newSizeMB = (newStats.size / 1024 / 1024).toFixed(2);
                    console.log(`SUCCESS: ${file} reduced from ${sizeMB} MB -> ${newSizeMB} MB`);

                    fs.unlinkSync(filePath);
                    const finalPath = filePath.endsWith('.mov') ? filePath.replace('.mov', '.mp4') : filePath;
                    fs.renameSync(tempOut, finalPath);
                }
            } catch (err) {
                console.error(`Error compressing ${file}:`, err);
                if (fs.existsSync(tempOut)) {
                    try { fs.unlinkSync(tempOut); } catch (e) { }
                }
            }
        }
    }
}

// 2. Compress Art & Public Images with Sharp
async function processImages(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const ext = path.extname(file).toLowerCase();
        if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
            const filePath = path.join(dir, file);
            const stats = fs.statSync(filePath);
            const sizeMB = (stats.size / 1024 / 1024).toFixed(2);

            if (stats.size > 200 * 1024) { // process anything > 200KB
                console.log(`\n--- Optimizing Image: ${file} (${sizeMB} MB) ---`);
                try {
                    const tempPath = filePath + '.tmp';
                    await sharp(filePath)
                        .resize(1920, null, { withoutEnlargement: true })
                        .jpeg({ quality: 80, mozjpeg: true })
                        .toFile(tempPath);

                    const newStats = fs.statSync(tempPath);
                    const newSizeMB = (newStats.size / 1024 / 1024).toFixed(2);

                    if (newStats.size < stats.size) {
                        fs.unlinkSync(filePath);
                        fs.renameSync(tempPath, filePath);
                        console.log(`SUCCESS: ${file} reduced from ${sizeMB} MB -> ${newSizeMB} MB`);
                    } else {
                        fs.unlinkSync(tempPath);
                    }
                } catch (err) {
                    console.error(`Error optimizing ${file}:`, err);
                }
            }
        }
    }
}

async function main() {
    console.log("=== Starting Media Optimization ===");
    processVideos(videosDir);
    processVideos(publicDir);
    await processImages(artDir);
    await processImages(publicDir);
    await processImages(postersDir);
    console.log("\n=== Media Optimization Complete! ===");
}

main().catch(console.error);
