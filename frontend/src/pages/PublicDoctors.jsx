import Navbar from '../components/Navbar';
import { useEffect, useState } from 'react';
import api from '../services/api';
import { Search, MapPin, Phone, Loader2, Eye } from 'lucide-react';

const PublicDoctors = () => {
    const defaultDoctors = [
        { id: 1, name: 'Sarah Wilson', specialization: 'Cardiologist', mobile: '+1 234 567 8900', email: 'sarah.wilson@hospital.com', fees: '1200', availability_status: 'Available', working_time: '9 AM - 5 PM', img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80' },
        { id: 2, name: 'James Chen', specialization: 'Neurologist', mobile: '+1 234 567 8901', email: 'james.chen@hospital.com', fees: '1100', availability_status: 'Busy', working_time: '10 AM - 6 PM', img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80' },
        { id: 3, name: 'Emily Brooks', specialization: 'Pediatrician', mobile: '+1 234 567 8902', email: 'emily.brooks@hospital.com', fees: '950', availability_status: 'Available', working_time: '9 AM - 4 PM', img: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=600&q=80' },
        { id: 4, name: 'Michael Brown', specialization: 'Orthopedic', mobile: '+1 234 567 8903', email: 'michael.brown@hospital.com', fees: '1300', availability_status: 'Available', working_time: '11 AM - 7 PM', img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80' },
    ];
    const fallbackDoctorImages = [
        'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
    ];
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const response = await api.get('doctors/');
            setDoctors(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch doctors');
            setLoading(false);
        }
    };

    const filteredDoctors = (doctors.length ? doctors : defaultDoctors).filter(doctor => 
        doctor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.mobile?.includes(searchTerm) ||
        doctor.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const hasDoctorData = doctors.length > 0;

    const handleViewProfile = (doctor) => {
        setSelectedDoctor(doctor);
    };

    const closeProfileModal = () => {
        setSelectedDoctor(null);
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-red-500 text-center">
                <p className="text-xl font-bold mb-2">Error Loading Doctors</p>
                <p>{error}</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Find a Doctor</h1>
                    <p className="text-gray-600 max-w-2xl">Browse our extensive directory of qualified medical professionals. Filter by specialization or name to find the right doctor for your needs.</p>

                    <div className="mt-8 flex gap-4 max-w-3xl">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search by doctor name or specialization..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                            />
                        </div>
                        <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm">
                            Search
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {!hasDoctorData && !searchTerm && (
                    <div className="mb-8 rounded-3xl border border-blue-100 bg-blue-50 p-6 text-blue-700 shadow-sm">
                        <p className="font-bold">No doctor records were found in the hospital database.</p>
                        <p className="text-sm mt-2">Showing sample profiles for the public directory. Add real doctor profiles via the admin panel to replace these.</p>
                    </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {filteredDoctors.map((doctor, index) => {
                        const photoUrl = doctor.img || fallbackDoctorImages[index % fallbackDoctorImages.length];
                        return (
                            <div key={doctor.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                                <div className="h-64 overflow-hidden bg-gray-200">
                                    <img
                                        src={photoUrl}
                                        alt={doctor.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-6">
                                    <span className="text-blue-600 text-sm font-semibold uppercase tracking-wide">{doctor.specialization}</span>
                                    <h3 className="text-xl font-bold text-gray-900 mt-2 mb-1">Dr. {doctor.name}</h3>
                                    <p className="text-gray-500 text-sm mb-4">Consultation Fee: ₹{doctor.fees}</p>

                                    <div className="space-y-2 mb-6">
                                        <div className="flex items-center text-gray-600 text-sm">
                                            <MapPin size={16} className="mr-2" />
                                            <span>Main Hospital, Block A</span>
                                        </div>
                                        <div className="flex items-center text-gray-600 text-sm">
                                            <Phone size={16} className="mr-2" />
                                            <span>{doctor.mobile || '+1 234 567 8900'}</span>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={() => handleViewProfile(doctor)}
                                        className="w-full border-2 border-blue-600 text-blue-600 py-2 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Eye size={16} />
                                        View Profile
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filteredDoctors.length === 0 && searchTerm && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No doctors found matching "{searchTerm}"</p>
                        <button 
                            onClick={() => setSearchTerm('')}
                            className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                        >
                            Clear search
                        </button>
                    </div>
                )}
            </div>

            {/* Doctor Profile Modal */}
            {selectedDoctor && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-2xl font-bold text-gray-900">Doctor Profile</h3>
                            <button 
                                onClick={closeProfileModal}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center gap-6 mb-6">
                                <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-black text-2xl">
                                    {selectedDoctor.name.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Dr. {selectedDoctor.name}</h2>
                                    <p className="text-blue-600 font-semibold">{selectedDoctor.specialization}</p>
                                    <p className="text-gray-500">Status: <span className={`font-medium ${selectedDoctor.availability_status === 'Available' ? 'text-green-600' : 'text-yellow-600'}`}>{selectedDoctor.availability_status}</span></p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-3">Contact Information</h4>
                                    <div className="space-y-2">
                                        <div className="flex items-center text-gray-600">
                                            <Phone size={16} className="mr-2" />
                                            <span>{selectedDoctor.mobile || 'Not provided'}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <span className="mr-2">✉️</span>
                                            <span>{selectedDoctor.email || 'Not provided'}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <MapPin size={16} className="mr-2" />
                                            <span>Main Hospital, Block A</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-bold text-gray-900 mb-3">Professional Details</h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Consultation Fee:</span>
                                            <span className="font-bold text-gray-900">₹{selectedDoctor.fees}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Specialization:</span>
                                            <span className="font-bold text-gray-900">{selectedDoctor.specialization}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Working Time:</span>
                                            <span className="font-bold text-gray-900">{selectedDoctor.working_time || '9 AM - 5 PM'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <p className="text-gray-600 text-sm">
                                    For appointments, please contact reception or book online through our patient portal.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PublicDoctors;
