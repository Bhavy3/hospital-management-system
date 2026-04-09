import Navbar from '../components/Navbar';
import { ShieldCheck, Clock, CreditCard, HeartPulse, FileText, ChevronRight } from 'lucide-react';

const PatientInfo = () => {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Hero Section */}
            <div className="bg-slate-900 py-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600 transform skew-x-12 translate-x-1/2 opacity-20"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <h1 className="text-5xl md:text-6xl font-black text-white mb-6">Patient Resources</h1>
                    <p className="text-xl text-slate-400 max-w-2xl leading-relaxed">
                        Everything you need to know about your visit to MediCare. We are committed to providing you with the best medical care and experience.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {/* Visiting Hours */}
                    <div className="group p-10 rounded-[2.5rem] bg-slate-50 hover:bg-white hover:shadow-2xl hover:shadow-blue-100 border border-transparent hover:border-blue-100 transition-all duration-500">
                        <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-8 transform group-hover:scale-110 group-hover:rotate-6 transition-all">
                            <Clock size={32} />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-4">Visiting Hours</h2>
                        <ul className="space-y-4 text-slate-600 font-medium">
                            <li className="flex justify-between items-center pb-2 border-b border-slate-200">
                                <span>General Wards</span>
                                <span className="text-blue-600">10:00 - 20:00</span>
                            </li>
                            <li className="flex justify-between items-center pb-2 border-b border-slate-200">
                                <span>ICU</span>
                                <span className="text-blue-600">11:00 - 12:00</span>
                            </li>
                            <li className="flex justify-between items-center pb-2">
                                <span>Emergency</span>
                                <span className="font-bold text-rose-500">24/7 Available</span>
                            </li>
                        </ul>
                    </div>

                    {/* Insurance & Billing */}
                    <div className="group p-10 rounded-[2.5rem] bg-slate-50 hover:bg-white hover:shadow-2xl hover:shadow-emerald-100 border border-transparent hover:border-emerald-100 transition-all duration-500">
                        <div className="w-16 h-16 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mb-8 transform group-hover:scale-110 group-hover:rotate-6 transition-all">
                            <CreditCard size={32} />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-4">Insurance & Billing</h2>
                        <p className="text-slate-600 mb-6 leading-relaxed">
                            We accept most major insurance providers. Please bring your insurance card and a valid ID for every visit.
                        </p>
                        <button className="flex items-center gap-2 text-emerald-600 font-bold hover:gap-4 transition-all">
                            View Accepted Insurers <ChevronRight size={20} />
                        </button>
                    </div>

                    {/* Patient Rights */}
                    <div className="group p-10 rounded-[2.5rem] bg-slate-50 hover:bg-white hover:shadow-2xl hover:shadow-purple-100 border border-transparent hover:border-purple-100 transition-all duration-500">
                        <div className="w-16 h-16 bg-purple-600 text-white rounded-2xl flex items-center justify-center mb-8 transform group-hover:scale-110 group-hover:rotate-6 transition-all">
                            <ShieldCheck size={32} />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-4">Patient Rights</h2>
                        <p className="text-slate-600 mb-6 leading-relaxed">
                            You have the right to high-quality care, privacy, and full information about your medical condition.
                        </p>
                        <button className="flex items-center gap-2 text-purple-600 font-bold hover:gap-4 transition-all">
                            Read Patient Charter <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                {/* Additional Info Grid */}
                <div className="mt-24 grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="bg-blue-50 rounded-[3rem] p-12 flex flex-col md:flex-row items-center gap-10">
                        <div className="flex-1">
                            <h3 className="text-3xl font-black text-blue-900 mb-4 italic flex items-center gap-3">
                                <HeartPulse className="text-blue-600" /> Virtual Care
                            </h3>
                            <p className="text-blue-800/70 font-medium mb-8 leading-relaxed">
                                Can't make it to the hospital? Connect with our doctors from the comfort of your home through our secure virtual platform.
                            </p>
                            <button className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
                                Learn More
                            </button>
                        </div>
                        <div className="w-48 h-48 bg-blue-200 rounded-3xl rotate-12 flex items-center justify-center">
                            <FileText size={80} className="text-blue-400" />
                        </div>
                    </div>

                    <div className="bg-rose-50 rounded-[3rem] p-12 flex flex-col md:flex-row items-center gap-10">
                        <div className="flex-1 text-right md:order-2">
                            <h3 className="text-3xl font-black text-rose-900 mb-4 italic flex items-center justify-end gap-3">
                                Support Groups <HeartPulse className="text-rose-600" />
                            </h3>
                            <p className="text-rose-800/70 font-medium mb-8 leading-relaxed">
                                Find strength and community through our specialized support groups for various health conditions and recovery phases.
                            </p>
                            <button className="px-8 py-4 bg-rose-600 text-white rounded-2xl font-bold shadow-lg shadow-rose-200 hover:bg-rose-700 transition-all">
                                Join Now
                            </button>
                        </div>
                        <div className="w-48 h-48 bg-rose-200 rounded-3xl -rotate-12 flex items-center justify-center md:order-1">
                            <ShieldCheck size={80} className="text-rose-400" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientInfo;
