
import { motion } from 'framer-motion';

const steps = [
    {
        num: "01",
        title: "Discover & Connect",
        desc: "We start by understanding your story—who you are and what you value. This stage is all about connection, collaboration, and listening deeply."
    },
    {
        num: "02",
        title: "Create & Craft",
        desc: "Imagination meets precision. Our creative team transforms ideas into powerful visuals through storytelling, innovation, and technical mastery."
    },
    {
        num: "03",
        title: "Deliver & Inspire",
        desc: "From final edit to delivery, every frame is refined for quality. We deliver timeless visuals that not only meet your needs but inspire."
    },
];

const Process = () => {
    return (
        <section id="process" className="py-24 bg-platinum dark:bg-gradient-to-b dark:from-obsidian dark:to-[#0f1218] transition-colors duration-300">
            <div className="container mx-auto px-6">
                <div className="mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-serif font-bold mb-4 text-charcoal dark:text-white"
                    >
                        How We Work
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-cobalt/0 via-cobalt/50 to-cobalt/0" />

                    {steps.map((step, index) => (
                        <motion.div
                            key={step.num}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="relative z-10"
                        >
                            <div className="text-7xl font-serif font-bold text-slate-200 dark:text-white/5 mb-4 select-none">
                                {step.num}
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-cobalt">{step.title}</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                {step.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Process;
