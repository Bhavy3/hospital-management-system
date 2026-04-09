import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'patient' // Default role
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            await api.post('users/register/', {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                role: formData.role
            });
            alert("Registration successful! Please login.");
            navigate('/login');
        } catch (err) {
            console.error("Registration failed", err);
            alert("Registration failed. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-900 px-4 py-12">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl w-full max-w-md text-white">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-2">Create Account</h2>
                    <p className="text-blue-200">Join MediCare today</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-blue-100">Username</label>
                        <input
                            type="text"
                            name="username"
                            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/10 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all placeholder-gray-400 text-white"
                            placeholder="Choose a username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-blue-100">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/10 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all placeholder-gray-400 text-white"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-blue-100">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/10 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all placeholder-gray-400 text-white"
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-blue-100">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/10 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all placeholder-gray-400 text-white"
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-blue-100">I am a</label>
                        <select
                            name="role"
                            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/10 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all text-white [&>option]:text-black"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value="patient">Patient</option>
                            <option value="doctor">Doctor</option>
                            <option value="admin">Admin</option>
                            <option value="receptionist">Receptionist</option>
                            <option value="staff">Staff</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-green-500/30 transition-all transform hover:-translate-y-0.5 mt-4"
                    >
                        Sign Up
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-blue-200">
                    Already have an account? <Link to="/login" className="text-white font-semibold hover:underline">Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
