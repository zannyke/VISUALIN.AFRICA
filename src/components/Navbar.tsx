import { useState } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, Info, Briefcase, Image, ArrowRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [hidden, setHidden] = useState(false);
    const { scrollY } = useScroll();
    const location = useLocation();

    // Handle Scroll styling & Adaptive Visibility
    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() ?? 0;

        // Style: Transparent at top, Blur when scrolled
        setScrolled(latest > 20);

        // Visibility: Hide on scroll down, Show on scroll up
        if (latest > previous && latest > 150) {
            setHidden(true);
        } else {
            setHidden(false);
        }
    });

    const links = [
        { name: 'Home', href: '/', icon: Home },
        { name: 'About', href: '/about', icon: Info },
        { name: 'Services', href: '/services', icon: Briefcase },
        { name: 'Gallery', href: '/gallery', icon: Image },
    ];

    return (
        <motion.nav
            variants={{
                visible: { y: 0, opacity: 1 },
                hidden: { y: -100, opacity: 0 },
            }}
            animate={hidden && !isOpen ? "hidden" : "visible"}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? 'py-4 bg-white backdrop-blur-xl shadow-sm border-b border-slate-200/50'
                : 'py-6 bg-transparent border-b border-white/10'
                }`}
        >
            <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-1 group">
                    <img
                        src="/visualink_logo_snap-removebg-preview.png"
                        alt="Visualink Africa"
                        className="h-10 w-auto object-contain rounded-full"
                    />
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    <nav className="flex items-center gap-8">
                        {links.map((link) => {
                            const isActive = location.pathname === link.href;

                            return (
                                <Link
                                    key={link.name}
                                    to={link.href}
                                    className={`relative py-1 font-medium tracking-[0.2em] uppercase text-[11px] transition-colors duration-200 ${isActive
                                        ? scrolled ? 'text-cobalt border-b border-cobalt' : 'text-white border-b border-white'
                                        : scrolled ? 'text-slate-800 hover:text-cobalt' : 'text-white/80 hover:text-white'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className={`w-[1px] h-6 ${scrolled ? 'bg-slate-200' : 'bg-white/20'}`} />

                    <div className="flex items-center gap-3">
                        <Link to="/contact">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`px-5 py-2 text-[10px] font-medium tracking-[0.18em] uppercase rounded-full border transition-all duration-300 ${scrolled
                                    ? 'border-cobalt text-cobalt hover:bg-cobalt hover:text-white'
                                    : 'border-white text-white hover:bg-white hover:text-black'
                                    }`}
                            >
                                Start Project
                            </motion.button>
                        </Link>
                    </div>
                </div>

                {/* Mobile Toggle */}
                <div className="flex md:hidden items-center gap-4">
                    <button
                        className={`${scrolled ? 'text-slate-800' : 'text-white'} p-1`}
                        onClick={() => setIsOpen(!isOpen)}
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
                                    <X size={24} />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="menu"
                                    initial={{ rotate: 90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: -90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Menu size={24} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: '100vh' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="fixed inset-0 top-[72px] z-40 bg-white/98 dark:bg-obsidian/98 backdrop-blur-2xl md:hidden overflow-y-auto"
                    >
                        <div className="p-6 flex flex-col gap-4 pt-8">
                            {links.map((link, i) => (
                                <motion.div
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    key={link.name}
                                >
                                    <Link
                                        to={link.href}
                                        className={`flex items-center gap-4 font-medium p-4 rounded-2xl transition-all ${location.pathname === link.href
                                            ? 'bg-cobalt/10 text-cobalt'
                                            : 'text-charcoal dark:text-white hover:bg-slate-50 dark:hover:bg-white/5'
                                            }`}
                                        style={{ fontSize: "var(--text-fluid-h4)" }}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <link.icon size={24} className={location.pathname === link.href ? 'text-cobalt' : ''} />
                                        {link.name}
                                    </Link>
                                </motion.div>
                            ))}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="mt-8"
                            >
                                <Link
                                    to="/contact"
                                    className="w-full py-4 bg-cobalt rounded-2xl font-bold text-white flex items-center justify-center gap-2 shadow-xl shadow-cobalt/20"
                                    style={{ fontSize: "var(--text-fluid-body)" }}
                                    onClick={() => setIsOpen(false)}
                                >
                                    Start Project
                                    <ArrowRight size={20} />
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;
