
import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

const testimonials = [
    {
        id: 1,
        name: "James & Faith",
        role: "Wedding Couple",
        content: "Visualink Africa didn't just document our story they told it with heart. Every shot captured the emotion of the day perfectly.",
        rating: 5
    },
    {
        id: 2,
        name: "Terry",
        role: "CEO, Yardie Eatery",
        content: "From food photography to promo videos, everything looked cinematic and authentic. The content boosted our social media engagement and brought real customers through the door.",
        rating: 5
    },
    {
        id: 3,
        name: "Sarah M.",
        role: "Creative Director",
        content: "The level of professionalism and creativity is unmatched. They turned our vague ideas into a stunning visual reality.",
        rating: 5
    }
];

const Testimonials = () => {
    return (
        <section className="py-24 bg-white dark:bg-obsidian overflow-hidden">
            <div className="container mx-auto px-6">

                <div className="mb-16 text-center max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="text-cobalt font-bold tracking-widest uppercase text-xs mb-4 block">Client Stories</span>
                        <h2 className="text-4xl md:text-6xl font-serif font-bold text-charcoal dark:text-white mb-6">
                            Trusted by Clients.
                        </h2>
                    </motion.div>
                </div>

                <div className="flex flex-wrap md:flex-nowrap gap-8 justify-center">
                    {testimonials.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            whileHover={{ y: -10 }}
                            className="bg-platinum dark:bg-white/5 p-8 rounded-3xl relative w-full md:w-1/3 flex flex-col shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 dark:border-white/10"
                        >
                            <Quote className="text-cobalt/20 mb-6" size={48} />

                            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 italic leading-relaxed flex-grow">
                                "{item.content}"
                            </p>

                            <div className="flex items-center gap-1 mb-4">
                                {[...Array(item.rating)].map((_, i) => (
                                    <Star key={i} size={16} className="fill-cobalt text-cobalt" />
                                ))}
                            </div>

                            <div>
                                <h4 className="font-bold text-charcoal dark:text-white text-xl">{item.name}</h4>
                                <span className="text-sm text-cobalt font-medium uppercase tracking-wide">{item.role}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default Testimonials;
