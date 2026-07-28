import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const publicDir = path.join(process.cwd(), 'public');
const videosDir = path.join(publicDir, 'videos');
const postersDir = path.join(publicDir, 'posters');

if (!fs.existsSync(postersDir)) {
    fs.mkdirSync(postersDir, { recursive: true });
}

function generatePosters(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);

    for (const file of files) {
        if ((file.endsWith('.mp4') || file.endsWith('.mov')) && !file.endsWith('.tmp.mp4')) {
            const filePath = path.join(dir, file);
            const baseName = path.basename(file, path.extname(file));
            const posterPath = path.join(postersDir, `${baseName}.jpg`);

            if (!fs.existsSync(posterPath)) {
                try {
                    console.log(`Generating poster for ${file}...`);
                    const posterCmd = `ffmpeg -y -ss 00:00:01 -i "${filePath}" -vframes 1 -q:v 2 "${posterPath}"`;
                    execSync(posterCmd, { stdio: 'pipe' });
                } catch (e) {
                    console.error(`Failed poster for ${file}:`, e.message);
                }
            }
        }
    }
}

generatePosters(videosDir);
generatePosters(publicDir);
console.log("All poster frames created successfully!");
