import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import API_URL from "../constants";
import "./Signup.css";
import signupIllustration from "./Dormly-animated.gif"; // Use a relevant illustration here

function Signup() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});

    const validateEmail = (email) =>
        /^[a-zA-Z0-9._%+-]+@bmsce\.ac\.in$/.test(email);
    

    const validateMobile = (mobile) =>
        /^[6-9]\d{9}$/.test(mobile);

    const validatePassword = (password) =>
        password.length >= 6;

    const validateForm = () => {
        const errors = {};

        if (!username) errors.username = "Username is required.";
        if (!validateEmail(email)) errors.email = "Invalid email format.";
        if (!validateMobile(mobile)) errors.mobile = "Invalid mobile number.";
        if (!validatePassword(password)) errors.password = "Password must be at least 6 characters long.";

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleApi = () => {
        if (!validateForm()) return;

        const url = API_URL + "/signup";
        const data = { username, password, email, mobile };
        axios
            .post(url, data)
            .then((res) => {
                if (res.data.message) {
                    alert(res.data.message);
                    if (res.data.success) {
                        // Redirect to the login page after successful signup
                        navigate("/login");
                    }
                }
            })
            .catch(() => {
                setErrorMessage("Server error. Please try again.");
            });
    };

    return (
        <div className="signup-page">
            {/* Welcome Header */}
            <div className="welcome-header">Create Your Dormly Account</div>

            {/* Main Signup Content */}
            <div className="signup-container">
                {/* Illustration */}
                <div className="illustration-container">
                    <img
                        src={signupIllustration}
                        alt="Signup Illustration"
                        className="illustration"
                    />
                </div>

                {/* Signup Form */}
                <div className="signup-card">
                    <h2>Sign Up for Dormly!</h2>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}

                    {/* Username Input */}
                    <div className="input-group">
                        <input
                            className="form-control"
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        {fieldErrors.username && <small className="error-text">{fieldErrors.username}</small>}
                    </div>
                    <div className="input-group">
                        <input
                            className="form-control"
                            type="text"
                            placeholder="Mobile (10 digits)"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                        />
                        {fieldErrors.mobile && <small className="error-text">{fieldErrors.mobile}</small>}
                    </div>
                    <div className="input-group">
                        <input
                            className="form-control"
                            type="email"
                            placeholder="Email (@bmsce.ac.in)"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {fieldErrors.email && <small className="error-text">{fieldErrors.email}</small>}
                    </div>
                    <div className="input-group">
                        <input
                            className="form-control"
                            type="password"
                            placeholder="Password (6 characters or more)"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {fieldErrors.password && <small className="error-text">{fieldErrors.password}</small>}
                    </div>

                    {/* Signup Button */}
                    <button
                        className="btn signup-btn"
                        onClick={handleApi}
                    >
                        Sign Up
                    </button>

                    {/* Already have an account */}
                    <p className="or-continue">Already have an account?</p>
                    <Link className="login-link" to="/login">
                        Log In here
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Signup;
