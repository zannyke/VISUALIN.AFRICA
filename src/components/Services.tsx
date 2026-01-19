
import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Camera, Video, Share2, Sparkles, Tv, Plane } from 'lucide-react';

const services = [
    {
        id: 1,
        icon: Camera,
        title: "Wedding Coverage",
        desc: "Your love story deserves to be told beautifully. We capture every precious moment—laughter, tears, and joy.",
        colSpan: "md:col-span-2",
        videoSrc: "/videos/wedding-reception.mp4"
    },
    {
        id: 2,
        icon: Sparkles,
        title: "Fashion & Reels",
        desc: "Style meets storytelling. From quick-turnaround reels to high-end photoshoots.",
        colSpan: "md:col-span-1",
        videoSrc: "/videos/fashion-reels.mp4"
    },
    {
        id: 3,
        icon: Video,
        title: "Promotional Videos",
        desc: "Transform your ideas into compelling visual stories that grab attention.",
        colSpan: "md:col-span-1",
        videoSrc: "/promotional-video.mp4"
    },
    {
        id: 4,
        icon: Share2,
        title: "Social Media Management",
        desc: "We handle everything from engaging content creation to audience growth.",
        colSpan: "md:col-span-2"
    },
    {
        id: 5,
        icon: Tv,
        title: "Livestreaming",
        desc: "Go live effortlessly for events, concerts, or brand launches.",
        colSpan: "md:col-span-1"
    },
    {
        id: 6,
        icon: Plane,
        title: "Drone & Documentaries",
        desc: "Real stories, powerfully told. Deep dives into genuine emotion and meaning.",
        colSpan: "md:col-span-2"
    },
    {
        id: 7,
        icon: Video,
        title: "Corporate Event Highlights",
        desc: "Professional multi-camera setup and cinematic editing for conferences and launches.",
        colSpan: "md:col-span-3"
    }
];

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
                        <source src="/drone shots on potrait.mp4" type="video/mp4" />
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {services.map((service, index) => (
                        <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className={`backdrop-blur-xl bg-white/60 dark:bg-white/5 border border-white/20 dark:border-white/10 p-8 rounded-2xl hover:bg-white/80 dark:hover:bg-white/10 transition-all duration-300 shadow-lg hover:shadow-xl ${service.colSpan} group`}
                        >
                            {service.videoSrc && (
                                <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl overflow-hidden">
                                    <video
                                        src={service.videoSrc}
                                        className="w-full h-full object-cover"
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
                                    <div className="absolute inset-0 bg-black/60 pointer-events-none" />
                                </div>
                            )}

                            <div className="relative z-10">
                                <div className="mb-6 inline-flex p-3 rounded-xl bg-cobalt/10 dark:bg-cobalt/20 text-cobalt group-hover:bg-cobalt group-hover:text-white transition-colors duration-300">
                                    <service.icon size={32} />
                                </div>
                                <h3 className="text-2xl font-bold mb-3 text-charcoal dark:text-white group-hover:text-white transition-colors">{service.title}</h3>
                                <p className="text-slate-600 dark:text-slate-300 group-hover:text-slate-200 transition-colors leading-relaxed">
                                    {service.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
