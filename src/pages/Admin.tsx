import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, LogOut, Loader, Lock, Mail, Calendar, User, Image as ImageIcon, Upload, Eye, EyeOff, X, Pencil } from 'lucide-react';
import content from '../constants/content.json';
import { upload } from '@vercel/blob/client';

interface Message {
    id: number;
    name: string;
    email: string;
    subject: string;
    message: string;
    created_at: string;
}

interface GalleryItem {
    id: number | string;
    url: string;
    title: string;
    category: string;
    created_at: string;
}

const Admin = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [activeTab, setActiveTab] = useState<'messages' | 'gallery'>('messages');

    // Data
    const [messages, setMessages] = useState<Message[]>([]);
    const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);

    // Static Items (Built-in)
    const staticItems: GalleryItem[] = [
        {
            id: 'static-1' as any,
            url: "/videos/makutano-promo.mp4?v=2",
            title: "Internal Makutano Project",
            category: "Promotional Videos",
            created_at: new Date().toISOString()
        },
        {
            id: 'static-2' as any,
            url: "/videos/wedding-reception.mp4?v=2",
            title: "Wedding Reception Highlights",
            category: "Wedding Coverage",
            created_at: new Date().toISOString()
        }
    ];

    // Combine for display: DB items first (overriding), then Static items
    // If a DB item exists with same category, it technically overrides the static one in the website logic, but here we show ALL.
    const displayItems = [...galleryItems, ...staticItems];

    // States
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [uploading, setUploading] = useState(false);

    // Upload & Preview States
    const [previewFile, setPreviewFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [uploadForm, setUploadForm] = useState({ title: '', category: 'General' });
    const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);

    // Initial Load
    useEffect(() => {
        const cached = sessionStorage.getItem('admin_token');
        if (cached) {
            setPassword(cached);
            setIsAuthenticated(true);
            fetchData(cached);
        }
    }, []);

    const fetchData = async (pwd: string) => {
        setLoading(true);
        setError('');
        try {
            // Fetch Messages
            const resMsg = await fetch('/api/messages', { headers: { 'Authorization': pwd } });
            if (resMsg.status === 401) { throw new Error('Unauthorized'); }
            const dataMsg = await resMsg.json();
            setMessages(dataMsg.messages || []);

            // Fetch Gallery (If we add this endpoint)
            const resGal = await fetch('/api/gallery', { headers: { 'Authorization': pwd } });
            if (resGal.ok) {
                const dataGal = await resGal.json();
                setGalleryItems(dataGal.items?.sort((a: GalleryItem, b: GalleryItem) => Number(b.id) - Number(a.id)) || []);
            }

            sessionStorage.setItem('admin_token', pwd);
        } catch (err) {
            if ((err as Error).message === 'Unauthorized') {
                setIsAuthenticated(false);
                setError('Invalid Password');
            } else {
                setError('Connection Error');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsAuthenticated(true); // Optimistic, verification happens in fetchData
        fetchData(password);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setPassword('');
        setMessages([]);
        setGalleryItems([]);
        sessionStorage.removeItem('admin_token');
    };

    // --- Message Actions ---
    const handleDeleteMessage = async (id: number) => {
        if (!confirm('Delete this message?')) return;
        try {
            await fetch('/api/messages', {
                method: 'DELETE',
                headers: { 'Authorization': password, 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            setMessages(prev => prev.filter(m => m.id !== id));
        } catch (e) { alert('Failed to delete'); }
    };

    // --- Gallery Actions ---
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            setPreviewFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            // Only auto-fill title if NOT editing (to preserve existing title if just replacing file)
            if (!editingItem) {
                setUploadForm({ ...uploadForm, title: file.name.split('.')[0] });
            }
        }
    };

    const handleEdit = (item: GalleryItem) => {
        // If it's a static item, we treat "Edit" as "Create a new entry to override this one"
        const isStatic = typeof item.id === 'string' && item.id.toString().startsWith('static');

        setUploadForm({ title: item.title, category: isStatic && item.category === 'Promotional Videos' ? 'Promotional Videos' : item.category });
        setPreviewUrl(item.url);
        setPreviewFile(null);

        if (isStatic) {
            setEditingItem(null); // Force "Create New" mode
            alert(`You are editing a built-in file. Saving changes will create a NEW version that overrides the original.`);
        } else {
            setEditingItem(item);
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelUpload = () => {
        setPreviewFile(null);
        if (previewUrl && previewFile) URL.revokeObjectURL(previewUrl); // Only revoke if we created it from a file
        setPreviewUrl(null);
        setUploadForm({ title: '', category: 'General' });
        setEditingItem(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handlePublish = async () => {
        if (!previewUrl && !previewFile) return; // Must have something
        setUploading(true);

        try {
            let newUrl = null;

            // 1. Upload new file if selected
            if (previewFile) {
                const newBlob = await upload(previewFile.name, previewFile, {
                    access: 'public',
                    handleUploadUrl: `/api/upload?auth=${password}`,
                });
                newUrl = newBlob.url;
            }

            // 2. Save Metadata to DB (Create or Update)
            const method = editingItem ? 'PUT' : 'POST';
            const body = editingItem ? {
                id: editingItem.id,
                url: newUrl, // Only send if we have a new one, backend handles keeping old if null
                oldUrl: editingItem.url,
                title: uploadForm.title,
                category: uploadForm.category
            } : {
                url: newUrl,
                title: uploadForm.title,
                category: uploadForm.category
            };

            const resDb = await fetch('/api/gallery', {
                method,
                headers: { 'Authorization': password, 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (resDb.ok) {
                const data = await resDb.json();
                if (method === 'PUT') {
                    setGalleryItems(prev => prev.map(item => item.id === data.item.id ? data.item : item));
                    alert('Updated successfully!');
                } else {
                    setGalleryItems(prev => [data.item, ...prev]);
                    if (confirm('Published successfully! View it in the Gallery now?')) {
                        window.open('/gallery', '_blank');
                    }
                }
                handleCancelUpload(); // Clear UI
            } else {
                throw new Error('Database save failed');
            }
        } catch (err) {
            console.error(err);
            alert((editingItem ? 'Update' : 'Publish') + ' failed: ' + (err as Error).message);
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteGalleryItem = async (id: number | string, url: string) => {
        if (typeof id === 'string' && id.toString().startsWith('static')) {
            alert('This is a built-in system file and cannot be deleted physically. To "remove" it, you can upload a new video in the same category which will override it on the website.');
            return;
        }
        if (!confirm('Delete this image?')) return;
        try {
            await fetch('/api/gallery', {
                method: 'DELETE',
                headers: { 'Authorization': password, 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, url })
            });
            setGalleryItems(prev => prev.filter(i => i.id !== id));
        } catch (e) { alert('Failed to delete'); }
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
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter Admin Password"
                                className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-charcoal dark:text-white focus:outline-none focus:border-cobalt transition-colors pr-12"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cobalt transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {error && <p className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/10 py-2 rounded-md border border-red-100 dark:border-red-900/30">{error}</p>}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary flex justify-center items-center gap-2 py-3 text-lg font-semibold shadow-lg shadow-cobalt/20 hover:shadow-cobalt/40 transition-shadow"
                        >
                            {loading ? <Loader className="animate-spin" size={24} /> : 'Login to Dashboard'}
                        </button>
                    </form>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-20 bg-platinum dark:bg-obsidian transition-colors px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <h1 className="text-3xl font-serif font-bold text-charcoal dark:text-white">Dashboard</h1>
                    <div className="flex flex-wrap gap-2 md:gap-4">
                        <div className="flex bg-white dark:bg-white/10 rounded-lg p-1">
                            <button
                                onClick={() => setActiveTab('messages')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'messages' ? 'bg-cobalt text-white' : 'text-slate-600 dark:text-slate-300'}`}
                            >
                                Messages
                            </button>
                            <button
                                onClick={() => setActiveTab('gallery')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'gallery' ? 'bg-cobalt text-white' : 'text-slate-600 dark:text-slate-300'}`}
                            >
                                Gallery
                            </button>
                        </div>
                        <a
                            href="/gallery"
                            target="_blank"
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-cobalt hover:bg-cobalt/10 rounded-lg transition-colors"
                        >
                            <Eye size={18} />
                            <span className="hidden sm:inline">View Live</span>
                        </a>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20 text-cobalt">
                        <Loader className="animate-spin" size={40} />
                    </div>
                ) : (
                    <>
                        {/* MESSAGES TAB */}
                        {activeTab === 'messages' && (
                            <div className="grid grid-cols-1 gap-6">
                                {messages.length === 0 ? (
                                    <div className="text-center py-20 text-slate-500 dark:text-slate-400">
                                        <Mail size={48} className="mx-auto mb-4 opacity-50" />
                                        <p className="text-lg">No messages found.</p>
                                    </div>
                                ) : (
                                    <AnimatePresence>
                                        {messages.map((msg) => (
                                            <motion.div
                                                key={msg.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 md:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
                                            >
                                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                                    <div className="space-y-2 flex-grow">
                                                        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                                                            <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(msg.created_at).toLocaleString()}</span>
                                                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-xs font-mono">ID: {msg.id}</span>
                                                        </div>
                                                        <h3 className="text-xl font-bold text-charcoal dark:text-white break-words">{msg.subject}</h3>
                                                        <div className="flex flex-wrap items-center gap-2 text-cobalt font-medium">
                                                            <User size={16} />
                                                            {msg.name}
                                                            <span className="text-slate-400 mx-1">•</span>
                                                            <a href={`mailto:${msg.email}`} className="hover:underline break-all">{msg.email}</a>
                                                        </div>
                                                        <div className="mt-4 p-4 bg-slate-50 dark:bg-black/20 rounded-lg text-slate-700 dark:text-slate-300 whitespace-pre-wrap break-words">
                                                            {msg.message}
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={() => handleDeleteMessage(msg.id)}
                                                        className="self-end md:self-start p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                                        title="Delete Message"
                                                    >
                                                        <Trash2 size={20} />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                )}
                            </div>
                        )}

                        {/* GALLERY TAB */}
                        {activeTab === 'gallery' && (
                            <div>
                                {/* Upload/Edit Section */}
                                <div className="mb-12">
                                    <h3 className="text-xl font-bold text-charcoal dark:text-white mb-6 flex items-center gap-2">
                                        {editingItem ? <Pencil className="text-cobalt" /> : <Upload className="text-cobalt" />}
                                        {editingItem ? 'Edit Gallery Item' : 'Upload New Work'}
                                    </h3>

                                    {!previewUrl ? (
                                        <div className="p-6 md:p-10 bg-white dark:bg-white/5 rounded-2xl border-2 border-dashed border-slate-300 dark:border-white/20 text-center hover:border-cobalt/50 transition-colors group">
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleFileSelect}
                                                className="hidden"
                                                id="gallery-upload"
                                                accept="image/*,video/*"
                                            />
                                            <label htmlFor="gallery-upload" className="cursor-pointer flex flex-col items-center gap-4">
                                                <div className="w-16 h-16 bg-cobalt/10 rounded-full flex items-center justify-center text-cobalt group-hover:scale-110 transition-transform">
                                                    <Upload size={32} />
                                                </div>
                                                <div>
                                                    <span className="text-lg font-bold text-charcoal dark:text-white block mb-1">Click to Upload Image or Video</span>
                                                    <span className="text-sm text-slate-500">Supports JPG, PNG, MP4, MOV (Max 500MB)</span>
                                                </div>
                                            </label>
                                        </div>
                                    ) : (
                                        <div className="bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-lg flex flex-col lg:flex-row">
                                            {/* Preview Area */}
                                            <div className="w-full lg:w-1/2 bg-black flex items-center justify-center relative aspect-video group">
                                                {(previewFile?.type.startsWith('video') || previewUrl.endsWith('.mp4') || previewUrl.endsWith('.webm') || previewUrl.endsWith('.mov')) ? (
                                                    <video src={previewUrl} controls className="max-h-[400px] w-full object-contain" />
                                                ) : (
                                                    <img src={previewUrl} alt="Preview" className="max-h-[400px] w-full object-contain" />
                                                )}

                                                {/* Overlay to Change File */}
                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                                    <label htmlFor="gallery-replace" className="pointer-events-auto cursor-pointer flex items-center gap-2 text-white bg-white/10 backdrop-blur-md px-4 py-2 rounded-full hover:bg-white/20 transition-colors">
                                                        <Upload size={16} />
                                                        Change File
                                                    </label>
                                                    <input
                                                        type="file"
                                                        id="gallery-replace"
                                                        className="hidden"
                                                        onChange={handleFileSelect}
                                                        accept="image/*,video/*"
                                                    />
                                                </div>

                                                <button
                                                    onClick={handleCancelUpload}
                                                    className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-red-500 transition-colors z-10"
                                                >
                                                    <X size={20} />
                                                </button>
                                            </div>

                                            {/* Details Form */}
                                            <div className="w-full lg:w-1/2 p-6 md:p-8 flex flex-col justify-center gap-6">
                                                <div>
                                                    <h4 className="text-lg font-bold text-charcoal dark:text-white mb-1">
                                                        {editingItem ? 'Update Content' : 'Publish to Portfolio'}
                                                    </h4>
                                                    <p className="text-slate-500 text-sm">Review content and add details before publishing.</p>
                                                </div>

                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
                                                        <input
                                                            type="text"
                                                            value={uploadForm.title}
                                                            onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                                                            placeholder="e.g. Wedding at The Manor, Fashion Week Highlights"
                                                            className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-cobalt focus:outline-none transition-colors"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category / Service</label>
                                                        <select
                                                            value={uploadForm.category}
                                                            onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                                                            className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-cobalt focus:outline-none transition-colors"
                                                        >
                                                            <option value="General">General</option>
                                                            {content.services.map((s, i) => (
                                                                <option key={i} value={s.title}>{s.title}</option>
                                                            ))}
                                                            <option value="Behind The Scenes">Behind The Scenes</option>
                                                            <option value="Personal Projects">Personal Projects</option>
                                                            <option value="Fine Art">Fine Art</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex gap-4">
                                                    <button
                                                        onClick={handleCancelUpload}
                                                        disabled={uploading}
                                                        className="px-6 py-3 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={handlePublish}
                                                        disabled={uploading || !uploadForm.title}
                                                        className="flex-grow px-6 py-3 rounded-xl bg-cobalt text-white font-bold shadow-lg shadow-cobalt/20 hover:shadow-cobalt/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {uploading ? <Loader className="animate-spin" /> : (editingItem ? <Pencil size={20} /> : <Upload size={20} />)}
                                                        {uploading ? 'Processing...' : (editingItem ? 'Save Changes' : 'Publish to Gallery')}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <h3 className="text-xl font-bold text-charcoal dark:text-white mb-6">Existing Gallery Items</h3>

                                {displayItems.length === 0 ? (
                                    <div className="text-center py-20 text-slate-500 dark:text-slate-400">
                                        <ImageIcon size={48} className="mx-auto mb-4 opacity-50" />
                                        <p className="text-lg">No gallery items found.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
                                        <AnimatePresence>
                                            {displayItems.map((item) => (
                                                <motion.div key={item.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative group rounded-lg overflow-hidden aspect-square bg-slate-100 dark:bg-white/5">
                                                    {item.url.endsWith('.mp4') ? (
                                                        <video src={item.url} controls className="w-full h-full object-cover" />
                                                    ) : (
                                                        <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                                                    )}
                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => handleEdit(item)}
                                                            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                                                            title="Edit"
                                                        >
                                                            <Pencil size={20} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteGalleryItem(item.id, item.url)}
                                                            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                                            title="Delete"
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
                        )}
                    </>
                )}
            </div>
        </div>
    );
};
export default Admin;
