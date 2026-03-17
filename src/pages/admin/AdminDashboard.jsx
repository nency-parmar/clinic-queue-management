import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getAdmin, getUsers, addUsers, updateUser, deleteUser } from "../../api/endpoints";

const AdminDashboard = () => {
    const location = useLocation();
    const isManageUsers = location.pathname.includes("/users");

    const [clinic, setClinic] = useState({});
    const [users, setUsers] = useState([]);

    const [form, setForm] = useState({ name: "", email: "", role: "patient", password: "" });
    const [editId, setEditId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
        if (!isManageUsers) {
            handleCancel();
        }
    }, [isManageUsers]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const clinicRes = await getAdmin();
            const userRes = await getUsers();

            console.log("Clinic API Response:", clinicRes.data);

            const rawClinic = clinicRes.data || {};
            setClinic({
                clinicName: rawClinic.clinicName || rawClinic.name || rawClinic.clinic_name || "",
                clinicCode: rawClinic.clinicCode || rawClinic.code || rawClinic.clinic_code || "",
                ...rawClinic
            });
            setUsers(Array.isArray(userRes.data) ? userRes.data : []);
        } catch (err) {
            console.error("fetchData error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                const payload = { ...form };
                if (!payload.password) delete payload.password;
                await updateUser(editId, payload);
            } else {
                await addUsers(form);
            }
            fetchData();
            handleCancel();
        } catch (err) {
            console.error(err);
            alert("Error saving user");
        }
    };

    const handleEdit = (user) => {
        if (user.role === 'admin') return;

        setForm({ name: user.name, email: user.email, role: user.role, password: "" });
        setEditId(user.id);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (user) => {
        if (user.role === 'admin') return;

        console.log("Delete user object:", user);
        const userId = user.id || user.userId || user.user_id;
        if (!userId) {
            alert("Cannot find user ID — check the browser console for details.");
            return;
        }

        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await deleteUser(userId);
                fetchData();
            } catch (err) {
                console.error("Delete failed:", err.response?.data || err.message);
                alert(`Delete failed: ${err.response?.data?.message || err.message}`);
            }
        }
    };

    const handleCancel = () => {
        setEditId(null);
        setForm({ name: "", email: "", role: "patient", password: "" });
        setShowForm(false);
    };

    if (loading && users.length === 0) {
        return <div className="p-5 text-center text-muted">Loading Admin Data...</div>;
    }

    return (
        <div className="container-fluid py-4" style={{ maxWidth: "1200px" }}>

            {!isManageUsers ? (
                <div className="card shadow-sm border-0">
                    <div className="card-body p-5">
                        <h2 className="h4 text-dark mb-4 border-bottom pb-3">Admin Overview</h2>

                        <div className="row g-4 mb-4">
                            <div className="col-md-6">
                                <div className="p-4 bg-light rounded shadow-sm h-100 border-start border-primary border-4">
                                    <h4 className="h6 text-muted text-uppercase fw-bold mb-3">Clinic Information</h4>
                                    <p className="mb-2"><strong>Name:</strong> {clinic.clinicName || "Not Set"}</p>
                                    <p className="mb-2"><strong>Code:</strong> {clinic.clinicCode || "Not Set"}</p>
                                    <p className="mb-0"><strong>Status:</strong> <span className="text-success fw-medium">Active</span></p>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="p-4 bg-light rounded shadow-sm h-100 border-start border-info border-4">
                                    <h4 className="h6 text-muted text-uppercase fw-bold mb-3">System Statistics</h4>
                                    <div className="d-flex gap-4">
                                        <div>
                                            <h3 className="h2 mb-0 text-primary">{users.length}</h3>
                                            <p className="text-muted mb-0 small fw-medium">Total Registered Users</p>
                                        </div>
                                        <div>
                                            <h3 className="h2 mb-0 text-success">{users.filter(u => u.role === 'doctor').length}</h3>
                                            <p className="text-muted mb-0 small fw-medium">Active Doctors</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                        <h2 className="h4 mb-0 text-dark">Manage Users</h2>
                        {!showForm && (
                            <button className="btn btn-primary shadow-sm" onClick={() => setShowForm(true)}>
                                + Add New User
                            </button>
                        )}
                    </div>

                    {showForm && (
                        <div className="card shadow-sm mb-4 border-0">
                            <div className="card-header bg-white border-bottom py-3">
                                <h3 className="h5 mb-0 text-dark">{editId ? "Edit Existing User" : "Register New User"}</h3>
                            </div>
                            <div className="card-body p-4">
                                <form onSubmit={handleSubmit}>
                                    <div className="row g-3">
                                        <div className="col-md-6 col-12">
                                            <label className="form-label fw-medium text-secondary">Full Name</label>
                                            <input type="text" className="form-control bg-light" name="name" value={form.name} onChange={handleChange} required placeholder="Enter full name" />
                                        </div>
                                        <div className="col-md-6 col-12">
                                            <label className="form-label fw-medium text-secondary">Email Address</label>
                                            <input type="email" className="form-control bg-light" name="email" value={form.email} onChange={handleChange} required placeholder="email@example.com" />
                                        </div>
                                        <div className="col-md-6 col-12">
                                            <label className="form-label fw-medium text-secondary">System Role</label>
                                            <select className="form-select bg-light" name="role" value={form.role} onChange={handleChange}>
                                                <option value="patient">Patient</option>
                                                <option value="doctor">Doctor</option>
                                                <option value="receptionist">Receptionist</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6 col-12">
                                            <label className="form-label fw-medium text-secondary">Password {editId && "(Leave blank to keep same)"}</label>
                                            <input type="password" className="form-control bg-light" name="password" value={form.password} onChange={handleChange} required={!editId} placeholder="Enter secure password" />
                                        </div>
                                    </div>
                                    <div className="mt-4 d-flex justify-content-end gap-2">
                                        <button type="button" className="btn btn-light border shadow-sm" onClick={handleCancel}>Cancel</button>
                                        <button type="submit" className="btn btn-primary shadow-sm px-4">{editId ? "Update User" : "Add User"}</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    <div className="card shadow-sm border-0">
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover table-bordered mb-0 align-middle">
                                    <thead className="table-light text-muted" style={{ fontSize: "0.85rem", textTransform: "uppercase" }}>
                                        <tr>
                                            <th className="py-3 px-4 fw-semibold border-bottom-0">ID</th>
                                            <th className="py-3 px-4 fw-semibold border-bottom-0">Name</th>
                                            <th className="py-3 px-4 fw-semibold border-bottom-0">Email</th>
                                            <th className="py-3 px-4 fw-semibold border-bottom-0">Role</th>
                                            <th className="py-3 px-4 fw-semibold border-bottom-0 text-end">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="text-center py-5 text-muted">No users found for this clinic.</td>
                                            </tr>
                                        ) : (
                                            users.map(u => (
                                                <tr key={u.id}>
                                                    <td className="px-4 text-muted border-light">#{u.id}</td>
                                                    <td className="px-4 fw-medium text-dark border-light">{u.name}</td>
                                                    <td className="px-4 text-secondary border-light">{u.email}</td>
                                                    <td className="px-4 border-light">
                                                        <span className={`badge rounded-pill fw-medium header-card py-2 px-3 
                                                            ${u.role === 'admin' ? 'bg-indigo-subtle text-indigo' :
                                                                u.role === 'doctor' ? 'bg-success-subtle text-success' :
                                                                    u.role === 'receptionist' ? 'bg-purple-subtle text-purple' :
                                                                        'bg-warning-subtle text-warning text-dark'}`}
                                                            style={{
                                                                backgroundColor: u.role === 'admin' ? '#e0e7ff' : u.role === 'doctor' ? '#dcfce7' : u.role === 'receptionist' ? '#f3e8ff' : '#fef3c7',
                                                                color: u.role === 'admin' ? '#4338ca' : u.role === 'doctor' ? '#15803d' : u.role === 'receptionist' ? '#7e22ce' : '#b45309'
                                                            }}
                                                        >
                                                            {u.role}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 text-end border-light">
                                                        {u.role !== 'admin' ? (
                                                            <div className="d-flex gap-2 justify-content-end">
                                                                <button className="btn btn-sm btn-outline-primary" onClick={() => handleEdit(u)}>Edit</button>
                                                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(u)}>Delete</button>
                                                            </div>
                                                        ) : (
                                                            <span className="text-muted small fst-italic me-2">System Admin</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </>
            )}

        </div>
    );
};

export default AdminDashboard;