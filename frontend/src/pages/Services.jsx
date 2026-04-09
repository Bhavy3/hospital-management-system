import Navbar from '../components/Navbar';
import { Pill, Activity, Heart, Stethoscope, Eye, Brain } from 'lucide-react';

const Services = () => {
    const services = [
        { name: 'General Medicine', icon: Stethoscope, desc: 'Comprehensive healthcare for adults.' },
        { name: 'Cardiology', icon: Heart, desc: 'Advanced heart care and surgery.' },
        { name: 'Neurology', icon: Brain, desc: 'Treatment for disorders of the nervous system.' },
        { name: 'Ophthalmology', icon: Eye, desc: 'Eye care, surgery, and vision correction.' },
        { name: 'Pharmacy', icon: Pill, desc: '24/7 in-house pharmacy services.' },
        { name: 'Diagnostics', icon: Activity, desc: 'Advanced lab testing and imaging.' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h1 className="text-4xl font-bold text-gray-800 text-center mb-12">Our Services</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service) => (
                        <div key={service.name} className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-transform hover:-translate-y-1">
                            <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                                <service.icon className="text-blue-600" size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 text-center mb-3">{service.name}</h3>
                            <p className="text-gray-600 text-center">{service.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Services;
