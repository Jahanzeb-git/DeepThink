import React, { useState, useRef } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import Image1 from '.../assets/image1.jpg';
import Image2 from '.../assets/image2.jpg';
import Image3 from '.../assets/image3.jpg';
import Image4 from '.../assets/image4.jpg';
import Image5 from '.../assets/image5.jpg';
// Using placeholder images instead of external URLs
const images = [
  Image1,
  Image2,
  Image3,
  Image4,
  Image5
];

const ImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(2);
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
      className="w-full h-64 flex items-center justify-center overflow-hidden relative"
    >
      <div className="flex items-center justify-center w-full max-w-5xl relative">
        {images.map((image, index) => {
          const distanceFromCenter = Math.abs(index - currentIndex);
          const scale = 1 - distanceFromCenter * 0.2;
          const opacity = 1 - distanceFromCenter * 0.4;
          const zIndex = images.length - distanceFromCenter;
          const xOffset = (index - currentIndex) * 100;

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
              className="cursor-grab active:cursor-grabbing absolute"
              style={{
                width: '200px',
                height: '150px',
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

