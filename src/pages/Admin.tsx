import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, LogOut, Loader, Lock, Mail, Calendar, User } from 'lucide-react';

interface Message {
    id: number;
    name: string;
    email: string;
    subject: string;
    message: string;
    created_at: string;
}

const Admin = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Check session storage on load
    useEffect(() => {
        const cached = sessionStorage.getItem('admin_token');
        if (cached) {
            setPassword(cached);
            fetchMessages(cached);
        }
    }, []);

    const fetchMessages = async (pwd: string) => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/messages', {
                headers: { 'Authorization': pwd }
            });

            if (res.status === 401) {
                setError('Invalid Password');
                setIsAuthenticated(false);
                sessionStorage.removeItem('admin_token');
            } else if (res.ok) {
                const data = await res.json();
                setMessages(data.messages);
                setIsAuthenticated(true);
                sessionStorage.setItem('admin_token', pwd);
            } else {
                setError('Failed to fetch messages');
            }
        } catch (err) {
            setError('Connection error');
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        fetchMessages(password);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this message?')) return;

        try {
            const res = await fetch('/api/messages', {
                method: 'DELETE',
                headers: {
                    'Authorization': password,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id })
            });

            if (res.ok) {
                setMessages(prev => prev.filter(m => m.id !== id));
            } else {
                alert('Failed to delete');
            }
        } catch (err) {
            alert('Error deleting message');
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setPassword('');
        setMessages([]);
        sessionStorage.removeItem('admin_token');
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-platinum dark:bg-obsidian transition-colors px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-8 rounded-2xl shadow-xl"
                >
                    <div className="flex justify-center mb-6 text-cobalt">
                        <div className="p-4 bg-cobalt/10 rounded-full">
                            <Lock size={32} />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-center text-charcoal dark:text-white mb-6">Admin Access</h2>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter Admin Password"
                            className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-charcoal dark:text-white focus:outline-none focus:border-cobalt transition-colors"
                        />
                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary flex justify-center items-center gap-2"
                        >
                            {loading ? <Loader className="animate-spin" size={20} /> : 'Login'}
                        </button>
                    </form>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-20 bg-platinum dark:bg-obsidian transition-colors px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-serif font-bold text-charcoal dark:text-white">Messages Dashboard</h1>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
                    >
                        <LogOut size={18} /> Logout
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20 text-cobalt">
                        <Loader className="animate-spin" size={40} />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="text-center py-20 text-slate-500 dark:text-slate-400">
                        <Mail size={48} className="mx-auto mb-4 opacity-50" />
                        <p className="text-lg">No messages found.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        <AnimatePresence>
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
                                >
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                        <div className="space-y-2 flex-grow">
                                            <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                                                <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(msg.created_at).toLocaleString()}</span>
                                                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-xs font-mono">ID: {msg.id}</span>
                                            </div>
                                            <h3 className="text-xl font-bold text-charcoal dark:text-white">{msg.subject}</h3>
                                            <div className="flex items-center gap-2 text-cobalt font-medium">
                                                <User size={16} />
                                                {msg.name}
                                                <span className="text-slate-400 mx-1">•</span>
                                                <a href={`mailto:${msg.email}`} className="hover:underline">{msg.email}</a>
                                            </div>
                                            <div className="mt-4 p-4 bg-slate-50 dark:bg-black/20 rounded-lg text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                                                {msg.message}
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleDelete(msg.id)}
                                            className="self-start md:self-center p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                            title="Delete Message"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;
