import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';


const Hero = () => {
    const containerRef = useRef(null);
    const { scrollY } = useScroll();

    // Parallax & Fade Effects
    const y = useTransform(scrollY, [0, 1000], [0, 400]);
    const opacity = useTransform(scrollY, [0, 600], [1, 0]);
    const scale = useTransform(scrollY, [0, 1000], [1, 1.1]);

    // Video ref for speed control
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = 0.6; // Slow down video
        }
    }, []);

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
                    loop
                    muted
                    playsInline
                    preload="auto"
                    className="w-full h-full object-cover"
                >
                    <source src="/videos/working.mp4" type="video/mp4" />
                </video>
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
                        className="text-4xl sm:text-6xl md:text-7xl lg:text-9xl font-serif font-normal tracking-[0.02em] text-white mb-4 leading-[1.0]"
                    >
                        VISUALINK AFRICA
                    </motion.h1>

                    <motion.h2
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="text-lg md:text-2xl font-serif font-normal italic text-white/90 mb-12 tracking-wide"
                    >
                        Visuals That Connect.
                    </motion.h2>

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
