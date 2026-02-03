import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
    return (
        <section className="pt-32 pb-24 min-h-screen bg-platinum dark:bg-obsidian transition-colors duration-300">
            <div className="container mx-auto px-6 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1
                        className="font-serif font-bold text-charcoal dark:text-white mb-2"
                        style={{ fontSize: "var(--text-fluid-h2)" }}
                    >
                        Privacy Policy
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mb-12">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

                    <div
                        className="space-y-12 text-slate-700 dark:text-slate-300 leading-relaxed"
                        style={{ fontSize: "var(--text-fluid-body)" }}
                    >

                        {/* 1. Introduction */}
                        <div>
                            <h2
                                className="font-serif font-bold text-charcoal dark:text-white mb-4"
                                style={{ fontSize: "var(--text-fluid-h3)" }}
                            >
                                1. Introduction
                            </h2>
                            <p>
                                Welcome to Visualink Africa. We respect your privacy and are committed to protecting your personal data.
                                This privacy policy will inform you as to how we look after your personal data when you visit our website
                                (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
                            </p>
                        </div>

                        {/* 2. Data We Collect */}
                        <div>
                            <h2
                                className="font-serif font-bold text-charcoal dark:text-white mb-4"
                                style={{ fontSize: "var(--text-fluid-h3)" }}
                            >
                                2. The Data We Collect
                            </h2>
                            <p className="mb-4">
                                We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 marker:text-cobalt">
                                <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
                                <li><strong>Contact Data:</strong> includes email address and telephone numbers.</li>
                                <li><strong>Technical Data:</strong> includes internet protocol (IP) address, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform on the devices you use to access this website.</li>
                                <li><strong>Usage Data:</strong> includes information about how you use our website, products and services.</li>
                            </ul>
                        </div>

                        {/* 3. How We Use Your Data */}
                        <div>
                            <h2
                                className="font-serif font-bold text-charcoal dark:text-white mb-4"
                                style={{ fontSize: "var(--text-fluid-h3)" }}
                            >
                                3. How We Use Your Data
                            </h2>
                            <p className="mb-4">
                                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 marker:text-cobalt">
                                <li>Where we need to perform the contract we are about to enter into or have entered into with you (e.g., responding to project inquiries).</li>
                                <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                                <li>Where we need to comply with a legal or regulatory obligation.</li>
                            </ul>
                        </div>

                        {/* 4. Data Security */}
                        <div>
                            <h2
                                className="font-serif font-bold text-charcoal dark:text-white mb-4"
                                style={{ fontSize: "var(--text-fluid-h3)" }}
                            >
                                4. Data Security
                            </h2>
                            <p>
                                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
                            </p>
                        </div>

                        {/* 5. Marketing */}
                        <div>
                            <h2
                                className="font-serif font-bold text-charcoal dark:text-white mb-4"
                                style={{ fontSize: "var(--text-fluid-h3)" }}
                            >
                                5. Marketing
                            </h2>
                            <p>
                                We strive to provide you with choices regarding certain personal data uses, particularly around marketing and advertising.
                                We will get your express opt-in consent before we share your personal data with any company outside the Visualink Africa group of companies for marketing purposes.
                            </p>
                        </div>


                        {/* 6. Contact Us */}
                        <div>
                            <h2 className="text-2xl font-serif font-bold text-charcoal dark:text-white mb-4">6. Contact Us</h2>
                            <p>
                                If you have any questions about this privacy policy or our privacy practices, please contact us at:
                            </p>
                            <div className="mt-4 p-6 bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10">
                                <p className="font-bold text-cobalt mb-1">Visualink Africa</p>
                                <p>Email: <a href="mailto:visualinkafrica@gmail.com" className="hover:text-cobalt transition-colors">visualinkafrica@gmail.com</a></p>
                                <p>Phone: <a href="tel:+254114876997" className="hover:text-cobalt transition-colors">+254 114 876 997</a></p>
                                <p>Address: Nairobi, Kenya</p>
                            </div>
                        </div>

                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default PrivacyPolicy;
