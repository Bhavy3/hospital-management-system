import { useEffect, useState } from 'react';
import api from '../services/api';
import { Plus, Search, Pill, FileText, User, Calendar, ClipboardList, PenTool } from 'lucide-react';

const Prescriptions = () => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [newPrescription, setNewPrescription] = useState({
        patient: '',
        doctor: '',
        medicine: '',
        date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        fetchPrescriptions();
        fetchPatients();
        fetchDoctors();
    }, []);

    const fetchPatients = async () => {
        try {
            const response = await api.get('patients/');
            setPatients(response.data);
        } catch (err) {
            console.error('Failed to fetch patients');
        }
    };

    const fetchDoctors = async () => {
        try {
            const response = await api.get('doctors/');
            setDoctors(response.data);
        } catch (err) {
            console.error('Failed to fetch doctors');
        }
    };

    const fetchPrescriptions = async () => {
        try {
            const response = await api.get('prescriptions/');
            setPrescriptions(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch prescription records');
            setLoading(false);
        }
    };

    const handleIssuePrescription = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('prescriptions/', newPrescription);
            fetchPrescriptions();
            setIsModalOpen(false);
            setNewPrescription({
                patient: '',
                doctor: '',
                medicine: '',
                date: new Date().toISOString().split('T')[0]
            });
        } catch (err) {
            alert('Failed to issue prescription. Please ensure all fields are correct.');
        } finally {
            setSubmitting(false);
        }
    };

    const filteredPrescriptions = prescriptions.filter(p => 
        p.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.medicine?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="flex items-center justify-center h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    if (error) return <div className="p-6 text-red-500 font-bold bg-red-50 rounded-xl border border-red-200">{error}</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                        <Pill className="text-indigo-600" size={32} /> Digital Prescriptions
                    </h2>
                    <p className="text-slate-500 font-medium">Patient medication history and clinical instructions.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2"
                >
                    <PenTool size={20} /> Issue New Prescription
                </button>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[32px] shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden transform animate-in slide-in-from-bottom-8 duration-500">
                        <div className="p-8 bg-slate-50/50 border-b border-slate-100">
                            <h3 className="text-2xl font-black text-slate-800 tracking-tight">New Prescription</h3>
                            <p className="text-slate-500 font-medium text-sm">Issue clinical instructions and medication dosage.</p>
                        </div>
                        <form onSubmit={handleIssuePrescription} className="p-8 space-y-5">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Patient</label>
                                <select 
                                    required
                                    className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/30 transition-all font-bold appearance-none"
                                    value={newPrescription.patient}
                                    onChange={(e) => setNewPrescription({...newPrescription, patient: e.target.value})}
                                >
                                    <option value="">Select patient...</option>
                                    {patients.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Assigning Doctor</label>
                                <select 
                                    required
                                    className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/30 transition-all font-bold appearance-none"
                                    value={newPrescription.doctor}
                                    onChange={(e) => setNewPrescription({...newPrescription, doctor: e.target.value})}
                                >
                                    <option value="">Select doctor...</option>
                                    {doctors.map(d => (
                                        <option key={d.id} value={d.id}>{d.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Medicine & Dosage</label>
                                <textarea 
                                    required
                                    rows="3"
                                    placeholder="e.g. Paracetamol 500mg - Twice daily after meals"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/30 transition-all font-bold resize-none"
                                    value={newPrescription.medicine}
                                    onChange={(e) => setNewPrescription({...newPrescription, medicine: e.target.value})}
                                />
                            </div>
                            <div className="flex gap-4 pt-2">
                                <button 
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-6 py-3.5 border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 px-6 py-3.5 bg-indigo-600 text-white rounded-2xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
                                >
                                    {submitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Issue RX'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b bg-slate-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3 top-3 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search patients or medicines..."
                            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white shadow-sm transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 text-slate-500 uppercase text-[11px] font-black tracking-widest border-b border-slate-100">
                                <th className="px-6 py-4">Prescription ID</th>
                                <th className="px-6 py-4">Patient</th>
                                <th className="px-6 py-4">Medicine & Dosage</th>
                                <th className="px-6 py-4">Doctor</th>
                                <th className="px-6 py-4">Date Issued</th>
                                <th className="px-6 py-4 text-center">Summary</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredPrescriptions.map((p) => (
                                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors group">
                                    <td className="px-6 py-4">
                                        <span className="font-bold text-slate-400 text-xs tracking-tighter uppercase">#RX-{p.id.toString().padStart(4, '0')}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-800">{p.patient_name}</span>
                                            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">In-Patient</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="p-2 border border-slate-100 bg-slate-50 rounded-lg max-w-xs">
                                            <p className="text-emerald-700 font-bold text-sm leading-tight line-clamp-2">{p.medicine}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-[10px] font-bold">DR</div>
                                            <span className="text-slate-600 font-medium text-sm">{p.doctor_name || 'Dr. Staff'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 font-medium text-sm">
                                        {new Date(p.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                                            <ClipboardList size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredPrescriptions.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-400 font-medium">
                                        No prescriptions found. Select "Issue New" to get started.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Prescriptions;
