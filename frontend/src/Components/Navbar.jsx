import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import home from "../assets/image.png"

const Navbar = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024); // Changed breakpoint to lg for consistency

  const mainNavRef = useRef(null);
  const [mainNavHeight, setMainNavHeight] = useState(0);

  const navItems = [
    { name: "Flights", icon: "✈️", path: "/" },
    { name: "Hotels", icon: "🏨", path: "/hotels" },
    { name: "Homestays", icon: <img src={home} alt="" width={30} />, path: "/homestays" },
    { name: "Holidays", icon: "🌴", path: "/holiday-packages" },
    { name: "Trains", icon: "🚆", path: "/trains" },
    { name: "Buses", icon: "🚌", path: "/buses" },
    { name: "Cabs", icon: "🚕", path: "/cabs" },
    { name: "Attractions", icon: "🎡", path: "/tours" },
    { name: "Visa", icon: "🛂", path: "/visa" },
    { name: "Cruise", icon: "🛳️", path: "/cruise" },
    { name: "Forex", icon: "💵", path: "/forex" },
    { name: "Insurance", icon: "🛡️", path: "/insurance" },
  ];

  useEffect(() => {
    const currentPath = location.pathname;
    const currentItem = navItems.find((item) => item.path === currentPath);
    if (currentItem) {
      setActiveTab(currentItem.name);
    }
    // Close mobile menu on navigation
    setIsMobileMenuOpen(false); 
  }, [location.pathname]);

  useEffect(() => {
    // --- FIX: Changed breakpoint to 1024px (lg) to match layout change ---
    const handleResize = () => {
        setIsMobile(window.innerWidth < 1024); 
        if (mainNavRef.current) {
            setMainNavHeight(mainNavRef.current.offsetHeight);
        }
    };
    
    const handleScroll = () => setIsScrolled(window.scrollY > 50);

    // Set initial height
    if (mainNavRef.current) {
        setMainNavHeight(mainNavRef.current.offsetHeight);
    }

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Fixed scroll behavior now applies on non-mobile (lg screens and up)
  const shouldBeFixed = !isMobile && isScrolled;

  return (
    <>
      <style>
        {`
          @keyframes left-to-right {
            from { width: 0; }
            to { width: 100%; }
          }
          .animate-left-to-right {
            animation: left-to-right 0.3s ease-out forwards;
          }
        `}
      </style>

      {/* --- FIX 1: Conditionally increase z-index when mobile menu is open --- */}
      {/* This ensures the dropdown appears above the icon navigation bar. */}
      <div className={`bg-white shadow-md relative ${isMobileMenuOpen ? 'z-[60]' : 'z-40'}`}>
        <div className="flex items-center justify-between p-2 px-4 md:px-8 bg-gray-100">
          {/* Logo */}
          <div className="flex items-center space-x-2 md:space-x-6">
            <Link to="/" className="flex items-center space-x-1">
              <span className="text-xl font-bold text-red-500">Go</span>
              <span className="text-xl font-bold">On</span>
              <span className="text-xl font-bold text-red-500">Trip</span>
            </Link>
            <div className="hidden lg:flex items-center space-x-6">
              <Link to="/list-property" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-200">
                <span className="text-md">List Your Property</span>
              </Link>
              <Link to="/mybiz" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-200">
                <span className="text-md">Introducing myBiz</span>
                <span className="text-xs text-white bg-blue-500 rounded-full px-2">new</span>
              </Link>
            </div>
          </div>

          {/* Right Side */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link to="/my-trips" className="text-md hover:underline">My Trips</Link>
            <Link to="/login" className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-md">Login/Register</Link>
            <div className="flex items-center space-x-1 cursor-pointer">
              <span className="text-md">INR</span><span>▼</span>
            </div>
          </div>

          {/* Mobile Menu Button - shows on screens smaller than lg (1024px) */}
          <div className="lg:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-700 focus:outline-none">
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white shadow-lg lg:hidden p-4">
             <div className="flex flex-col space-y-4">
              <Link to="/list-property" className="p-2 rounded-lg hover:bg-gray-200">List Your Property</Link>
              <Link to="/mybiz" className="p-2 rounded-lg hover:bg-gray-200">Introducing myBiz</Link>
              <Link to="/my-trips" className="p-2 rounded-lg hover:bg-gray-200">My Trips</Link>
              <Link to="/login" className="w-full text-center px-4 py-2 text-white bg-blue-600 rounded-md">Login/Register</Link>
            </div>
          </div>
        )}
      </div>

      {/* Placeholder for fixed nav */}
      <div style={{ height: shouldBeFixed ? mainNavHeight : 0 }} />

      {/* Main Nav (Icon Bar) */}
      <div
        ref={mainNavRef}
        className={`w-full flex justify-center bg-white shadow-md transition-all duration-300 ease-in-out z-50 ${
          shouldBeFixed
            ? "fixed top-0 left-0 py-2"
            : "relative py-3 md:py-4"
        }`}
      >
        {/* --- FIX 2: Adjusted responsive grid and flex classes --- */}
        {/* - grid-cols-4 for mobile (< 768px) */}
        {/* - md:grid-cols-6 for tablet (>= 768px) -> This fixes the 800px view */}
        {/* - lg:flex for desktop (>= 1024px) */}
        <div className="grid grid-cols-4 gap-y-3 gap-x-1 w-full px-2 md:grid-cols-6 lg:flex lg:w-auto lg:space-x-4 lg:gap-0 lg:px-0">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setActiveTab(item.name)}
              className={`relative flex flex-col items-center p-1 text-center text-gray-900 transition-colors duration-200 hover:text-blue-500 ${
                activeTab === item.name ? "text-blue-600" : ""
              }`}
            >
              <div className="text-xl md:text-2xl">{item.icon}</div>
              <span className="mt-1 text-xs leading-tight md:text-sm md:leading-normal">
                {item.name}
              </span>
              {activeTab === item.name && (
                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-blue-600 rounded-t-sm animate-left-to-right"></div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Navbar;