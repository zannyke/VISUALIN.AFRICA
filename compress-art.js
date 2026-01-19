
import fs from 'fs';
import path from 'path';
import jpeg from 'jpeg-js';

const artDir = path.join(process.cwd(), 'public', 'art');

if (!fs.existsSync(artDir)) {
    console.log('Art directory not found');
    process.exit(0);
}

const files = fs.readdirSync(artDir);

files.forEach(file => {
    if (file.toLowerCase().endsWith('.jpg') || file.toLowerCase().endsWith('.jpeg')) {
        const filePath = path.join(artDir, file);
        const stats = fs.statSync(filePath);

        // Only compress if larger than 2MB
        if (stats.size > 2 * 1024 * 1024) {
            console.log(`Compressing ${file} (${(stats.size / 1024 / 1024).toFixed(2)} MB)...`);

            try {
                const jpegData = fs.readFileSync(filePath);
                const rawImageData = jpeg.decode(jpegData, { useTArray: true, maxMemoryUsageInMB: 2048 });

                // Encode with lower quality (e.g., 50)
                const encodedJpeg = jpeg.encode(rawImageData, 50);

                fs.writeFileSync(filePath, encodedJpeg.data);

                const newStats = fs.statSync(filePath);
                console.log(`Saved ${file} (${(newStats.size / 1024 / 1024).toFixed(2)} MB)`);
            } catch (err) {
                console.error(`Error processing ${file}:`, err);
            }
        } else {
            console.log(`Skipping ${file} (already small enough)`);
        }
    }
});
