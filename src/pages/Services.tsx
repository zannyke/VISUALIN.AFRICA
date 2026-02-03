import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import content from '../constants/content.json';

const ServicesPage = () => {

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 50, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1] as const
            }
        }
    };

    return (
        <section className="pt-32 md:pt-40 pb-24 min-h-screen bg-platinum dark:bg-obsidian transition-colors duration-500">
            <div className="container mx-auto px-6">

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-24 text-center max-w-3xl mx-auto"
                >
                    <span className="text-cobalt font-bold tracking-widest uppercase text-xs mb-4 block">Expertise</span>
                    <h2 className="text-5xl md:text-7xl font-serif font-bold text-charcoal dark:text-white mb-6">
                        Our Services.
                    </h2>
                    <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
                        Comprehensive visual solutions tailored for impact.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="flex flex-col gap-20 md:gap-32"
                >
                    {content.services.map((service, index) => {
                        const isEven = index % 2 === 0;
                        const isPromo = service.title === "Promotional Videos";
                        const videoSrc = "/videos/makutano-promo.mp4";

                        return (
                            <motion.div
                                key={index}
                                id={service.title.replace(/\s+/g, '-').toLowerCase()}
                                variants={itemVariants}
                                className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-10 md:gap-20 items-center scroll-mt-32`}
                            >
                                {/* Cinematic Visual Side */}
                                <div className="w-full md:w-3/5">
                                    <div className={`relative aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl group ${isPromo ? 'bg-black' : 'bg-slate-200 dark:bg-white/5'} flex items-center justify-center`}>

                                        {isPromo ? (
                                            <>
                                                <video
                                                    autoPlay
                                                    loop
                                                    muted
                                                    playsInline
                                                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                                                >
                                                    <source src={videoSrc} type="video/mp4" />
                                                </video>
                                                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 pointer-events-none" />
                                            </>
                                        ) : (
                                            <p className="text-slate-400 dark:text-slate-600 font-medium">Video Coming Soon</p>
                                        )}

                                        {/* Floating Badge */}
                                        <div className="absolute top-6 left-6 z-20 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full hidden md:block">
                                            <span className="text-white text-xs font-bold tracking-widest uppercase">Visualink Premium</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Content Side */}
                                <div className="w-full md:w-2/5 p-4">
                                    <div className="mb-4 w-12 h-1 bg-cobalt rounded-full" />
                                    <h3 className="text-3xl md:text-4xl font-serif font-bold text-charcoal dark:text-white mb-6">
                                        {service.title}
                                    </h3>
                                    <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                                        {service.description}
                                    </p>

                                    <ul className="mb-8 space-y-3">
                                        {/* Dynamic feature list from content.json */}
                                        {service.features && service.features.map((feat: string, i: number) => (
                                            <li key={i} className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                                                <div className="p-1 rounded-full bg-cobalt/10 text-cobalt">
                                                    <Check size={12} strokeWidth={3} />
                                                </div>
                                                <span className="text-sm font-medium">{feat}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <button className="flex items-center gap-2 text-cobalt font-bold tracking-wide group hover:gap-4 transition-all duration-300">
                                        View Service <ArrowRight size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
};

export default ServicesPage;
