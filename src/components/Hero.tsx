import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';

const Typewriter = ({ text, delay = 50 }: { text: string, delay?: number }) => {
    const [currentText, setCurrentText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setCurrentText(prev => prev + text[currentIndex]);
                setCurrentIndex(prev => prev + 1);
            }, delay);
            return () => clearTimeout(timeout);
        }
    }, [currentIndex, delay, text]);

    return <span>{currentText}<span className="animate-pulse">|</span></span>;
};

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
        <section ref={containerRef} className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden bg-platinum dark:bg-obsidian">

            {/* Cinematic Video Background - Edge to Edge */}
            <motion.div
                style={{ scale }}
                className="absolute inset-0 z-0 select-none pointer-events-none"
            >
                <div className="absolute inset-0 bg-white/50 dark:bg-black/70 z-10 transition-colors duration-500" />
                <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    className="w-full h-full object-cover filter blur-[3px]"
                >
                    <source src="/videos/working.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-platinum via-transparent to-transparent dark:from-obsidian dark:via-transparent dark:to-transparent z-20" />
            </motion.div>

            <motion.div
                style={{ y, opacity }}
                className="container mx-auto px-6 relative z-30 flex flex-col items-center justify-center h-full pt-20"
            >
                <div className="max-w-5xl mx-auto text-center flex flex-col items-center justify-center">

                    {/* "New" Badge */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/40 dark:bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-1.5 shadow-xl"
                    >
                        <span className="flex h-2 w-2 rounded-full bg-cobalt"></span>
                        <span className="text-xs font-semibold uppercase tracking-widest text-charcoal dark:text-white">
                            Elevate Your Narrative
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className="font-serif font-bold tracking-tight text-charcoal dark:text-white mb-6 leading-[0.9] drop-shadow-md mix-blend-overlay dark:mix-blend-normal"
                        style={{ fontSize: "var(--text-fluid-h1)", textShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
                    >
                        VISUALINK AFRICA
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="h-10 md:h-12 font-serif font-medium text-cobalt dark:text-white/90 italic mb-10 tracking-wide"
                        style={{ fontSize: "var(--text-fluid-h3)" }}
                    >
                        <Typewriter text="Visuals That Connect." delay={80} />
                    </motion.div>

                    <motion.p
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="max-w-2xl text-slate-700 dark:text-slate-300 mb-12 leading-relaxed font-medium"
                        style={{ fontSize: "var(--text-fluid-body)" }}
                    >
                        Connecting people through powerful storytelling. <br className="hidden md:block" />
                        We craft cinematic films and bold imagery that inspire emotion.
                    </motion.p>

                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col sm:flex-row items-center gap-6"
                    >
                        <Link to="/contact" className="btn-primary flex items-center gap-3 group">
                            Start Your Project
                            <i className="transform group-hover:translate-x-1 transition-transform">→</i>
                        </Link>

                        <Link to="/gallery" className="flex items-center gap-4 cursor-pointer group">
                            <div className="w-12 h-12 rounded-full bg-white/60 dark:bg-white/10 backdrop-blur-md flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 border border-white/20">
                                <Play size={20} className="ml-1 text-charcoal dark:text-white" fill="currentColor" />
                            </div>
                            <span className="font-semibold text-charcoal dark:text-white">Watch Showreel</span>
                        </Link>
                    </motion.div>

                </div>
            </motion.div>

            {/* Scroll Hint */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-30 opacity-50"
            >
                <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-charcoal dark:via-slate-400 to-transparent" />
            </motion.div>

        </section>
    );
};

export default Hero;
