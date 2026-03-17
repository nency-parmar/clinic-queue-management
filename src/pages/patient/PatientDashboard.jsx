import { useEffect, useState } from "react";
import { getAppointments, addAppointments, getPrescriptions, getReports } from "../../api/endpoints";

const PatientDashboard = () => {
    const [activeTab, setActiveTab] = useState("appointments");

    const [appointments, setAppointments] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedDate, setSelectedDate] = useState("");
    const [selectedSlot, setSelectedSlot] = useState("");
    const [booking, setBooking] = useState(false);

    const generateTimeSlots = () => {
        const slots = [];
        let startHour = 9;
        let startMin = 0;
        while (startHour < 17) {
            const currentMin = startMin;
            const currentHour = startHour;

            let nextMin = startMin + 15;
            let nextHour = startHour;
            if (nextMin === 60) {
                nextMin = 0;
                nextHour++;
            }

            const format = (h, m) => `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
            const timeRange = `${format(currentHour, currentMin)}-${format(nextHour, nextMin)}`;

            slots.push(timeRange);

            startMin = nextMin;
            startHour = nextHour;
        }
        return slots;
    };

    const timeSlots = generateTimeSlots();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [appRes, prescRes, repRes] = await Promise.allSettled([
                getAppointments(),
                getPrescriptions(),
                getReports()
            ]);

            console.log("Appointments response:", appRes);
            if (appRes.status === "fulfilled") {
                console.log("Appointments data:", appRes.value.data);
                setAppointments(appRes.value.data || []);
            } else {
                console.error("Failed to fetch appointments:", appRes.reason);
            }
            if (prescRes.status === "fulfilled") setPrescriptions(prescRes.value.data || []);
            if (repRes.status === "fulfilled") setReports(repRes.value.data || []);

        } catch (err) {
            console.error("Error fetching patient data", err);
        } finally {
            setLoading(false);
        }
    };

    const handleBookAppointment = async (e) => {
        e.preventDefault();
        if (!selectedDate || !selectedSlot) {
            alert("Please select a date and an available time slot");
            return;
        }

        setBooking(true);
        try {
            await addAppointments({
                appointmentDate: selectedDate,
                timeSlot: selectedSlot
            });
            alert("Appointment successfully booked!");
            setSelectedDate("");
            setSelectedSlot("");
            setActiveTab("appointments");
            fetchData();
        } catch (err) {
            console.error("Booking failed", err);
            const errorMsg = err.response?.data?.error || "Failed to book appointment. Try a different slot.";
            alert(errorMsg);
        } finally {
            setBooking(false);
        }
    };

    if (loading) {
        return <div className="p-5 text-center text-muted">Loading Patient Portal...</div>;
    }

    return (
        <div className="container-fluid py-4" style={{ maxWidth: "1000px" }}>

            <div className="mb-4">
                <h1 className="h3 mb-2 text-dark">Patient Portal</h1>
                <p className="text-muted">Manage your appointments, view prescriptions, and check medical reports.</p>
            </div>

            <ul className="nav nav-tabs mb-4 border-bottom">
                <li className="nav-item">
                    <button
                        className={`nav-link fw-medium bg-transparent border-0 ${activeTab === "appointments" ? "active border-bottom border-primary border-3 text-primary" : "text-muted"}`}
                        onClick={() => setActiveTab("appointments")}
                    >
                        My Appointments
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link fw-medium bg-transparent border-0 ${activeTab === "book" ? "active border-bottom border-primary border-3 text-primary" : "text-muted"}`}
                        onClick={() => setActiveTab("book")}
                    >
                        Book Appointment
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link fw-medium bg-transparent border-0 ${activeTab === "prescriptions" ? "active border-bottom border-primary border-3 text-primary" : "text-muted"}`}
                        onClick={() => setActiveTab("prescriptions")}
                    >
                        Prescriptions
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link fw-medium bg-transparent border-0 ${activeTab === "reports" ? "active border-bottom border-primary border-3 text-primary" : "text-muted"}`}
                        onClick={() => setActiveTab("reports")}
                    >
                        Lab Reports
                    </button>
                </li>
            </ul>

            <div className="card shadow-sm border-0">
                <div className="card-body p-4">

                    {activeTab === "appointments" && (
                        <div>
                            <h2 className="h5 mb-4 text-dark">Upcoming Appointments</h2>
                            {appointments.length === 0 ? (
                                <div className="text-center p-5 bg-light rounded text-muted">
                                    <p className="mb-3">You have no scheduled appointments.</p>
                                    <button onClick={() => setActiveTab("book")} className="btn btn-primary shadow-sm">Book One Now</button>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover table-bordered align-middle mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Doctor</th>
                                                <th>Date</th>
                                                <th>Time Slot</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {appointments.map((app) => (
                                                <tr key={app.id}>
                                                    <td className="fw-medium text-dark">{app.Doctor?.name || app.doctorName || `Doctor #${app.doctorId}`}</td>
                                                    <td>{app.appointmentDate?.split('T')[0] || app.date}</td>
                                                    <td className="text-primary fw-medium">{app.timeSlot || app.time || "Scheduled"}</td>
                                                    <td>
                                                        <span className={`badge rounded-pill px-3 py-2 ${app.status === 'completed' ? 'bg-success' : app.status === 'cancelled' ? 'bg-danger' : 'bg-primary'}`}>
                                                            {app.status || "Waiting"}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "book" && (
                        <div>
                            <h2 className="h5 mb-4 text-dark">Schedule New Visit</h2>
                            <form onSubmit={handleBookAppointment}>
                                <div className="row mb-4">
                                    <div className="col-12">
                                        <label className="form-label text-muted fw-bold">Select Date</label>
                                        <input
                                            type="date"
                                            className="form-control bg-light"
                                            value={selectedDate}
                                            onChange={(e) => setSelectedDate(e.target.value)}
                                            min={new Date().toISOString().split("T")[0]}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label text-muted fw-bold">Select Time Slot (15-min intervals)</label>
                                    {selectedDate ? (
                                        <div className="d-flex flex-wrap gap-2 mt-2">
                                            {timeSlots.map((slot) => (
                                                <button
                                                    key={slot}
                                                    type="button"
                                                    onClick={() => setSelectedSlot(slot)}
                                                    className={`btn border ${selectedSlot === slot ? 'btn-primary' : 'btn-light text-dark'}`}
                                                    style={{ minWidth: "90px" }}
                                                >
                                                    {slot}
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-muted small bg-light p-3 rounded mt-2">Please select a date first to view available slots.</p>
                                    )}
                                </div>

                                <hr />
                                <div className="d-flex justify-content-end">
                                    <button type="submit" className="btn btn-primary px-4 shadow-sm" disabled={!selectedDate || !selectedSlot || booking}>
                                        {booking ? "Confirming..." : "Confirm Appointment"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {activeTab === "prescriptions" && (
                        <div>
                            <h2 className="h5 mb-4 text-dark">My Prescriptions</h2>
                            {prescriptions.length === 0 ? (
                                <p className="text-muted text-center p-4 bg-light rounded">No prescriptions found on your record.</p>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover table-bordered align-middle mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Medicine Name</th>
                                                <th>Dosage</th>
                                                <th>Instructions</th>
                                                <th>Prescribed Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {prescriptions.map((p, index) => (
                                                <tr key={index}>
                                                    <td className="fw-bold text-dark">{p.medicineName || "N/A"}</td>
                                                    <td><span className="badge bg-light text-dark border">{p.dosage}</span></td>
                                                    <td className="text-secondary">{p.instructions || "--"}</td>
                                                    <td className="text-muted small">{p.date || "Unknown"}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "reports" && (
                        <div>
                            <h2 className="h5 mb-4 text-dark">My Medical Reports</h2>
                            {reports.length === 0 ? (
                                <p className="text-muted text-center p-4 bg-light rounded">No medical reports available.</p>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover table-bordered align-middle mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Report Name</th>
                                                <th>Doctor Analysis / Description</th>
                                                <th className="text-end">Attachment URL</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {reports.map((r, index) => (
                                                <tr key={index}>
                                                    <td className="fw-medium text-dark">{r.reportName || "General Report"}</td>
                                                    <td className="text-secondary">{r.description || "--"}</td>
                                                    <td className="text-end">
                                                        <a href={r.fileUrl || "#"} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary shadow-sm">
                                                            View Document
                                                        </a>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </div>

        </div>
    );
};

export default PatientDashboard;