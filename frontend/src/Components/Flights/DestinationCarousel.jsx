import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { FiArrowLeft, FiArrowRight, FiArrowUpRight } from 'react-icons/fi';

// --- DATA (No changes needed here) ---
const DESTINATIONS = [
  // ... (Using the same 7 destinations as the previous version)
  { id: 1, name: 'Kyoto, Japan', description: 'Ancient temples, vibrant traditions, and serene gardens.', image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80', accentColor: '#FF4A4A' },
  { id: 2, name: 'Santorini, Greece', description: 'Whitewashed villages above the azure Aegean Sea.', image: 'https://images.unsplash.com/photo-1512413317424-328120306117?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80', accentColor: '#0077B6' },
  { id: 3, name: 'Bora Bora', description: 'Overwater bungalows on turquoise lagoons.', image: 'https://images.unsplash.com/photo-1508672154135-0b5c18445353?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80', accentColor: '#22D3EE' },
  { id: 4, name: 'Venice, Italy', description: 'A floating city of romantic canals and historic art.', image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1966&q=80', accentColor: '#F5A623' },
  { id: 5, name: 'Banff, Canada', description: 'Pristine mountain lakes and vast alpine landscapes.', image: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2011&q=80', accentColor: '#4A90E2' },
  { id: 6, name: 'Cairo, Egypt', description: 'Journey through time amidst colossal pyramids.', image: 'https://images.unsplash.com/photo-1566203910394-463226a200a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80', accentColor: '#D0A25E' },
  { id: 7, name: 'Machu Picchu, Peru', description: 'The mysterious ancient Incan citadel in the Andes.', image: 'https://images.unsplash.com/photo-1526749903959-5763242426fe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80', accentColor: '#50E3C2' },
];

// --- 1. Interactive Destination Card Component ---
const DestinationCard = ({ destination, isCurrent }) => {
  const cardRef = useRef(null);

  // Motion values to track mouse position
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Transform mouse position into 3D rotation
  const rotateX = useTransform(y, [-150, 150], [10, -10]);
  const rotateY = useTransform(x, [-150, 150], [-10, 10]);
  // Parallax transform for the image
  const imageX = useTransform(x, [-150, 150], [-25, 25]);
  const imageY = useTransform(y, [-150, 150], [-25, 25]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    x.set(e.clientX - (left + width / 2));
    y.set(e.clientY - (top + height / 2));
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };
  
  return (
    <motion.div
      ref={cardRef}
      className="relative w-full h-full rounded-2xl shadow-2xl"
      style={{
        transformStyle: 'preserve-3d',
        rotateX: isCurrent ? rotateX : 0,
        rotateY: isCurrent ? rotateY : 0,
        willChange: 'transform',
      }}
      onMouseMove={isCurrent ? handleMouseMove : undefined}
      onMouseLeave={isCurrent ? handleMouseLeave : undefined}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
    >
      {/* Base card with border and glow */}
      <div className={`absolute inset-0 rounded-2xl bg-black/40 border-2 transition-colors ${isCurrent ? 'border-white/40' : 'border-white/10'}`}>
        {isCurrent && <div className="absolute inset-0 rounded-2xl" style={{boxShadow: `0 0 80px 15px ${destination.accentColor}55`}} />}
      </div>
      
      {/* Parallax Image */}
      <motion.div
        className="absolute inset-4 overflow-hidden rounded-lg"
        style={{ x: imageX, y: imageY, willChange: 'transform' }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      >
        <img src={destination.image} alt={destination.name} className="w-full h-full object-cover" />
      </motion.div>

      {/* Content Layer */}
      <AnimatePresence>
        {isCurrent && (
          <motion.div 
            className="absolute bottom-0 left-0 w-full p-6 text-white bg-gradient-to-t from-black/80 via-black/50 to-transparent"
            initial="exit"
            animate="enter"
            exit="exit"
            variants={{
              enter: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
              exit: { transition: { staggerChildren: 0.05, staggerDirection: -1 } }
            }}
          >
            <motion.h3 variants={{ enter: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 20 } }} className="text-4xl font-bold" style={{textShadow: '0 2px 5px rgba(0,0,0,0.8)'}}>{destination.name}</motion.h3>
            <motion.p variants={{ enter: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 20 } }} className="text-md text-slate-200 mt-2" style={{textShadow: '0 1px 3px rgba(0,0,0,0.8)'}}>{destination.description}</motion.p>
            <motion.button variants={{ enter: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 20 } }} className="mt-4 flex items-center space-x-2 px-4 py-2 font-semibold rounded-lg bg-white/20 backdrop-blur-md hover:bg-white/30 transition-colors">
              <span>Discover Trips</span>
              <FiArrowUpRight />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};


// --- 2. Main Carousel Component ---
const DestinationCarousel = () => {
  const [index, setIndex] = useState(0);

  const handleNext = () => setIndex((prev) => (prev + 1) % DESTINATIONS.length);
  const handlePrev = () => setIndex((prev) => (prev - 1 + DESTINATIONS.length) % DESTINATIONS.length);
  
  return (
    <section className="relative w-full pt-10 h-screen flex flex-col justify-center items-center bg-black overflow-hidden">
      {/* Background Image */}
      <AnimatePresence>
        <motion.div
          key={index}
          className="absolute inset-0 z-0"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1, transition: { duration: 1, ease: [0.42, 0, 0.58, 1] } }}
          exit={{ opacity: 0, scale: 1.1, transition: { duration: 0.8, ease: [0.42, 0, 0.58, 1] } }}
        >
          <img src={DESTINATIONS[index].image} alt="background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        </motion.div>
      </AnimatePresence>

      {/* Title */}
      <h2 className="relative z-10 text-3xl md:text-5xl font-black text-white text-center -mt-24 md:-mt-12" style={{textShadow: '0 4px 20px rgba(0,0,0,0.5)'}}>
        Where to next?
      </h2>

      {/* 3D Carousel Stage */}
      <div className="relative z-10 w-full h-[500px] md:h-[600px]" style={{ perspective: '1200px' }}>
        {DESTINATIONS.map((destination, i) => {
          const offset = i - index;
          const isCurrent = i === index;

          return (
            <motion.div
              key={destination.id}
              className="absolute w-[320px] h-[450px] md:w-[380px] md:h-[530px]"
              style={{
                transformStyle: 'preserve-3d',
                left: '50%',
                top: '50%',
                willChange: 'transform, opacity, filter',
              }}
              animate={{
                x: `calc(-50% + ${offset * 35}%)`,
                y: '-50%',
                scale: isCurrent ? 1 : 0.7,
                rotateY: `${offset * -20}deg`,
                zIndex: DESTINATIONS.length - Math.abs(offset),
                filter: isCurrent ? 'brightness(1)' : 'brightness(0.5)',
              }}
              transition={{ type: 'spring', stiffness: 80, damping: 20 }}
              onClick={() => setIndex(i)}
            >
              <DestinationCard destination={destination} isCurrent={isCurrent} />
            </motion.div>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="absolute bottom-8 md:bottom-12 z-20 flex space-x-6">
        <motion.button onClick={handlePrev} className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white transition-colors hover:bg-white/20" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <FiArrowLeft size={28} />
        </motion.button>
        <motion.button onClick={handleNext} className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white transition-colors hover:bg-white/20" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <FiArrowRight size={28} />
        </motion.button>
      </div>
    </section>
  );
};

export default DestinationCarousel;