import Navbar from '../components/Navbar';
import { Calendar, UserCheck, Clock, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 space-y-6">
                        <h1 className="text-5xl font-bold leading-tight">
                            Your Health, <br /> Our Priority
                        </h1>
                        <p className="text-xl text-blue-100">
                            Experience world-class healthcare with our expert doctors and modern facilities. Book appointments online and manage your health records seamlessly.
                        </p>
                        <div className="flex space-x-4">
                            <Link to="/login" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                                Book Appointment
                            </Link>
                            <Link to="/services" className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
                                Our Services
                            </Link>
                        </div>
                    </div>
                    <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
                        <img
                            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                            alt="Doctor Team"
                            className="rounded-lg shadow-2xl w-full max-w-lg object-cover h-80"
                        />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800">Why Choose MediCare?</h2>
                        <p className="text-gray-600 mt-2">We provide the best medical services for you and your family.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                                <UserCheck className="text-blue-600" size={24} />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Expert Doctors</h3>
                            <p className="text-gray-600">Qualified and experienced medical professionals from various specialities.</p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                                <Calendar className="text-green-600" size={24} />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Easy Booking</h3>
                            <p className="text-gray-600">Book appointments online instantly without waiting in long queues.</p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                            <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                                <Clock className="text-purple-600" size={24} />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">24/7 Service</h3>
                            <p className="text-gray-600">Emergency medical support available round the clock for critical care.</p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                            <div className="bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                                <Shield className="text-yellow-600" size={24} />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Secure Records</h3>
                            <p className="text-gray-600">Your medical history and data are kept safe and secure with us.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-800 text-gray-300 py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-white text-lg font-bold mb-4">MediCare</h3>
                        <p className="text-sm">Leading hospital management system providing top-notch healthcare services.</p>
                    </div>
                    <div>
                        <h3 className="text-white text-lg font-bold mb-4">Contact Us</h3>
                        <p className="text-sm">123 Health Street, Medical City</p>
                        <p className="text-sm">Phone: +1 234 567 890</p>
                        <p className="text-sm">Email: info@medicare.com</p>
                    </div>
                    <div>
                        <h3 className="text-white text-lg font-bold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/" className="hover:text-white">Home</Link></li>
                            <li><Link to="/services" className="hover:text-white">Services</Link></li>
                            <li><Link to="/login" className="hover:text-white">Login</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="text-center mt-10 text-sm border-t border-gray-700 pt-6">
                    © 2024 MediCare HMS. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default Home;
