import { useEffect, useState } from 'react';
import api from '../services/api';
import { Calendar, CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await api.get('appointments/');
            setAppointments(response.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching appointments:", err);
            setLoading(false);
        }
    };

    const handleConfirm = async (id) => {
        try {
            await api.post(`appointments/${id}/confirm/`);
            fetchAppointments();
        } catch (err) {
            console.error("Error confirming appointment:", err);
        }
    };

    const handleCancel = async (id) => {
        try {
            await api.post(`appointments/${id}/cancel/`);
            fetchAppointments();
        } catch (err) {
            console.error("Error cancelling appointment:", err);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-[60vh]">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        </div>
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'Confirmed': return 'bg-green-100 text-green-800 border-green-200';
            case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
            case 'Completed': return 'bg-blue-100 text-blue-800 border-blue-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Appointments</h2>
                    <p className="text-slate-500 font-medium">Manage patient bookings and consultation schedules.</p>
                </div>
            </div>

            <div className="bg-white rounded-[30px] shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                        <tr>
                            <th className="p-6">Patient</th>
                            <th className="p-6">Doctor</th>
                            <th className="p-6">Schedule</th>
                            <th className="p-6">Status</th>
                            <th className="p-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {appointments.map((apt) => (
                            <tr key={apt.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="p-6">
                                    <p className="font-black text-slate-800 text-sm tracking-tight">{apt.patient_name}</p>
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mt-1">ID: #APT-{apt.id}</p>
                                </td>
                                <td className="p-6">
                                    <span className="text-sm font-bold text-slate-600">Dr. {apt.doctor_name}</span>
                                </td>
                                <td className="p-6">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center text-xs font-bold text-slate-500 gap-1.5">
                                            <Calendar size={14} className="text-slate-300" /> {apt.date}
                                        </div>
                                        <div className="flex items-center text-xs font-bold text-slate-500 gap-1.5">
                                            <Clock size={14} className="text-slate-300" /> {apt.time}
                                        </div>
                                    </div>
                                </td>
                                <td className="p-6">
                                    <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(apt.status)}`}>
                                        {apt.status}
                                    </span>
                                </td>
                                <td className="p-6">
                                    <div className="flex items-center justify-end gap-2">
                                        {apt.status === 'Pending' && (
                                            <>
                                                <button 
                                                    onClick={() => handleConfirm(apt.id)}
                                                    className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm" title="Confirm">
                                                    <CheckCircle size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => handleCancel(apt.id)}
                                                    className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm" title="Cancel">
                                                    <XCircle size={18} />
                                                </button>
                                            </>
                                        )}
                                        <button className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-slate-200 transition-colors">Details</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {appointments.length === 0 && (
                    <div className="p-20 text-center">
                        <Calendar className="w-16 h-16 text-slate-100 mx-auto mb-4" />
                        <p className="text-slate-400 font-bold">No appointments scheduled for today.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Appointments;
