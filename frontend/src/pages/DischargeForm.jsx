import { useEffect, useState } from 'react';
import api from '../services/api';
import { Plus, Search, LogOut, User, Calendar, FileText, CreditCard, CheckCircle } from 'lucide-react';

const DischargeForm = () => {
    const [discharges, setDischarges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [newDischarge, setNewDischarge] = useState({
        patient: '',
        doctor: '',
        room: '',
        discharge_reason: 'Recovered',
        discharge_summary: '',
        follow_up_instructions: ''
    });

    useEffect(() => {
        fetchDischarges();
        fetchPatients();
        fetchDoctors();
        fetchRooms();
    }, []);

    const fetchPatients = async () => {
        try {
            const response = await api.get('patients/');
            // Only show admitted patients who are not discharged
            setPatients(response.data.filter(p => p.admitted_room && !p.is_discharged));
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

    const fetchRooms = async () => {
        try {
            const response = await api.get('rooms/');
            setRooms(response.data);
        } catch (err) {
            console.error('Failed to fetch rooms');
        }
    };

    const fetchDischarges = async () => {
        try {
            const response = await api.get('discharges/');
            setDischarges(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch discharge records');
            setLoading(false);
        }
    };

    const handleDischargePatient = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('discharges/', newDischarge);
            fetchDischarges();
            fetchPatients(); // Refresh patient list
            setIsModalOpen(false);
            setNewDischarge({
                patient: '',
                doctor: '',
                room: '',
                discharge_reason: 'Recovered',
                discharge_summary: '',
                follow_up_instructions: ''
            });
        } catch (err) {
            alert('Failed to process discharge. Please ensure all fields are correct.');
        } finally {
            setSubmitting(false);
        }
    };

    const handlePaymentComplete = async (dischargeId) => {
        try {
            await api.post(`discharges/${dischargeId}/complete_payment/`);
            fetchDischarges();
        } catch (err) {
            alert('Failed to update payment status');
        }
    };

    const filteredDischarges = discharges.filter(d => 
        d.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.discharge_reason?.toLowerCase().includes(searchTerm.toLowerCase())
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
                        <LogOut className="text-indigo-600" size={32} /> Patient Discharge
                    </h2>
                    <p className="text-slate-500 font-medium">Process patient discharge and manage final billing.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                    <Plus size={20} /> Process Discharge
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="Search discharge records..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                />
            </div>

            {/* Discharge Records */}
            <div className="grid gap-6">
                {filteredDischarges.map((discharge) => (
                    <div key={discharge.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all duration-200">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <User className="text-slate-400" size={20} />
                                    <h3 className="text-xl font-bold text-slate-900">{discharge.patient_name}</h3>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        discharge.payment_status === 'Paid' 
                                            ? 'bg-green-100 text-green-800' 
                                            : discharge.payment_status === 'Partial'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {discharge.payment_status}
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-slate-600">
                                    <div className="flex items-center gap-2">
                                        <User size={16} />
                                        <span>Doctor: {discharge.doctor_name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} />
                                        <span>Discharged: {new Date(discharge.discharge_date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FileText size={16} />
                                        <span>Reason: {discharge.discharge_reason}</span>
                                    </div>
                                </div>
                                {discharge.discharge_summary && (
                                    <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                                        <p className="text-sm text-slate-700"><strong>Summary:</strong> {discharge.discharge_summary}</p>
                                    </div>
                                )}
                                {discharge.follow_up_instructions && (
                                    <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                                        <p className="text-sm text-blue-700"><strong>Follow-up:</strong> {discharge.follow_up_instructions}</p>
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                {discharge.total_bill && (
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-slate-900">₹{discharge.total_bill}</p>
                                        <p className="text-sm text-slate-500">Total Bill</p>
                                    </div>
                                )}
                                {discharge.payment_status !== 'Paid' && (
                                    <button
                                        onClick={() => handlePaymentComplete(discharge.id)}
                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all duration-200"
                                    >
                                        <CheckCircle size={16} /> Mark Paid
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal for New Discharge */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-200">
                            <h3 className="text-2xl font-bold text-slate-900">Process Patient Discharge</h3>
                        </div>
                        <form onSubmit={handleDischargePatient} className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Patient *</label>
                                    <select
                                        value={newDischarge.patient}
                                        onChange={(e) => setNewDischarge({...newDischarge, patient: e.target.value})}
                                        className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        required
                                    >
                                        <option value="">Select Patient</option>
                                        {patients.map(patient => (
                                            <option key={patient.id} value={patient.id}>
                                                {patient.name} (Room: {patient.admitted_room ? rooms.find(r => r.id === patient.admitted_room)?.room_no : 'N/A'})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Doctor *</label>
                                    <select
                                        value={newDischarge.doctor}
                                        onChange={(e) => setNewDischarge({...newDischarge, doctor: e.target.value})}
                                        className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        required
                                    >
                                        <option value="">Select Doctor</option>
                                        {doctors.map(doctor => (
                                            <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Discharge Reason</label>
                                <select
                                    value={newDischarge.discharge_reason}
                                    onChange={(e) => setNewDischarge({...newDischarge, discharge_reason: e.target.value})}
                                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="Recovered">Recovered</option>
                                    <option value="Transferred">Transferred to another facility</option>
                                    <option value="Against Medical Advice">Against Medical Advice</option>
                                    <option value="Deceased">Deceased</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Discharge Summary</label>
                                <textarea
                                    value={newDischarge.discharge_summary}
                                    onChange={(e) => setNewDischarge({...newDischarge, discharge_summary: e.target.value})}
                                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 h-24"
                                    placeholder="Medical summary of patient's condition at discharge..."
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Follow-up Instructions</label>
                                <textarea
                                    value={newDischarge.follow_up_instructions}
                                    onChange={(e) => setNewDischarge({...newDischarge, follow_up_instructions: e.target.value})}
                                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 h-24"
                                    placeholder="Instructions for follow-up care, medications, etc..."
                                />
                            </div>
                            
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 py-3 rounded-lg font-medium transition-all duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
                                >
                                    {submitting ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    ) : (
                                        <LogOut size={20} />
                                    )}
                                    {submitting ? 'Processing...' : 'Process Discharge'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DischargeForm;