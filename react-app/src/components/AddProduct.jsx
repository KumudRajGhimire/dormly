import { useEffect, useState } from "react";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import categories from "./CategoriesList";
import API_URL from "../constants";
import { FaTag, FaAlignLeft, FaDollarSign, FaListAlt, FaUpload, FaUndo, FaPaperPlane } from "react-icons/fa"; // Icons import
import "./AddProduct.css"; // Importing the new CSS file

function AddProduct() {
  const navigate = useNavigate();
  const [pname, setpname] = useState("");
  const [pdesc, setpdesc] = useState("");
  const [price, setprice] = useState("");
  const [category, setcategory] = useState("");
  const [pimage, setpimage] = useState("");
  const [pimage2, setpimage2] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, []);

  const handleApi = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const formData = new FormData();
      formData.append("plat", position.coords.latitude);
      formData.append("plong", position.coords.longitude);
      formData.append("pname", pname);
      formData.append("pdesc", pdesc);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("pimage", pimage);
      formData.append("pimage2", pimage2);
      formData.append("userId", localStorage.getItem("userId"));

      const url = API_URL + "/add-product";
      axios
        .post(url, formData)
        .then((res) => {
          if (res.data.message) {
            alert(res.data.message);
            navigate("/");
          }
        })
        .catch(() => {
          alert("Server error");
        });
    });
  };

  const handleClear = () => {
    setpname("");
    setpdesc("");
    setprice("");
    setcategory("");
    setpimage("");
    setpimage2("");
  };

  return (
    <div className="add-product-page">
      <Header />
      <div className="form-wrapper">
        {/* Left Side: Product Details */}
        <div className="form-left">
          <h2>Product Details</h2>

          <div className="form-group">
            <label><FaTag className="form-icon" /> Product Name</label>
            <input
              className="form-control"
              type="text"
              value={pname}
              onChange={(e) => setpname(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label><FaAlignLeft className="form-icon" /> Product Description</label>
            <textarea
              className="form-control"
              rows="4"
              value={pdesc}
              onChange={(e) => setpdesc(e.target.value)}
            ></textarea>
          </div>

          <div className="form-group">
            <label><FaDollarSign className="form-icon" /> Price</label>
            <input
              className="form-control"
              type="number"
              value={price}
              onChange={(e) => setprice(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label><FaListAlt className="form-icon" /> Category</label>
            <select
              className="form-control"
              value={category}
              onChange={(e) => setcategory(e.target.value)}
            >
              <option>Select Category</option>
              {categories &&
                categories.map((item, index) => (
                  <option key={index}>{item}</option>
                ))}
            </select>
          </div>
        </div>

        {/* Right Side: Image Upload and Buttons */}
        <div className="form-right">
          <h2>Product Images</h2>

          <div className="form-group">
            <label><FaUpload className="form-icon" /> Primary Image</label>
            <input
              type="file"
              className="file-upload"
              onChange={(e) => setpimage(e.target.files[0])}
            />
          </div>

          <div className="form-group">
            <label><FaUpload className="form-icon" /> Secondary Image</label>
            <input
              type="file"
              className="file-upload"
              onChange={(e) => setpimage2(e.target.files[0])}
            />
          </div>

          <div className="button-group">
            <button className="btn btn-secondary" onClick={handleClear}>
              <FaUndo className="btn-icon" /> Clear
            </button>
            <button className="btn btn-primary" onClick={handleApi}>
              <FaPaperPlane className="btn-icon" /> Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;
