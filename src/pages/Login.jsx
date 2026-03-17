import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/endpoints";

const Login = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async () => {
        try {
            const res = await loginUser(form);

            // Save token
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));

            // Redirect
            navigate("/dashboard");
        } catch (err) {
            console.error(err);
            alert("Login failed");
        }
    };

    return (
        <div style={{ padding: "50px" }}>
            <h2>Login</h2>

            <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
            />

            <br /><br />

            <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
            />

            <br /><br />

            <button onClick={handleSubmit}>Login</button>
        </div>
    );
};

export default Login;