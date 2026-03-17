import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/endpoints";

const Login = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await loginUser(form);
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));

            const role = res.data.user.role;
            if (role === "admin") navigate("/admin");
            else if (role === "doctor") navigate("/doctor");
            else if (role === "patient") navigate("/patient");
            else if (role === "receptionist") navigate("/reception");
        } catch (err) {
            console.error(err);
            setError("Invalid email or password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="w-100" style={{ maxWidth: "420px", padding: "0 16px" }}>

                <div className="text-center mb-4">
                    <div
                        className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center fw-bold mb-3"
                        style={{ width: 52, height: 52, fontSize: "1.5rem" }}
                    >
                        +
                    </div>
                    <h1 className="h4 fw-bold text-dark mb-1">Clinic Queue</h1>
                    <p className="text-muted small mb-0">Sign in to your account</p>
                </div>

                <div className="card border-0 shadow-sm">
                    <div className="card-body p-4">
                        {error && (
                            <div className="alert alert-danger py-2 px-3 small mb-3" role="alert">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label fw-medium text-secondary small">Email Address</label>
                                <input
                                    type="email"
                                    className="form-control bg-light"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="you@clinic.com"
                                    required
                                    autoFocus
                                />
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-medium text-secondary small">Password</label>
                                <input
                                    type="password"
                                    className="form-control bg-light"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary w-100 py-2 fw-medium"
                                disabled={loading}
                            >
                                {loading ? "Signing in..." : "Sign In"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;