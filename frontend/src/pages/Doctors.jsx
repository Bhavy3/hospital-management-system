import { useEffect, useState } from 'react';
import api from '../services/api';
import { Plus, Search, UserPlus, Phone, Mail, Stethoscope, Loader2, X, Trash2, DollarSign } from 'lucide-react';

const Doctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        specialization: '',
        mobile: '',
        email: '',
        address: '',
        fees: 50,
        availability_status: 'Available'
    });

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const response = await api.get('doctors/');
            setDoctors(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch doctors');
            setLoading(false);
        }
    };

    const handleAddDoctor = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('doctors/', formData);
            setShowModal(false);
            setFormData({ name: '', specialization: '', mobile: '', email: '', address: '', fees: 50, availability_status: 'Available' });
            fetchDoctors();
        } catch (err) {
            alert('Failed to add doctor');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to remove this doctor from the registry?')) return;
        try {
            await api.delete(`doctors/${id}/`);
            fetchDoctors();
        } catch (err) {
            alert('Failed to delete doctor');
        }
    };

    const filteredDoctors = doctors.filter(d => 
        d.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.mobile?.includes(searchTerm) ||
        d.email?.toLowerCase().includes(searchTerm.toLowerCase())
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
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Medical Staff Registry</h2>
                    <p className="text-slate-500 font-medium">Manage physician profiles, specialties, and active availability.</p>
                </div>
                <button 
                    onClick={() => setShowModal(true)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 flex items-center gap-2"
                >
                    <Plus size={20} /> Onboard Doctor
                </button>
            </div>

            <div className="bg-white rounded-[30px] shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-50 bg-slate-50/30">
                    <div className="relative max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name or specialty..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-6 py-3.5 rounded-2xl border border-slate-100 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-200 bg-white font-bold text-sm transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                <th className="p-6">Doctor Details</th>
                                <th className="p-6">Specialty</th>
                                <th className="p-6">Status</th>
                                <th className="p-6">Contact Unit</th>
                                <th className="p-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredDoctors.map((doctor) => (
                                <tr key={doctor.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black transition-all shadow-sm">
                                                {doctor.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-800 text-sm tracking-tight">Dr. {doctor.name}</p>
                                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mt-1">DOCID: #MED-{doctor.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                                            {doctor.specialization}
                                        </span>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex flex-col gap-1">
                                            <span className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest ${
                                                doctor.availability_status === 'Available' ? 'text-emerald-500' : 
                                                doctor.availability_status === 'Busy' ? 'text-amber-500' : 'text-slate-400'
                                            }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${
                                                    doctor.availability_status === 'Available' ? 'bg-emerald-500 animate-pulse' : 
                                                    doctor.availability_status === 'Busy' ? 'bg-amber-500' : 'bg-slate-300'
                                                }`}></div>
                                                {doctor.availability_status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                                                <Phone size={14} className="text-slate-300" /> {doctor.mobile}
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-500 text-[10px] font-medium">
                                                <Mail size={12} className="text-slate-300" /> {doctor.email}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center justify-end gap-3">
                                            <button className="text-blue-600 hover:scale-110 transition-transform"><UserPlus size={18} /></button>
                                            <button 
                                                onClick={() => handleDelete(doctor.id)}
                                                className="text-rose-400 hover:text-rose-600 transition-colors"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredDoctors.length === 0 && searchTerm && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="text-slate-400" size={24} />
                        </div>
                        <p className="text-slate-500 text-lg font-medium">No doctors found matching "{searchTerm}"</p>
                        <button 
                            onClick={() => setSearchTerm('')}
                            className="mt-4 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                        >
                            Clear search
                        </button>
                    </div>
                )}
            </div>

            {/* Doctor Onboarding Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-300">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                            <div>
                                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Physician Onboarding</h3>
                                <p className="text-slate-400 text-sm font-medium courier">Configure new medical profile</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="p-3 hover:bg-white rounded-2xl transition-all shadow-sm">
                                <X size={24} className="text-slate-400" />
                            </button>
                        </div>
                        <form onSubmit={handleAddDoctor} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                <div className="relative">
                                    <Stethoscope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                    <input
                                        type="text" required
                                        value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                                        className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-200 outline-none transition-all font-bold text-sm"
                                        placeholder="Dr. Name"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Medical Specialty</label>
                                    <input
                                        type="text" required
                                        value={formData.specialization} onChange={e => setFormData({...formData, specialization: e.target.value})}
                                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-200 outline-none transition-all font-bold text-sm"
                                        placeholder="e.g. Cardiology"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Consultation Fee</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                        <input
                                            type="number" required
                                            value={formData.fees} onChange={e => setFormData({...formData, fees: e.target.value})}
                                            className="w-full pl-10 pr-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-200 outline-none transition-all font-bold text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mobile Unit</label>
                                    <input
                                        type="text" required
                                        value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})}
                                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-200 outline-none transition-all font-bold text-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Official Email</label>
                                    <input
                                        type="email" required
                                        value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-200 outline-none transition-all font-bold text-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Office Address</label>
                                <input
                                    type="text" required
                                    value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}
                                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-200 outline-none transition-all font-bold text-sm"
                                    placeholder="Hospital Ward/Room No."
                                />
                            </div>

                            <button
                                type="submit" disabled={submitting}
                                className="w-full py-5 bg-blue-600 text-white font-black rounded-3xl shadow-xl shadow-blue-500/20 hover:bg-blue-700 hover:-translate-y-1 active:scale-95 transition-all text-sm uppercase tracking-widest flex items-center justify-center gap-3 mt-4"
                            >
                                {submitting ? <Loader2 className="animate-spin" /> : 'Confirm Onboarding'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Doctors;
