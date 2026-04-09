import { useEffect, useState } from 'react';
import api from '../services/api';
import { 
    FileText, 
    Download, 
    TrendingUp, 
    Users, 
    Activity, 
    DollarSign, 
    Calendar, 
    CheckCircle, 
    Printer,
    ArrowUpRight,
    ArrowDownRight,
    Loader2
} from 'lucide-react';

const ReportCard = ({ title, value, detail, icon: Icon, color, trend, trendValue }) => (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-xl transition-all duration-500">
        <div className="relative z-10">
            <div className={`w-14 h-14 rounded-2xl ${color} bg-opacity-10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                <Icon size={28} className={color.replace('bg-', 'text-')} />
            </div>
            <h3 className="text-slate-400 text-sm font-black uppercase tracking-[2px] mb-2">{title}</h3>
            <div className="flex items-baseline gap-3">
                <p className="text-4xl font-black text-slate-900 tracking-tight">{value}</p>
                {trendValue && (
                    <span className={`text-xs font-black px-2 py-1 rounded-lg flex items-center gap-1 ${trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {trendValue}
                    </span>
                )}
            </div>
            <p className="text-slate-500 font-medium mt-2 text-sm">{detail}</p>
        </div>
        <div className="absolute -right-6 -bottom-6 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-500">
            <Icon size={180} />
        </div>
    </div>
);

const Reports = () => {
    const [stats, setStats] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [recentPayments, setRecentPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [statsRes, roomsRes, billingRes] = await Promise.all([
                    api.get('reports/dashboard-stats/'),
                    api.get('rooms/'),
                    api.get('billing/')
                ]);
                setStats(statsRes.data);
                setRooms(roomsRes.data);
                setRecentPayments(billingRes.data.slice(0, 4)); // Get last 4 payments
            } catch (err) {
                console.error("Error fetching report data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, []);

    const availableRooms = rooms.filter(r => r.is_available).length;
    const occupancyRate = rooms.length > 0 ? Math.round(((rooms.length - availableRooms) / rooms.length) * 100) : 0;

    if (loading) return (
        <div className="flex items-center justify-center h-[70vh]">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        </div>
    );

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-900 p-10 rounded-[40px] shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-4xl font-black text-white tracking-tight flex items-center gap-4">
                        <FileText className="text-blue-400" size={40} /> Operational Insights
                    </h2>
                    <p className="text-slate-400 font-medium text-lg mt-2 max-w-xl">
                        Comprehensive health analytics, financial performance, and system infrastructure metrics.
                    </p>
                </div>
                <div className="flex gap-4 relative z-10">
                    <button className="px-6 py-3.5 bg-white/10 text-white rounded-2xl font-black text-sm hover:bg-white/20 transition-all flex items-center gap-2 backdrop-blur-md">
                        <Printer size={20} /> Preview
                    </button>
                    <button className="px-6 py-3.5 bg-blue-500 text-white rounded-2xl font-black text-sm hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/30 flex items-center gap-2">
                        <Download size={20} /> Download PDF
                    </button>
                </div>
                <Activity size={300} className="absolute -right-20 -top-20 text-white/5" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <ReportCard 
                    title="Patient Growth" 
                    value={stats?.total_patients?.value || 0} 
                    detail="Total registered individuals" 
                    icon={Users} 
                    color="bg-blue-600" 
                    trend="up"
                    trendValue={stats?.total_patients?.trend}
                />
                <ReportCard 
                    title="Gross Revenue" 
                    value={`$${stats?.revenue_today?.value?.toLocaleString() || 0}`} 
                    detail="Daily transactional volume" 
                    icon={DollarSign} 
                    color="bg-emerald-600" 
                    trend="up"
                    trendValue={stats?.revenue_today?.trend}
                />
                <ReportCard 
                    title="Consultations" 
                    value={stats?.appointments_today?.value || 0} 
                    detail="Scheduled for modern cycle" 
                    icon={Calendar} 
                    color="bg-indigo-600" 
                    trend="up"
                    trendValue="Live"
                />
                <ReportCard 
                    title="Bed Occupancy" 
                    value={`${occupancyRate}%`} 
                    detail={`${rooms.length - availableRooms}/${rooms.length} units in use`} 
                    icon={TrendingUp} 
                    color="bg-rose-600" 
                    trend={occupancyRate > 50 ? 'up' : 'down'}
                    trendValue={occupancyRate > 80 ? 'High' : 'Stable'}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="bg-white p-10 rounded-[30px] border border-slate-100 shadow-sm space-y-8">
                    <div className="flex items-center justify-between border-b border-slate-50 pb-6">
                        <h3 className="text-xl font-black text-slate-800 tracking-tight">Facility Infrastructure</h3>
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full">All Systems Normal</span>
                    </div>
                    <div className="space-y-8">
                        {[
                            { label: 'Bed Capacity', status: `${availableRooms} Available`, val: occupancyRate, color: 'bg-blue-500' },
                            { label: 'API Response', status: '< 18ms', val: 92, color: 'bg-emerald-500' },
                            { label: 'Cloud Storage', status: '48% Capacity', val: 48, color: 'bg-amber-500' },
                        ].map((s, i) => (
                            <div key={i} className="space-y-3">
                                <div className="flex justify-between items-baseline">
                                    <span className="text-sm font-black text-slate-600 uppercase tracking-wider">{s.label}</span>
                                    <span className="text-xs font-bold text-slate-400">{s.status}</span>
                                </div>
                                <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden p-0.5">
                                    <div className={`h-full ${s.color} rounded-full transition-all duration-1000`} style={{ width: `${s.val}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-10 rounded-[30px] border border-slate-100 shadow-sm space-y-8">
                    <div className="flex items-center justify-between border-b border-slate-50 pb-6">
                        <h3 className="text-xl font-black text-slate-800 tracking-tight">Recent Financial Activity</h3>
                        <button className="text-blue-500 text-xs font-bold uppercase tracking-wider hover:underline transition-all">View All</button>
                    </div>
                    <div className="space-y-6">
                        {recentPayments.map((row, i) => (
                            <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors group cursor-pointer border border-transparent hover:border-slate-100">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-white transition-colors">
                                        <DollarSign size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800 text-sm tracking-tight">{row.patient_name}</p>
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{row.payment_type} • ${parseFloat(row.amount).toLocaleString()}</p>
                                    </div>
                                </div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[1px]">{new Date(row.date).toLocaleDateString()}</span>
                            </div>
                        ))}
                        {recentPayments.length === 0 && (
                            <p className="text-center text-slate-400 py-10 font-medium font-bold">No recent transactions found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
