import { useState, useRef, useEffect } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL, fetchFile } from '@ffmpeg/util';
import { Loader, Scissors, Check, X, Play } from 'lucide-react';
import { motion } from 'framer-motion';

interface VideoOptimizerProps {
    file: File;
    onOptimize: (optimizedFile: File) => void;
    onCancel: () => void;
}

export default function VideoOptimizer({ file, onOptimize, onCancel }: VideoOptimizerProps) {
    const [loaded, setLoaded] = useState(false);
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState('Loading optimization engine...');
    const ffmpegRef = useRef(new FFmpeg());
    const [videoUrl, setVideoUrl] = useState<string>('');

    // Video Metadata
    const [duration, setDuration] = useState(0);
    const [startTime, setStartTime] = useState(0);
    const [endTime, setEndTime] = useState(0);
    const [compressionLevel, setCompressionLevel] = useState<'low' | 'medium' | 'high'>('low');

    // Preview
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Initial Load
    useEffect(() => {
        load();
        const url = URL.createObjectURL(file);
        setVideoUrl(url);

        return () => {
            if (url) URL.revokeObjectURL(url);
        }
    }, []);

    const load = async () => {
        // Use the single-threaded core (no-mt) to avoid SharedArrayBuffer issues (COOP/COEP)
        // This is slightly slower but works in all environments without special headers.
        const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
        const ffmpeg = ffmpegRef.current;

        ffmpeg.on('log', () => {
            // console.log(message);
        });

        ffmpeg.on('progress', ({ progress }: { progress: number }) => {
            setProgress(Math.round(progress * 100));
        });

        try {
            await ffmpeg.load({
                coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
                wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
            });
            setLoaded(true);
            setMessage('');
        } catch (error) {
            console.error(error);
            const err = error as Error;
            setMessage(`Failed to load video engine: ${err.message || 'Unknown error (check console)'}`);
        }
    };

    const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
        const dur = e.currentTarget.duration;
        setDuration(dur);
        setEndTime(dur);
    };

    const processVideo = async () => {
        setIsOptimizing(true);
        setMessage('Processing video... This may take a minute.');
        const ffmpeg = ffmpegRef.current;

        try {
            const inputName = 'input.mp4';
            const outputName = 'output.mp4';

            await ffmpeg.writeFile(inputName, await fetchFile(file));

            // Build FFmpeg Command
            let args: string[] = [];

            if (compressionLevel === 'low') {
                // EXTREMELY FAST: "Stream Copy"
                // No re-encoding. Just cuts the file at the keyframes nearest the start/end.
                // Quality is 100% original.
                args = [
                    '-i', inputName,
                    '-ss', startTime.toString(),
                    '-to', endTime.toString(),
                    '-c', 'copy', // The magic flag for speed
                    outputName
                ];
            } else {
                // SLOWER: Re-encoding for size reduction
                let crf = '28'; // Medium
                if (compressionLevel === 'high') crf = '32'; // High

                args = [
                    '-i', inputName,
                    '-ss', startTime.toString(),
                    '-to', endTime.toString(),
                    '-vcodec', 'libx264',
                    '-crf', crf,
                    '-preset', 'ultrafast', // prioritizing speed over max compression
                    outputName
                ];
            }

            await ffmpeg.exec(args);

            const data = await ffmpeg.readFile(outputName);
            const optimizedBlob = new Blob([data as any], { type: 'video/mp4' });
            const optimizedFile = new File([optimizedBlob], `optimized-${file.name}`, { type: 'video/mp4' });

            onOptimize(optimizedFile);

        } catch (error) {
            console.error(error);
            setMessage('Optimization failed.');
            setIsOptimizing(false);
        }
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const togglePlay = () => {
        if (!videoRef.current) return;
        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.currentTime = startTime;
            videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    // Stop playback if it passes endTime
    const handleTimeUpdate = () => {
        if (!videoRef.current) return;
        if (videoRef.current.currentTime >= endTime) {
            videoRef.current.pause();
            setIsPlaying(false);
            videoRef.current.currentTime = startTime;
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-zinc-900 border border-zinc-800 rounded-xl w-[95%] max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent"
            >
                {/* Header */}
                <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
                    <h2 className="text-white font-serif flex items-center gap-2">
                        <Scissors className="w-5 h-5 text-orange-500" />
                        Optimize Video
                    </h2>
                    <button onClick={onCancel} className="text-zinc-400 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Video Preview */}
                    <div className="relative aspect-video bg-black rounded-lg overflow-hidden group border border-zinc-800">
                        {videoUrl ? (
                            <video
                                ref={videoRef}
                                src={videoUrl}
                                className="w-full h-full object-contain"
                                onLoadedMetadata={handleLoadedMetadata}
                                onTimeUpdate={handleTimeUpdate}
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-zinc-500">
                                <Loader className="w-8 h-8 animate-spin" />
                            </div>
                        )}

                        {/* Play Overlay */}
                        <button
                            onClick={togglePlay}
                            className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/10 transition-colors"
                        >
                            {!isPlaying && <Play className="w-12 h-12 text-white opacity-80" />}
                        </button>
                    </div>

                    {/* Controls */}
                    <div className={`space-y-6 transition-opacity ${isOptimizing ? 'opacity-50 pointer-events-none' : ''}`}>
                        {/* Trimming */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm text-zinc-400">
                                <span>Trim Duration</span>
                                <span className="text-white font-mono">{formatTime(startTime)} - {formatTime(endTime)} ({formatTime(endTime - startTime)})</span>
                            </div>
                            <div className="relative h-2 bg-zinc-800 rounded-full">
                                {/* Track */}
                                <div
                                    className="absolute h-full bg-orange-500/30 rounded-full"
                                    style={{
                                        left: `${(startTime / duration) * 100}%`,
                                        right: `${100 - (endTime / duration) * 100}%`
                                    }}
                                />
                                {/* Start Thumb */}
                                <input
                                    type="range"
                                    min={0}
                                    max={duration}
                                    step={0.1}
                                    value={startTime}
                                    onChange={(e) => {
                                        const val = Number(e.target.value);
                                        if (val < endTime) setStartTime(val);
                                        if (videoRef.current) videoRef.current.currentTime = val;
                                    }}
                                    className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
                                />
                                {/* End Thumb (Visual Fake or Requires Dual Slider lib) */}
                                {/* For simplicity, we just use two separate range inputs below */}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-zinc-500">Start Time</label>
                                    <input
                                        type="range"
                                        min={0}
                                        max={duration}
                                        step={1}
                                        value={startTime}
                                        onChange={(e) => {
                                            const val = Number(e.target.value);
                                            if (val < endTime) setStartTime(val);
                                            if (videoRef.current) {
                                                videoRef.current.currentTime = val;
                                                // videoRef.current.pause();
                                                // setIsPlaying(false);
                                            }
                                        }}
                                        className="w-full accent-orange-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-zinc-500">End Time</label>
                                    <input
                                        type="range"
                                        min={0}
                                        max={duration}
                                        step={1}
                                        value={endTime}
                                        onChange={(e) => {
                                            const val = Number(e.target.value);
                                            if (val > startTime) setEndTime(val);
                                            if (videoRef.current) {
                                                videoRef.current.currentTime = val;
                                                // videoRef.current.pause();
                                                // setIsPlaying(false);
                                            }
                                        }}
                                        className="w-full accent-orange-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Export Quality */}
                        <div className="space-y-2">
                            <label className="text-sm text-zinc-400">Export Quality</label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                {(['low', 'medium', 'high'] as const).map((level) => (
                                    <button
                                        key={level}
                                        onClick={() => setCompressionLevel(level)}
                                        className={`px-3 py-2 rounded-lg text-sm transition-colors border ${compressionLevel === level
                                            ? 'bg-orange-500 text-white border-orange-500'
                                            : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700'
                                            }`}
                                    >
                                        {level === 'low' ? 'Original Quality' : level === 'medium' ? 'Balanced' : 'Max Compression'}
                                        <span className="block text-xs opacity-70">
                                            {level === 'low' ? 'Larger File' : level === 'medium' ? 'Standard' : 'Smallest File'}
                                        </span>
                                    </button>
                                ))}
                            </div>
                            <p className="text-xs text-zinc-500 mt-1">
                                Trimming the video will naturally reduce file size by discarding unused parts.
                            </p>
                        </div>
                    </div>

                    {/* Footer / Status */}
                    <div className="border-t border-zinc-800 pt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="text-sm w-full sm:w-auto text-center sm:text-left">
                            {isOptimizing ? (
                                <span className="text-orange-400 flex items-center justify-center sm:justify-start gap-2">
                                    <Loader className="w-4 h-4 animate-spin" />
                                    {progress > 0 ? `Compressing: ${progress}%` : message}
                                </span>
                            ) : !loaded ? (
                                <span className="text-zinc-500 flex items-center gap-2">
                                    <Loader className="w-4 h-4 animate-spin" />
                                    {message}
                                </span>
                            ) : (
                                <span className="text-zinc-400">
                                    Original: {(file.size / (1024 * 1024)).toFixed(1)} MB
                                </span>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={onCancel}
                                disabled={isOptimizing}
                                className="px-4 py-2 text-sm text-zinc-400 hover:text-white disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={processVideo}
                                disabled={!loaded || isOptimizing}
                                className="px-4 py-2 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isOptimizing ? 'Processing...' : 'Trim & Save'}
                                {!isOptimizing && <Check className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
