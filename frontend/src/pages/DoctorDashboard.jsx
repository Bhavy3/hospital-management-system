import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import WaitingList from '../components/WaitingList';
import { Calendar, Users, Activity, Settings, UserCircle, Clock, CheckCircle, ArrowRight, Clipboard, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const DoctorDashboard = () => {
    const [doctorInfo, setDoctorInfo] = useState(null);
    const [patientsInQueue, setPatientsInQueue] = useState([]);
    const [stats, setStats] = useState({ today: 0, total: 342, pending: 8 });
    const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
    const [showAdmitModal, setShowAdmitModal] = useState(false);
    const [activeAppt, setActiveAppt] = useState(null);
    const [prescriptionData, setPrescriptionData] = useState({ medicine: '', description: '' });
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState('');
    useEffect(() => {
        fetchDoctorProfile();
        fetchRooms();
    }, []);

    useEffect(() => {
        if (!doctorInfo) return;
        
        fetchWaitingList();
        const interval = setInterval(fetchWaitingList, 5000);
        return () => clearInterval(interval);
    }, [doctorInfo]);

    const fetchRooms = async () => {
        try {
            const res = await api.get('rooms/');
            setRooms(res.data.filter(r => r.is_available));
        } catch (err) { console.error(err); }
    };

    const fetchDoctorProfile = async () => {
        try {
            const res = await api.get('doctors/me/');
            setDoctorInfo(res.data);
        } catch (err) { 
            console.error("Error fetching doctor profile", err); 
        }
    };

    const fetchWaitingList = async () => {
        if (!doctorInfo) return;
        try {
            const [waitingRes, allRes] = await Promise.all([
                api.get('appointments/waiting_list/'),
                api.get('appointments/')
            ]);
            setPatientsInQueue(waitingRes.data);
            
            const completed = allRes.data.filter(a => a.status === 'Completed').length;
            setStats({
                today: waitingRes.data.length,
                total: completed,
                pending: waitingRes.data.filter(a => a.queue_status === 'Waiting').length
            });
        } catch (err) { console.error(err); }
    };

    const handleStartConsultation = async (id) => {
        try {
            await api.post(`appointments/${id}/start_consultation/`);
            fetchWaitingList();
        } catch (err) { console.error(err); }
    };

    const handleCompleteConsultation = async (id) => {
        try {
            await api.post(`appointments/${id}/complete_consultation/`);
            fetchWaitingList();
        } catch (err) { console.error(err); }
    };

    const handlePrescribe = (app) => {
        setActiveAppt(app);
        setPrescriptionData({ medicine: '', description: '' });
        setShowPrescriptionModal(true);
    };

    const submitPrescription = async (e) => {
        e.preventDefault();
        try {
            await api.post('prescriptions/', {
                patient: activeAppt.patient,
                doctor: doctorInfo.id,
                appointment: activeAppt.id,
                medicine: prescriptionData.medicine,
                description: prescriptionData.description
            });
            setShowPrescriptionModal(false);
            alert("Prescription saved successfully.");
        } catch (err) {
            console.error("Prescription error", err);
            const errStr = err.response?.data ? JSON.stringify(err.response.data) : err.message;
            alert("Failed to save prescription. Reason: " + errStr);
        }
    };

    const handleAdmit = (app) => {
        setActiveAppt(app);
        setSelectedRoom('');
        setShowAdmitModal(true);
    };

    const submitAdmission = async (e) => {
        e.preventDefault();
        try {
            await api.post(`patients/${activeAppt.patient}/admit/`, {
                room_id: selectedRoom
            });
            setShowAdmitModal(false);
            fetchRooms(); // refresh rooms
            alert("Patient admitted successfully.");
        } catch (err) {
            console.error("Admission error", err);
            const errStr = err.response?.data ? JSON.stringify(err.response.data) : err.message;
            alert("Failed to admit patient. Reason: " + errStr);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fbff]">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-indigo-200 overflow-hidden transform hover:rotate-6 transition-transform">
                                <UserCircle className="w-12 h-12" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-4 border-white rounded-full"></div>
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 leading-tight">
                                {doctorInfo ? `Dr. ${doctorInfo.name}` : 'Welcome, Doctor'}
                            </h1>
                            <div className="flex items-center gap-3 mt-1">
                                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-wider">
                                    {doctorInfo?.specialization || 'General Surgeon'}
                                </span>
                                <span className="text-slate-400 font-medium text-sm flex items-center gap-1">
                                    <Clock className="w-4 h-4" /> Shift Ends: 18:00
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-slate-600 font-bold hover:bg-slate-50 transition-all shadow-sm">
                            <Settings className="w-5 h-5" />
                            <span className="hidden sm:inline">Preferences</span>
                        </button>
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
                            Emergency Alert
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <div className="bg-white p-7 rounded-3xl shadow-sm border border-slate-100 flex justify-between items-center group hover:border-indigo-200 transition-all">
                        <div>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Queue Status</p>
                            <h3 className="text-3xl font-black text-slate-800">{stats.today} Patients</h3>
                            <p className="text-indigo-500 text-xs font-bold mt-1 flex items-center gap-1">
                                Live Tracking <Activity className="w-3 h-3 animate-pulse" />
                            </p>
                        </div>
                        <div className="p-4 bg-indigo-50 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors text-indigo-600">
                            <Users size={28} />
                        </div>
                    </div>

                    <div className="bg-white p-7 rounded-3xl shadow-sm border border-slate-100 flex justify-between items-center group hover:border-emerald-200 transition-all">
                        <div>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Efficiency</p>
                            <h3 className="text-3xl font-black text-slate-800">12m <span className="text-base font-medium text-slate-400">/avg</span></h3>
                            <p className="text-emerald-500 text-xs font-bold mt-1 flex items-center gap-1">
                                Optimal Performance <CheckCircle className="w-3 h-3" />
                            </p>
                        </div>
                        <div className="p-4 bg-emerald-50 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-colors text-emerald-600">
                            <Clock size={28} />
                        </div>
                    </div>

                    <div className="bg-white p-7 rounded-3xl shadow-sm border border-slate-100 flex justify-between items-center group hover:border-amber-200 transition-all">
                        <div>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Total Consults</p>
                            <h3 className="text-3xl font-black text-slate-800">{stats.total}</h3>
                            <p className="text-amber-500 text-xs font-bold mt-1">This month's analytics</p>
                        </div>
                        <div className="p-4 bg-amber-50 rounded-2xl group-hover:bg-amber-600 group-hover:text-white transition-colors text-amber-600">
                            <Clipboard size={28} />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                    <div className="xl:col-span-2 space-y-8">
                        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                            <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-white">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-800">Current Queue</h2>
                                    <p className="text-slate-400 font-medium text-sm">Real-time patient flow management</p>
                                </div>
                                <div className="flex gap-2">
                                    <span className="px-4 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase tracking-tighter">Automated Queue</span>
                                </div>
                            </div>
                            <div className="p-8">
                                <WaitingList
                                    patients={patientsInQueue}
                                    onStartConsultation={handleStartConsultation}
                                    onCompleteConsultation={handleCompleteConsultation}
                                    onPrescribe={handlePrescribe}
                                    onAdmit={handleAdmit}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-indigo-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-100">
                            <div className="relative z-10">
                                <h3 className="text-xl font-black mb-1">Next Session Note</h3>
                                <p className="text-indigo-300 text-sm mb-6">Quick reference for patient history</p>
                                <textarea
                                    className="w-full bg-indigo-800/50 border border-indigo-700/50 rounded-2xl p-5 text-sm focus:ring-2 focus:ring-indigo-400 outline-none text-white placeholder-indigo-400/60 min-h-[150px]"
                                    placeholder="e.g., Follow up with Patient #2104 about blood reports..."
                                ></textarea>
                                <button className="w-full bg-white text-indigo-900 font-black py-4 rounded-2xl mt-6 hover:bg-slate-100 transition-all flex items-center justify-center gap-2 group">
                                    Save Intelligence <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-800/30 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                        </div>

                        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                            <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                                <Calendar size={20} className="text-indigo-600" /> Today's Routine
                            </h3>
                            <div className="space-y-6">
                                {[
                                    { time: '09:00', task: 'General Wards Round', status: 'completed' },
                                    { time: '11:00', task: 'OPD Consultations', status: 'current' },
                                    { time: '14:30', task: 'Staff Meeting (Room 4)', status: 'upcoming' },
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4 items-start relative pb-6 last:pb-0">
                                        {i !== 2 && <div className="absolute left-2.5 top-6 bottom-0 w-0.5 bg-slate-100"></div>}
                                        <div className={`w-5 h-5 rounded-full border-4 border-white shadow-sm shrink-0 z-10 ${item.status === 'completed' ? 'bg-emerald-500' : item.status === 'current' ? 'bg-indigo-600' : 'bg-slate-200'
                                            }`}></div>
                                        <div>
                                            <p className={`text-xs font-bold uppercase tracking-wider ${item.status === 'current' ? 'text-indigo-600' : 'text-slate-400'}`}>
                                                {item.time}
                                            </p>
                                            <p className={`text-sm font-bold ${item.status === 'current' ? 'text-slate-900' : 'text-slate-600'}`}>
                                                {item.task}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <AnimatePresence>
                {showPrescriptionModal && (
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
                        >
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                <h2 className="text-xl font-bold">Write Prescription</h2>
                                <button onClick={() => setShowPrescriptionModal(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <form onSubmit={submitPrescription} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Medicine Details *</label>
                                    <textarea 
                                        required
                                        className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-400 outline-none min-h-[100px]"
                                        placeholder="e.g., Crocin 500mg, 1 tablet twice a day"
                                        value={prescriptionData.medicine}
                                        onChange={(e) => setPrescriptionData({...prescriptionData, medicine: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Additional Instructions</label>
                                    <textarea 
                                        className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-400 outline-none min-h-[100px]"
                                        placeholder="Take after meals..."
                                        value={prescriptionData.description}
                                        onChange={(e) => setPrescriptionData({...prescriptionData, description: e.target.value})}
                                    />
                                </div>
                                <div className="mt-6 flex gap-3">
                                    <button type="button" onClick={() => setShowPrescriptionModal(false)} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors">Cancel</button>
                                    <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors">Save Prescription</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}

                {showAdmitModal && (
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
                        >
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                <h2 className="text-xl font-bold">Admit Patient</h2>
                                <button onClick={() => setShowAdmitModal(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <form onSubmit={submitAdmission} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Assign Room *</label>
                                    <select
                                        required
                                        className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-400 outline-none"
                                        value={selectedRoom}
                                        onChange={(e) => setSelectedRoom(e.target.value)}
                                    >
                                        <option value="">-- Select Available Room --</option>
                                        {rooms.map(room => (
                                            <option key={room.id} value={room.id}>
                                                {room.room_no} - {room.room_type} (₹{room.charges}/day)
                                            </option>
                                        ))}
                                    </select>
                                    {rooms.length === 0 && (
                                        <p className="text-red-500 text-sm mt-2">No rooms available currently.</p>
                                    )}
                                </div>
                                <div className="mt-6 flex gap-3">
                                    <button type="button" onClick={() => setShowAdmitModal(false)} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors">Cancel</button>
                                    <button type="submit" disabled={rooms.length === 0 || !selectedRoom} className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50">
                                        Confirm Admission
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DoctorDashboard;
