import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CTAProps {
    theme?: 'white' | 'black';
}

const CTA = ({ theme = 'white' }: CTAProps) => {
    const isWhite = theme === 'white';

    return (
        <section className={`py-24 md:py-32 relative overflow-hidden transition-colors duration-500 ${isWhite ? 'bg-white text-charcoal border-t border-slate-100' : 'bg-black text-white border-t border-white/10'}`}>
            
            {/* Ambient Background Glow */}
            <div className={`absolute inset-0 pointer-events-none ${isWhite ? 'bg-gradient-to-b from-slate-50 to-transparent' : 'bg-gradient-to-b from-white/5 to-transparent'}`} />

            <div className="container mx-auto px-6 relative z-10 max-w-6xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className={`font-semibold tracking-[0.25em] uppercase text-xs mb-4 block ${isWhite ? 'text-cobalt' : 'text-cobalt'}`}>
                            Let's Collaborate
                        </span>
                        <h2
                            className={`font-serif font-normal leading-[1.15] mb-6 ${isWhite ? 'text-charcoal' : 'text-white'}`}
                            style={{ fontSize: "var(--text-fluid-h2)" }}
                        >
                            Have an idea? <br />
                            <span className="text-cobalt italic font-serif">Let's build it.</span>
                        </h2>
                        <p className={`max-w-xl text-base sm:text-lg leading-relaxed ${isWhite ? 'text-slate-600' : 'text-white/70'}`}>
                            Whether you need commercial storytelling, luxury wedding coverage, or high-impact brand campaigns—we bring your vision to life with cinematic precision.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="shrink-0"
                    >
                        <Link
                            to="/contact"
                            className={`px-9 py-4 rounded-full font-medium tracking-[0.18em] uppercase text-xs transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center gap-3 transform active:scale-95 group ${
                                isWhite
                                    ? 'bg-charcoal text-white hover:bg-cobalt hover:text-white'
                                    : 'bg-white text-black hover:bg-cobalt hover:text-white'
                            }`}
                        >
                            <span>Start a Project</span>
                            <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default CTA;
