import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FineArtSlideshowProps {
    images: string[];
    title: string;
    category: string;
    onImageClick?: (src: string) => void;
}

const FineArtSlideshow = ({ images, title, category, onImageClick }: FineArtSlideshowProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 4000);

        return () => clearInterval(timer);
    }, [images.length]);

    return (
        <div className="relative w-full h-full overflow-hidden group cursor-pointer" onClick={() => onImageClick && onImageClick(images[currentIndex])}>
            {/* Main Background Image - AnimatePresence doesn't work perfectly well with absolute positioning in this specific tight layout without fixed height, but we use absolute here */}
            <div className="w-full h-full">
                <AnimatePresence mode="wait">
                    <motion.img
                        key={currentIndex}
                        src={images[currentIndex]}
                        alt={title}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        className="w-full h-full object-cover absolute inset-0"
                    />
                </AnimatePresence>
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

            {/* Content & Thumbnails Container */}
            <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col gap-4 z-10">
                {/* Text Info */}
                <div className="pointer-events-none">
                    <span className="text-cobalt text-xs font-bold uppercase tracking-wider">{category}</span>
                    <h4
                        className="text-white font-serif"
                        style={{ fontSize: "var(--text-fluid-h4)" }}
                    >
                        {title}
                    </h4>
                </div>

                {/* Thumbnails Strip */}
                <div className="flex gap-3 overflow-x-auto scrollbar-hide py-2 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                    {images.map((src, idx) => (
                        <div
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`
                                relative h-16 w-12 flex-shrink-0 overflow-hidden rounded-md border-2 transition-all duration-300 cursor-pointer
                                ${idx === currentIndex ? 'border-cobalt scale-110' : 'border-white/30 hover:border-white/70 opacity-70 hover:opacity-100'}
                            `}
                        >
                            <img src={src} alt="thumbnail" className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FineArtSlideshow;
