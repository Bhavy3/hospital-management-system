import { useEffect, useState } from 'react';
import api from '../services/api';
import { Plus, Search, CreditCard, DollarSign, Wallet, ArrowDownCircle, History, Filter } from 'lucide-react';

const Billing = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
    const [patients, setPatients] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [demoPayment, setDemoPayment] = useState({
        amount: '1500',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardHolder: ''
    });

    useEffect(() => {
        fetchBilling();
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const response = await api.get('patients/');
            setPatients(response.data);
        } catch (err) {
            console.error('Failed to fetch patients');
        }
    };

    const fetchBilling = async () => {
        try {
            const response = await api.get('billing/');
            setPayments(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch billing records');
            setLoading(false);
        }
    };

    const handleProcessPayment = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('billing/', newPayment);
            fetchBilling();
            setIsModalOpen(false);
            setNewPayment({
                patient: '',
                amount: '',
                payment_type: 'Cash',
                date: new Date().toISOString().split('T')[0]
            });
        } catch (err) {
            alert('Failed to process payment. Please ensure all fields are correct.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDemoPayment = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        
        // Simulate payment processing
        setTimeout(async () => {
            try {
                // Use test patient (first one) or create a demo payment
                const demoPatient = patients[0]?.id || '';
                await api.post('billing/', {
                    patient: demoPatient,
                    amount: demoPayment.amount,
                    payment_type: 'Card',
                    date: new Date().toISOString().split('T')[0],
                    remarks: 'Demo payment processed successfully'
                });
                fetchBilling();
                setIsDemoModalOpen(false);
                alert('Demo payment processed successfully! (This is for educational purposes only)');
                setDemoPayment({
                    amount: '1500',
                    cardNumber: '',
                    expiryDate: '',
                    cvv: '',
                    cardHolder: ''
                });
            } catch (err) {
                alert('Demo payment simulation failed.');
            } finally {
                setSubmitting(false);
            }
        }, 2000); // Simulate 2 second processing time
    };

    const filteredPayments = payments.filter(payment => 
        payment.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.payment_type?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalRevenue = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);

    if (loading) return (
        <div className="flex items-center justify-center h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
    );

    if (error) return <div className="p-6 text-red-500 font-bold bg-red-50 rounded-xl border border-red-200">{error}</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                        <CreditCard className="text-emerald-600" size={32} /> Financial Registry
                    </h2>
                    <p className="text-slate-500 font-medium">Payment tracking, invoicing, and revenue management.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2">
                        <ArrowDownCircle size={18} /> Export CSV
                    </button>
                    <button 
                        onClick={() => setIsDemoModalOpen(true)}
                        className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2"
                    >
                        <Wallet size={20} /> Demo Payment
                    </button>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2"
                    >
                        <Plus size={20} /> New Payment
                    </button>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[32px] shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden transform animate-in slide-in-from-bottom-8 duration-500">
                        <div className="p-8 bg-slate-50/50 border-b border-slate-100">
                            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Record Payment</h3>
                            <p className="text-slate-500 font-medium text-sm">Issue a new financial receipt for patient services.</p>
                        </div>
                        <form onSubmit={handleProcessPayment} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Patient</label>
                                <select 
                                    required
                                    className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-slate-50/30 transition-all font-bold appearance-none"
                                    value={newPayment.patient}
                                    onChange={(e) => setNewPayment({...newPayment, patient: e.target.value})}
                                >
                                    <option value="">Choose a patient...</option>
                                    {patients.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Amount ($)</label>
                                    <input 
                                        required
                                        type="number" 
                                        placeholder="0.00"
                                        className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-slate-50/30 transition-all font-bold"
                                        value={newPayment.amount}
                                        onChange={(e) => setNewPayment({...newPayment, amount: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Method</label>
                                    <select 
                                        className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-slate-50/30 transition-all font-bold appearance-none"
                                        value={newPayment.payment_type}
                                        onChange={(e) => setNewPayment({...newPayment, payment_type: e.target.value})}
                                    >
                                        <option value="Cash">Cash</option>
                                        <option value="Card">Card</option>
                                        <option value="Insurance">Insurance</option>
                                        <option value="UPI">Transfer / UPI</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button 
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-6 py-3.5 border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 px-6 py-3.5 bg-emerald-600 text-white rounded-2xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
                                >
                                    {submitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Process'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Demo Payment Modal */}
            {isDemoModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[32px] shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden transform animate-in slide-in-from-bottom-8 duration-500">
                        <div className="p-8 bg-blue-50/50 border-b border-slate-100">
                            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Demo Payment Gateway</h3>
                            <p className="text-slate-500 font-medium text-sm">Educational payment simulation (College Project)</p>
                        </div>
                        <form onSubmit={handleDemoPayment} className="p-8 space-y-6">
                            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                                <p className="text-yellow-800 text-sm font-medium">
                                    ⚠️ This is a demo payment system for educational purposes only. No real transactions occur.
                                </p>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Amount (₹)</label>
                                <input 
                                    required
                                    type="number" 
                                    placeholder="1500"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50/30 transition-all font-bold"
                                    value={demoPayment.amount}
                                    onChange={(e) => setDemoPayment({...demoPayment, amount: e.target.value})}
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Card Number</label>
                                <input 
                                    required
                                    type="text" 
                                    placeholder="4111 1111 1111 1111"
                                    maxLength="19"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50/30 transition-all font-bold"
                                    value={demoPayment.cardNumber}
                                    onChange={(e) => setDemoPayment({...demoPayment, cardNumber: e.target.value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim()})}
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Expiry Date</label>
                                    <input 
                                        required
                                        type="text" 
                                        placeholder="MM/YY"
                                        maxLength="5"
                                        className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50/30 transition-all font-bold"
                                        value={demoPayment.expiryDate}
                                        onChange={(e) => setDemoPayment({...demoPayment, expiryDate: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">CVV</label>
                                    <input 
                                        required
                                        type="text" 
                                        placeholder="123"
                                        maxLength="4"
                                        className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50/30 transition-all font-bold"
                                        value={demoPayment.cvv}
                                        onChange={(e) => setDemoPayment({...demoPayment, cvv: e.target.value})}
                                    />
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Cardholder Name</label>
                                <input 
                                    required
                                    type="text" 
                                    placeholder="John Doe"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50/30 transition-all font-bold"
                                    value={demoPayment.cardHolder}
                                    onChange={(e) => setDemoPayment({...demoPayment, cardHolder: e.target.value})}
                                />
                            </div>
                            
                            <div className="flex gap-4 pt-4">
                                <button 
                                    type="button"
                                    onClick={() => setIsDemoModalOpen(false)}
                                    className="flex-1 px-6 py-3.5 border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 px-6 py-3.5 bg-blue-600 text-white rounded-2xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
                                >
                                    {submitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Process Demo Payment'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                        <DollarSign size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Revenue</p>
                        <p className="text-2xl font-black text-slate-800">${totalRevenue.toLocaleString()}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                        <History size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Transactions</p>
                        <p className="text-2xl font-black text-slate-800">{payments.length}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
                        <Wallet size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Pending Bills</p>
                        <p className="text-2xl font-black text-slate-800">4</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b bg-slate-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3 top-3 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search patients or methods..."
                            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white shadow-sm transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-white flex items-center gap-2">
                        <Filter size={16} /> Filters
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 text-slate-500 uppercase text-[11px] font-black tracking-widest border-b border-slate-100">
                                <th className="px-6 py-4">Receipt ID</th>
                                <th className="px-6 py-4">Patient</th>
                                <th className="px-6 py-4">Method</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredPayments.map((payment) => (
                                <tr key={payment.id} className="hover:bg-slate-50/80 transition-colors group">
                                    <td className="px-6 py-4">
                                        <span className="font-bold text-slate-400 text-xs tracking-tighter uppercase">#RCPT-{payment.id.toString().padStart(4, '0')}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-black text-xs">
                                                {payment.patient_name?.charAt(0)}
                                            </div>
                                            <span className="font-bold text-slate-800">{payment.patient_name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 font-medium">{payment.payment_type}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600">Paid Clear</span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 font-medium text-sm">
                                        {new Date(payment.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="font-black text-slate-900 text-lg">${parseFloat(payment.amount).toLocaleString()}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Billing;
