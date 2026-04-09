import { Link } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';

const Navbar = () => {
    const role = localStorage.getItem('role');

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2">
                            <Stethoscope className="h-8 w-8 text-blue-600" />
                            <span className="text-2xl font-bold text-gray-800">MediCare</span>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-6">
                        <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium">Home</Link>
                        <Link to="/doctors" className="text-gray-600 hover:text-blue-600 font-medium">Doctors</Link>
                        <Link to="/patients-info" className="text-gray-600 hover:text-blue-600 font-medium">Patients</Link>
                        {role === 'patient' && <Link to="/patient-dashboard" className="text-gray-600 hover:text-blue-600 font-medium">Dashboard</Link>}
                        {role === 'doctor' && <Link to="/doctor-dashboard" className="text-gray-600 hover:text-blue-600 font-medium">Dashboard</Link>}
                        {role === 'receptionist' && <Link to="/reception-dashboard" className="text-gray-600 hover:text-blue-600 font-medium">Reception</Link>}
                        {role === 'admin' && <Link to="/admin/dashboard" className="text-gray-600 hover:text-blue-600 font-medium">Admin Panel</Link>}
                        <Link to="/about" className="text-gray-600 hover:text-blue-600 font-medium">About Us</Link>
                        <Link to="/contact" className="text-gray-600 hover:text-blue-600 font-medium">Contact Us</Link>
                        {!role ? (
                            <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium transition-colors">
                                Login
                            </Link>
                        ) : (
                            <button
                                onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
                                className="bg-rose-600 text-white px-4 py-2 rounded-md hover:bg-rose-700 font-medium transition-colors"
                            >
                                Logout
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
