import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../constants";
import "./Login.css";
import { FaEnvelope, FaLock } from "react-icons/fa";
import dormlyIllustration from "./Dormly-animated.gif";

// Import social login libraries
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    
    // Typing effect state
    const [welcomeText, setWelcomeText] = useState('');
    const welcomeMessage = "Welcome to Dormly!";
    
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
        // Send credentialResponse.credential to the backend for verification
    };

    const handleGoogleFailure = () => {
        setErrorMessage("Google login failed.");
    };

    return (
        <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
            <div className="login-page">
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
