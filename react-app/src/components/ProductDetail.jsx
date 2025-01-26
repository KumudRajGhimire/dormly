import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaComments, FaMinusCircle } from 'react-icons/fa';
import './ProductDetail.css';
import Header from "./Header";
import API_URL from "../constants";
import io from 'socket.io-client';
import gpayLogo from './gpay.png';
import phonepeLogo from './phonepe.png';


let socket;

function ProductDetail() {
  const [product, setProduct] = useState(null);
  const [user, setUser] = useState(null);
  const [showContact, setShowContact] = useState(false);
  const [msg, setMsg] = useState('');
  const [msgs, setMsgs] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatUser, setChatUser] = useState(null);
  const [username, setUsername] = useState(localStorage.getItem('userName'));

  const p = useParams();

  useEffect(() => {
    socket = io(API_URL);
    socket.on('connect', () => {
      console.log('Socket connected');
    });
    return () => {
      socket.off();
    };
  }, []);

  useEffect(() => {
    const url = `${API_URL}/get-product/${p.productId}`;
    axios.get(url)
      .then((res) => {
        if (res.data.product) {
          setProduct(res.data.product);
        }
      })
      .catch(() => {
        alert('Error fetching product details.');
      });
  }, [p.productId]);

  const handleContactToggle = () => {
    if (!showContact) {
      const url = `${API_URL}/get-user/${product.addedBy}`;
      axios.get(url)
        .then((res) => {
          if (res.data.user) {
            setUser(res.data.user);
          }
        })
        .catch(() => {
          alert('Error fetching user details.');
        });
    }
    setShowContact(!showContact);
  };

  const handlePayment = (method) => {
    alert(`Initiating payment using ${method}. This feature will be integrated soon.`);
    // Here you can integrate respective SDKs or APIs for GPay or PhonePe.
  };

  const handleSendMessage = () => {
    if (msg.trim()) {
      const data = {
        username: username,
        msg,
        productId: p.productId,
      };
      socket.emit('sendMsg', data);
      setMsg('');
    }
  };

  useEffect(() => {
    socket.on('getMsg', (data) => {
      const filteredMessages = data.filter(item => item.productId === p.productId);
      setMsgs(filteredMessages);
    });
  }, [p.productId]);

  return (
    <>
      <Header />
      <div className="product-detail-container">
        {product && (
          <div className="product-info-container">
            {/* Left Section: Product Details */}
            <div className="left-section">
              <div className="product-images">
                <div className="image-frame">
                  <img
                    className="product-main-image"
                    src={`${API_URL}/${product.pimage}`}
                    alt={product.pname}
                  />
                </div>
                {product.pimage2 && (
                  <div className="image-frame">
                    <img
                      className="product-secondary-image"
                      src={`${API_URL}/${product.pimage2}`}
                      alt={product.pname}
                    />
                  </div>
                )}
              </div>

              <div className="product-details">
                <h2 className="product-name">{product.pname}</h2>
                <h3 className="product-price">Rs. {product.price} /-</h3>
                <p className="product-category">{product.category}</p>
                <p className="product-desc">{product.pdesc}</p>
              </div>
            </div>

            {/* Right Section: Owner Details */}
            <div className="right-section">
              <button onClick={handleContactToggle} className="show-contact-button">
                {showContact ? "Hide Owner Details" : "Show Owner Details"}
              </button>
              {showContact && user && (
                <div className="contact-details">
                  <h4>{user.username}</h4>
                  <p>{user.mobile}</p>
                  <p>{user.email}</p>

                  {/* Payment Options */}
                  <div className="payment-options mt-3">
  <h5>Payment Options:</h5>
  <div className="d-flex gap-3 align-items-center">
    <button
      className="btn btn-outline-success payment-button d-flex align-items-center gap-2"
      onClick={() => handlePayment("GPay")}
    >
      <img
        src={gpayLogo}
        alt="GPay"
        className="payment-logo"
      />
      GPay
    </button>
    <button
      className="btn btn-outline-primary payment-button d-flex align-items-center gap-2"
      onClick={() => handlePayment("PhonePe")}
    >
      <img
        src={phonepeLogo}
        alt="PhonePe"
        className="payment-logo"
      />
      PhonePe
    </button>
  </div>
</div>
                </div>
              )}

              {product.location && (
                <div className="owner-location">
                  <p><strong>Owner's Location:</strong> {product.location}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Chat Icon */}
        <FaComments
          className="chat-icon"
          onClick={() => {
            setIsChatOpen(true);
            setChatUser(product.addedBy);
          }}
        />

        {/* Chat Section */}
        {isChatOpen && (
          <div className="chat-section">
            <div className="chat-header">
              <h4>Chats: </h4>
              <FaMinusCircle
                className="close-chat-icon"
                onClick={() => setIsChatOpen(false)}
              />
            </div>
            <div className="chat-messages">
              {msgs.map((item, index) => (
                <div key={index} className={`chat-message ${item.username === username ? 'sent' : 'received'}`}>
                  <p><strong>{item.username}</strong>: {item.msg}</p>
                </div>
              ))}
            </div>
            <div className="chat-input">
              <input
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                className="form-control"
                type="text"
                placeholder="Type a message..."
              />
              <button
                onClick={handleSendMessage}
                className="btn btn-primary"
                disabled={!msg.trim()}
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ProductDetail;
