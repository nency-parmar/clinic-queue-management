import { useEffect, useState } from "react";
import { getDoctor, addPrescription, addReports } from "../../api/endpoints";

const DoctorDashboard = () => {
    const [queue, setQueue] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedPatient, setSelectedPatient] = useState(null);
    const [activeTab, setActiveTab] = useState("prescription");

    const [prescriptionForm, setPrescriptionForm] = useState({ medicineName: "", dosage: "", instructions: "" });
    const [reportForm, setReportForm] = useState({ reportName: "", description: "", fileUrl: "" });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 15000);
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            const res = await getDoctor();
            setQueue(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Failed to fetch doctor queue", err);
        } finally {
            setLoading(false);
        }
    };

    const handlePrescriptionSubmit = async (e) => {
        e.preventDefault();
        if (!selectedPatient) return;
        setSubmitting(true);
        try {
            await addPrescription(selectedPatient.appointmentId || selectedPatient.id, prescriptionForm);
            alert("Prescription added successfully!");
            setPrescriptionForm({ medicineName: "", dosage: "", instructions: "" });
        } catch (err) {
            console.error(err);
            alert("Failed to add prescription");
        } finally {
            setSubmitting(false);
        }
    };

    const handleReportSubmit = async (e) => {
        e.preventDefault();
        if (!selectedPatient) return;
        setSubmitting(true);
        try {
            await addReports(selectedPatient.appointmentId || selectedPatient.id, reportForm);
            alert("Report added successfully!");
            setReportForm({ reportName: "", description: "", fileUrl: "" });
        } catch (err) {
            console.error(err);
            alert("Failed to add report");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading && queue.length === 0) {
        return <div className="p-5 text-center text-muted">Loading your patients...</div>;
    }

    return (
        <div className="container-fluid py-4" style={{ maxWidth: "1400px" }}>
            <div className="row g-4 h-100">

                <div className="col-12 col-md-5 col-lg-4 d-flex flex-column" style={{ minHeight: "400px" }}>
                    <div className="mb-3">
                        <h1 className="h4 mb-1 text-dark">My Patients</h1>
                        <p className="text-muted small mb-0">Today's Schedule</p>
                    </div>

                    <div className="card shadow-sm border-0 flex-grow-1 overflow-auto bg-white">
                        {queue.length === 0 ? (
                            <div className="p-4 text-center text-muted">
                                <p className="mb-0">No patients currently in your queue.</p>
                            </div>
                        ) : (
                            <div className="list-group list-group-flush rounded-bottom">
                                {queue.map((p) => (
                                    <button
                                        key={p.id}
                                        onClick={() => setSelectedPatient(p)}
                                        className={`list-group-item list-group-item-action p-3 border-bottom-0 border-start border-4 ${selectedPatient?.id === p.id ? 'border-primary bg-primary bg-opacity-10' : 'border-transparent'}`}
                                    >
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="bg-white text-primary border rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm" style={{ width: 40, height: 40 }}>
                                                {p.patientName.charAt(0)}
                                            </div>
                                            <div className="text-start flex-grow-1">
                                                <h6 className="mb-1 fw-bold text-dark">{p.patientName}</h6>
                                                <div className="d-flex gap-2 align-items-center">
                                                    <span className="badge bg-secondary text-white px-2 py-1">{p.tokenNumber || "TKN"}</span>
                                                    <span className="small text-warning fw-medium">{p.time || "Waiting"}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="col-12 col-md-7 col-lg-8 d-flex flex-column" style={{ minHeight: "500px" }}>
                    {!selectedPatient ? (
                        <div className="card border-0 bg-light shadow-sm d-flex flex-column align-items-center justify-content-center text-muted text-center flex-grow-1 p-5 rounded-4 border-2" style={{ borderStyle: "dashed !important" }}>
                            <div className="bg-white p-3 rounded-circle shadow-sm mb-3">
                                <span className="h3">📋</span>
                            </div>
                            <h3 className="h5 text-dark mb-2">No Patient Selected</h3>
                            <p className="mb-0 text-secondary">Select a patient from the queue to add prescriptions or upload reports.</p>
                        </div>
                    ) : (
                        <div className="d-flex flex-column h-100 gap-3">
                            <div className="card shadow-sm border-0 border-top border-primary border-4">
                                <div className="card-body p-4 d-flex flex-wrap justify-content-between align-items-start gap-3">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center h2 mb-0 shadow-sm" style={{ width: 56, height: 56 }}>
                                            {selectedPatient.patientName.charAt(0)}
                                        </div>
                                        <div>
                                            <h2 className="h4 mb-1 fw-bold text-dark">{selectedPatient.patientName}</h2>
                                            <p className="text-muted mb-0 small">
                                                Age: {selectedPatient.age || "--"} | Gender: {selectedPatient.gender || "--"} | Blood: {selectedPatient.bloodGroup || "--"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-md-end text-start">
                                        <span className="badge bg-success bg-opacity-10 text-success border border-success px-3 py-2 rounded-pill mb-2">in consultation</span>
                                        <p className="text-muted mb-0 small fw-bold">TOKEN: {selectedPatient.tokenNumber}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="card shadow-sm border-0 flex-grow-1 d-flex flex-column">
                                <div className="card-header bg-white border-bottom p-0">
                                    <ul className="nav nav-tabs nav-fill border-0">
                                        <li className="nav-item">
                                            <button
                                                className={`nav-link border-0 py-3 fw-medium rounded-0 ${activeTab === "prescription" ? "active border-bottom border-primary border-3 text-primary bg-primary bg-opacity-10" : "text-muted hover-bg-light"}`}
                                                onClick={() => setActiveTab("prescription")}
                                            >
                                                Add Prescription
                                            </button>
                                        </li>
                                        <li className="nav-item">
                                            <button
                                                className={`nav-link border-0 py-3 fw-medium rounded-0 ${activeTab === "report" ? "active border-bottom border-primary border-3 text-primary bg-primary bg-opacity-10" : "text-muted hover-bg-light"}`}
                                                onClick={() => setActiveTab("report")}
                                            >
                                                Upload Report
                                            </button>
                                        </li>
                                    </ul>
                                </div>

                                <div className="card-body p-4 overflow-auto">
                                    {activeTab === "prescription" && (
                                        <form onSubmit={handlePrescriptionSubmit}>
                                            <div className="mb-3">
                                                <label className="form-label fw-medium text-secondary">Medicine Name</label>
                                                <input
                                                    type="text" className="form-control bg-light"
                                                    value={prescriptionForm.medicineName}
                                                    onChange={(e) => setPrescriptionForm({ ...prescriptionForm, medicineName: e.target.value })}
                                                    placeholder="e.g. Amoxicillin 500mg" required
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label fw-medium text-secondary">Dosage Details</label>
                                                <input
                                                    type="text" className="form-control bg-light"
                                                    value={prescriptionForm.dosage}
                                                    onChange={(e) => setPrescriptionForm({ ...prescriptionForm, dosage: e.target.value })}
                                                    placeholder="e.g. 1-0-1 (Morning & Night)" required
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label className="form-label fw-medium text-secondary">Instructions / Remarks</label>
                                                <textarea
                                                    className="form-control bg-light" rows="3"
                                                    value={prescriptionForm.instructions}
                                                    onChange={(e) => setPrescriptionForm({ ...prescriptionForm, instructions: e.target.value })}
                                                    placeholder="Take after meals for 5 days..." required
                                                />
                                            </div>
                                            <button type="submit" className="btn btn-primary w-100 py-2 shadow-sm fw-medium" disabled={submitting}>
                                                {submitting ? "Saving Prescription..." : "Save Prescription to Record"}
                                            </button>
                                        </form>
                                    )}

                                    {activeTab === "report" && (
                                        <form onSubmit={handleReportSubmit}>
                                            <div className="mb-3">
                                                <label className="form-label fw-medium text-secondary">Report Title</label>
                                                <input
                                                    type="text" className="form-control bg-light"
                                                    value={reportForm.reportName}
                                                    onChange={(e) => setReportForm({ ...reportForm, reportName: e.target.value })}
                                                    placeholder="e.g. Complete Blood Count (CBC)" required
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label fw-medium text-secondary">File Attachment Link</label>
                                                <input
                                                    type="url" className="form-control bg-light"
                                                    value={reportForm.fileUrl}
                                                    onChange={(e) => setReportForm({ ...reportForm, fileUrl: e.target.value })}
                                                    placeholder="https://link-to-lab-report.pdf"
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label className="form-label fw-medium text-secondary">Doctor's Analysis</label>
                                                <textarea
                                                    className="form-control bg-light" rows="4"
                                                    value={reportForm.description}
                                                    onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
                                                    placeholder="Hb levels are slightly low. Recommend iron supplements." required
                                                />
                                            </div>
                                            <button type="submit" className="btn btn-primary w-100 py-2 shadow-sm fw-medium" disabled={submitting}>
                                                {submitting ? "Uploading Analysis..." : "Save Report Analysis"}
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

            </div>

            <style>{`.hover-bg-light:hover { background-color: #f8fafc; } .border-transparent { border-color: transparent !important; }`}</style>
        </div>
    );
};

export default DoctorDashboard;