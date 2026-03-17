import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";

const DashboardLayout = () => {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="d-flex flex-column flex-md-row min-vh-100" style={{ backgroundColor: "var(--bg-color)" }}>
            <Sidebar />
            <main className="flex-grow-1 p-3 p-md-4 w-100" style={{ overflowY: "auto", overflowX: "hidden" }}>
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;
