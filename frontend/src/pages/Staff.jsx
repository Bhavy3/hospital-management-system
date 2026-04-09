import { useEffect, useState } from 'react';
import api from '../services/api';
import { Plus, Search, UserPlus, Mail, Phone, Briefcase, Loader2, X, Trash2 } from 'lucide-react';

const Staff = () => {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        role: 'nurse',
        mobile: '',
        email: '',
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        try {
            const response = await api.get('staff/');
            setStaff(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch staff members');
            setLoading(false);
        }
    };

    const handleAddStaff = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('staff/', formData);
            setShowModal(false);
            setFormData({ name: '', role: 'nurse', mobile: '', email: '' });
            fetchStaff();
        } catch (err) {
            alert("Error adding staff member");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Permanent removal of staff member record?")) return;
        try {
            await api.delete(`staff/${id}/`);
            fetchStaff();
        } catch (err) {
            alert("Error removing staff record");
        }
    };

    const filteredStaff = staff.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.role.toLowerCase().includes(searchTerm.toLowerCase())
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
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Staff Management</h2>
                    <p className="text-slate-500 font-medium">Coordinate hospital personnel and active duty shifts.</p>
                </div>
                <button 
                    onClick={() => setShowModal(true)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 flex items-center gap-2"
                >
                    <Plus size={20} /> Add Personnel
                </button>
            </div>

            <div className="bg-white rounded-[30px] shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-50 bg-slate-50/30">
                    <div className="relative max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Find staff by name or role..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-6 py-3.5 rounded-2xl border border-slate-100 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-200 bg-white font-bold text-sm transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                <th className="p-6">Personnel Info</th>
                                <th className="p-6">Role & Status</th>
                                <th className="p-6">Contact</th>
                                <th className="p-6">Joining Date</th>
                                <th className="p-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredStaff.map((member) => (
                                <tr key={member.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                                                {member.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-800 tracking-tight">{member.name}</p>
                                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">ID: #STF-{member.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex flex-col gap-1.5">
                                            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest w-fit">
                                                {member.role.replace('_', ' ')}
                                            </span>
                                            {member.is_active ? (
                                                <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-500 uppercase tracking-widest ml-1">
                                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> Active Duty
                                                </span>
                                            ) : (
                                                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest ml-1">Off Duty</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                                                <Phone size={14} className="text-slate-300" /> {member.mobile}
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                                                <Mail size={14} className="text-slate-300" /> {member.email}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6 text-slate-500 font-bold text-sm">
                                        {new Date(member.joining_date).toLocaleDateString()}
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <button className="text-blue-600 hover:underline text-xs font-black uppercase tracking-widest">Profile</button>
                                            <button 
                                                onClick={() => handleDelete(member.id)}
                                                className="text-rose-400 hover:text-rose-600 transition-colors">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredStaff.length === 0 && (
                        <div className="p-20 text-center">
                            <Briefcase className="w-16 h-16 text-slate-100 mx-auto mb-4" />
                            <p className="text-slate-400 font-bold">No personnel records found.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Staff Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-300">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                            <div>
                                <h3 className="text-2xl font-black text-slate-800">New Personnel</h3>
                                <p className="text-slate-400 text-sm font-medium courier">Onboard new hospital staff</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="p-3 hover:bg-white rounded-2xl transition-all shadow-sm">
                                <X size={24} className="text-slate-400" />
                            </button>
                        </div>
                        <form onSubmit={handleAddStaff} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                <div className="relative">
                                    <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                    <input
                                        type="text" required
                                        value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                                        className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-200 outline-none transition-all font-bold text-sm"
                                        placeholder="Staff Member Name"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Designation</label>
                                    <select
                                        value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}
                                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-200 outline-none transition-all font-bold text-sm appearance-none"
                                    >
                                        <option value="nurse">Nurse</option>
                                        <option value="receptionist">Receptionist</option>
                                        <option value="lab_tech">Lab Technician</option>
                                        <option value="admin_staff">Admin Staff</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mobile Unit</label>
                                    <input
                                        type="text" required
                                        value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})}
                                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-200 outline-none transition-all font-bold text-sm"
                                        placeholder="Contact Number"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Official Email</label>
                                <input
                                    type="email" required
                                    value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-200 outline-none transition-all font-bold text-sm"
                                    placeholder="email@hospital.com"
                                />
                            </div>

                            <button
                                type="submit" disabled={submitting}
                                className="w-full py-5 bg-blue-600 text-white font-black rounded-3xl shadow-xl shadow-blue-500/20 hover:bg-blue-700 hover:-translate-y-1 active:scale-95 transition-all text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 mt-4"
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

export default Staff;
