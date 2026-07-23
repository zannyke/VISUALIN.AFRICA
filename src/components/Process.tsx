
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
        <section id="process" className="py-28 bg-platinum dark:bg-obsidian transition-colors duration-300">
            <div className="container mx-auto px-6 max-w-6xl">
                <div className="mb-20 text-center">
                    <motion.span 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-cobalt dark:text-white/60 font-medium tracking-[0.2em] uppercase text-[10px] mb-3 block"
                    >
                        Our Process
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-serif font-normal text-charcoal dark:text-white"
                    >
                        How We Work
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.num}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.15 }}
                            className="flex flex-col items-center text-center group"
                        >
                            <div className="text-6xl font-serif font-normal text-slate-300 dark:text-white/10 mb-6 select-none transition-transform group-hover:scale-105 duration-500">
                                {step.num}
                            </div>
                            <h3 className="text-xl font-serif font-normal italic text-charcoal dark:text-white mb-4">{step.title}</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm max-w-sm">
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
