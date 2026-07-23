import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Play, X, ChevronLeft, ChevronRight, Filter, Film, Image as ImageIcon } from 'lucide-react';
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
                    video.playbackRate = 0.75;
                    video.play().catch(() => { });
                } else {
                    video.pause();
                }
            },
            { threshold: 0.3 }
        );

        if (videoRef.current) observer.observe(videoRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div className="w-full h-full relative bg-black overflow-hidden">
            <video
                ref={videoRef}
                src={src}
                className="w-full h-full object-cover opacity-90 transition-transform duration-700 hover:scale-105"
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

    const defaultGalleryItems: GalleryItem[] = [
        {
            type: 'video',
            id: 101,
            src: "/videos/wedding-reception.mp4",
            title: "Wedding Reception Highlights",
            category: "Wedding Coverage",
            orientation: "landscape"
        },
        {
            type: 'video',
            id: 102,
            src: "/videos/fashion-reels.mp4",
            title: "Vibrant Fashion Campaign",
            category: "Fashion Photography & Reels",
            orientation: "landscape"
        },
        {
            type: 'video',
            id: 103,
            src: "/videos/makutano.mp4",
            title: "Makutano Promo Film",
            category: "Promotional Videos",
            orientation: "landscape"
        },
        {
            type: 'video',
            id: 104,
            src: "/videos/working.mp4",
            title: "Behind The Scenes Creative Workflow",
            category: "Behind The Scenes",
            orientation: "landscape"
        },
        {
            type: 'video',
            id: 105,
            src: "/videos/dr-godfrey-maggie-2.mp4",
            title: "Dr. Godfrey & Maggie Wedding Docu",
            category: "Wedding Coverage",
            orientation: "landscape"
        },
        {
            type: 'video',
            id: 106,
            src: "/videos/kcb-lawyers.mp4",
            title: "KCB Corporate Documentary",
            category: "Promotional Videos",
            orientation: "landscape"
        },
        {
            type: 'image',
            id: 107,
            src: "/art/ART_0416.jpg",
            title: "Studio Fine Art Portrait",
            category: "Fashion Photography & Reels",
            orientation: "landscape"
        },
        {
            type: 'image',
            id: 108,
            src: "/art/ART_0602.jpg",
            title: "Chiaroscuro Lighting Session",
            category: "Fashion Photography & Reels",
            orientation: "landscape"
        },
        {
            type: 'image',
            id: 109,
            src: "/art/ART_0621.jpg",
            title: "Outdoor Creative Shoot",
            category: "Fashion Photography & Reels",
            orientation: "landscape"
        },
        {
            type: 'image',
            id: 110,
            src: "/art/ART_0621_1.jpg",
            title: "Creative Portrait Session",
            category: "Fashion Photography & Reels",
            orientation: "landscape"
        }
    ];

    const categories = [
        "All Projects",
        "Wedding Coverage",
        "Fashion Photography & Reels",
        "Promotional Videos",
        "Behind The Scenes",
        "Live Streaming"
    ];

    const [selectedCategory, setSelectedCategory] = useState("All Projects");
    const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
    const [dbItems, setDbItems] = useState<GalleryItem[]>([]);
    const carouselRef = useRef<HTMLDivElement>(null);

    const scrollCarousel = (direction: 'left' | 'right') => {
        if (carouselRef.current) {
            const scrollAmount = window.innerWidth > 768 ? window.innerWidth * 0.45 : window.innerWidth * 0.85;
            carouselRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        }
    };

    const isVideoFile = (src: string) => /\.(mp4|mov|webm|ogg|quicktime)$/i.test(src);

    useEffect(() => {
        const fetchGalleryItems = async () => {
            try {
                const response = await fetch('/api/gallery');
                const contentType = response.headers.get('content-type');
                if (response.ok && contentType && contentType.includes('application/json')) {
                    const data = await response.json();
                    if (data.items && data.items.length > 0) {
                        const formattedItems: GalleryItem[] = data.items
                            .sort((a: any, b: any) => b.id - a.id)
                            .map((item: any) => {
                                const isVideo = isVideoFile(item.url) || item.url.includes('youtube') || item.url.includes('vimeo');
                                return {
                                    type: isVideo ? 'video' : 'image',
                                    id: item.id,
                                    src: item.url,
                                    title: item.title || "Visualink Portfolio Piece",
                                    category: item.category || "General",
                                    orientation: 'landscape'
                                };
                            });

                        const combined = [
                            ...formattedItems,
                            ...defaultGalleryItems.filter(def => 
                                def.type !== 'slideshow' && !formattedItems.some(f => f.type !== 'slideshow' && f.src === def.src)
                            )
                        ];
                        setDbItems(combined);
                        return;
                    }
                }
            } catch (error) {
                console.error("Failed to fetch gallery items", error);
            }
            setDbItems(defaultGalleryItems);
        };

        fetchGalleryItems();
    }, []);

    const allItems = dbItems.length > 0 ? dbItems : defaultGalleryItems;

    // Filter items based on active tab
    const filteredItems = selectedCategory === "All Projects"
        ? allItems
        : allItems.filter(item => item.category?.toLowerCase() === selectedCategory.toLowerCase());

    const featuredVideos = allItems.filter(x => x.type === 'video').slice(0, 6) as Extract<GalleryItem, { type: 'video' }>[];

    return (
        <section className="pt-28 md:pt-36 pb-24 min-h-screen bg-white text-charcoal">

            {/* Header */}
            <div className="container mx-auto px-6 mb-16">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl"
                >
                    <span className="text-cobalt font-semibold tracking-[0.25em] uppercase text-xs mb-4 block">Portfolio & Archive</span>
                    <h1
                        className="font-serif font-normal text-charcoal mb-6 leading-tight"
                        style={{ fontSize: "var(--text-fluid-h2)" }}
                    >
                        Our Work.
                    </h1>
                    <p className="text-slate-600 max-w-2xl text-base sm:text-lg leading-relaxed">
                        Explore our creative portfolio of premium cinematic films, wedding documentaries, brand campaigns, and visual storytelling captured across Africa.
                    </p>
                </motion.div>
            </div>

            {/* Featured Landscape Films Carousel */}
            <div className="relative mb-24">
                <div className="container mx-auto px-6 mb-8 flex justify-between items-end">
                    <div>
                        <span className="text-cobalt font-bold tracking-[0.2em] uppercase text-[11px] mb-2 block">Featured Reel</span>
                        <h2 className="text-2xl sm:text-3xl font-serif font-normal text-charcoal">Cinematic Stories</h2>
                    </div>
                    
                    {/* Carousel Nav Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => scrollCarousel('left')}
                            className="p-3 rounded-full bg-slate-100 text-charcoal hover:bg-cobalt hover:text-white transition-all duration-300 shadow-sm"
                            aria-label="Scroll left"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={() => scrollCarousel('right')}
                            className="p-3 rounded-full bg-slate-100 text-charcoal hover:bg-cobalt hover:text-white transition-all duration-300 shadow-sm"
                            aria-label="Scroll right"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                <div
                    ref={carouselRef}
                    className="flex gap-6 overflow-x-auto px-6 md:px-12 scrollbar-none scroll-smooth snap-x snap-mandatory"
                    style={{ scrollbarWidth: 'none' }}
                >
                    {featuredVideos.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.96 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            onClick={() => setSelectedItem(item)}
                            className="flex-shrink-0 w-[85vw] md:w-[55vw] lg:w-[45vw] aspect-video rounded-2xl overflow-hidden shadow-xl relative cursor-pointer group snap-start bg-black"
                        >
                            {isVideoFile(item.src) ? (
                                <video
                                    src={item.src}
                                    className="w-full h-full object-cover pointer-events-none group-hover:scale-105 transition-transform duration-700 opacity-90"
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    preload="auto"
                                />
                            ) : (
                                <iframe
                                    src={`${item.src}?autoplay=0&controls=0&showinfo=0&rel=0`}
                                    className="w-full h-full object-cover pointer-events-none group-hover:scale-105 transition-transform duration-700"
                                    title={item.title}
                                    loading="lazy"
                                />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                            <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
                                <span className="text-white/70 font-medium uppercase tracking-[0.2em] text-[10px] mb-2 block">{item.category}</span>
                                <h3 className="font-serif text-white text-xl sm:text-2xl font-normal mb-3 leading-snug">
                                    {item.title}
                                </h3>
                                <div className="flex items-center gap-2 text-white/90 group-hover:text-cobalt transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                                        <Play size={14} fill="currentColor" className="ml-0.5" />
                                    </div>
                                    <span className="font-medium text-xs tracking-[0.15em] uppercase">Watch Film</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Filter Category Pills */}
            <div className="container mx-auto px-6 mb-12">
                <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-none border-b border-slate-100">
                    <div className="flex items-center gap-2 text-slate-400 text-xs uppercase tracking-widest mr-2 shrink-0">
                        <Filter size={14} />
                        <span>Filter:</span>
                    </div>
                    {categories.map((category) => {
                        const isActive = selectedCategory === category;
                        return (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-5 py-2.5 rounded-full text-xs font-medium tracking-wider uppercase transition-all duration-300 shrink-0 ${
                                    isActive
                                        ? 'bg-charcoal text-white shadow-md'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                {category}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Main Portfolio Grid */}
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredItems.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "50px" }}
                            transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
                            className="group relative cursor-pointer rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 bg-slate-50 border border-slate-100 flex flex-col"
                            onClick={() => item.type !== 'slideshow' && setSelectedItem(item)}
                        >
                            <div className="aspect-video relative overflow-hidden bg-black">
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
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                        loading="lazy"
                                    />
                                ) : item.type === 'video' ? (
                                    isVideoFile(item.src) ? (
                                        <VideoThumbnail src={item.src} />
                                    ) : (
                                        <div className="w-full h-full bg-black relative">
                                            <img
                                                src={`https://img.youtube.com/vi/${item.src.split('/').pop()}/maxresdefault.jpg`}
                                                className="w-full h-full object-cover opacity-80"
                                                alt={item.title}
                                                loading="lazy"
                                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Play className="text-white opacity-70 group-hover:scale-110 transition-transform" size={40} />
                                            </div>
                                        </div>
                                    )
                                ) : null}

                                <div className="absolute top-4 right-4 z-20">
                                    <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] text-white font-medium uppercase tracking-wider flex items-center gap-1.5 border border-white/10">
                                        {item.type === 'video' ? <Film size={12} /> : <ImageIcon size={12} />}
                                        {item.type}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6 bg-white flex-1 flex flex-col justify-between border-t border-slate-100">
                                <div>
                                    <span className="text-cobalt font-semibold tracking-[0.2em] uppercase text-[10px] mb-2 block">
                                        {item.category}
                                    </span>
                                    <h3 className="font-serif text-lg text-charcoal font-normal group-hover:text-cobalt transition-colors">
                                        {item.title}
                                    </h3>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Immersive Lightbox Modal */}
            <AnimatePresence>
                {selectedItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-10"
                        onClick={() => setSelectedItem(null)}
                    >
                        <button
                            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-3 z-50 rounded-full bg-white/10"
                            onClick={() => setSelectedItem(null)}
                        >
                            <X size={28} />
                        </button>

                        <div className="w-full max-w-5xl aspect-video relative bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10" onClick={(e) => e.stopPropagation()}>
                            {selectedItem.type === 'image' ? (
                                <img
                                    src={selectedItem.src}
                                    alt={selectedItem.title}
                                    className="w-full h-full object-contain"
                                />
                            ) : selectedItem.type === 'video' ? (
                                isVideoFile(selectedItem.src) ? (
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
                                )
                            ) : null}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </section>
    );
};

export default Gallery;
