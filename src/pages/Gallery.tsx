import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { images } from '../constants/images';
import { Play, X } from 'lucide-react';
import FineArtSlideshow from '../components/FineArtSlideshow';

const Gallery = () => {
    type GalleryItem =
        | { type: 'image', src: string, title?: string, category?: string, orientation?: 'portrait' | 'landscape' }
        | { type: 'video', src: string, title?: string, category?: string, orientation?: 'portrait' | 'landscape' }
        | { type: 'slideshow', images: string[], title: string, category: string, orientation: 'portrait' | 'landscape' };

    const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

    // Mixed Gallery Items
    const mixedGallery: GalleryItem[] = [
        { type: 'video', src: images.makutano[0], title: "Promotional video", category: "Cinematography", orientation: 'landscape' },

        // Dr. Godfrey & Maggie (Grouped) - Portrait
        { type: 'video', src: images.godfrey[0], title: "Dr. Godfrey & Maggie 1", category: "Wedding", orientation: 'portrait' },
        // Replaced Dr. Godfrey 2 with Wedding Reception
        { type: 'video', src: images.wedding[1], title: "Wedding Reception", category: "Wedding", orientation: 'landscape' },

        // KCB Lawyer (Alone) - Landscape
        ...images.kcb.map(src => ({
            type: 'video' as const, src, title: "KCB Lawyers Cocktail", category: "Corporate", orientation: 'landscape' as const
        })),

        // Working & BTS (Grouped) - Portrait
        ...images.bts.map((src, i) => ({
            type: 'video' as const, src, title: `Behind The Scenes ${i + 1}`, category: "Process", orientation: 'portrait' as const
        })),

        // Makutano (Alone) - Landscape
        ...images.makutano.slice(1).map(src => ({ // Adjusted slice to account for makutano[0] being used at the start
            type: 'video' as const, src, title: "Makutano Project", category: "Documentary", orientation: 'landscape' as const
        })),

        // Wedding Reception (Grouped) - Landscape
        ...images.wedding.slice(0, 1).map((src, i) => ({ // Adjusted slice to account for wedding[1] being used earlier
            type: 'video' as const, src, title: `Wedding Reception ${i + 1}`, category: "Events", orientation: 'landscape' as const
        })),




        { type: 'video', src: images.videos[1], title: "Fashion Week '25", category: "Fashion", orientation: 'landscape' as const },

        // Art Series Group - Single Slideshow Item
        {
            type: 'slideshow',
            images: images.art,
            title: "Art Portrait Series",
            category: "Fine Art",
            orientation: 'portrait'
        },


    ];

    const featuredItems = mixedGallery.filter(x => x.type === 'video').slice(0, 3) as Extract<GalleryItem, { type: 'video' }>[];

    return (
        <section className="pt-32 pb-24 min-h-screen bg-platinum dark:bg-obsidian transition-colors duration-500 overflow-hidden">

            {/* Header */}
            <div className="container mx-auto px-6 mb-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-4xl"
                >
                    <span className="text-cobalt font-bold tracking-widest uppercase text-xs mb-4 block">Portfolio</span>
                    <h2 className="text-5xl md:text-7xl font-serif font-bold text-charcoal dark:text-white mb-8">
                        Selected Works.
                    </h2>
                    <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                        A curation of our finest moments. From intimate weddings to high-energy commercial productions.
                    </p>
                </motion.div>
            </div>

            {/* Carousel Section - Apple Style */}
            <div className="mb-32 relative pl-6 md:pl-0">
                <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 md:gap-10 pb-10 scrollbar-hide px-6 md:px-12">
                    {featuredItems.map((item, index) => (
                        <motion.div
                            key={index}
                            className="min-w-[85vw] md:min-w-[60vw] lg:min-w-[45vw] aspect-video snap-center relative rounded-3xl overflow-hidden cursor-pointer group shadow-2xl"
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.4 }}
                            onClick={() => setSelectedItem(item)}
                        >
                            {item.src.endsWith('.mp4') ? (
                                <video
                                    src={item.src}
                                    className="w-full h-full object-cover pointer-events-none group-hover:scale-105 transition-transform duration-700"
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                />
                            ) : (
                                <iframe
                                    src={`${item.src}?autoplay=0&controls=0&showinfo=0&rel=0`}
                                    className="w-full h-full object-cover pointer-events-none group-hover:scale-105 transition-transform duration-700"
                                    title={item.title}
                                />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                            <div className="absolute bottom-0 left-0 p-8 w-full">
                                <span className="text-cobalt font-bold uppercase tracking-wider text-xs mb-2 block">{item.category}</span>
                                <h3 className="text-3xl font-serif text-white font-bold mb-2">{item.title}</h3>
                                <div className="flex items-center gap-2 text-white/80 group-hover:text-white transition-colors">
                                    <Play size={16} fill="currentColor" />
                                    <span className="font-medium text-sm">Watch Film</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Masonry Grid - "Endless" feel */}
            <div className="container mx-auto px-6">
                <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                    {mixedGallery.slice(3).map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "50px" }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="group relative cursor-pointer break-inside-avoid"
                            onClick={() => item.type !== 'slideshow' && setSelectedItem(item)}
                        >
                            <div className={`relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 dark:shadow-none bg-gray-200 dark:bg-white/5 ${item.orientation === 'portrait' ? 'aspect-[9/16]' : 'aspect-video'}`}>

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
                                ) : item.src.endsWith('.mp4') ? (
                                    <div className="w-full h-full relative bg-black">
                                        <video
                                            src={item.src}
                                            className="w-full h-full object-cover opacity-90"
                                            autoPlay
                                            muted
                                            loop
                                            playsInline
                                        />

                                    </div>
                                ) : (
                                    <div className="aspect-video bg-black relative">

                                        <img
                                            src={`https://img.youtube.com/vi/${item.src.split('/').pop()}/maxresdefault.jpg`}
                                            className="w-full h-full object-cover opacity-80"
                                            alt={item.title}
                                        />
                                    </div>
                                )}

                                {item.type !== 'slideshow' && (
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                        <span className="text-cobalt text-xs font-bold uppercase tracking-wider">{item.category}</span>
                                        <h4 className="text-white font-serif text-xl">{item.title}</h4>
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
                            className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors p-2"
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
                                    {selectedItem.src.endsWith('.mp4') ? (
                                        <video
                                            src={selectedItem.src}
                                            className="w-full h-full"
                                            controls
                                            autoPlay
                                        />
                                    ) : (
                                        <iframe
                                            src={`${selectedItem.src}?autoplay=1&modestbranding=1&rel=0&showinfo=0`}
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
