import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, Sparkles, X, Video, Camera, Heart, Film, Radio, Layers } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import content from '../constants/content.json';

interface ServiceItem {
    title: string;
    description: string;
    features?: string[];
    icon?: any;
    fallbackVideo?: string;
}

const serviceIcons: Record<string, any> = {
    "Wedding Coverage": Heart,
    "Fashion Photography & Reels": Camera,
    "Promotional Videos": Film,
    "Behind The Scenes": Video,
    "Live Streaming": Radio,
};

const defaultServiceVideos: Record<string, string> = {
    "Promotional Videos": "/videos/makutano-promo.mp4",
    "Wedding Coverage": "/videos/wedding-reception.mp4",
    "Fashion Photography & Reels": "/videos/fashion-reels.mp4",
    "Behind The Scenes": "/videos/working.mp4",
    "Live Streaming": "/videos/behind-the-scenes.mp4",
};

// Fast video header component with poster fallback & auto-play
const ServiceVideoHeader = ({ src }: { src: string; title?: string }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleCanPlay = () => setIsLoaded(true);
        video.addEventListener('canplay', handleCanPlay);

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    video.playbackRate = 0.8;
                    video.play().catch(() => {});
                } else {
                    video.pause();
                }
            },
            { threshold: 0.2 }
        );

        observer.observe(video);
        return () => {
            video.removeEventListener('canplay', handleCanPlay);
            observer.disconnect();
        };
    }, [src]);

    return (
        <div className="w-full h-full relative bg-slate-900 overflow-hidden rounded-3xl group shadow-2xl border border-slate-100">
            {/* Ambient Loading Placeholder / Skeleton gradient */}
            {!isLoaded && (
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 animate-pulse flex items-center justify-center z-10">
                    <span className="text-white/40 text-xs uppercase tracking-widest font-medium">Loading Media...</span>
                </div>
            )}
            
            <video
                ref={videoRef}
                src={src}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ${isLoaded ? 'opacity-90' : 'opacity-0'}`}
                onError={(e) => console.error("Service video error:", src, e)}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

            <div className="absolute top-6 left-6 z-20">
                <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-[10px] font-semibold uppercase tracking-widest shadow-md">
                    Visualink Signature
                </span>
            </div>
        </div>
    );
};

const ServicesPage = () => {
    const navigate = useNavigate();
    const [galleryVideos, setGalleryVideos] = useState<any[]>([]);
    const [activeServiceModal, setActiveServiceModal] = useState<ServiceItem | null>(null);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const res = await fetch('/api/gallery');
                const contentType = res.headers.get('content-type');
                if (res.ok && contentType && contentType.includes('application/json')) {
                    const data = await res.json();
                    if (data.items) {
                        const sortedItems = data.items.sort((a: any, b: any) => b.id - a.id);
                        setGalleryVideos(sortedItems.filter((item: any) =>
                            /\.(mp4|mov|webm)$/i.test(item.url)
                        ));
                    }
                }
            } catch (e) {
                console.error("Failed to fetch dynamic service videos", e);
            }
        };
        fetchVideos();
    }, []);

    const getVideoForService = (serviceTitle: string) => {
        const match = galleryVideos.find(v => v.category === serviceTitle);
        return match ? match.url : defaultServiceVideos[serviceTitle] || "/videos/working.mp4";
    };

    const handleInquireService = (serviceTitle: string) => {
        navigate(`/contact?service=${encodeURIComponent(serviceTitle)}`);
    };

    return (
        <section className="pt-28 md:pt-36 pb-24 min-h-screen bg-white text-charcoal relative overflow-hidden">
            
            {/* Header */}
            <div className="container mx-auto px-6 mb-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl"
                >
                    <span className="text-cobalt font-semibold tracking-[0.25em] uppercase text-xs mb-4 block">
                        Our Expertise & Capabilities
                    </span>
                    <h1
                        className="font-serif font-normal text-charcoal mb-6 leading-tight"
                        style={{ fontSize: "var(--text-fluid-h2)" }}
                    >
                        Tailored Media Production. <br />
                        <span className="text-cobalt italic font-serif">Crafted for Impact.</span>
                    </h1>
                    <p className="text-slate-600 max-w-2xl text-base sm:text-lg leading-relaxed">
                        From grand wedding documentaries to commercial brand films and fashion reels, we deliver high-end visual storytelling tailored for your unique identity.
                    </p>
                </motion.div>
            </div>

            {/* Services Showcase Cards */}
            <div className="container mx-auto px-6">
                <div className="flex flex-col gap-20 md:gap-32">
                    {content.services.map((service: any, index: number) => {
                        const isEven = index % 2 === 0;
                        const videoSrc = getVideoForService(service.title);
                        const IconComponent = serviceIcons[service.title] || Layers;

                        return (
                            <motion.div
                                key={index}
                                id={service.title.replace(/\s+/g, '-').toLowerCase()}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-80px" }}
                                transition={{ duration: 0.7 }}
                                className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-20 items-center scroll-mt-36`}
                            >
                                {/* Video Visual Column */}
                                <div className="w-full lg:w-1/2 aspect-video">
                                    <ServiceVideoHeader src={videoSrc} title={service.title} />
                                </div>

                                {/* Content Column */}
                                <div className="w-full lg:w-1/2 flex flex-col justify-center">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-cobalt/10 text-cobalt flex items-center justify-center">
                                            <IconComponent size={20} />
                                        </div>
                                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cobalt">
                                            Service 0{index + 1}
                                        </span>
                                    </div>

                                    <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal mb-6 leading-snug">
                                        {service.title}
                                    </h2>

                                    <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-8">
                                        {service.description}
                                    </p>

                                    {/* Features Checklist */}
                                    <ul className="mb-10 space-y-3.5 border-t border-b border-slate-100 py-6">
                                        {service.features && service.features.map((feat: string, i: number) => (
                                            <li key={i} className="flex items-center gap-3 text-slate-700">
                                                <div className="p-1 rounded-full bg-cobalt/10 text-cobalt shrink-0">
                                                    <Check size={14} strokeWidth={3} />
                                                </div>
                                                <span className="text-sm font-medium">{feat}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="flex flex-wrap items-center gap-4">
                                        <button
                                            onClick={() => handleInquireService(service.title)}
                                            className="px-8 py-3.5 bg-charcoal text-white hover:bg-cobalt transition-all duration-300 rounded-full font-medium tracking-[0.15em] uppercase text-xs shadow-lg hover:shadow-xl flex items-center gap-2 group active:scale-95"
                                        >
                                            <span>Inquire This Service</span>
                                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                        </button>

                                        <button
                                            onClick={() => setActiveServiceModal(service)}
                                            className="px-6 py-3.5 border border-slate-200 text-charcoal hover:bg-slate-50 transition-all rounded-full font-medium tracking-[0.15em] uppercase text-xs"
                                        >
                                            View Package Specs
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Service Package Specs Modal */}
            <AnimatePresence>
                {activeServiceModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
                        onClick={() => setActiveServiceModal(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white border border-slate-100 p-8 md:p-10 rounded-3xl shadow-2xl max-w-lg w-full relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setActiveServiceModal(null)}
                                className="absolute top-6 right-6 text-slate-400 hover:text-charcoal transition-colors p-2"
                            >
                                <X size={24} />
                            </button>

                            <div className="flex items-center gap-3 mb-4">
                                <Sparkles size={20} className="text-cobalt" />
                                <span className="text-xs font-semibold uppercase tracking-widest text-cobalt">Production Spec</span>
                            </div>

                            <h3 className="text-2xl font-serif font-bold text-charcoal mb-4">
                                {activeServiceModal.title}
                            </h3>

                            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                                {activeServiceModal.description}
                            </p>

                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-8">
                                <h4 className="text-xs font-semibold uppercase tracking-wider text-charcoal mb-3">Included Deliverables:</h4>
                                <ul className="space-y-2.5">
                                    {activeServiceModal.features?.map((feat, i) => (
                                        <li key={i} className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                                            <Check size={14} className="text-cobalt shrink-0" />
                                            <span>{feat}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <button
                                onClick={() => {
                                    const title = activeServiceModal.title;
                                    setActiveServiceModal(null);
                                    handleInquireService(title);
                                }}
                                className="w-full py-4 bg-charcoal text-white hover:bg-cobalt transition-colors rounded-xl font-medium tracking-[0.15em] uppercase text-xs flex items-center justify-center gap-2"
                            >
                                <span>Book {activeServiceModal.title}</span>
                                <ArrowRight size={16} />
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </section>
    );
};

export default ServicesPage;
