import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Mail, Phone, MapPin, CheckCircle } from 'lucide-react';

const Contact = () => {
    return (
        <section className="pt-28 md:pt-32 pb-24 min-h-screen flex items-center bg-platinum dark:bg-obsidian transition-colors duration-300">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">

                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="text-cobalt font-semibold tracking-wider uppercase text-sm">Get in Touch</span>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold mt-2 mb-6 text-charcoal dark:text-white transition-colors">Let's Create Something Amazing</h2>
                        <p className="text-slate-600 dark:text-slate-400 text-lg mb-12 transition-colors">
                            Have a project in mind? We'd love to hear from you. Send us a message and we'll get back to you as soon as possible.
                        </p>

                        <div className="space-y-8">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-cobalt/10 flex items-center justify-center text-cobalt shrink-0">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h3 className="text-charcoal dark:text-white font-semibold text-lg mb-1">Phone</h3>
                                    <a href="tel:+254114876997" className="text-slate-600 dark:text-slate-400 hover:text-cobalt transition-colors">+254 114 876 997</a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-cobalt/10 flex items-center justify-center text-cobalt shrink-0">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h3 className="text-charcoal dark:text-white font-semibold text-lg mb-1">Email</h3>
                                    <a href="mailto:visualinkafrica@gmail.com" className="text-slate-600 dark:text-slate-400 hover:text-cobalt transition-colors">visualinkafrica@gmail.com</a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-cobalt/10 flex items-center justify-center text-cobalt shrink-0">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h3 className="text-charcoal dark:text-white font-semibold text-lg mb-1">Location</h3>
                                    <p className="text-slate-600 dark:text-slate-400">Nairobi, Kenya</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>


                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="glass-card p-8 md:p-10 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-none"
                    >
                        <ContactForm />
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

const ContactForm = () => {
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');

        // Collect form data
        const form = e.target as HTMLFormElement;
        const formData = {
            name: (form.elements.namedItem('name') as HTMLInputElement).value,
            email: (form.elements.namedItem('email') as HTMLInputElement).value,
            subject: (form.elements.namedItem('subject') as HTMLInputElement).value,
            message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
        };

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setStatus('success');
                form.reset();
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error('Submission error:', error);
            setStatus('error');
        }
    };

    return (
        <>
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-charcoal dark:text-white">Name</label>
                        <input required type="text" id="name" className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 text-charcoal dark:text-white focus:outline-none focus:border-cobalt transition-colors" placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-charcoal dark:text-white">Email</label>
                        <input required type="email" id="email" className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 text-charcoal dark:text-white focus:outline-none focus:border-cobalt transition-colors" placeholder="john@example.com" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium text-charcoal dark:text-white">Subject</label>
                    <input required type="text" id="subject" className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 text-charcoal dark:text-white focus:outline-none focus:border-cobalt transition-colors" placeholder="Project Inquiry" />
                </div>

                <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-charcoal dark:text-white">Message</label>
                    <textarea required id="message" rows={4} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 text-charcoal dark:text-white focus:outline-none focus:border-cobalt transition-colors" placeholder="Tell us about your project..." />
                </div>

                <button
                    type="submit"
                    disabled={status === 'sending' || status === 'success'}
                    className={`w-full btn-primary disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                >
                    {status === 'sending' ? 'Sending...' : 'Send Message'}
                </button>
            </form>

            <AnimatePresence>
                {status === 'success' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => setStatus('idle')}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-obsidian border border-white/20 p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center relative overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
                                <CheckCircle size={32} />
                            </div>
                            <h3 className="text-2xl font-serif font-bold text-charcoal dark:text-white mb-2">Success!</h3>
                            <p className="text-slate-600 dark:text-slate-300 mb-8">
                                Message has been successfully sent. <br /> Thank you!
                            </p>
                            <button
                                onClick={() => setStatus('idle')}
                                className="w-full btn-primary"
                            >
                                Close
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
export default Contact;
