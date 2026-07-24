import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, Info, Briefcase, Image, ArrowRight, Phone, Mail } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const links = [
        { name: 'Home', href: '/', icon: Home, subtitle: 'Welcome & Portfolio Highlights' },
        { name: 'About', href: '/about', icon: Info, subtitle: 'Our Studio & Storytelling Vision' },
        { name: 'Services', href: '/services', icon: Briefcase, subtitle: 'Wedding, Commercial & Fashion Production' },
        { name: 'Gallery', href: '/gallery', icon: Image, subtitle: 'Cinematic Films & Photography Archive' },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-slate-200/80 transition-all duration-300">
            <div className="container mx-auto px-4 sm:px-6 md:px-12 py-2 sm:py-2.5 flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group" onClick={() => setIsOpen(false)}>
                    <img
                        src="/visualink_logo_snap-removebg-preview.png"
                        alt="Visualink Africa"
                        className="h-8 sm:h-9 md:h-10 w-auto object-contain rounded-full transition-transform duration-300 group-hover:scale-105"
                    />
                </Link>

                {/* Desktop Navigation Links */}
                <div className="hidden md:flex items-center gap-8">
                    <nav className="flex items-center gap-8">
                        {links.map((link) => {
                            const isActive = location.pathname === link.href;

                            return (
                                <Link
                                    key={link.name}
                                    to={link.href}
                                    className={`relative py-1 font-medium tracking-[0.2em] uppercase text-[11px] transition-colors duration-200 ${
                                        isActive
                                            ? 'text-cobalt border-b-2 border-cobalt'
                                            : 'text-slate-800 hover:text-cobalt'
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="w-[1px] h-5 bg-slate-200" />

                    <div className="flex items-center gap-3">
                        <Link to="/contact">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-5 py-2 text-[10px] font-medium tracking-[0.18em] uppercase rounded-full border border-cobalt text-cobalt hover:bg-cobalt hover:text-white transition-all duration-300 shadow-sm"
                            >
                                Start Project
                            </motion.button>
                        </Link>
                    </div>
                </div>

                {/* Mobile Dropdown Toggle Button (Always visible on phone header) */}
                <div className="flex md:hidden items-center gap-2">
                    <button
                        className="text-charcoal px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200/80 hover:bg-cobalt hover:text-white transition-all duration-300 focus:outline-none flex items-center gap-2 text-xs font-semibold tracking-wider uppercase active:scale-95 shadow-sm"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle Navigation Menu"
                    >
                        <span className="text-[11px] font-bold">MENU</span>
                        <AnimatePresence mode="wait">
                            {isOpen ? (
                                <motion.div
                                    key="close"
                                    initial={{ rotate: -90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: 90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <X size={18} />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="menu"
                                    initial={{ rotate: 90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: -90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Menu size={18} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </button>
                </div>
            </div>

            {/* High-Visibility Mobile Dropdown Menu Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="absolute top-full left-0 right-0 bg-white border-b-2 border-cobalt shadow-2xl md:hidden overflow-hidden z-[100]"
                    >
                        <div className="p-4 sm:p-6 flex flex-col gap-3 max-h-[80vh] overflow-y-auto">
                            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-cobalt mb-1 block">
                                Select Page
                            </span>

                            {links.map((link, i) => {
                                const isActive = location.pathname === link.href;
                                return (
                                    <motion.div
                                        key={link.name}
                                        initial={{ x: -15, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: i * 0.05, duration: 0.2 }}
                                    >
                                        <Link
                                            to={link.href}
                                            className={`flex items-center justify-between p-3.5 rounded-xl transition-all duration-200 border ${
                                                isActive
                                                    ? 'bg-cobalt text-white border-cobalt shadow-md'
                                                    : 'bg-slate-50 border-slate-100 text-charcoal hover:bg-slate-100'
                                            }`}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${isActive ? 'bg-white/20 text-white' : 'bg-white text-cobalt shadow-sm'}`}>
                                                    <link.icon size={18} />
                                                </div>
                                                <div>
                                                    <span className="font-serif text-base font-normal block leading-tight">
                                                        {link.name}
                                                    </span>
                                                    <span className={`text-[10px] font-sans tracking-wide ${isActive ? 'text-white/80' : 'text-slate-500'}`}>
                                                        {link.subtitle}
                                                    </span>
                                                </div>
                                            </div>

                                            <ArrowRight size={16} className={`transition-transform ${isActive ? 'text-white translate-x-1' : 'text-slate-400'}`} />
                                        </Link>
                                    </motion.div>
                                );
                            })}

                            <motion.div
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.25 }}
                                className="mt-2"
                            >
                                <Link
                                    to="/contact"
                                    className="w-full py-3.5 bg-cobalt text-white hover:bg-charcoal transition-all duration-300 rounded-xl font-medium tracking-[0.18em] uppercase text-xs flex items-center justify-center gap-2 shadow-md"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <span>Start Your Project</span>
                                    <ArrowRight size={15} />
                                </Link>
                            </motion.div>

                            {/* Direct Quick Contact Footer */}
                            <div className="pt-4 border-t border-slate-100 mt-2 grid grid-cols-2 gap-2">
                                <a
                                    href="tel:+254114876997"
                                    className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 text-slate-700 text-xs font-medium border border-slate-100 hover:bg-cobalt/10 hover:text-cobalt transition-colors"
                                >
                                    <Phone size={14} className="text-cobalt shrink-0" />
                                    <span className="truncate text-[11px]">+254 114 876 997</span>
                                </a>
                                <a
                                    href="mailto:visualinkafrica@gmail.com"
                                    className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 text-slate-700 text-xs font-medium border border-slate-100 hover:bg-cobalt/10 hover:text-cobalt transition-colors"
                                >
                                    <Mail size={14} className="text-cobalt shrink-0" />
                                    <span className="truncate text-[11px]">Email Us</span>
                                </a>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
