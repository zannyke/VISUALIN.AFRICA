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
        <nav className="fixed top-0 left-0 right-0 z-50 py-2 sm:py-2.5 md:py-3 bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100 transition-all duration-300">
            <div className="container mx-auto px-4 sm:px-6 md:px-12 flex items-center justify-between">

                {/* Compact Mobile & Desktop Logo */}
                <Link to="/" className="flex items-center gap-2 group" onClick={() => setIsOpen(false)}>
                    <img
                        src="/visualink_logo_snap-removebg-preview.png"
                        alt="Visualink Africa"
                        className="h-7 sm:h-8 md:h-9 w-auto object-contain rounded-full transition-transform duration-300 group-hover:scale-105"
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

                {/* Mobile Toggle Button - Always Visible on Phone Header */}
                <div className="flex md:hidden items-center gap-2">
                    <button
                        className="text-charcoal p-2 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100 transition-colors focus:outline-none flex items-center justify-center"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle Mobile Navigation"
                    >
                        <AnimatePresence mode="wait">
                            {isOpen ? (
                                <motion.div
                                    key="close"
                                    initial={{ rotate: -90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: 90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <X size={20} />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="menu"
                                    initial={{ rotate: 90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: -90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Menu size={20} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </button>
                </div>
            </div>

            {/* Redesigned Mobile Drawer Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="fixed inset-0 top-[49px] z-40 bg-white/98 backdrop-blur-2xl md:hidden flex flex-col justify-between overflow-y-auto px-5 py-6"
                    >
                        <div className="flex flex-col gap-3">
                            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-cobalt mb-1 block">
                                Mobile Navigation
                            </span>

                            {links.map((link, i) => {
                                const isActive = location.pathname === link.href;
                                return (
                                    <motion.div
                                        key={link.name}
                                        initial={{ x: -15, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: i * 0.06, duration: 0.25 }}
                                    >
                                        <Link
                                            to={link.href}
                                            className={`flex items-center justify-between p-3.5 rounded-2xl transition-all duration-300 border ${
                                                isActive
                                                    ? 'bg-cobalt/10 border-cobalt/20 text-cobalt shadow-sm'
                                                    : 'bg-slate-50 border-slate-100 text-charcoal hover:bg-slate-100'
                                            }`}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-xl ${isActive ? 'bg-cobalt text-white' : 'bg-white text-slate-700 shadow-sm'}`}>
                                                    <link.icon size={18} />
                                                </div>
                                                <div>
                                                    <span className="font-serif text-base font-normal block leading-tight">
                                                        {link.name}
                                                    </span>
                                                    <span className="text-[10px] text-slate-500 font-sans tracking-wide">
                                                        {link.subtitle}
                                                    </span>
                                                </div>
                                            </div>

                                            <ArrowRight size={16} className={`transition-transform ${isActive ? 'text-cobalt translate-x-1' : 'text-slate-400'}`} />
                                        </Link>
                                    </motion.div>
                                );
                            })}

                            <motion.div
                                initial={{ y: 15, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="mt-3"
                            >
                                <Link
                                    to="/contact"
                                    className="w-full py-3.5 bg-charcoal text-white hover:bg-cobalt transition-all duration-300 rounded-2xl font-medium tracking-[0.18em] uppercase text-xs flex items-center justify-center gap-2 shadow-lg"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <span>Start Your Project</span>
                                    <ArrowRight size={15} />
                                </Link>
                            </motion.div>
                        </div>

                        {/* Direct Mobile Quick Contact Footer */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="pt-6 border-t border-slate-100 mt-6"
                        >
                            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-400 mb-2 block">
                                Quick Connect
                            </span>
                            <div className="grid grid-cols-2 gap-2.5">
                                <a
                                    href="tel:+254114876997"
                                    className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 text-slate-700 text-xs font-medium border border-slate-100 hover:bg-cobalt/10 hover:text-cobalt transition-colors"
                                >
                                    <Phone size={14} className="text-cobalt shrink-0" />
                                    <span className="truncate text-[11px]">+254 114 876 997</span>
                                </a>
                                <a
                                    href="mailto:visualinkafrica@gmail.com"
                                    className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 text-slate-700 text-xs font-medium border border-slate-100 hover:bg-cobalt/10 hover:text-cobalt transition-colors"
                                >
                                    <Mail size={14} className="text-cobalt shrink-0" />
                                    <span className="truncate text-[11px]">Email Us</span>
                                </a>
                            </div>
                        </motion.div>

                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
