import { useEffect, useState } from "react";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Categories from "./Categories";
import { FaHeart } from "react-icons/fa";
import './Home.css';
import Slider from './Slider'; // Import the Slider component
import API_URL from "../constants";

const categories = [
  'Stationaries', 'Entertainment', 'Fashion', 'Furniture',
  'Cutleries', 'Vehicles', 'Hobbies', 'Sports', 'Daily',
  'Electronics', 'Notes', 'Miscellaneous'
];

function Home() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [cproducts, setCproducts] = useState([]);
  const [search, setSearch] = useState('');
  const [isSearch, setIsSearch] = useState(false);
  const [placeholder, setPlaceholder] = useState(categories[0]);
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [favorites, setFavorites] = useState(new Set());

  // Fetch products from the server on initial load
  useEffect(() => {
    const url = API_URL + '/get-products';
    axios.get(url)
      .then((res) => {
        if (res.data.products) {
          setProducts(res.data.products);
        }
      })
      .catch(() => {
        alert('Server Error.');
      });
  }, []);

  // Typing effect for placeholder
  useEffect(() => {
    let i = 0;
    let currentCategory = categories[categoryIndex];
    
    const typeEffect = () => {
      if (i <= currentCategory.length) {
        setPlaceholder(currentCategory.slice(0, i));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    };

    const typingInterval = setInterval(typeEffect, 100);

    const categoryChangeInterval = setInterval(() => {
      setCategoryIndex((prevIndex) => (prevIndex + 1) % categories.length);
    }, 20000); // Change every 20 seconds

    // Cleanup intervals on unmount
    return () => {
      clearInterval(typingInterval);
      clearInterval(categoryChangeInterval);
    };
  }, [categoryIndex]);

  const handleSearch = (value) => {
    setSearch(value);
  };

  const handleClick = () => {
    const url = API_URL + '/search?search=' + search + '&loc=' + localStorage.getItem('userLoc');
    axios.get(url)
      .then((res) => {
        setCproducts(res.data.products);
        setIsSearch(true);
      })
      .catch(() => {
        alert('Server Error.');
      });
  };

  const handleCategory = (value) => {
    const filteredProducts = products.filter((item) => item.category === value);
    setCproducts(filteredProducts);
    setIsSearch(true);
  };

  const handleLike = (productId, e) => {
    e.stopPropagation();
    let userId = localStorage.getItem('userId');

    if (!userId) {
      alert('Please login first.');
      return;
    }

    const url = API_URL + '/like-product';
    const data = { userId, productId };
    
    axios.post(url, data)
      .then(() => {
        if (favorites.has(productId)) {
          setFavorites((prev) => {
            const updated = new Set(prev);
            updated.delete(productId);
            return updated;
          });
          showPopup('Removed from favorites', 'remove');
        } else {
          setFavorites((prev) => new Set(prev).add(productId));
          showPopup('Added to favorites', 'show');
        }
      })
      .catch(() => {
        alert('Server Error.');
      });
  };

  const showPopup = (message, type) => {
    const popup = document.createElement('div');
    popup.className = `popup-message ${type}`;
    popup.innerText = message;
    document.body.appendChild(popup);
    setTimeout(() => {
      popup.classList.add('show');
    }, 0);
    setTimeout(() => {
      popup.classList.remove('show');
      setTimeout(() => document.body.removeChild(popup), 500);
    }, 3000);
  };

  const handleProduct = (id) => {
    navigate('/product/' + id);
  };

  return (
    <div>
      <Header search={search} handlesearch={handleSearch} handleClick={handleClick} placeholder={placeholder} />
      <Categories handleCategory={handleCategory} />
      
      {/* Conditionally render Slider */}
      {!isSearch && <Slider />}

      {isSearch && cproducts && (
        <>
          <h5>SEARCH RESULTS
            <button className="clear-btn" onClick={() => setIsSearch(false)}>CLEAR</button>
          </h5>
          {cproducts.length === 0 && <h5>No Results Found</h5>}
        </>
      )}
      
      <div className="d-flex justify-content-center flex-wrap">
        {(isSearch ? cproducts : products).map((item) => (
          <div onClick={() => handleProduct(item._id)} key={item._id} className="card m-3">
            <div onClick={(e) => handleLike(item._id, e)} className="icon-con">
              <FaHeart className={`icons ${favorites.has(item._id) ? 'liked' : ''}`} />
            </div>
            <img width="250px" height="150px" src={API_URL + '/' + item.pimage} alt={item.pname} />
            <h3 className="m-2 price-text">Rs. {item.price} /-</h3>
            <p className="m-2">{item.pname} | {item.category}</p>
            <p className="m-2 text-success">{item.pdesc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
