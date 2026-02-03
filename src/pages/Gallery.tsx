import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

import { Play, X } from 'lucide-react';
import FineArtSlideshow from '../components/FineArtSlideshow';

// Helper component for auto-playing videos on scroll
const VideoThumbnail = ({ src }: { src: string }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                const video = videoRef.current;
                if (!video) return;

                if (entry.isIntersecting) {
                    // "play slow ly" - Cinematic slow motion
                    video.playbackRate = 0.7;
                    video.play().catch(() => { });
                } else {
                    video.pause();
                }
            },
            { threshold: 0.3 } // Start playing when 30% visible
        );

        if (videoRef.current) observer.observe(videoRef.current);

        return () => observer.disconnect();
    }, []);

    return (
        <div className="w-full h-full relative bg-gray-900">
            <video
                ref={videoRef}
                src={src}
                className="w-full h-full object-cover opacity-90"
                muted
                loop
                playsInline
                preload="metadata"
            />
        </div>
    );
};

const Gallery = () => {
    type GalleryItem =
        | { type: 'image', id?: string | number, src: string, title?: string, category?: string, orientation?: 'portrait' | 'landscape' }
        | { type: 'video', id?: string | number, src: string, title?: string, category?: string, orientation?: 'portrait' | 'landscape' }
        | { type: 'slideshow', id?: string | number, images: string[], title: string, category: string, orientation: 'portrait' | 'landscape' };

    const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
    const [dbItems, setDbItems] = useState<GalleryItem[]>([]);

    // Helper to check if source is a video file
    const isVideoFile = (src: string) => /\.(mp4|mov|webm|ogg|quicktime)$/i.test(src);

    useEffect(() => {
        const fetchGalleryItems = async () => {
            try {
                const response = await fetch('/api/gallery');
                if (response.ok) {
                    const data = await response.json();
                    if (data.items) {
                        const formattedItems: GalleryItem[] = data.items
                            .sort((a: any, b: any) => b.id - a.id) // Recent first
                            .map((item: any) => {
                                const isVideo = isVideoFile(item.url) || item.url.includes('youtube') || item.url.includes('vimeo');
                                return {
                                    type: isVideo ? 'video' : 'image',
                                    id: item.id,
                                    src: item.url,
                                    title: item.title,
                                    category: item.category,
                                    orientation: 'landscape'
                                };
                            });
                        setDbItems(formattedItems);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch gallery items", error);
            }
        };

        fetchGalleryItems();
    }, []);

    // Mixed Gallery Items
    const allItems = dbItems;

    const featuredItems = allItems.filter(x => x.type === 'video').slice(0, 5) as Extract<GalleryItem, { type: 'video' }>[];

    return (
        <section className="pt-28 md:pt-32 pb-24 min-h-screen bg-platinum dark:bg-obsidian transition-colors duration-500 overflow-hidden">

            {/* Header */}
            <div className="container mx-auto px-6 mb-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-4xl"
                >
                    <span className="text-cobalt font-bold tracking-widest uppercase text-xs mb-4 block">Portfolio</span>
                    <h2
                        className="font-serif font-bold text-charcoal dark:text-white mb-8"
                        style={{ fontSize: "var(--text-fluid-h2)" }}
                    >
                        Selected Works.
                    </h2>
                    <p
                        className="text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed"
                        style={{ fontSize: "var(--text-fluid-body)" }}
                    >
                        A curation of our finest moments. From intimate weddings to high-energy commercial productions.
                    </p>
                </motion.div>
            </div>

            {/* Carousel Section */}
            <div className="mb-32 relative pl-6 md:pl-0">
                <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 md:gap-10 pb-10 scrollbar-hide px-6 md:px-12">
                    {featuredItems.map((item, index) => (
                        <motion.div
                            key={index}
                            className="min-w-[85vw] md:min-w-[60vw] lg:min-w-[45vw] aspect-video snap-center relative rounded-3xl overflow-hidden cursor-pointer group shadow-2xl bg-black"
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.4 }}
                            onClick={() => setSelectedItem(item)}
                        >
                            {isVideoFile(item.src) ? (
                                <video
                                    key={item.src}
                                    src={item.src}
                                    className="w-full h-full object-cover pointer-events-none group-hover:scale-105 transition-transform duration-700 opacity-90"
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    preload="auto"
                                    onError={(e) => console.error("Gallery featured video error:", item.src, e)}
                                />
                            ) : (
                                <iframe
                                    src={`${item.src}?autoplay=0&controls=0&showinfo=0&rel=0`}
                                    className="w-full h-full object-cover pointer-events-none group-hover:scale-105 transition-transform duration-700"
                                    title={item.title}
                                    loading="lazy"
                                />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                            <div className="absolute bottom-0 left-0 p-8 w-full">
                                <span className="text-cobalt font-bold uppercase tracking-wider text-xs mb-2 block">{item.category}</span>
                                <h3
                                    className="font-serif text-white font-bold mb-2"
                                    style={{ fontSize: "var(--text-fluid-h3)" }}
                                >
                                    {item.title}
                                </h3>
                                <div className="flex items-center gap-2 text-white/80 group-hover:text-white transition-colors">
                                    <Play size={16} fill="currentColor" />
                                    <span className="font-medium text-sm">Watch Film</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Masonry Grid */}
            <div className="container mx-auto px-6">
                <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                    {allItems.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "50px" }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="group relative cursor-pointer break-inside-avoid"
                            onClick={() => item.type !== 'slideshow' && setSelectedItem(item)}
                        >
                            <div className={`relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 dark:shadow-none bg-gray-200 dark:bg-white/5 ${item.type === 'video' ? 'aspect-video' : ''}`}>

                                {item.type === 'slideshow' ? (
                                    <FineArtSlideshow
                                        images={item.images}
                                        title={item.title}
                                        category={item.category}
                                        onImageClick={(src) => setSelectedItem({ type: 'image', src, title: item.title, category: item.category, orientation: item.orientation })}
                                    />
                                ) : item.type === 'image' ? (
                                    <img
                                        src={item.src}
                                        alt={item.title}
                                        className="w-full h-auto block transform group-hover:scale-105 transition-transform duration-700"
                                        loading="lazy"
                                    />
                                ) : item.type === 'video' ? (
                                    isVideoFile(item.src) ? (
                                        <VideoThumbnail src={item.src} />
                                    ) : (
                                        <div className="aspect-video bg-black relative">
                                            <img
                                                src={`https://img.youtube.com/vi/${item.src.split('/').pop()}/maxresdefault.jpg`}
                                                className="w-full h-full object-cover opacity-80"
                                                alt={item.title}
                                                loading="lazy"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                }}
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                <Play className="text-white opacity-50" size={48} />
                                            </div>
                                        </div>
                                    )
                                ) : null}

                                {item.type !== 'slideshow' && (
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                        <span className="text-cobalt text-xs font-bold uppercase tracking-wider">{item.category}</span>
                                        <h4
                                            className="text-white font-serif"
                                            style={{ fontSize: "var(--text-fluid-h4)" }}
                                        >
                                            {item.title}
                                        </h4>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Immersive Lightbox */}
            <AnimatePresence>
                {selectedItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/98 backdrop-blur-xl"
                        onClick={() => setSelectedItem(null)}
                    >
                        <button
                            className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors p-2 z-50"
                            onClick={() => setSelectedItem(null)}
                        >
                            <X size={40} strokeWidth={1} />
                        </button>

                        <div className="w-full h-full p-4 md:p-12 flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                            {selectedItem.type === 'image' ? (
                                <img
                                    src={selectedItem.src}
                                    alt="Full View"
                                    className="max-w-full max-h-full object-contain shadow-2xl rounded-sm"
                                />
                            ) : selectedItem.type === 'video' ? (
                                <div className="w-full max-w-6xl aspect-video relative bg-black rounded-xl overflow-hidden shadow-2xl border border-white/10">
                                    {isVideoFile(selectedItem.src) ? (
                                        <video
                                            src={selectedItem.src}
                                            className="w-full h-full"
                                            controls
                                            autoPlay
                                            playsInline
                                        />
                                    ) : (
                                        <iframe
                                            src={`${selectedItem.src}${selectedItem.src.includes('?') ? '&' : '?'}autoplay=1&modestbranding=1&rel=0&showinfo=0`}
                                            className="w-full h-full"
                                            allow="autoplay; encrypted-media; fullscreen"
                                            allowFullScreen
                                            title={selectedItem.title}
                                        />
                                    )}
                                </div>
                            ) : null}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </section >
    );
};

export default Gallery;
