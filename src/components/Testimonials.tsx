
import { motion } from 'framer-motion';

const testimonials = [
    {
        id: 1,
        name: "James & Faith",
        role: "Wedding Couple",
        content: "Visualink Africa didn't just document our story—they told it with heart. Every shot captured the emotion of the day perfectly."
    },
    {
        id: 2,
        name: "Terry",
        role: "CEO, Yardie Eatery",
        content: "From food photography to promo videos, everything looked cinematic and authentic. The content boosted our engagement and brought real customers through the door."
    },
    {
        id: 3,
        name: "Sarah M.",
        role: "Creative Director",
        content: "The level of professionalism and creativity is unmatched. They turned our vague ideas into a stunning visual reality."
    }
];

const Testimonials = () => {
    return (
        <section className="py-32 bg-white dark:bg-obsidian transition-colors duration-300">
            <div className="container mx-auto px-6 max-w-4xl">

                <div className="mb-24 text-center">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-cobalt dark:text-white/60 font-medium tracking-[0.2em] uppercase text-[10px] mb-3 block"
                    >
                        Kind Words
                    </motion.span>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-serif font-normal text-charcoal dark:text-white"
                    >
                        Client Stories
                    </motion.h2>
                </div>

                <div className="space-y-24">
                    {testimonials.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                            className="text-center flex flex-col items-center max-w-2xl mx-auto"
                        >
                            <p className="text-xl md:text-2xl font-serif font-normal italic text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">
                                "{item.content}"
                            </p>

                            <div className="flex flex-col items-center">
                                <span className="font-sans font-medium tracking-[0.2em] uppercase text-xs text-charcoal dark:text-white">{item.name}</span>
                                <span className="text-[10px] text-cobalt dark:text-white/40 tracking-[0.15em] uppercase mt-1">{item.role}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default Testimonials;
