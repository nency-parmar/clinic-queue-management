import { useEffect, useState } from "react";
import { getQueue, getQueueId } from "../../api/endpoints";
import { Link } from "react-router-dom";

const ReceptionDashboard = () => {
    const [queue, setQueue] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchQueue();
        const interval = setInterval(fetchQueue, 10000);
        return () => clearInterval(interval);
    }, []);

    const fetchQueue = async () => {
        try {
            const res = await getQueue();
            console.log("Queue response:", res);
            setQueue(res.data || []);
        } catch (err) {
            console.error("Failed to fetch queue", err);
            console.log("Error details:", err.response?.data);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            await getQueueId(id, { status: newStatus });
            setQueue(prev => prev.map(q => q.id === id ? { ...q, status: newStatus } : q));
        } catch (err) {
            console.error("Failed to update status", err);
            alert("Could not update patient status.");
        }
    };

    if (loading && queue.length === 0) {
        return <div className="p-5 text-center text-muted">Loading Queue...</div>;
    }

    const waitingCount = queue.filter(q => q.status?.toLowerCase() === "waiting").length;
    const inProgressCount = queue.filter(q => q.status?.toLowerCase() === "in-progress").length;
    const completedCount = queue.filter(q => q.status?.toLowerCase() === "completed").length;

    return (
        <div className="container-fluid py-4" style={{ maxWidth: "1200px" }}>
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                <div>
                    <h1 className="h3 mb-1 text-dark">Live Queue Management</h1>
                    <p className="text-muted mb-0">Manage patient flow and update statuses in real-time.</p>
                </div>
                <Link to="/reception/tv" target="_blank" className="btn btn-dark shadow-sm px-4">
                    Open TV Display
                </Link>
            </div>

            <div className="row g-3 mb-4">
                <div className="col-md-4">
                    <div className="card shadow-sm border-0">
                        <div className="card-body d-flex align-items-center gap-3">
                            <div className="bg-warning bg-opacity-10 text-warning rounded-pill px-3 py-2 fw-bold">W</div>
                            <div>
                                <p className="text-muted small mb-0 fw-medium uppercase">Waiting</p>
                                <h3 className="h4 mb-0 fw-bold">{waitingCount}</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card shadow-sm border-0">
                        <div className="card-body d-flex align-items-center gap-3">
                            <div className="bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2 fw-bold">P</div>
                            <div>
                                <p className="text-muted small mb-0 fw-medium uppercase">In Progress</p>
                                <h4 className="h4 mb-0 fw-bold">{inProgressCount}</h4>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card shadow-sm border-0">
                        <div className="card-body d-flex align-items-center gap-3">
                            <div className="bg-success bg-opacity-10 text-success rounded-pill px-3 py-2 fw-bold">C</div>
                            <div>
                                <p className="text-muted small mb-0 fw-medium uppercase">Completed</p>
                                <h3 className="h4 mb-0 fw-bold">{completedCount}</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card shadow-sm border-0">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover table-bordered mb-0 align-middle">
                            <thead className="table-light text-muted" style={{ fontSize: "0.85rem", textTransform: "uppercase" }}>
                                <tr>
                                    <th className="py-3 px-4 fw-semibold border-bottom-0">Token / Time</th>
                                    <th className="py-3 px-4 fw-semibold border-bottom-0">Patient Name</th>
                                    <th className="py-3 px-4 fw-semibold border-bottom-0">Doctor</th>
                                    <th className="py-3 px-4 fw-semibold border-bottom-0 text-center">Status</th>
                                    <th className="py-3 px-4 fw-semibold border-bottom-0 text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {queue.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-5 text-muted">No patients in the queue for today.</td>
                                    </tr>
                                ) : (
                                    queue.map((q) => (
                                        <tr key={q.id}>
                                            <td className="px-4">
                                                <div className="fw-bold text-dark">{q.tokenNumber || "--"}</div>
                                                <div className="small text-muted">{q.time || "No Set Time"}</div>
                                            </td>
                                            <td className="px-4 fw-medium text-dark">{q.patientName || "Unknown Patient"}</td>
                                            <td className="px-4 text-secondary">{q.doctorName || "General"}</td>
                                            <td className="px-4 text-center">
                                                <span className={`badge rounded-pill px-3 py-2 fw-medium
                                                    ${q.status?.toLowerCase() === 'waiting' ? 'bg-warning-subtle text-warning text-dark' :
                                                        q.status?.toLowerCase() === 'in-progress' ? 'bg-primary-subtle text-primary' :
                                                            q.status?.toLowerCase() === 'completed' ? 'bg-success-subtle text-success' :
                                                                'bg-light text-muted'}`}
                                                    style={{
                                                        backgroundColor: q.status?.toLowerCase() === 'waiting' ? '#fef3c7' : q.status?.toLowerCase() === 'in-progress' ? '#eff6ff' : q.status?.toLowerCase() === 'completed' ? '#dcfce7' : '#f8fafc',
                                                        color: q.status?.toLowerCase() === 'waiting' ? '#b45309' : q.status?.toLowerCase() === 'in-progress' ? '#1d4ed8' : q.status?.toLowerCase() === 'completed' ? '#15803d' : '#64748b'
                                                    }}
                                                >
                                                    {q.status || "Waiting"}
                                                </span>
                                            </td>
                                            <td className="px-4 text-end">
                                                <div className="d-flex gap-2 justify-content-end">
                                                    {q.status?.toLowerCase() !== "in-progress" && q.status?.toLowerCase() !== "completed" && (
                                                        <button
                                                            className="btn btn-sm btn-outline-primary"
                                                            onClick={() => updateStatus(q.id, "in-progress")}
                                                        >
                                                            Send In
                                                        </button>
                                                    )}
                                                    {q.status?.toLowerCase() === "in-progress" && (
                                                        <button
                                                            className="btn btn-sm btn-outline-success"
                                                            onClick={() => updateStatus(q.id, "completed")}
                                                        >
                                                            Mark Done
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReceptionDashboard;