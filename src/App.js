import React, { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "./slider.css";

import images from "./images/images";
import CustomCursor from "./CustomCursor";

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const swiperRef = useRef(null);

  const sliderImages = Object.entries(images)
    .filter(([key]) => /^slider(1[0-3]|[1-9])$/.test(key))
    .sort(
      (a, b) =>
        parseInt(a[0].replace("slider", "")) -
        parseInt(b[0].replace("slider", ""))
    );

  const openFullscreen = (index) => {
    setStartIndex(index);
    setCurrentIndex(index);
    setIsOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const closeFullscreen = () => {
    setIsAnimating(false);
    setTimeout(() => setIsOpen(false), 300);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeFullscreen();
    };
    if (isOpen) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handlePrev = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  };

  return (
    <>
      <Swiper
        slidesPerView={"auto"}
        freeMode={true}
        modules={[FreeMode]}
        className="gallerySwiper"
      >
        {sliderImages.map(([key, src], index) => (
          <SwiperSlide key={key} className="custom-slide">
            <div className="img-container">
              <img src={src} alt={key} className="custom-image" />
              <img
                src={images.fullscreen}
                alt="fullscreen"
                className="fullscreen-icon"
                onClick={() => openFullscreen(index)}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {isOpen && (
        <div className={`fullscreen-overlay ${isAnimating ? "show" : ""}`}>
          <CustomCursor className="custom-cursor"></CustomCursor>
          <button
            className="close-button"
            onMouseEnter={() => document.body.classList.add("hovering-close")}
            onMouseLeave={() =>
              document.body.classList.remove("hovering-close")
            }
            onClick={closeFullscreen}
          >
            <span className="close-icon">×</span>
            <span className="close-text">CLOSE</span>
          </button>

          <div
            className="custom-pagination"
            onMouseEnter={() => document.body.classList.add("hovering-close")}
            onMouseLeave={() =>
              document.body.classList.remove("hovering-close")
            }
          ></div>

          <Swiper
            ref={swiperRef}
            initialSlide={startIndex}
            modules={[Pagination]}
            className="fullscreenSwiper"
            pagination={{
              el: ".custom-pagination",
              clickable: true,
              renderBullet: (index, className) =>
                `<span class="${className} custom-bullet"></span>`,
            }}
            onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
          >
            {sliderImages.map(([key, src]) => (
              <SwiperSlide key={`full-${key}`}>
                <div className="fullscreen-img-wrapper">
                  <img src={src} alt={key} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Кастомные стрелки */}
          {currentIndex > 0 && (
            <div
              className="prev-arrow custom-arrow"
              onClick={handlePrev}
              onMouseEnter={() => document.body.classList.add("hovering-close")}
              onMouseLeave={() =>
                document.body.classList.remove("hovering-close")
              }
            >
              <svg width="48" height="16" viewBox="0 0 48 16" fill="white">
                <path d="M0 8c0 .573.2445 1.0865.6305 1.451l-.004.002L8 16 4 8l4-8L.6265 6.547l.004.002C.2445 6.9135 0 7.427 0 8z" />
                <path d="M47.6636904 7.66132609L.6726191 7.33207746c-.3688836-.00258463-.6700181.29435935-.6726027.66324294A.66977174.66977174 0 0 0 0 8.00000028c0 .36889265.2990466.66793922.6679392.66793922.00156 0 .00312-.00000546.0046799-.00001639l46.9910713-.32924863C47.849809 8.33737042 48 8.18612343 48 8.00000028s-.150191-.33737013-.3363096-.33867419z" />
              </svg>
            </div>
          )}

          {currentIndex < sliderImages.length - 1 && (
            <div
              className="next-arrow custom-arrow"
              onClick={handleNext}
              onMouseEnter={() => document.body.classList.add("hovering-close")}
              onMouseLeave={() =>
                document.body.classList.remove("hovering-close")
              }
            >
              <svg width="48" height="16" viewBox="0 0 48 16" fill="white">
                <path d="M48 8a1.99 1.99 0 0 1-.63 1.451l.004.002L40 16l4-8-4-8 7.373 6.547-.003.002c.386.364.63.878.63 1.451z" />
                <path d="M.336 7.661l46.991-.329A.668.668 0 0 1 48 8a.668.668 0 0 1-.673.668l-46.99-.33a.339.339 0 0 1 0-.677z" />
              </svg>
            </div>
          )}
        </div>
      )}
    </>
  );
}
