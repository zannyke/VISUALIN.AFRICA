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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-obsidian border border-slate-200 dark:border-white/10 rounded-2xl w-[95%] max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent"
            >
                {/* Header */}
                <div className="p-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-platinum/50 dark:bg-obsidian/50 backdrop-blur-md sticky top-0 z-20">
                    <h2 className="text-2xl font-serif font-bold text-charcoal dark:text-white flex items-center gap-3">
                        <div className="p-2 bg-cobalt/10 rounded-full">
                            <Scissors className="w-5 h-5 text-cobalt" />
                        </div>
                        Optimize Video
                    </h2>
                    <button
                        onClick={onCancel}
                        className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 hover:text-charcoal dark:hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-8">
                    {/* Video Preview */}
                    <div className="relative aspect-video bg-black rounded-xl overflow-hidden group shadow-lg ring-1 ring-black/5 dark:ring-white/10">
                        {videoUrl ? (
                            <video
                                ref={videoRef}
                                src={videoUrl}
                                className="w-full h-full object-contain"
                                onLoadedMetadata={handleLoadedMetadata}
                                onTimeUpdate={handleTimeUpdate}
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-slate-400">
                                <Loader className="w-8 h-8 animate-spin" />
                            </div>
                        )}

                        {/* Play Overlay */}
                        <button
                            onClick={togglePlay}
                            className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/10 transition-colors group/play"
                        >
                            {!isPlaying && (
                                <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 transition-transform group-hover/play:scale-110">
                                    <Play className="w-8 h-8 text-white fill-white ml-1" />
                                </div>
                            )}
                        </button>
                    </div>

                    {/* Controls */}
                    <div className={`space-y-8 transition-opacity ${isOptimizing ? 'opacity-50 pointer-events-none' : ''}`}>
                        {/* Trimming */}
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm items-end border-b border-slate-100 dark:border-white/5 pb-2">
                                <span className="font-serif text-lg text-charcoal dark:text-platinum">Trim Duration</span>
                                <span className="font-mono text-cobalt font-medium bg-cobalt/10 px-2 py-0.5 rounded text-xs">
                                    {formatTime(startTime)} - {formatTime(endTime)} ({formatTime(endTime - startTime)})
                                </span>
                            </div>

                            <div className="relative h-12 flex items-center">
                                {/* Track Background */}
                                <div className="absolute w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                    {/* Active Range */}
                                    <div
                                        className="absolute h-full bg-cobalt"
                                        style={{
                                            left: `${(startTime / duration) * 100}%`,
                                            right: `${100 - (endTime / duration) * 100}%`
                                        }}
                                    />
                                </div>

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
                                {/* Visual Thumbs (Optional Enhancement, currently relying on range inputs below for precise control) */}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                                <div className="bg-platinum dark:bg-white/5 p-4 rounded-xl border border-slate-200 dark:border-white/5">
                                    <label className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-2 block">Start</label>
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
                                            }
                                        }}
                                        className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cobalt"
                                    />
                                    <div className="mt-2 text-right font-mono text-sm text-charcoal dark:text-platinum">{formatTime(startTime)}</div>
                                </div>
                                <div className="bg-platinum dark:bg-white/5 p-4 rounded-xl border border-slate-200 dark:border-white/5">
                                    <label className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-2 block">End</label>
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
                                            }
                                        }}
                                        className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cobalt"
                                    />
                                    <div className="mt-2 text-right font-mono text-sm text-charcoal dark:text-platinum">{formatTime(endTime)}</div>
                                </div>
                            </div>
                        </div>

                        {/* Export Quality */}
                        <div className="space-y-4">
                            <label className="font-serif text-lg text-charcoal dark:text-platinum block border-b border-slate-100 dark:border-white/5 pb-2">Export Quality</label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {(['low', 'medium', 'high'] as const).map((level) => (
                                    <button
                                        key={level}
                                        onClick={() => setCompressionLevel(level)}
                                        className={`group relative px-4 py-3 rounded-xl text-left transition-all duration-300 border ${compressionLevel === level
                                            ? 'bg-cobalt text-white border-cobalt shadow-lg shadow-cobalt/20'
                                            : 'bg-white dark:bg-white/5 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:border-cobalt/50 hover:bg-slate-50 dark:hover:bg-white/10'
                                            }`}
                                    >
                                        <span className="block font-bold text-sm mb-1">
                                            {level === 'low' ? 'Original' : level === 'medium' ? 'Balanced' : 'Compressed'}
                                        </span>
                                        <span className={`block text-xs ${compressionLevel === level ? 'text-white/80' : 'text-slate-400 group-hover:text-slate-500 dark:group-hover:text-slate-300'}`}>
                                            {level === 'low' ? 'Best Quality' : level === 'medium' ? 'Standard' : 'Smallest Size'}
                                        </span>
                                        {compressionLevel === level && (
                                            <div className="absolute top-3 right-3">
                                                <Check className="w-4 h-4" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg flex items-start gap-2 border border-blue-100 dark:border-blue-900/30">
                                <span className="text-cobalt">ℹ</span>
                                Trimming reduces file size by removing unused parts. "Original" keeps quality intact.
                            </p>
                        </div>
                    </div>

                    {/* Footer / Status */}
                    <div className="border-t border-slate-100 dark:border-white/5 pt-6 flex flex-col sm:flex-row justify-between items-center gap-6 sticky bottom-0 bg-white/95 dark:bg-obsidian/95 backdrop-blur-xl -mx-6 -mb-6 p-6 z-20">
                        <div className="text-sm w-full sm:w-auto text-center sm:text-left flex items-center justify-center sm:justify-start gap-3">
                            {isOptimizing ? (
                                <div className="flex items-center gap-3 text-cobalt font-medium animate-pulse">
                                    <Loader className="w-5 h-5 animate-spin" />
                                    <span>{progress > 0 ? `Processing: ${progress}%` : message}</span>
                                </div>
                            ) : !loaded ? (
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Loader className="w-4 h-4 animate-spin" />
                                    <span>{message}</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium">
                                    <span className="bg-slate-100 dark:bg-white/10 px-2 py-1 rounded text-xs">ORIGINAL</span>
                                    {(file.size / (1024 * 1024)).toFixed(1)} MB
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3 w-full sm:w-auto">
                            <button
                                onClick={onCancel}
                                disabled={isOptimizing}
                                className="flex-1 sm:flex-none px-6 py-3 rounded-xl text-sm font-bold text-slate-500 hover:text-charcoal dark:text-slate-400 dark:hover:text-white border border-transparent hover:bg-slate-100 dark:hover:bg-white/5 transition-all disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={processVideo}
                                disabled={!loaded || isOptimizing}
                                className="flex-1 sm:flex-none px-8 py-3 bg-cobalt text-white text-sm font-bold rounded-xl hover:bg-[#ff851b] shadow-lg shadow-cobalt/20 hover:shadow-cobalt/40 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
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
