import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

const images = [
  'https://example.com/image1.jpg',
  'https://example.com/image2.jpg',
  'https://example.com/image3.jpg',
  'https://example.com/image4.jpg',
  'https://example.com/image5.jpg'
];

const ImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(2); // Start with center image
  const carouselRef = useRef(null);
  const x = useMotionValue(0);

  const handleDragEnd = (event, info) => {
    const swipe = info.offset.x;
    if (swipe < -50 && currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (swipe > 50 && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <motion.div 
      ref={carouselRef}
      className="w-full h-full flex items-center justify-center overflow-hidden relative"
    >
      <div className="flex items-center justify-center w-full max-w-5xl space-x-[-200px]">
        {images.map((image, index) => {
          const distanceFromCenter = Math.abs(index - currentIndex);
          const scale = 1 - distanceFromCenter * 0.2;
          const opacity = 1 - distanceFromCenter * 0.4;
          const zIndex = images.length - distanceFromCenter;
          const xOffset = (index - currentIndex) * 200;

          return (
            <motion.div
              key={index}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
              animate={{ 
                x: xOffset, 
                scale: scale, 
                opacity: opacity,
                zIndex: zIndex
              }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30 
              }}
              className="cursor-grab active:cursor-grabbing"
              style={{
                position: 'absolute',
                width: '400px',
                height: '300px',
                borderRadius: '16px',
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
              }}
            />
          );
        })}
      </div>
    </motion.div>
  );
};

export default ImageCarousel;
