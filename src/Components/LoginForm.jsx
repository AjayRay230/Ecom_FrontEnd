import axios from "axios";
import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import MyContext from "../Context/MyContext";
import { toast } from "react-toastify";

const LoginForm = ({ onLogin }) => {
    const [form, setForm] = useState({ username: "", password: "", email: "" });
    const { login } = useContext(MyContext);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`https://ecom-backend-rt2i.onrender.com/api/user/login`, form,
            );

           
            login(res.data);

            toast.success("Login successful");
            onLogin();

        } catch (err) {
            console.error("Failed to Login", err);
            toast.warn("Failed to login");
        }
    };

    return (
        <div className="login-container">
            <div className="loginForm">
                <input
                    onChange={handleChange}
                    placeholder="Enter UserName"
                    value={form.username}
                    name="username"
                    type="text"
                    required
                />
                <input
                    onChange={handleChange}
                    placeholder="Enter Email Id"
                    value={form.email}
                    name="email"
                    type="email"
                    required
                />
                <input
                    onChange={handleChange}
                    placeholder="Enter Password"
                    name="password"
                    type="password"
                    value={form.password}
                    required
                />
                <button type="button" onClick={handleLogin}>Login</button>
                <p className="register-link">
                    New User? <Link to="/register">Sign Up</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginForm;
