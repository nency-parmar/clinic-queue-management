import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h3>{user?.clinicName}</h3>
            &nbsp;&nbsp;&nbsp;
            <div>
                <span>{user?.name}</span>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
};

export default Navbar;