import { useEffect, useState } from "react";
import Header from "./Header";
import { useNavigate, Link, useParams } from "react-router-dom";
import axios from "axios";
import categories from "./CategoriesList";
import API_URL from "../constants";
import "./EditProduct.css";

function EditProduct() {
    const p = useParams();
    const navigate = useNavigate();
    const [pname, setpname] = useState('');
    const [pdesc, setpdesc] = useState('');
    const [price, setprice] = useState('');
    const [category, setcategory] = useState('');
    const [pimage, setpimage] = useState('');
    const [pimage2, setpimage2] = useState('');
    const [poldimage, setpoldimage] = useState('');
    const [poldimage2, setpoldimage2] = useState('');

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/login');
        }
    }, []);

    useEffect(() => {
        const url = `${API_URL}/get-product/${p.productId}`;
        axios.get(url)
            .then((res) => {
                if (res.data.product) {
                    let product = res.data.product;
                    setpname(product.pname);
                    setpdesc(product.pdesc);
                    setprice(product.price);
                    setcategory(product.category);
                    setpoldimage(product.pimage);
                    setpoldimage2(product.pimage2);
                }
            })
            .catch(() => {
                alert('Server Error');
            });
    }, []);

    const handleApi = () => {
        const formData = new FormData();

        formData.append('pid', p.productId);
        formData.append('pname', pname);
        formData.append('pdesc', pdesc);
        formData.append('price', price);
        formData.append('category', category);
        formData.append('pimage', pimage);
        formData.append('pimage2', pimage2);
        formData.append('userId', localStorage.getItem('userId'));

        const url = `${API_URL}/edit-product`;
        axios.post(url, formData)
            .then((res) => {
                if (res.data.message) {
                    alert(res.data.message);
                    navigate('/my-products');
                }
            })
            .catch(() => {
                alert('Server Error');
            });
    };

    return (
        <div>
            <Header />
            <div className="edit-product-container">
                <div className="edit-product-card">
                    <h2 className="edit-product-heading">Edit Product</h2>
                    <div className="form-section">
                        <label>Product Name</label>
                        <input
                            className="form-control"
                            type="text"
                            value={pname}
                            onChange={(e) => setpname(e.target.value)}
                        />
                    </div>
                    <div className="form-section">
                        <label>Product Description</label>
                        <textarea
                            className="form-control"
                            rows="3"
                            value={pdesc}
                            onChange={(e) => setpdesc(e.target.value)}
                        ></textarea>
                    </div>
                    <div className="form-section">
                        <label>Product Price</label>
                        <input
                            className="form-control"
                            type="number"
                            value={price}
                            onChange={(e) => setprice(e.target.value)}
                        />
                    </div>
                    <div className="form-section">
                        <label>Product Category</label>
                        <select
                            className="form-control"
                            value={category}
                            onChange={(e) => setcategory(e.target.value)}
                        >
                            <option>Select Category</option>
                            {categories.map((item, index) => (
                                <option key={index} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="image-section">
                        <div className="image-upload">
                            <label>Product Image</label>
                            <input
                                className="form-control"
                                type="file"
                                onChange={(e) => setpimage(e.target.files[0])}
                            />
                            {poldimage && (
                                <img
                                    src={`${API_URL}/${poldimage}`}
                                    alt="Old Product"
                                    className="image-preview"
                                />
                            )}
                        </div>
                        <div className="image-upload">
                            <label>Second Product Image</label>
                            <input
                                className="form-control"
                                type="file"
                                onChange={(e) => setpimage2(e.target.files[0])}
                            />
                            {poldimage2 && (
                                <img
                                    src={`${API_URL}/${poldimage2}`}
                                    alt="Old Product"
                                    className="image-preview"
                                />
                            )}
                        </div>
                    </div>
                    <button onClick={handleApi} className="btn btn-primary submit-btn">
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditProduct;
