import { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, Info, Briefcase, Image, Sun, Moon, ArrowRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isDark, setIsDark] = useState(false);
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

    // Handle Theme Toggle
    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    const links = [
        { name: 'Home', href: '/', icon: Home },
        { name: 'About', href: '/about', icon: Info },
        { name: 'Services', href: '/services', icon: Briefcase },
        { name: 'Gallery', href: '/gallery', icon: Image },
    ];

    return (
        <motion.nav
            variants={{
                visible: { y: 0 },
                hidden: { y: "-100%" },
            }}
            animate={hidden && !isOpen ? "hidden" : "visible"}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${scrolled
                ? 'py-3 bg-white/95 dark:bg-obsidian/95 backdrop-blur-xl shadow-md'
                : 'py-4 bg-transparent'
                }`}
        >
            <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-1 group">
                    <img
                        src="/logo.jpeg"
                        alt="Visualink Africa"
                        className="h-12 w-auto object-contain rounded-full scale-[1.8]"
                    />
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-6">
                    <nav className="flex items-center p-1 rounded-full bg-slate-100/50 dark:bg-white/5 border border-white/20 backdrop-blur-sm">
                        {links.map((link) => {
                            const isActive = location.pathname === link.href;

                            return (
                                <Link
                                    key={link.name}
                                    to={link.href}
                                    className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 flex items-center gap-2 z-10 ${isActive
                                        ? 'text-charcoal dark:text-white'
                                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                                        }`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="activePill"
                                            className="absolute inset-0 bg-white dark:bg-white/10 rounded-full shadow-sm"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            style={{ zIndex: -1 }}
                                        />
                                    )}

                                    <motion.div
                                        animate={isActive ? { scale: 1.1, rotate: [0, -10, 10, 0] } : { scale: 1, rotate: 0 }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        <link.icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                                    </motion.div>
                                    <span>{link.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="w-[1px] h-6 bg-slate-200 dark:bg-white/10" />

                    <div className="flex items-center gap-3">
                        {/* Theme Toggle */}
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            whileHover={{ rotate: 180 }}
                            transition={{ duration: 0.3 }}
                            onClick={() => setIsDark(!isDark)}
                            className="p-2.5 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                            aria-label="Toggle Theme"
                        >
                            {isDark ? <Sun size={20} /> : <Moon size={20} />}
                        </motion.button>

                        <Link to="/contact">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-5 py-2.5 text-sm font-semibold bg-cobalt text-white rounded-full flex items-center gap-2 shadow-lg shadow-cobalt/20 hover:shadow-xl transition-all"
                            >
                                <span>Start Project</span>
                                <motion.div
                                    animate={{ x: [0, 4, 0] }}
                                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                                >
                                    <ArrowRight size={14} />
                                </motion.div>
                            </motion.button>
                        </Link>
                    </div>
                </div>

                {/* Mobile Toggle */}
                <div className="flex md:hidden items-center gap-4">
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        whileHover={{ rotate: 90 }}
                        onClick={() => setIsDark(!isDark)}
                        className="p-2 rounded-full text-slate-600 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                    >
                        {isDark ? <Sun size={20} /> : <Moon size={20} />}
                    </motion.button>
                    <button
                        className="text-slate-800 dark:text-white p-1"
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
                        className="fixed inset-0 top-[72px] z-40 bg-white/95 dark:bg-obsidian/95 backdrop-blur-2xl md:hidden overflow-y-auto"
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
                                        className={`flex items-center gap-4 text-xl font-medium p-4 rounded-2xl transition-all ${location.pathname === link.href
                                            ? 'bg-cobalt/10 text-cobalt'
                                            : 'text-charcoal dark:text-white hover:bg-slate-50 dark:hover:bg-white/5'
                                            }`}
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
                                    className="w-full py-4 bg-cobalt rounded-2xl font-bold text-white text-lg flex items-center justify-center gap-2 shadow-xl shadow-cobalt/20"
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
