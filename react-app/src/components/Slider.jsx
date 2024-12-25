import React, { useState, useEffect } from "react";
import './Slider.css';

// Import images
import slider1 from './slider1.png';
import slider2 from './slider2.png';
import slider3 from './slider3.png';

const Slider = () => {
  const sliderImages = [slider1, slider2, slider3];  // Added the 3rd image
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto-slide to the right every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000); // Adjust the interval as needed
    return () => clearInterval(interval);
  }, [currentSlide]);

  const nextSlide = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % sliderImages.length);
      setIsAnimating(false);
    }, 1000); // Transition duration
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === 0 ? sliderImages.length - 1 : prevSlide - 1
    );
  };

  return (
    <div className="slider-container">
      <div
        className="slider"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {sliderImages.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Slide ${index + 1}`}
            className="slider-image"
          />
        ))}
      </div>

      {/* Navigation Buttons */}
      <button className="prev-button" onClick={prevSlide}>
        &#10094;
      </button>
      <button className="next-button" onClick={nextSlide}>
        &#10095;
      </button>

      {/* Navigation Dots */}
      <div className="slider-dots">
        {sliderImages.map((_, index) => (
          <span
            key={index}
            className={`dot ${currentSlide === index ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Slider;
