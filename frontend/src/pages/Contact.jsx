import Navbar from '../components/Navbar';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Message sent successfully!');
    };

    return (
        <div className="min-h-screen bg-slate-50 selection:bg-blue-100 selection:text-blue-900">
            <Navbar />

            <div className="relative bg-slate-900 py-32 overflow-hidden">
                {/* Dynamic Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
                    <div className="absolute top-1/2 -right-24 w-80 h-80 bg-emerald-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute -bottom-24 left-1/2 w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" style={{ animationDelay: '4s' }}></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
                    <span className="inline-block py-1 px-4 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold mb-6 tracking-widest uppercase">
                        Get In Touch
                    </span>
                    <h1 className="text-6xl md:text-7xl font-black text-white mb-8 tracking-tight">
                        Let's Start a <span className="gradient-text">Conversation</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
                        Have questions about our facilities? Our team of medical professionals is ready to assist you around the clock.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 mb-32 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Contact info cards */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="group bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-blue-900/5 border border-slate-100 hover:border-blue-200 transition-all duration-500">
                            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-8 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-inner">
                                <Phone size={32} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-800 mb-3">Call Support</h3>
                            <p className="text-slate-500 font-medium mb-6">Our 24/7 helpline is always ready for your calls.</p>
                            <p className="text-3xl font-black text-blue-600 tracking-tight">+1 (234) 567-8900</p>
                        </div>

                        <div className="group bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-emerald-900/5 border border-slate-100 hover:border-emerald-200 transition-all duration-500">
                            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-8 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-inner">
                                <Mail size={32} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-800 mb-3">Professional Email</h3>
                            <p className="text-slate-500 font-medium mb-6">Direct access to our specialized departments.</p>
                            <p className="text-xl font-bold text-slate-700 bg-slate-50 px-4 py-2 rounded-xl inline-block">support@medicare.com</p>
                        </div>

                        <div className="group bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-amber-900/5 border border-slate-100 hover:border-amber-200 transition-all duration-500">
                            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-8 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-inner">
                                <MapPin size={32} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-800 mb-3">Our Location</h3>
                            <p className="text-slate-500 font-medium mb-2">123 Health Ave, Medical District</p>
                            <p className="text-slate-500 font-medium italic">New York, NY 10001</p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white p-12 md:p-20 rounded-[3.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 backdrop-blur-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-32 -mt-32 opacity-50"></div>

                            <h2 className="text-4xl font-black text-slate-900 mb-10 relative">Leave a <span className="text-blue-600 italic">Message</span></h2>

                            <form onSubmit={handleSubmit} className="space-y-10 relative">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-3">
                                        <label className="text-sm font-black text-slate-800 uppercase tracking-widest pl-1">Name</label>
                                        <input
                                            type="text" required
                                            placeholder="Your full name"
                                            className="w-full px-8 py-5 rounded-[1.5rem] bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white focus:ring-8 focus:ring-blue-500/5 outline-none transition-all duration-300 font-medium"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-sm font-black text-slate-800 uppercase tracking-widest pl-1">Email</label>
                                        <input
                                            type="email" required
                                            placeholder="hello@example.com"
                                            className="w-full px-8 py-5 rounded-[1.5rem] bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white focus:ring-8 focus:ring-blue-500/5 outline-none transition-all duration-300 font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-black text-slate-800 uppercase tracking-widest pl-1">Message Subject</label>
                                    <div className="relative">
                                        <select className="w-full px-8 py-5 rounded-[1.5rem] bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white focus:ring-8 focus:ring-blue-500/5 outline-none transition-all duration-300 font-bold appearance-none cursor-pointer">
                                            <option>General Support Inquiry</option>
                                            <option>Clinical Appointment Help</option>
                                            <option>Billing & Insurance Services</option>
                                            <option>Feedback & Suggestions</option>
                                        </select>
                                        <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-black text-slate-800 uppercase tracking-widest pl-1">How can we assist?</label>
                                    <textarea
                                        rows="6" required
                                        placeholder="Type your message here..."
                                        className="w-full px-8 py-6 rounded-[2rem] bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white focus:ring-8 focus:ring-blue-500/5 outline-none transition-all duration-300 font-medium resize-none shadow-inner"
                                    ></textarea>
                                </div>

                                <button className="w-full py-6 bg-blue-600 text-white rounded-[1.5rem] font-black text-xl hover:bg-blue-700 transform hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 shadow-2xl shadow-blue-500/40 flex items-center justify-center gap-4 group">
                                    <Send size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    Beam Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
