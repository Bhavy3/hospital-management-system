import { useEffect, useState } from 'react';
import api from '../services/api';
import { Plus, Search, UserPlus, Phone, Calendar, Loader2, X, Trash2 } from 'lucide-react';

const Patients = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        gender: 'M',
        mobile: '',
        address: ''
    });

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const response = await api.get('patients/');
            setPatients(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch patients');
            setLoading(false);
        }
    };

    const handleAddPatient = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('patients/', formData);
            setShowModal(false);
            setFormData({ name: '', age: '', gender: 'M', mobile: '', address: '' });
            fetchPatients();
        } catch (err) {
            alert('Failed to add patient');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this patient record?')) return;
        try {
            await api.delete(`patients/${id}/`);
            fetchPatients();
        } catch (err) {
            alert('Failed to delete patient');
        }
    };

    const filteredPatients = patients.filter(p => 
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.mobile?.includes(searchTerm) ||
        p.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="flex items-center justify-center h-[60vh]">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Patient Registry</h2>
                    <p className="text-slate-500 font-medium">Database of all registered individuals and health histories.</p>
                </div>
                <button 
                    onClick={() => setShowModal(true)}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20 flex items-center gap-2"
                >
                    <Plus size={20} /> Register Patient
                </button>
            </div>

            <div className="bg-white rounded-[30px] shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-50 bg-slate-50/30">
                    <div className="relative max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name or mobile..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-6 py-3.5 rounded-2xl border border-slate-100 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 bg-white font-bold text-sm transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                <th className="p-6">Patient Details</th>
                                <th className="p-6">Age / Bio</th>
                                <th className="p-6">Contact Unit</th>
                                <th className="p-6">Current Location</th>
                                <th className="p-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredPatients.map((patient) => (
                                <tr key={patient.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black transition-all">
                                                {patient.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-800 text-sm tracking-tight">{patient.name}</p>
                                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mt-1">PID: #PTR-{patient.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <p className="text-sm font-bold text-slate-600 tracking-tight">{patient.age}Y • {patient.gender === 'M' ? 'Male' : 'Female'}</p>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center text-xs font-bold text-slate-500 gap-1.5">
                                            <Phone size={14} className="text-slate-300" /> {patient.mobile}
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <span className="text-xs font-bold text-slate-500">
                                            {patient.admitted_room || 'Outpatient'}
                                        </span>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center justify-end gap-3">
                                            <button className="text-blue-600 hover:scale-110 transition-transform"><UserPlus size={18} /></button>
                                            <button 
                                                onClick={() => handleDelete(patient.id)}
                                                className="text-rose-400 hover:text-rose-600 transition-colors"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredPatients.length === 0 && searchTerm && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="text-slate-400" size={24} />
                        </div>
                        <p className="text-slate-500 text-lg font-medium">No patients found matching "{searchTerm}"</p>
                        <button 
                            onClick={() => setSearchTerm('')}
                            className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                        >
                            Clear search
                        </button>
                    </div>
                )}
            </div>

            {/* Registration Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-300">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                            <div>
                                <h3 className="text-2xl font-black text-slate-800 tracking-tighter">New Registration</h3>
                                <p className="text-slate-400 text-sm font-medium courier">Initialize patient record</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="p-3 hover:bg-white rounded-2xl transition-all shadow-sm">
                                <X size={24} className="text-slate-400" />
                            </button>
                        </div>
                        <form onSubmit={handleAddPatient} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Identity</label>
                                <input
                                    type="text" required
                                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 outline-none transition-all font-bold text-sm"
                                    placeholder="Legal Name"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Biological Age</label>
                                    <input
                                        type="number" required
                                        value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})}
                                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 outline-none transition-all font-bold text-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Gender</label>
                                    <select
                                        value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}
                                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 outline-none transition-all font-bold text-sm appearance-none"
                                    >
                                        <option value="M">Male</option>
                                        <option value="F">Female</option>
                                        <option value="O">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mobile Contact</label>
                                <input
                                    type="text" required
                                    value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})}
                                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 outline-none transition-all font-bold text-sm"
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>

                            <button
                                type="submit" disabled={submitting}
                                className="w-full py-5 bg-indigo-600 text-white font-black rounded-3xl shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 hover:-translate-y-1 active:scale-95 transition-all text-sm uppercase tracking-widest flex items-center justify-center gap-3 mt-4"
                            >
                                {submitting ? <Loader2 className="animate-spin" /> : 'Confirm Registration'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Patients;
