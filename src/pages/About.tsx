import { motion } from 'framer-motion';
import { images } from '../constants/images';
import content from '../constants/content.json';

const About = () => {
    return (
        <section className="pt-32 pb-24 min-h-screen relative overflow-hidden bg-platinum dark:bg-obsidian transition-colors duration-300">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-b from-purple-900/10 to-transparent rounded-full blur-[100px] -z-10" />

            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col lg:flex-row gap-12 items-center"
                >
                    {/* Image Side */}
                    <div className="lg:w-1/2 relative">
                        <div className="absolute inset-0 bg-cobalt/20 blur-2xl rounded-full transform scale-90 -z-10" />
                        <div className="glass-card p-2 rounded-2xl overflow-hidden shadow-2xl skew-y-1 hover:skew-y-0 transition-transform duration-500 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10">
                            <img src={images.gallery[0]} alt="About Us visual" className="w-full h-auto object-cover rounded-xl" />
                        </div>
                        {/* Floating Element */}
                        <div className="absolute -bottom-6 -right-6 glass-card p-6 rounded-xl hidden md:block animate-float bg-white/80 dark:bg-obsidian/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-xl">
                            <span className="text-4xl font-serif font-bold text-cobalt">5+</span>
                            <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wide">Years Exp.</p>
                        </div>
                    </div>

                    {/* Text Content Side */}
                    <div className="lg:w-1/2">
                        <span className="text-cobalt font-semibold tracking-wider uppercase text-sm mb-2 block">Who We Are</span>
                        <h1 className="text-5xl md:text-6xl font-serif font-bold mb-8 leading-tight text-charcoal dark:text-white transition-colors">
                            {content.about.title}
                        </h1>
                        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-8 transition-colors">
                            {content.about.content}
                        </p>

                        {/* Core Values Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                            {content.process.map((step, idx) => (
                                <div key={idx} className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 p-4 rounded-xl hover:shadow-lg dark:hover:bg-white/10 transition-all duration-300">
                                    <h3 className="text-charcoal dark:text-white font-serif text-lg mb-2">{step.step}</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">{step.details}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default About;
