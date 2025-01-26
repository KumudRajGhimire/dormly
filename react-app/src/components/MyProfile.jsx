import { useEffect, useState } from "react";
import Header from "./Header";
import axios from "axios";
import { FaUser, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import API_URL from "../constants";
import './MyProfile.css';


function MyProfile() {
  const [user, setuser] = useState({});

  useEffect(() => {
    let url = API_URL + "/my-profile/" + localStorage.getItem("userId");
    axios
      .get(url)
      .then((res) => {
        console.log(res.data);
        if (res.data.user) {
          setuser(res.data.user);
        }
      })
      .catch((err) => {
        alert("Server Error.");
      });
  }, []);

  return (
    <div>
      <Header />
      <div className="profile-container">
        <h3 className="text-center profile-title">User Profile</h3>
        <div className="profile-card">
          <div className="profile-item">
            <FaUser className="profile-icon" />
            <div>
              <h6 className="profile-label">Username</h6>
              <p className="profile-value">{user.username || "N/A"}</p>
            </div>
          </div>

          <div className="profile-item">
            <FaEnvelope className="profile-icon" />
            <div>
              <h6 className="profile-label">Email</h6>
              <p className="profile-value">{user.email || "N/A"}</p>
            </div>
          </div>

          <div className="profile-item">
            <FaPhoneAlt className="profile-icon" />
            <div>
              <h6 className="profile-label">Mobile</h6>
              <p className="profile-value">{user.mobile || "N/A"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyProfile;
