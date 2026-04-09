import { useState, useEffect } from 'react';
import { Users, UserPlus, Calendar, DollarSign, Activity, TrendingUp, Clock, ShieldCheck, Loader2 } from 'lucide-react';
import api from '../services/api';

const DashboardCard = ({ title, value, subtext, icon: Icon, color, trend }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
                <Icon size={24} className={color.replace('bg-', 'text-')} />
            </div>
            {trend && (
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    {trend}
                </span>
            )}
        </div>
        <div>
            <h3 className="text-slate-500 text-sm font-semibold tracking-tight uppercase">{title}</h3>
            <div className="flex items-baseline gap-2 mt-1">
                <p className="text-3xl font-black text-slate-800">{value}</p>
                <span className="text-xs text-slate-400 font-medium">{subtext}</span>
            </div>
        </div>
    </div>
);

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('reports/dashboard-stats/');
                setStats(res.data);
            } catch (err) {
                console.error("Error fetching stats:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-900">Admin Command Center</h2>
                    <p className="text-slate-500 font-medium">System-wide overview and infrastructure health.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">Generate Report</button>
                    <button className="btn-primary">Manage Staff</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DashboardCard 
                    title="Total Patients" 
                    value={stats?.total_patients?.value || 0} 
                    subtext="Registered in system" 
                    icon={Users} 
                    color="bg-blue-600" 
                    trend={stats?.total_patients?.trend} 
                />
                <DashboardCard 
                    title="Active Doctors" 
                    value={stats?.active_doctors?.value || 0} 
                    subtext={`${stats?.active_doctors?.total || 0} total personnel`} 
                    icon={UserPlus} 
                    color="bg-emerald-600" 
                    trend={stats?.active_doctors?.trend} 
                />
                <DashboardCard 
                    title="Daily Appointments" 
                    value={stats?.appointments_today?.value || 0} 
                    subtext="Updated live" 
                    icon={Calendar} 
                    color="bg-indigo-600" 
                    trend={stats?.appointments_today?.trend} 
                />
                <DashboardCard 
                    title="Revenue (Today)" 
                    value={`$${stats?.revenue_today?.value?.toLocaleString() || 0}`} 
                    subtext="Total transactions" 
                    icon={DollarSign} 
                    color="bg-amber-600" 
                    trend={stats?.revenue_today?.trend} 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="card !p-0 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                                <Activity size={20} className="text-blue-600" /> Recent System Activity
                            </h3>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {(stats?.recent_activity || []).map((log, i) => (
                                <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-lg bg-slate-100 ${log.type === 'Patient' ? 'text-blue-500' : 'text-emerald-500'}`}>
                                            {log.type === 'Patient' ? <Users size={18} /> : <DollarSign size={18} />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800 text-sm">{log.user}</p>
                                            <p className="text-xs text-slate-500 font-medium">{log.act}</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{log.time}</span>
                                </div>
                            ))}
                            {(!stats?.recent_activity || stats.recent_activity.length === 0) && (
                                <p className="p-10 text-center text-slate-400 font-medium">No recent activity detected.</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="card bg-slate-900 border-none relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-lg font-bold text-white mb-2">Hospital Health</h3>
                            <div className="space-y-4 mt-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                                        <span>Bed Occupancy</span>
                                        <span className={stats?.system_health?.occupancy > 80 ? 'text-rose-400' : 'text-emerald-400'}>
                                            {stats?.system_health?.occupancy || 0}%
                                        </span>
                                    </div>
                                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full transition-all duration-1000 ${stats?.system_health?.occupancy > 80 ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                                            style={{ width: `${stats?.system_health?.occupancy || 0}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                                        <span>Available Units</span>
                                        <span className="text-blue-400">
                                            {(stats?.system_health?.total_rooms || 0) - (stats?.system_health?.occupied_rooms || 0)}
                                        </span>
                                    </div>
                                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-blue-500 rounded-full" 
                                            style={{ width: `${100 - (stats?.system_health?.occupancy || 0)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="absolute -right-10 -bottom-10 opacity-10">
                            <TrendingUp size={160} className="text-white" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
