import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('token/', { username, password });
            const { access, refresh, role, user_id } = response.data;

            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);
            localStorage.setItem('role', role);
            localStorage.setItem('user_id', user_id);
            localStorage.setItem('username', username);

            if (role === 'admin' || role === 'staff') {
                navigate('/admin/dashboard');
            } else if (role === 'doctor') {
                navigate('/doctor-dashboard');
            } else if (role === 'patient') {
                navigate('/patient-dashboard');
            } else if (role === 'receptionist') {
                navigate('/reception-dashboard');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError('Invalid credentials. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-900 px-4">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl w-full max-w-md text-white">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
                    <p className="text-blue-200">Sign in to access your account</p>
                </div>

                {error && <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg mb-6 text-sm text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-blue-100">Username</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/10 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all placeholder-gray-400 text-white"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-blue-100">Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/10 focus:border-blue-400 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all placeholder-gray-400 text-white"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center">
                            <input type="checkbox" className="rounded bg-white/10 border-white/20 text-blue-500 focus:ring-blue-500" />
                            <span className="ml-2 text-blue-200">Remember me</span>
                        </label>
                        <a href="#" className="text-blue-300 hover:text-white transition-colors">Forgot password?</a>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-blue-500/30 transition-all transform hover:-translate-y-0.5"
                    >
                        Sign In
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-blue-200">
                    Don't have an account? <Link to="/register" className="text-white font-semibold hover:underline">Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
