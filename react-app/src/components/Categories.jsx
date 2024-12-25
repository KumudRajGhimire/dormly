import React from 'react';
import { FaPen, FaFilm, FaTshirt, FaHome, FaCogs, FaCar, FaBook, FaRunning, FaStickyNote, FaTv, FaBoxOpen } from 'react-icons/fa';
import './Categories.css';

const Categories = ({ handleCategory }) => {
  const categories = [
    { name: 'Stationaries', icon: <FaPen /> },
    { name: 'Entertainment', icon: <FaFilm /> },
    { name: 'Fashion', icon: <FaTshirt /> },
    { name: 'Furniture', icon: <FaHome /> },
    { name: 'Cutleries', icon: <FaCogs /> },
    { name: 'Vehicles', icon: <FaCar /> },
    { name: 'Hobbies', icon: <FaBook /> },
    { name: 'Sports', icon: <FaRunning /> },
    { name: 'Daily', icon: <FaStickyNote /> },
    { name: 'Electronics', icon: <FaTv /> },
    { name: 'Notes', icon: <FaBook /> },
    { name: 'Miscellaneous', icon: <FaBoxOpen /> }
  ];

  return (
    <div className="category-container">
      {categories.map((category, index) => (
        <div 
          key={index} 
          className="category-item" 
          onClick={() => handleCategory(category.name)}
        >
          <div className="icon-container">
            {category.icon}
          </div>
          <span>{category.name}</span>
        </div>
      ))}
    </div>
  );
};

export default Categories;
