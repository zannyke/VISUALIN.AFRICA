import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const videosDir = path.join(process.cwd(), 'public', 'videos');
const publicDir = path.join(process.cwd(), 'public');

function processDirectory(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);

    for (const file of files) {
        if (file.endsWith('.mp4') || file.endsWith('.mov')) {
            const filePath = path.join(dir, file);
            const stats = fs.statSync(filePath);
            const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
            
            console.log(`Processing ${file} (Original size: ${sizeMB} MB)...`);
            
            const tempOut = filePath + '.tmp.mp4';
            try {
                // Compress using x264, CRF 26 (great compression, solid quality), faststart flag for instant web streaming, remove audio if background video
                const cmd = `ffmpeg -y -i "${filePath}" -vcodec libx264 -crf 26 -preset fast -movflags +faststart -an "${tempOut}"`;
                execSync(cmd, { stdio: 'inherit' });

                if (fs.existsSync(tempOut)) {
                    const newStats = fs.statSync(tempOut);
                    const newSizeMB = (newStats.size / 1024 / 1024).toFixed(2);
                    console.log(`Successfully compressed ${file}: ${sizeMB} MB -> ${newSizeMB} MB`);
                    
                    fs.unlinkSync(filePath);
                    const finalPath = filePath.endsWith('.mov') ? filePath.replace('.mov', '.mp4') : filePath;
                    fs.renameSync(tempOut, finalPath);
                }
            } catch (err) {
                console.error(`Error processing ${file}:`, err);
                if (fs.existsSync(tempOut)) {
                    try { fs.unlinkSync(tempOut); } catch (e) {}
                }
            }
        }
    }
}

console.log("Starting video compression & web optimization (+faststart)...");
processDirectory(videosDir);
processDirectory(publicDir);
console.log("Video processing complete!");
