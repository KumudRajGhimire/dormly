import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import API_URL from "../constants";
import "./Login.css";
import { FaEnvelope, FaLock } from "react-icons/fa";
import dormlyIllustration from "./Dormly-animated.gif";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [welcomeText, setWelcomeText] = useState('');
    const welcomeMessage = "Welcome to Dormly!";
    const vantaRef = useRef(null); // Reference for the Vanta effect container

    useEffect(() => {
        let i = 0;
        const typeEffect = setInterval(() => {
            setWelcomeText(welcomeMessage.slice(0, i + 1));
            i++;
            if (i === welcomeMessage.length) {
                clearInterval(typeEffect);
            }
        }, 100);

        return () => clearInterval(typeEffect);
    }, []);

    useEffect(() => {
        // Initialize Vanta.js Birds effect
        const vantaEffect = window.VANTA.BIRDS({
            el: vantaRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            backgroundColor: 0xffffff,
            color1: 0x0, // black color
            color2: 0x0, // black color
            wingSpan: 36.00,
            speedLimit: 3.00,
            separation: 100.00,
            alignment: 25.00,
            quantity: 2.00, // Increase number of birds
        });

        // Cleanup on component unmount
        return () => {
            if (vantaEffect) vantaEffect.destroy();
        };
    }, []);

    const handleApi = () => {
        const url = `${API_URL}/login`;
        const data = { username, password };

        axios.post(url, data)
            .then((res) => {
                if (res.data.token) {
                    localStorage.setItem('token', res.data.token);
                    localStorage.setItem('userId', res.data.userId);
                    localStorage.setItem('userName', res.data.username);
                    navigate('/');
                } else {
                    setErrorMessage(res.data.message || "Invalid login credentials");
                }
            })
            .catch(() => {
                setErrorMessage("Server error. Please try again.");
            });
    };

    const isFormValid = () => username.trim() && password.trim();

    const handleGoogleSuccess = (credentialResponse) => {
        console.log(credentialResponse);
    };

    const handleGoogleFailure = () => {
        setErrorMessage("Google login failed.");
    };

    return (
        <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
            <div ref={vantaRef} className="login-page">
                {/* Typing Effect for Welcome Header */}
                <div className="welcome-header">
                    <h2>{welcomeText}</h2>
                </div>

                {/* Main Login Content */}
                <div className="login-container">
                    <div className="illustration-container">
                        <img src={dormlyIllustration} alt="Dormly Illustration" className="illustration" />
                    </div>
                    <div className="login-card">
                        <h1>Login to Dormly!</h1>
                        {errorMessage && <p className="error-message">{errorMessage}</p>}

                        {/* Username Input */}
                        <div className="input-group">
                            <FaEnvelope className="icon" />
                            <input
                                className="form-control"
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        {/* Password Input */}
                        <div className="input-group">
                            <FaLock className="icon" />
                            <input
                                className="form-control"
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {/* Login Button */}
                        <button
                            className="btn login-btn"
                            onClick={handleApi}
                            disabled={!isFormValid()}
                        >
                            Log In
                        </button>

                        {/* Browse Without Logging In Button */}
                        <div className="browse-btn-container">
                            <button
                                className="browse-btn"
                                onClick={() => navigate('/')}
                            >
                                Browse without logging in
                            </button>
                        </div>

                        {/* Social Login */}
                        <p className="or-continue">Or Continue With</p>
                        <div className="social-login">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={handleGoogleFailure}
                            />
                        </div>

                        {/* Sign Up Link */}
                        <p className="signup-text">
                            Don’t have an account? <Link to="/signup">Sign Up here</Link>
                        </p>
                    </div>
                </div>
            </div>
        </GoogleOAuthProvider>
    );
}

export default Login;
