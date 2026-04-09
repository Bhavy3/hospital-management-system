import { motion, AnimatePresence } from 'framer-motion';
import { Clock, User, AlertCircle } from 'lucide-react';

const WaitingList = ({ patients, onStartConsultation, onCompleteConsultation, onPrescribe, onAdmit }) => {
    return (
        <div className="card h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-800">Live Waiting List</h3>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                    {patients.length} Patient{patients.length !== 1 ? 's' : ''}
                </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                <AnimatePresence>
                    {patients.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12 text-slate-400"
                        >
                            No patients in queue
                        </motion.div>
                    ) : (
                        patients.map((app, index) => (
                            <motion.div
                                key={app.id}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className={`flex items-center justify-between p-4 rounded-lg border-l-4 ${app.queue_status === 'In-Progress'
                                        ? 'border-blue-500 bg-blue-50'
                                        : app.priority === 'Emergency'
                                            ? 'border-red-500 bg-red-50'
                                            : 'border-slate-200 bg-slate-50'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm font-bold text-slate-600">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 flex items-center gap-2">
                                            {app.patient_name || `Patient #${app.patient}`}
                                            {app.priority === 'Emergency' && <AlertCircle className="w-4 h-4 text-red-500" />}
                                        </h4>
                                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {new Date(app.arrival_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            <span className={`status-badge ${app.priority === 'Emergency' ? 'badge-busy' : 'badge-available'
                                                }`}>
                                                {app.priority}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    {app.queue_status === 'Waiting' ? (
                                        <button
                                            onClick={() => onStartConsultation(app.id)}
                                            className="btn-primary py-1.5 text-sm"
                                        >
                                            Call Now
                                        </button>
                                    ) : (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => onPrescribe(app)}
                                                className="bg-blue-600 hover:bg-blue-700 text-white py-1.5 px-3 rounded-lg text-sm font-semibold transition-all"
                                            >
                                                Prescribe
                                            </button>
                                            <button
                                                onClick={() => onAdmit && onAdmit(app)}
                                                className="bg-purple-600 hover:bg-purple-700 text-white py-1.5 px-3 rounded-lg text-sm font-semibold transition-all"
                                            >
                                                Admit
                                            </button>
                                            <button
                                                onClick={() => onCompleteConsultation(app.id)}
                                                className="bg-green-600 hover:bg-green-700 text-white py-1.5 px-3 rounded-lg text-sm font-semibold transition-all"
                                            >
                                                Complete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default WaitingList;
