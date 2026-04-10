import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { UserCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const DoctorDashboard = () => {

    const [doctorInfo, setDoctorInfo] = useState(null);
    const [patientsInQueue, setPatientsInQueue] = useState([]);
    const [stats, setStats] = useState({ today: 0, total: 0, pending: 0 });

    const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
    const [showAdmitModal, setShowAdmitModal] = useState(false);

    const [activeAppt, setActiveAppt] = useState(null);
    const [prescriptionData, setPrescriptionData] = useState({ medicine: '', description: '' });

    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState('');

    // ✅ INITIAL LOAD
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

    // ✅ API CALLS

    const fetchDoctorProfile = async () => {
        try {
            const res = await api.get('doctors/me/');
            setDoctorInfo(res.data);
        } catch (err) {
            console.error("Doctor fetch error:", err);
        }
    };

    const fetchRooms = async () => {
        try {
            const res = await api.get('rooms/');
            setRooms(res.data.filter(r => r.is_available));
        } catch (err) {
            console.error("Rooms error:", err);
        }
    };

    const fetchWaitingList = async () => {
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

        } catch (err) {
            console.error("Waiting list error:", err);
        }
    };

    // ✅ ACTIONS

    const handleStartConsultation = async (id) => {
        try {
            await api.post(`appointments/${id}/start_consultation/`);
            fetchWaitingList();
        } catch (err) {
            console.error(err);
        }
    };

    const handleCompleteConsultation = async (id) => {
        try {
            await api.post(`appointments/${id}/complete_consultation/`);
            fetchWaitingList();
        } catch (err) {
            console.error(err);
        }
    };

    const handlePrescribe = (appt) => {
        setActiveAppt(appt);
        setShowPrescriptionModal(true);
    };

    const submitPrescription = async (e) => {
        e.preventDefault();
        try {
            await api.post('prescriptions/', {
                patient: activeAppt.patient.id,   // ✅ FIXED
                doctor: doctorInfo.id,
                appointment: activeAppt.id,
                medicine: prescriptionData.medicine,
                description: prescriptionData.description
            });

            setShowPrescriptionModal(false);
            fetchWaitingList();

        } catch (err) {
            console.error("Prescription error:", err);
        }
    };

    const handleAdmit = (appt) => {
        setActiveAppt(appt);
        setShowAdmitModal(true);
    };

    const submitAdmission = async (e) => {
        e.preventDefault();
        try {
            await api.post(`patients/${activeAppt.patient.id}/admit/`, {
                room_id: selectedRoom
            });

            setShowAdmitModal(false);
            fetchRooms();

        } catch (err) {
            console.error("Admission error:", err);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fbff]">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-10">

                {/* HEADER */}
                <div className="flex justify-between items-center mb-10">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white">
                            <UserCircle size={40} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">
                                Dr. {doctorInfo?.name}
                            </h1>
                            <p className="text-sm text-gray-500">
                                {doctorInfo?.specialization}
                            </p>
                        </div>
                    </div>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-3 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-xl shadow">
                        <p>Queue</p>
                        <h2 className="text-2xl font-bold">{stats.today}</h2>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow">
                        <p>Completed</p>
                        <h2 className="text-2xl font-bold">{stats.total}</h2>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow">
                        <p>Pending</p>
                        <h2 className="text-2xl font-bold">{stats.pending}</h2>
                    </div>
                </div>

                {/* PATIENT LIST */}
                <div className="space-y-4">
                    {patientsInQueue.map((p) => (
                        <div key={p.id} className="bg-white p-6 rounded-xl shadow">

                            <div className="flex justify-between">
                                <div>
                                    {/* ✅ FIXED VARIABLES */}
                                    <h2 className="font-bold text-lg">
                                        {p.patient?.name}
                                    </h2>

                                    <p className="text-sm text-gray-500">
                                        Age: {p.patient?.age} | {p.patient?.gender}
                                    </p>

                                    <p className="text-sm mt-1">
                                        Symptoms: {p.symptoms || 'N/A'}
                                    </p>

                                    {p.priority === 'Emergency' && (
                                        <span className="text-red-500 text-xs font-bold">
                                            ⚠ Emergency
                                        </span>
                                    )}
                                </div>

                                <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">
                                    {p.queue_status}
                                </span>
                            </div>

                            {/* ACTIONS */}
                            <div className="flex gap-2 mt-4 flex-wrap">
                                <button onClick={() => handleStartConsultation(p.id)} className="bg-indigo-600 text-white px-4 py-2 rounded">
                                    Start
                                </button>

                                <button onClick={() => handleCompleteConsultation(p.id)} className="bg-green-600 text-white px-4 py-2 rounded">
                                    Complete
                                </button>

                                <button onClick={() => handlePrescribe(p)} className="bg-blue-500 text-white px-4 py-2 rounded">
                                    Prescribe
                                </button>

                                <button onClick={() => handleAdmit(p)} className="bg-red-500 text-white px-4 py-2 rounded">
                                    Admit
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* PRESCRIPTION MODAL */}
            <AnimatePresence>
                {showPrescriptionModal && (
                    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
                        <motion.div className="bg-white p-6 rounded-xl w-96">
                            <h2 className="text-lg font-bold mb-4">Prescription</h2>

                            <form onSubmit={submitPrescription}>
                                <textarea
                                    required
                                    className="w-full border p-2 mb-3"
                                    placeholder="Medicine"
                                    onChange={(e) => setPrescriptionData({ ...prescriptionData, medicine: e.target.value })}
                                />

                                <textarea
                                    className="w-full border p-2 mb-3"
                                    placeholder="Instructions"
                                    onChange={(e) => setPrescriptionData({ ...prescriptionData, description: e.target.value })}
                                />

                                <div className="flex gap-2">
                                    <button type="button" onClick={() => setShowPrescriptionModal(false)} className="flex-1 bg-gray-200 py-2 rounded">
                                        Cancel
                                    </button>

                                    <button type="submit" className="flex-1 bg-indigo-600 text-white py-2 rounded">
                                        Save
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ADMIT MODAL */}
            <AnimatePresence>
                {showAdmitModal && (
                    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
                        <motion.div className="bg-white p-6 rounded-xl w-96">
                            <h2 className="text-lg font-bold mb-4">Admit Patient</h2>

                            <form onSubmit={submitAdmission}>
                                <select
                                    required
                                    className="w-full border p-2 mb-3"
                                    onChange={(e) => setSelectedRoom(e.target.value)}
                                >
                                    <option value="">Select Room</option>
                                    {rooms.map(r => (
                                        <option key={r.id} value={r.id}>
                                            {r.room_no} - {r.room_type}
                                        </option>
                                    ))}
                                </select>

                                <div className="flex gap-2">
                                    <button type="button" onClick={() => setShowAdmitModal(false)} className="flex-1 bg-gray-200 py-2 rounded">
                                        Cancel
                                    </button>

                                    <button type="submit" className="flex-1 bg-indigo-600 text-white py-2 rounded">
                                        Admit
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
