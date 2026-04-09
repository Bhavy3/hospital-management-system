import { useEffect, useState } from 'react';
import api from '../services/api';
import { Plus, Search, Bed, CheckCircle, XCircle } from 'lucide-react';

const Rooms = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newRoom, setNewRoom] = useState({
        room_no: '',
        room_type: 'General',
        charges: '',
        is_available: true
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const response = await api.get('rooms/');
            setRooms(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch rooms');
            setLoading(false);
        }
    };

    const handleAddRoom = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('rooms/', newRoom);
            fetchRooms();
            setIsModalOpen(false);
            setNewRoom({ room_no: '', room_type: 'General', charges: '', is_available: true });
        } catch (err) {
            alert('Failed to add room. Please check your data.');
        } finally {
            setSubmitting(false);
        }
    };

    const filteredRooms = rooms.filter(room => 
        room.room_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.room_type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="flex items-center justify-center h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    if (error) return <div className="p-6 text-red-500 font-bold bg-red-50 rounded-xl border border-red-200">{error}</div>;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                        <Bed className="text-blue-600" size={32} /> Ward & Room Inventory
                    </h2>
                    <p className="text-slate-500 font-medium">Real-time occupancy and facility management.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus size={20} />
                    <span>Add New Room</span>
                </button>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[32px] shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden transform animate-in slide-in-from-bottom-8 duration-500">
                        <div className="p-8 bg-slate-50/50 border-b border-slate-100">
                            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Expand Facility</h3>
                            <p className="text-slate-500 font-medium text-sm">Register a new room or ward unit.</p>
                        </div>
                        <form onSubmit={handleAddRoom} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Room Identifier</label>
                                <input 
                                    required
                                    type="text" 
                                    placeholder="e.g. 101, ICU-B"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50/30 transition-all font-bold"
                                    value={newRoom.room_no}
                                    onChange={(e) => setNewRoom({...newRoom, room_no: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Category / Type</label>
                                <select 
                                    className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50/30 transition-all font-bold appearance-none"
                                    value={newRoom.room_type}
                                    onChange={(e) => setNewRoom({...newRoom, room_type: e.target.value})}
                                >
                                    <option value="General">General Ward</option>
                                    <option value="Private">Private Suite</option>
                                    <option value="ICU">Intensive Care (ICU)</option>
                                    <option value="OPD">Consultation / OPD</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Daily Charge Rate ($)</label>
                                <input 
                                    required
                                    type="number" 
                                    placeholder="0.00"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50/30 transition-all font-bold"
                                    value={newRoom.charges}
                                    onChange={(e) => setNewRoom({...newRoom, charges: e.target.value})}
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
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
                                    className="flex-1 px-6 py-3.5 bg-blue-600 text-white rounded-2xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
                                >
                                    {submitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Confirm Add'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b bg-slate-50/50">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-3 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search rooms (e.g. 101, ICU)..."
                            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white shadow-sm transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 text-slate-500 uppercase text-[11px] font-black tracking-widest border-b border-slate-100">
                                <th className="px-6 py-4">Room No</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Daily Rate</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredRooms.map((room) => (
                                <tr key={room.id} className="hover:bg-slate-50/80 transition-colors group">
                                    <td className="px-6 py-4">
                                        <span className="font-bold text-slate-800 text-lg">#{room.room_no}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                                            room.room_type === 'ICU' ? 'bg-rose-50 text-rose-600' :
                                            room.room_type === 'Private' ? 'bg-indigo-50 text-indigo-600' :
                                            'bg-blue-50 text-blue-600'
                                        }`}>
                                            {room.room_type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {room.is_available ? (
                                            <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                                                <CheckCircle size={16} /> Available
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-slate-400 font-bold text-sm">
                                                <XCircle size={16} /> Occupied
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-slate-700">
                                        ${parseFloat(room.charges).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="text-blue-600 hover:text-blue-800 font-bold text-xs uppercase tracking-wider">Assign</button>
                                            <button className="text-slate-400 hover:text-slate-600 font-bold text-xs uppercase tracking-wider">Edit</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredRooms.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-2 text-slate-400">
                                            <Search size={48} className="opacity-20" />
                                            <p className="text-lg font-bold">No rooms matched your search</p>
                                            <p className="text-sm">Try adjusting your filters or add a new wing.</p>
                                        </div>
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

export default Rooms;
