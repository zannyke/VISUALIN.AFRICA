import { motion } from 'framer-motion';
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
    "Wedding Coverage": "/videos/wedding-reception.mp4",
    "Fashion Photography & Reels": "/videos/fashion-reels.mp4",
    "Promotional Videos": "/videos/makutano.mp4",
    "Livestreaming": "/videos/behind-the-scenes.mp4",
    "Documentary & Drone Coverage": "/drone-shots-portrait.mp4",
    "Corporate Event Highlights": "/videos/kcb-lawyers.mp4"
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
    const navigate = useNavigate();

    const handleCardClick = (title: string) => {
        const slug = title.replace(/\s+/g, '-').toLowerCase();
        navigate(`/services#${slug}`);
        setTimeout(() => {
            const element = document.getElementById(slug);
            if (element) element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    return (
        <section id="services" className="py-28 relative min-h-screen bg-white transition-colors duration-300">

            <div className="container mx-auto px-6 relative z-30">
                <div className="mb-20 text-center">
                    <span className="text-cobalt font-medium tracking-[0.2em] uppercase text-[10px] mb-3 block">
                        Our Services
                    </span>
                    <h2 className="text-4xl md:text-5xl font-serif font-normal text-charcoal mb-6">
                        What We Do
                    </h2>
                    <p className="text-slate-600 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
                        We offer a comprehensive suite of visual solutions designed to elevate your brand and capture your most important moments.
                    </p>
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
