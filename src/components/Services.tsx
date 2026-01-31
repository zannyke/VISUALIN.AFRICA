
import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Camera, Video, Sparkles, Tv, Plane, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import content from '../constants/content.json';

const iconMap: Record<string, any> = {
    "Wedding Coverage": Camera,
    "Fashion Photography & Reels": Sparkles,
    "Promotional Videos": Video,
    "Livestreaming": Tv,
    "Documentary & Drone Coverage": Plane,
    "Corporate Event Highlights": Video
};

const videoMap: Record<string, string> = {
    "Wedding Coverage": "/videos/wedding-reception.mp4",
    "Fashion Photography & Reels": "/videos/fashion-reels.mp4",
    "Promotional Videos": "/promotional-video.mp4"
};

const services = content.services.map((service, index) => ({
    id: index + 1,
    icon: iconMap[service.title] || Video,
    title: service.title,
    desc: service.description,
    features: service.features,
    videoSrc: videoMap[service.title]
}));

const Services = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [0, 200]);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = 0.7;
        }
    }, []);

    return (
        <section ref={containerRef} id="services" className="py-24 relative min-h-screen overflow-hidden bg-platinum dark:bg-obsidian transition-colors duration-300">

            {/* Background Video */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-white/80 dark:bg-black/80 z-10 transition-colors duration-500" />
                <motion.div style={{ y }} className="absolute inset-0 w-full h-[120%] -top-[10%]">
                    <video
                        ref={videoRef}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover filter blur-[2px]"
                    >
                        <source src="/drone-shots-portrait.mp4" type="video/mp4" />
                    </video>
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-b from-platinum via-transparent to-platinum dark:from-obsidian dark:via-transparent dark:to-obsidian z-20" />
            </div>

            <div className="container mx-auto px-6 relative z-30">
                <div className="mb-16 text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-serif font-bold mb-4 text-charcoal dark:text-white"
                    >
                        Our Services
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-600 dark:text-slate-300 text-lg max-w-2xl mx-auto font-medium"
                    >
                        We offer a comprehensive suite of visual solutions designed to elevate your brand and capture your most important moments.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className={`relative overflow-hidden h-full backdrop-blur-3xl bg-white/80 dark:bg-white/5 border border-white/40 dark:border-white/10 p-6 rounded-2xl hover:bg-slate-950 dark:hover:bg-slate-950 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-cobalt/10 group ring-1 ring-white/20 hover:ring-cobalt/50`}
                        >
                            {/* Cinematic Background Gradient - Visible on Hover for uniform grading */}
                            <div className="absolute inset-0 bg-gradient-to-br from-cobalt/10 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                            {service.videoSrc && (
                                <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-all duration-700 rounded-2xl overflow-hidden">
                                    <video
                                        src={service.videoSrc}
                                        className="w-full h-full object-cover transform scale-110 group-hover:scale-100 transition-transform duration-[2s]"
                                        muted
                                        loop
                                        playsInline
                                        preload="none"
                                        onMouseEnter={(e) => e.currentTarget.play()}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.pause();
                                            e.currentTarget.currentTime = 0;
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-slate-950/80 group-hover:bg-slate-950/40 transition-colors duration-500" />
                                </div>
                            )}

                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div>
                                    <div className="mb-6 inline-flex p-4 rounded-2xl bg-white/50 dark:bg-white/10 border border-white/20 text-cobalt group-hover:bg-cobalt group-hover:text-white group-hover:border-cobalt transition-all duration-300 shadow-sm backdrop-blur-md">
                                        <service.icon size={28} strokeWidth={1.5} />
                                    </div>
                                    <h3 className="text-3xl font-serif font-bold mb-3 text-charcoal dark:text-white group-hover:text-white transition-colors tracking-tight">{service.title}</h3>
                                    <p className="text-slate-600 dark:text-slate-400 group-hover:text-slate-200 transition-colors leading-relaxed text-base mb-4">
                                        {service.desc}
                                    </p>

                                    <ul className="space-y-1 mb-2">
                                        {service.features.map((feature, i) => (
                                            <li key={i} className="text-sm text-slate-500 dark:text-slate-400 group-hover:text-slate-300 flex items-center gap-2">
                                                <span className="w-1 h-1 bg-cobalt group-hover:bg-white rounded-full" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/10 group-hover:border-white/20 transition-colors flex items-center gap-2 text-cobalt group-hover:text-white font-medium opacity-60 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                    <span className="text-sm uppercase tracking-widest">Explore Service</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover:translate-x-1 transition-transform"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <Link to="/gallery" className="btn-primary inline-flex items-center gap-2">
                        Explore More <ArrowRight size={20} />
                    </Link>
                </div>
            </div>
        </section >
    );
};

export default Services;
