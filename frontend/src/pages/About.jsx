import Navbar from '../components/Navbar';
import { Award, Users, ThumbsUp, Activity } from 'lucide-react';

const About = () => {
    const stats = [
        { label: 'Happy Patients', value: '15k+', icon: ThumbsUp },
        { label: 'Expert Doctors', value: '150+', icon: Users },
        { label: 'Years Experience', value: '25+', icon: Activity },
        { label: 'Awards Won', value: '50+', icon: Award },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Hero Section */}
            <section className="bg-blue-900 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-bold mb-4">About MediCare</h1>
                    <p className="text-xl text-blue-200 max-w-3xl mx-auto">
                        Dedicated to providing the highest quality healthcare with compassion and excellence.
                        We are a team of experienced professionals committed to your well-being.
                    </p>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <img
                            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1953&q=80"
                            alt="Hospital Building"
                            className="rounded-lg shadow-xl"
                        />
                    </div>
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">Our Mission</h2>
                            <p className="text-gray-600 leading-relaxed">
                                To improve the health and well-being of the communities we serve by providing quality, accessible, and affordable healthcare services.
                            </p>
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">Our Vision</h2>
                            <p className="text-gray-600 leading-relaxed">
                                To be the trusted leader in healthcare, renowned for clinical excellence and compassionate care.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="bg-blue-600 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat) => (
                            <div key={stat.label} className="text-center text-white">
                                <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                                    <stat.icon size={32} />
                                </div>
                                <div className="text-4xl font-bold mb-1">{stat.value}</div>
                                <div className="text-blue-100">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
