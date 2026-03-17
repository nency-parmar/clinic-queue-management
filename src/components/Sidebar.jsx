import { Link, useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    let user = null;
    try {
        const userStr = localStorage.getItem("user");
        if (userStr && userStr !== "undefined") {
            user = JSON.parse(userStr);
        }
    } catch (e) {
        console.error("Failed to parse user from localStorage", e);
    }

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    const getNavItems = () => {
        if (!user) return [];
        switch (user.role) {
            case "admin":
                return [
                    { path: "/admin", name: "Overview" },
                    { path: "/admin/users", name: "Manage Users" },
                ];
            case "patient":
                return [
                    { path: "/patient", name: "Book Appointment" },
                    { path: "/patient/appointments", name: "My Appointments" },
                    { path: "/patient/prescriptions", name: "Prescriptions" },
                    { path: "/patient/reports", name: "My Reports" }
                ];
            case "doctor":
                return [
                    { path: "/doctor", name: "My Queue" },
                    { path: "/doctor/prescribe", name: "Add Prescription" },
                    { path: "/doctor/reports", name: "Add Reports" }
                ];
            case "receptionist":
                return [
                    { path: "/reception", name: "Queue Management" },
                    { path: "/reception/tv", name: "TV Display" }
                ];
            default:
                return [];
        }
    };

    const navItems = getNavItems();

    return (
        <aside className="d-flex flex-md-column flex-row bg-white border-md-end border-bottom shadow-sm sticky-top" style={{
            height: "auto",
            minHeight: "100%",
            width: "100%",
            maxWidth: "280px"
        }}>
            <div className="p-3 border-bottom d-flex align-items-center gap-2">
                <div className="bg-primary text-white rounded d-flex align-items-center justify-content-center fw-bold" style={{ width: 36, height: 36, fontSize: "1.2rem" }}>
                    +
                </div>
                <div className="d-none d-md-block">
                    <h2 className="h6 mb-0 text-dark">Clinic Queue</h2>
                    {user?.clinicCode && <span className="text-muted small">{user.clinicCode}</span>}
                </div>
            </div>

            <div className="p-2 py-md-3 flex-grow-1 overflow-auto d-flex flex-row flex-md-column gap-1">
                <div className="d-none d-md-block text-muted small fw-bold text-uppercase px-2 mb-2">
                    MAIN MENU
                </div>
                <nav className="d-flex flex-row flex-md-column flex-nowrap overflow-auto hide-scrollbar gap-1 w-100">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== "/admin" && item.path !== "/patient" && item.path !== "/doctor" && item.path !== "/reception");

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`text-decoration-none px-3 py-2 rounded-2 d-flex align-items-center text-nowrap transition-all ${isActive ? 'bg-primary text-white fw-medium' : 'text-secondary hover-bg-light'}`}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="p-3 border-top d-flex flex-row flex-md-column align-items-center justify-content-between gap-md-3">
                <div className="d-flex align-items-center gap-2 w-100">
                    <div className="bg-light rounded-circle d-flex align-items-center justify-content-center text-muted fw-bold border" style={{ width: 36, height: 36 }}>
                        {user?.name?.charAt(0) || "U"}
                    </div>
                    <div className="d-none d-md-block overflow-hidden w-100">
                        <p className="mb-0 text-truncate fw-medium small text-dark">{user?.name || "User"}</p>
                        <p className="mb-0 small text-muted text-capitalize">{user?.role || "Role"}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="btn btn-sm btn-outline-danger w-100 d-none d-md-block"
                >
                    Logout
                </button>
                <button
                    onClick={handleLogout}
                    className="btn btn-sm btn-outline-danger d-md-none"
                    title="Logout"
                >
                    Exit
                </button>
            </div>

            <style>{`.hover-bg-light:hover { background-color: #f8fafc; color: var(--primary-blue) !important; } .hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
        </aside>
    );
};

export default Sidebar;