import { motion } from 'framer-motion';
import { images } from '../constants/images';
import content from '../constants/content.json';
import { Award, Camera, Video, Compass, Users, Sparkles } from 'lucide-react';

const About = () => {
    const stats = [
        { label: "Years of Excellence", value: "5+", icon: Award },
        { label: "Projects Completed", value: "250+", icon: Camera },
        { label: "High-Res Films", value: "100+", icon: Video },
        { label: "East Africa Reach", value: "100%", icon: Compass },
    ];

    return (
        <section className="pt-28 md:pt-36 pb-24 min-h-screen bg-white text-charcoal relative overflow-hidden">
            
            {/* Header / Intro Hero */}
            <div className="container mx-auto px-6 mb-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl"
                >
                    <span className="text-cobalt font-semibold tracking-[0.25em] uppercase text-xs mb-4 block">
                        Who We Are
                    </span>
                    <h1
                        className="font-serif font-normal text-charcoal mb-6 leading-tight"
                        style={{ fontSize: "var(--text-fluid-h2)" }}
                    >
                        Visuals That Connect. <br />
                        <span className="text-cobalt italic font-serif">Stories That Endure.</span>
                    </h1>
                    <p className="text-slate-600 max-w-2xl text-base sm:text-lg leading-relaxed">
                        Visualink Africa is a premier creative media house based in Nairobi, Kenya, specializing in high-end cinematic films, documentary wedding coverage, commercial photography, and brand storytelling across East Africa.
                    </p>
                </motion.div>
            </div>

            {/* Main Content & Feature Image */}
            <div className="container mx-auto px-6 mb-28">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    
                    {/* Visual Media Column */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="lg:col-span-6 relative"
                    >
                        <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl relative bg-slate-900 group">
                            <img
                                src={images.about}
                                alt="Visualink Africa Director & Studio"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-95"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white">
                                <span className="text-xs font-semibold tracking-widest uppercase text-cobalt block mb-1">Director & Creative Team</span>
                                <h3 className="font-serif text-xl font-normal text-white">Art Dennoh & Visualink Creatives</h3>
                            </div>
                        </div>
                    </motion.div>

                    {/* Narrative & Philosophy Column */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="lg:col-span-6 flex flex-col justify-center"
                    >
                        <h2 className="text-3xl sm:text-4xl font-serif font-normal text-charcoal mb-6 leading-snug">
                            {content.about.title}
                        </h2>
                        <p className="text-slate-600 leading-relaxed text-base sm:text-lg mb-8">
                            {content.about.content}
                        </p>

                        <div className="space-y-6 border-t border-slate-100 pt-6">
                            <div className="flex gap-4 items-start">
                                <div className="p-3 rounded-full bg-cobalt/10 text-cobalt shrink-0 mt-1">
                                    <Sparkles size={20} />
                                </div>
                                <div>
                                    <h4 className="font-serif text-lg font-semibold text-charcoal mb-1">Cinematic Quality</h4>
                                    <p className="text-sm text-slate-500 leading-relaxed">
                                        We leverage cutting-edge 4K cinema cameras, anamorphic lenses, and professional color grading to achieve timeless visual depth.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4 items-start">
                                <div className="p-3 rounded-full bg-cobalt/10 text-cobalt shrink-0 mt-1">
                                    <Users size={20} />
                                </div>
                                <div>
                                    <h4 className="font-serif text-lg font-semibold text-charcoal mb-1">Collaborative Vision</h4>
                                    <p className="text-sm text-slate-500 leading-relaxed">
                                        Every project starts by listening deeply to understand your identity, story, and values before filming a single frame.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>

            {/* Stat Counters Banner */}
            <div className="bg-slate-50 py-16 border-y border-slate-100">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {stats.map((stat, idx) => {
                            const IconComponent = stat.icon;
                            return (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="flex flex-col items-center"
                                >
                                    <div className="w-12 h-12 rounded-full bg-cobalt/10 text-cobalt flex items-center justify-center mb-4">
                                        <IconComponent size={22} />
                                    </div>
                                    <span className="text-3xl sm:text-4xl font-serif font-bold text-charcoal mb-1">
                                        {stat.value}
                                    </span>
                                    <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                                        {stat.label}
                                    </span>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Core Values Section */}
            <div className="container mx-auto px-6 pt-24">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-cobalt font-semibold tracking-[0.25em] uppercase text-xs mb-3 block">
                        Our Process & Values
                    </span>
                    <h2 className="font-serif text-3xl sm:text-4xl font-normal text-charcoal">
                        Built on Authenticity & Artistry
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {content.process.map((step, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.15 }}
                            className="p-8 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                        >
                            <div>
                                <span className="text-cobalt font-serif text-3xl font-bold mb-4 block">0{idx + 1}</span>
                                <h3 className="text-xl font-serif font-normal text-charcoal mb-3">{step.step}</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">{step.details}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

        </section>
    );
};

export default About;
