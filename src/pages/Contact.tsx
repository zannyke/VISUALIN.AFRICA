import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Mail, Phone, MapPin, CheckCircle, Send, Clock } from 'lucide-react';

const Contact = () => {
    const location = useLocation();
    const projectTypes = [
        "Wedding Coverage",
        "Fashion Photography & Reels",
        "Promotional Video",
        "Behind The Scenes",
        "Live Streaming",
        "Custom Project"
    ];

    const [selectedType, setSelectedType] = useState("Wedding Coverage");

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const serviceParam = params.get('service');
        if (serviceParam) {
            const match = projectTypes.find(p => p.toLowerCase().includes(serviceParam.toLowerCase()) || serviceParam.toLowerCase().includes(p.toLowerCase()));
            if (match) {
                setSelectedType(match);
            } else {
                setSelectedType(serviceParam);
            }
        }
    }, [location.search]);

    return (
        <section className="pt-28 md:pt-36 pb-24 min-h-screen bg-white text-charcoal relative overflow-hidden">
            
            {/* Header */}
            <div className="container mx-auto px-6 mb-16">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl"
                >
                    <span className="text-cobalt font-semibold tracking-[0.25em] uppercase text-xs mb-4 block">
                        Start Your Project
                    </span>
                    <h1
                        className="font-serif font-normal text-charcoal mb-6 leading-tight"
                        style={{ fontSize: "var(--text-fluid-h2)" }}
                    >
                        Let's Create Something <br />
                        <span className="text-cobalt italic font-serif">Extraordinary.</span>
                    </h1>
                    <p className="text-slate-600 max-w-2xl text-base sm:text-lg leading-relaxed">
                        Have a vision for your wedding, brand, or creative campaign? Tell us about your project and we'll craft a tailored visual experience for you.
                    </p>
                </motion.div>
            </div>

            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

                    {/* Contact Details & Studio Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-5 space-y-8"
                    >
                        <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 shadow-sm space-y-6">
                            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-cobalt block">Studio Details</span>
                            
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-cobalt/10 flex items-center justify-center text-cobalt shrink-0">
                                    <Phone size={22} />
                                </div>
                                <div>
                                    <h3 className="text-charcoal font-serif font-semibold text-lg mb-1">Phone & WhatsApp</h3>
                                    <a href="tel:+254114876997" className="text-slate-600 hover:text-cobalt font-medium transition-colors block">+254 114 876 997</a>
                                    <span className="text-xs text-slate-400">Mon - Sat, 8:00 AM - 6:00 PM EAT</span>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 border-t border-slate-200/60 pt-6">
                                <div className="w-12 h-12 rounded-full bg-cobalt/10 flex items-center justify-center text-cobalt shrink-0">
                                    <Mail size={22} />
                                </div>
                                <div>
                                    <h3 className="text-charcoal font-serif font-semibold text-lg mb-1">Email Inquiry</h3>
                                    <a href="mailto:visualinkafrica@gmail.com" className="text-slate-600 hover:text-cobalt font-medium transition-colors block">visualinkafrica@gmail.com</a>
                                    <span className="text-xs text-slate-400">Direct studio inbox</span>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 border-t border-slate-200/60 pt-6">
                                <div className="w-12 h-12 rounded-full bg-cobalt/10 flex items-center justify-center text-cobalt shrink-0">
                                    <MapPin size={22} />
                                </div>
                                <div>
                                    <h3 className="text-charcoal font-serif font-semibold text-lg mb-1">Nairobi Studio</h3>
                                    <p className="text-slate-600 font-medium">Nairobi, Kenya</p>
                                    <span className="text-xs text-slate-400">Available for travel across Africa & worldwide</span>
                                </div>
                            </div>
                        </div>

                        {/* Fast Response Guarantee Badge */}
                        <div className="p-6 rounded-2xl bg-cobalt/5 border border-cobalt/10 flex items-center gap-4 text-slate-700">
                            <div className="w-10 h-10 rounded-full bg-cobalt text-white flex items-center justify-center shrink-0">
                                <Clock size={20} />
                            </div>
                            <div>
                                <h4 className="font-serif font-semibold text-charcoal text-base">Rapid Response</h4>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    We review all project proposals and respond within 24 business hours.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Interactive Form Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="lg:col-span-7 p-8 md:p-12 rounded-3xl bg-white border border-slate-100 shadow-2xl relative"
                    >
                        <div className="mb-8">
                            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-cobalt mb-2 block">Project Type</span>
                            <div className="flex flex-wrap gap-2.5">
                                {projectTypes.map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setSelectedType(type)}
                                        className={`px-4 py-2 rounded-full text-xs font-medium tracking-wide uppercase transition-all duration-300 ${
                                            selectedType === type
                                                ? 'bg-charcoal text-white shadow-md'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <ContactForm selectedType={selectedType} />
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

const ContactForm = ({ selectedType }: { selectedType: string }) => {
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');

        const form = e.target as HTMLFormElement;
        const formData = {
            name: (form.elements.namedItem('name') as HTMLInputElement).value,
            email: (form.elements.namedItem('email') as HTMLInputElement).value,
            phone: (form.elements.namedItem('phone') as HTMLInputElement)?.value || '',
            subject: selectedType || (form.elements.namedItem('subject') as HTMLInputElement).value,
            message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
            honey: (form.elements.namedItem('honey') as HTMLInputElement)?.value || '',
        };

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
                {/* Honeypot */}
                <div className="opacity-0 absolute -z-10 select-none pointer-events-none h-0 w-0 overflow-hidden">
                    <label htmlFor="honey">Website</label>
                    <input type="text" id="honey" name="honey" tabIndex={-1} autoComplete="off" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-charcoal">Your Full Name</label>
                        <input
                            required
                            type="text"
                            id="name"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-charcoal focus:outline-none focus:border-cobalt focus:bg-white transition-all text-sm"
                            placeholder="e.g. Maggie Godfrey"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-charcoal">Email Address</label>
                        <input
                            required
                            type="email"
                            id="email"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-charcoal focus:outline-none focus:border-cobalt focus:bg-white transition-all text-sm"
                            placeholder="you@example.com"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wider text-charcoal">Phone / WhatsApp</label>
                        <input
                            type="tel"
                            id="phone"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-charcoal focus:outline-none focus:border-cobalt focus:bg-white transition-all text-sm"
                            placeholder="+254 700 000 000"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="subject" className="text-xs font-semibold uppercase tracking-wider text-charcoal">Project Category</label>
                        <input
                            readOnly
                            value={selectedType}
                            type="text"
                            id="subject"
                            className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3.5 text-charcoal font-medium text-sm cursor-default"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="message" className="text-xs font-semibold uppercase tracking-wider text-charcoal">Project Details & Vision</label>
                    <textarea
                        required
                        id="message"
                        rows={4}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-charcoal focus:outline-none focus:border-cobalt focus:bg-white transition-all text-sm"
                        placeholder="Tell us about your event date, location, visual style preferences, or key deliverables..."
                    />
                </div>

                <button
                    type="submit"
                    disabled={status === 'sending' || status === 'success'}
                    className="w-full py-4 bg-charcoal text-white hover:bg-cobalt transition-all duration-300 rounded-xl font-medium tracking-[0.18em] uppercase text-xs shadow-lg hover:shadow-xl flex items-center justify-center gap-3 active:scale-[0.99] disabled:opacity-60"
                >
                    {status === 'sending' ? (
                        <span>Submitting Proposal...</span>
                    ) : (
                        <>
                            <span>Send Project Proposal</span>
                            <Send size={16} />
                        </>
                    )}
                </button>
            </form>

            <AnimatePresence>
                {status === 'success' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
                        onClick={() => setStatus('idle')}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white border border-slate-100 p-8 md:p-10 rounded-3xl shadow-2xl max-w-md w-full text-center relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="w-16 h-16 bg-cobalt/10 rounded-full flex items-center justify-center mx-auto mb-6 text-cobalt">
                                <CheckCircle size={36} />
                            </div>
                            <h3 className="text-2xl font-serif font-bold text-charcoal mb-3">Proposal Received!</h3>
                            <p className="text-slate-600 text-sm mb-8 leading-relaxed">
                                Thank you for reaching out to Visualink Africa. Our team has received your project details and will be in touch shortly.
                            </p>
                            <button
                                onClick={() => setStatus('idle')}
                                className="w-full py-3.5 bg-charcoal text-white rounded-xl text-xs font-medium tracking-widest uppercase hover:bg-cobalt transition-colors"
                            >
                                Back to Studio
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Contact;
