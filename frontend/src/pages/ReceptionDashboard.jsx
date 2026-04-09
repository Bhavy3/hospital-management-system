import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { UserPlus, Calendar, List, CheckCircle, Search, Clock, Users, Shield, ArrowRight, Activity, Plus } from 'lucide-react';
import api from '../services/api';

const ReceptionDashboard = () => {
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [patientForm, setPatientForm] = useState({ name: '', gender: 'M', mobile: '', reason: '', priority: 'Normal' });
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchDoctors();
        fetchPatients();
    }, []);

    const fetchDoctors = async () => {
        try {
            const res = await api.get('doctors/');
            setDoctors(res.data);
        } catch (err) { console.error(err); }
    };

    const fetchPatients = async () => {
        try {
            const res = await api.get('patients/');
            setPatients(res.data);
        } catch (err) { console.error(err); }
    };

    const handleRegisterAndQueue = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const patientRes = await api.post('patients/', {
                name: patientForm.name,
                gender: patientForm.gender,
                mobile: patientForm.mobile
            });

            await api.post('appointments/', {
                patient: patientRes.data.id,
                doctor: selectedDoctor,
                date: new Date().toISOString().split('T')[0],
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
                reason: patientForm.reason,
                priority: patientForm.priority,
                queue_status: 'Waiting'
            });

            alert("Patient registered and added to queue!");
            setPatientForm({ name: '', gender: 'M', mobile: '', reason: '', priority: 'Normal' });
            fetchPatients();
        } catch (err) {
            console.error(err);
            alert("Error processing request");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fcfdfe]">
            <Navbar />
            <div className="max-w-[1600px] mx-auto p-6 lg:p-12">
                <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-12 gap-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                                <Shield size={20} />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-indigo-500">Coordination Core</span>
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 leading-tight">Reception Command</h1>
                        <p className="text-slate-400 font-medium text-lg mt-1">Efficient registration and live queue synchronization.</p>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <div className="bg-white p-5 rounded-[1.5rem] shadow-sm border border-slate-100 flex items-center gap-5 min-w-[240px]">
                            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner">
                                <CheckCircle className="w-7 h-7" />
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Active Status</p>
                                <p className="text-xl font-black text-slate-800">Front Desk A1</p>
                            </div>
                        </div>
                        <div className="bg-slate-900 p-5 rounded-[1.5rem] shadow-xl text-white flex items-center gap-5 min-w-[240px]">
                            <div className="w-14 h-14 bg-white/10 text-white rounded-2xl flex items-center justify-center">
                                <Users className="w-7 h-7" />
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Total Today</p>
                                <p className="text-xl font-black">{patients.length} Registered</p>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-12">
                    {/* Registration Form */}
                    <div className="xl:col-span-1">
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 sticky top-12">
                            <h2 className="text-2xl font-black mb-8 flex items-center gap-3 text-slate-800">
                                <Plus className="text-indigo-600 p-1 bg-indigo-50 rounded-lg" size={32} /> Fast Reg
                            </h2>
                            <form onSubmit={handleRegisterAndQueue} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                                    <input
                                        type="text" required value={patientForm.name}
                                        onChange={e => setPatientForm({ ...patientForm, name: e.target.value })}
                                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 outline-none transition-all placeholder-slate-300 text-sm font-bold"
                                        placeholder="Patient Name"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Gender</label>
                                        <select
                                            value={patientForm.gender} onChange={e => setPatientForm({ ...patientForm, gender: e.target.value })}
                                            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 outline-none transition-all text-sm font-bold appearance-none"
                                        >
                                            <option value="M">Male</option>
                                            <option value="F">Female</option>
                                            <option value="O">Other</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Priority</label>
                                        <select
                                            value={patientForm.priority} onChange={e => setPatientForm({ ...patientForm, priority: e.target.value })}
                                            className={`w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 outline-none transition-all text-sm font-bold appearance-none ${patientForm.priority === 'Emergency' ? 'text-rose-600 bg-rose-50 border-rose-100' : ''
                                                }`}
                                        >
                                            <option value="Normal">Normal</option>
                                            <option value="Urgent">Urgent</option>
                                            <option value="Emergency">Emergency</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Contact Info</label>
                                    <input
                                        type="text" required value={patientForm.mobile}
                                        onChange={e => setPatientForm({ ...patientForm, mobile: e.target.value })}
                                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 outline-none transition-all placeholder-slate-300 text-sm font-bold"
                                        placeholder="Mobile Number"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Assign Doctor</label>
                                    <select
                                        required value={selectedDoctor} onChange={e => setSelectedDoctor(e.target.value)}
                                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 outline-none transition-all text-sm font-bold appearance-none"
                                    >
                                        <option value="">Choose Physician...</option>
                                        {doctors.map(doc => (
                                            <option key={doc.id} value={doc.id}>
                                                Dr. {doc.name} • {doc.specialization}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Clinical Note</label>
                                    <textarea
                                        rows="2" value={patientForm.reason}
                                        onChange={e => setPatientForm({ ...patientForm, reason: e.target.value })}
                                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 outline-none transition-all placeholder-slate-300 text-sm font-bold min-h-[100px]"
                                        placeholder="Reason for visit..."
                                    ></textarea>
                                </div>
                                <button
                                    type="submit" disabled={loading}
                                    className="w-full py-5 bg-indigo-600 text-white font-black rounded-3xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-1 active:scale-95 transition-all text-sm uppercase tracking-widest flex items-center justify-center gap-3 group"
                                >
                                    {loading ? 'Processing System...' : (
                                        <>Deploy to Queue <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Status View */}
                    <div className="xl:col-span-3 space-y-12">
                        <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                                        <List className="text-indigo-600" /> Patient Registry
                                    </h2>
                                    <p className="text-slate-400 font-medium text-sm mt-1">Real-time database of today's admissions</p>
                                </div>                                <div className="relative group w-full md:w-auto">
                                    <Search className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                                    <input
                                        type="text" 
                                        placeholder="Filter patients by name or mobile..."
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        className="pl-14 pr-6 py-4 rounded-full bg-slate-50 border border-slate-100 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 outline-none transition-all w-full min-w-[320px]"
                                    />
                                </div>
                            </div>
 
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-separate border-spacing-y-4">
                                    <thead>
                                        <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] px-4">
                                            <th className="pb-4 pl-6">Identifier</th>
                                            <th className="pb-4">Timeline</th>
                                            <th className="pb-4">Assigned Unit</th>
                                            <th className="pb-4">Status</th>
                                            <th className="pb-4"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="">
                                        {patients
                                            .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.mobile.includes(searchTerm))
                                            .slice(0, 10).map(p => (
                                            <tr key={p.id} className="group transition-all hover:-translate-y-1">
                                                <td className="py-5 pl-6 bg-slate-50/50 rounded-l-[1.5rem] border-y border-l border-transparent group-hover:bg-white group-hover:border-indigo-100 group-hover:shadow-xl group-hover:shadow-slate-100/50 transition-all">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-white border border-slate-100 rounded-xl flex items-center justify-center font-black text-indigo-600 shadow-sm">
                                                            {p.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-slate-800">{p.name}</p>
                                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{p.mobile}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-5 bg-slate-50/50 border-y border-transparent group-hover:bg-white group-hover:border-indigo-100 group-hover:shadow-xl group-hover:shadow-slate-100/50 transition-all">
                                                    <div className="flex items-center gap-2 text-slate-600 font-bold text-sm">
                                                        <Clock size={14} className="text-slate-400" /> {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                    </div>
                                                </td>

                                                <td className="py-5 bg-slate-50/50 border-y border-transparent group-hover:bg-white group-hover:border-indigo-100 group-hover:shadow-xl group-hover:shadow-slate-100/50 transition-all font-bold text-sm text-slate-700">
                                                    {p.assigned_doctor_name ? (
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                                            Dr. {p.assigned_doctor_name}
                                                        </div>
                                                    ) : (
                                                        <span className="text-slate-300 italic">Unassigned</span>
                                                    )}
                                                </td>
                                                <td className="py-5 bg-slate-50/50 border-y border-transparent group-hover:bg-white group-hover:border-indigo-100 group-hover:shadow-xl group-hover:shadow-slate-100/50 transition-all">
                                                    <span className="px-5 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                                                        Registered
                                                    </span>
                                                </td>
                                                <td className="py-5 pr-6 bg-slate-50/50 rounded-r-[1.5rem] border-y border-r border-transparent group-hover:bg-white group-hover:border-indigo-100 group-hover:shadow-xl group-hover:shadow-slate-100/50 transition-all text-right">
                                                    <button className="p-3 text-slate-300 hover:text-indigo-600 transition-colors">
                                                        <Activity size={20} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReceptionDashboard;

