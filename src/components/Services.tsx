
import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Camera, Film, Megaphone, Radio, Aperture, Briefcase, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import content from '../constants/content.json';

const iconMap: Record<string, any> = {
    "Wedding Coverage": Camera,
    "Fashion Photography & Reels": Film,
    "Promotional Videos": Megaphone,
    "Livestreaming": Radio,
    "Documentary & Drone Coverage": Aperture,
    "Corporate Event Highlights": Briefcase
};

const videoMap: Record<string, string> = {
    "Wedding Coverage": "/videos/dr-godfrey-maggie-test.mp4",
    "Fashion Photography & Reels": "/videos/fashion-reels.mp4",
    "Promotional Videos": "/promotional-video.mp4"
};

const services = content.services.map((service, index) => ({
    id: index + 1,
    icon: iconMap[service.title] || Film,
    title: service.title,
    desc: service.description,
    features: service.features,
    videoSrc: videoMap[service.title]
}));

const Services = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef(null);
    const navigate = useNavigate();
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

    const handleCardClick = (title: string) => {
        const slug = title.replace(/\s+/g, '-').toLowerCase();
        navigate(`/services#${slug}`);
        // Optional: Manual scroll if hash navigation doesn't trigger automatically on page load quickly enough
        setTimeout(() => {
            const element = document.getElementById(slug);
            if (element) element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

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
                            onClick={() => handleCardClick(service.title)}
                            className="relative overflow-hidden aspect-[4/3] w-full cursor-pointer group bg-obsidian rounded-sm"
                        >
                            {/* Video / Media Layer */}
                            <div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
                                {service.videoSrc ? (
                                    <video
                                        src={service.videoSrc}
                                        className="w-full h-full object-cover transform scale-105 group-hover:scale-100 transition-transform duration-[1.5s]"
                                        muted
                                        loop
                                        playsInline
                                        autoPlay
                                        preload="auto"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-charcoal to-obsidian flex items-center justify-center opacity-85 group-hover:scale-105 transition-transform duration-750">
                                        <service.icon size={48} className="text-white/10" strokeWidth={1} />
                                    </div>
                                )}
                            </div>

                            {/* Hover Overlay Layer */}
                            <div className="absolute inset-0 z-10 bg-black/45 group-hover:bg-black/80 transition-all duration-500 flex flex-col justify-between p-8">
                                {/* Top Label / Icon */}
                                <div className="flex justify-between items-start opacity-80 group-hover:opacity-100 transition-opacity">
                                    <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-white/60">
                                        0{service.id}
                                    </span>
                                    <service.icon size={18} className="text-white" strokeWidth={1.5} />
                                </div>

                                {/* Text Details */}
                                <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                                    <h3 className="text-2xl font-serif font-normal text-white mb-2 leading-tight">
                                        {service.title}
                                    </h3>

                                    {/* Fades in on hover */}
                                    <div className="h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-500 overflow-hidden">
                                        <p className="text-white/80 text-xs font-medium leading-relaxed mb-4">
                                            {service.desc}
                                        </p>
                                        <ul className="space-y-1 mb-2">
                                            {service.features.map((feature, i) => (
                                                <li key={i} className="text-[11px] text-white/70 flex items-center gap-2">
                                                    <span className="w-1 h-1 bg-white rounded-full animate-pulse" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="mt-4 flex items-center gap-2 text-white font-medium">
                                        <span className="text-[10px] uppercase tracking-[0.18em]">Explore Service</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover:translate-x-1 transition-transform"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                                    </div>
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
