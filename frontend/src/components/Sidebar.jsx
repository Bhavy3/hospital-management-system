import { LayoutDashboard, Users, UserPlus, Calendar, Pill, CreditCard, Bed, FileText, Shield, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();
    const links = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Patients', path: '/admin/patients', icon: Users },
        { name: 'Doctors', path: '/admin/doctors', icon: UserPlus },
        { name: 'Staff', path: '/admin/staff', icon: Shield },
        { name: 'Appointments', path: '/admin/appointments', icon: Calendar },
        { name: 'Prescriptions', path: '/admin/prescriptions', icon: Pill },
        { name: 'Billing', path: '/admin/billing', icon: CreditCard },
        { name: 'Rooms', path: '/admin/rooms', icon: Bed },
        { name: 'Discharges', path: '/admin/discharges', icon: LogOut },
        { name: 'Reports', path: '/admin/reports', icon: FileText },
    ];

    return (
        <div className="h-screen w-64 bg-gray-900 text-white flex flex-col">
            <div className="p-4 text-2xl font-bold border-b border-gray-800">HMS Pro</div>
            <nav className="flex-1 p-4 space-y-2">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = location.pathname === link.path;
                    return (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                }`}
                        >
                            <Icon size={20} />
                            <span>{link.name}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
};

export default Sidebar;
