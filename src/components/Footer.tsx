import { Mail, Phone, Instagram, Facebook, ArrowUpRight, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="relative bg-white dark:bg-obsidian pt-24 pb-12 overflow-hidden">

            {/* Ambient Background Glow */}
            <div className="absolute bottom-0 left-0 w-full h-[500px] bg-gradient-to-t from-slate-100 dark:from-white/5 to-transparent pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">

                {/* Visual Header in Footer */}
                <div className="mb-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-10 border-b border-slate-200 dark:border-white/10 pb-16">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-charcoal dark:text-white mb-6">
                            Have an idea? <br />
                            <span className="text-cobalt">Let's build it.</span>
                        </h2>
                        <Link
                            to="/contact"
                            className="inline-flex items-center gap-2 text-xl font-bold text-charcoal dark:text-white group"
                        >
                            <span className="border-b-2 border-cobalt pb-1">Start a Project</span>
                            <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300 text-cobalt" />
                        </Link>
                    </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="md:col-span-2">
                        <a href="#" className="font-serif text-2xl font-bold tracking-tighter text-charcoal dark:text-white mb-6 block">
                            Visualink<span className="text-cobalt">.</span>
                        </a>
                        <p className="text-slate-600 dark:text-slate-400 max-w-sm text-lg leading-relaxed">
                            Crafting visuals that inspire emotion, identity, and growth for brands across Africa.
                        </p>

                        <div className="flex gap-4 mt-6">
                            {/* Instagram */}
                            <a
                                href="https://www.instagram.com/vila_creatives?igsh=NW90eXcydGUwcml2"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center hover:bg-cobalt hover:text-white hover:scale-110 transition-all duration-300"
                            >
                                <Instagram size={20} />
                            </a>
                            {/* TikTok */}
                            <a
                                href="https://www.tiktok.com/@vila_creatives?_r=1&_t=ZS-93c5PSLkng2"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center hover:bg-cobalt hover:text-white hover:scale-110 transition-all duration-300"
                            >
                                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                                </svg>
                            </a>
                            {/* Facebook */}
                            <a
                                href="https://www.facebook.com/denno.kanambo.14"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center hover:bg-cobalt hover:text-white hover:scale-110 transition-all duration-300"
                            >
                                <Facebook size={20} />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-charcoal dark:text-white font-bold mb-6">Explore</h4>
                        <ul className="space-y-4 text-slate-600 dark:text-slate-400">
                            <li><Link to="/about" className="hover:text-cobalt transition-colors">About Us</Link></li>
                            <li><Link to="/services" className="hover:text-cobalt transition-colors">Services</Link></li>
                            <li><Link to="/gallery" className="hover:text-cobalt transition-colors">Gallery</Link></li>
                            <li><Link to="/contact" className="hover:text-cobalt transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-charcoal dark:text-white font-bold mb-6">Connect with us</h4>
                        <ul className="space-y-4 text-slate-600 dark:text-slate-400">
                            <li className="flex items-center gap-3 group cursor-pointer">
                                <Link to="/contact" className="flex items-center gap-3 w-full hover:text-cobalt transition-colors">
                                    <MessageCircle size={18} className="text-cobalt group-hover:scale-110 transition-transform" />
                                    <span>Contact us</span>
                                </Link>
                            </li>
                            <li className="flex items-center gap-3 group cursor-pointer">
                                <a href="mailto:visualinkafrica@gmail.com" className="flex items-center gap-3 w-full hover:text-cobalt transition-colors">
                                    <Mail size={18} className="text-cobalt group-hover:scale-110 transition-transform" />
                                    <span>visualinkafrica@gmail.com</span>
                                </a>
                            </li>
                            <li className="flex items-center gap-3 group cursor-pointer">
                                <a href="tel:+254114876997" className="flex items-center gap-3 w-full hover:text-cobalt transition-colors">
                                    <Phone size={18} className="text-cobalt group-hover:scale-110 transition-transform" />
                                    <span>+254 114 876 997</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center pt-8 text-slate-500 dark:text-slate-500 text-sm">
                    <p>© {new Date().getFullYear()} Visualink Africa. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-cobalt">Privacy Policy</a>
                        <a href="#" className="hover:text-cobalt">Terms of Service</a>

                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
