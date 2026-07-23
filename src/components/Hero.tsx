import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';

const defaultHeroVideos = [
    "/videos/working.mp4",
    "/videos/wedding-reception.mp4",
    "/videos/makutano.mp4",
    "/videos/behind-the-scenes.mp4",
    "/videos/dr-godfrey-maggie-2.mp4"
];

const Hero = () => {
    const containerRef = useRef(null);
    const { scrollY } = useScroll();
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [videosList, setVideosList] = useState<string[]>(defaultHeroVideos);

    // Fetch dynamic videos uploaded via Admin panel / Cloudflare R2 storage
    useEffect(() => {
        const fetchDynamicVideos = async () => {
            try {
                const res = await fetch('/api/gallery');
                const contentType = res.headers.get('content-type');
                if (res.ok && contentType && contentType.includes('application/json')) {
                    const data = await res.json();
                    if (data.items && data.items.length > 0) {
                        const dynamicUrls = data.items
                            .sort((a: any, b: any) => b.id - a.id)
                            .map((item: any) => item.url)
                            .filter((url: string) => /\.(mp4|mov|webm)$/i.test(url));
                        
                        if (dynamicUrls.length > 0) {
                            // Merge dynamic uploaded videos with default fallbacks
                            const combined = Array.from(new Set([...dynamicUrls, ...defaultHeroVideos]));
                            setVideosList(combined);
                        }
                    }
                }
            } catch (err) {
                console.error("Failed to fetch dynamic hero videos:", err);
            }
        };
        fetchDynamicVideos();
    }, []);

    // Parallax & Fade Effects
    const y = useTransform(scrollY, [0, 1000], [0, 400]);
    const opacity = useTransform(scrollY, [0, 600], [1, 0]);
    const scale = useTransform(scrollY, [0, 1000], [1, 1.1]);

    // Video ref for speed control and source switching
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = 0.65; // Slow down video
            videoRef.current.load();
            videoRef.current.play().catch(e => console.log("Auto-play blocked or interrupted:", e));
        }
    }, [currentVideoIndex, videosList]);

    return (
        <section ref={containerRef} className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-black">

            {/* Cinematic Video Background - Edge to Edge */}
            <motion.div
                style={{ scale }}
                className="absolute inset-0 z-0 select-none pointer-events-none"
            >
                <div className="absolute inset-0 bg-black/40 z-10" />
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    preload="auto"
                    src={videosList[currentVideoIndex]}
                    onEnded={() => setCurrentVideoIndex((prev) => (prev + 1) % videosList.length)}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-20" />
            </motion.div>

            <motion.div
                style={{ y, opacity }}
                className="container mx-auto px-6 relative z-30 flex flex-col items-center justify-center h-full pt-20"
            >
                <div className="max-w-5xl mx-auto text-center flex flex-col items-center justify-center">

                    <motion.h1
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-normal tracking-[0.02em] text-white mb-6 leading-[1.1]"
                    >
                        VISUALINK AFRICA
                    </motion.h1>

                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="font-sans font-medium uppercase tracking-[0.25em] text-xs sm:text-sm text-white/80 mb-12 block"
                    >
                        Visuals That Connect
                    </motion.span>

                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col sm:flex-row items-center gap-6"
                    >
                        <Link to="/contact" className="px-8 py-3.5 bg-white text-black hover:bg-transparent hover:text-white border-2 border-white rounded-full font-medium tracking-[0.18em] uppercase text-xs transition-all duration-300 ease-out transform active:scale-95 shadow-none focus:outline-none flex items-center gap-2">
                            Start Your Project
                            <i>→</i>
                        </Link>

                        <Link to="/gallery" className="flex items-center gap-4 cursor-pointer group">
                            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/25 group-hover:bg-white group-hover:text-black transition-all duration-300">
                                <Play size={18} className="ml-1 text-white group-hover:text-black transition-colors" fill="currentColor" />
                            </div>
                            <span className="font-medium tracking-[0.15em] text-[11px] uppercase text-white">Watch Showreel</span>
                        </Link>
                    </motion.div>

                </div>
            </motion.div>

            {/* Scroll Hint */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-30 opacity-40"
            >
                <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-white to-transparent" />
            </motion.div>

        </section>
    );
};

export default Hero;
