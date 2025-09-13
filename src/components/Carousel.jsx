import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const images = [
  "https://images.unsplash.com/photo-1749482843703-3895960e7d63?w=900&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1519092503391-16a955fda811?w=900&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=900&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1514897575457-c4db467cf78e?w=900&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1444080748397-f442aa95c3e5?w=900&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1749449456588-ef30946060ca?w=900&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1749225667069-f7d8f585fa26?w=900&auto=format&fit=crop&q=60"
];

function Carousel() {
  const [current, setCurrent] = useState(0);
  const [backgroundGradient, setBackgroundGradient] = useState('linear-gradient(45deg, #f0f0f0, #e0e0e0)');

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  useEffect(() => {
    const slideInterval = setInterval(nextSlide, 5000);
    return () => clearInterval(slideInterval);
  }, []);

  const analyzeImageColors = (imageUrl) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        const colorCount = {};
        
        // Sample every 10th pixel for performance
        for (let i = 0; i < data.length; i += 40) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          // Group similar colors
          const rGroup = Math.floor(r / 20) * 20;
          const gGroup = Math.floor(g / 20) * 20;
          const bGroup = Math.floor(b / 20) * 20;
          
          const colorKey = `${rGroup},${gGroup},${bGroup}`;
          colorCount[colorKey] = (colorCount[colorKey] || 0) + 1;
        }
        
        const sortedColors = Object.entries(colorCount).sort((a, b) => b[1] - a[1]);
        
        if (sortedColors.length >= 2) {
          const mostUsed = sortedColors[0][0];
          const leastUsed = sortedColors[sortedColors.length - 1][0];
          
          resolve({
            dominant: `rgb(${mostUsed})`,
            least: `rgb(${leastUsed})`
          });
        } else {
          resolve({
            dominant: 'rgb(200, 200, 200)',
            least: 'rgb(100, 100, 100)'
          });
        }
      };
      
      img.onerror = () => {
        resolve({
          dominant: 'rgb(200, 200, 200)',
          least: 'rgb(100, 100, 100)'
        });
      };
      
      img.src = imageUrl;
    });
  };

  useEffect(() => {
    const currentImageUrl = images[current];
    
    analyzeImageColors(currentImageUrl).then(colors => {
      const gradient = `linear-gradient(135deg, ${colors.dominant}, ${colors.least})`;
      setBackgroundGradient(gradient);
    });
  }, [current]);

  const getImageIndex = (offset) => {
    return (current + offset + images.length) % images.length;
  };

  return (
    <div 
      className="relative w-full max-w-5xl mx-auto overflow-hidden py-6 rounded-xl shadow-2xl transition-all duration-1000 ease-in-out"
      style={{ background: backgroundGradient }}
    >
      <div className="flex items-center justify-center gap-2 sm:gap-4">
        {[-1, 0, 1].map((offset) => {
          const index = getImageIndex(offset);
          const isCenter = offset === 0;
          return (
            <img
              key={index}
              src={images[index]}
              alt={`slide ${index}`}
              className={`transition-all duration-700 ease-in-out rounded-2xl shadow-lg ${
                isCenter ? "w-4/5 sm:w-80 h-48 sm:h-64 scale-105 hover:border-3 hover:border-purple-500" : "w-1/4 sm:w-64 h-32 sm:h-48 opacity-60"
              }`}
            />
          );
        })}
      </div>

      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-2 sm:left-4 transform -translate-y-1/2 bg-black bg-opacity-50 hover:border-2 hover:border-purple-500 text-white p-2 rounded-full hover:bg-opacity-75 cursor-pointer"
      >
        <FaChevronLeft />
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-2 sm:right-4 transform -translate-y-1/2 bg-black bg-opacity-50 hover:border-2 hover:border-purple-500 text-white p-2 rounded-full hover:bg-opacity-75 cursor-pointer"
      >
        <FaChevronRight />
      </button>
    </div>
  );
}

export default Carousel;