import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import PopularDestinations from '../Components/Flights/PopularDestination';
import FeatureHighlight from '../Components/Flights/FeatureHighlight';
import FAQFlight from '../Components/Flights/FAQFlight';
import DestinationCarousel from '../Components/Flights/DestinationCarousel';


const InputIcon = ({ children }) => (
  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
    {children}
  </div>
);


// Airline code to name mapping (can be moved to a constants file if large)



export default function Flights() {
  const navigate = useNavigate(); // Initialize navigate hook

  // State management for inputs
  const [originInput, setOriginInput] = useState('');
  const [destinationInput, setDestinationInput] = useState('');
  const [originCode, setOriginCode] = useState('');
  const [destinationCode, setDestinationCode] = useState('');
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [departDate, setDepartDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [oneWay, setOneWay] = useState(true);
  const [loading, setLoading] = useState(false); // Only for the search button animation
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const [error, setError] = useState('');

  // Refs for debouncing autocomplete API calls
  const originTimer = useRef(null);
  const destinationTimer = useRef(null);

  // Fetches city suggestions for autocomplete inputs
  const fetchCitySuggestions = async (input, setSuggestions) => {
    if (input.length < 2) {
      setSuggestions([]);
      return;
    }
    setSuggestionLoading(true);
    try {
      const res = await axios.get('https://autocomplete.travelpayouts.com/places2', {
        params: { term: input, locale: 'en' },
      });
      setSuggestions(res.data || []);
    } catch (err) {
      console.error('Autocomplete error:', err);
    } finally {
      setSuggestionLoading(false);
    }
  };

  // useEffect hooks to trigger autocomplete with a debounce
  useEffect(() => {
    clearTimeout(originTimer.current);
    if (originInput.length < 2) return setOriginSuggestions([]);
    originTimer.current = setTimeout(() => {
      fetchCitySuggestions(originInput, setOriginSuggestions);
    }, 500);
  }, [originInput]);

  useEffect(() => {
    clearTimeout(destinationTimer.current);
    if (destinationInput.length < 2) return setDestinationSuggestions([]);
    destinationTimer.current = setTimeout(() => {
      fetchCitySuggestions(destinationInput, setDestinationSuggestions);
    }, 500);
  }, [destinationInput]);

  // Handlers for selecting a city from suggestions
  const selectOrigin = (city) => {
    setOriginInput(`${city.name}, ${city.country_name}`);
    setOriginCode(city.code);
    setOriginSuggestions([]);
  };

  const selectDestination = (city) => {
    setDestinationInput(`${city.name}, ${city.country_name}`);
    setDestinationCode(city.code);
    setDestinationSuggestions([]);
  };

  // Main function to search for flights - now navigates
  const handleSearch = () => {
    if (!originCode || !destinationCode || !departDate) {
      setError('Please fill in Origin, Destination, and Departure Date.');
      return;
    }

    setLoading(true); // Indicate loading for the button
    setError('');

    // Navigate to the results page, passing the search parameters as state
    navigate('/flights/results', {
      state: {
        origin: originCode,
        destination: destinationCode,
        depart_date: departDate,
        return_date: oneWay ? undefined : returnDate,
        one_way: oneWay,
        originInput: originInput, // Pass full names for display on results page
        destinationInput: destinationInput,
      },
    });

    setLoading(false); // Reset loading state after navigation (component will unmount/remount)
  };


  return (
    <>
    <div className=" bg-gradient-to-br from-teal-400 via-purple-500 to-indigo-800 text-slate-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto mt-20">
        {/* --- SEARCH PANEL --- */}
        <div className="bg-white/100 backdrop-blur-lg p-6  rounded-2xl shadow-lg border border-white/30 mb-8">
          <h1 className="text-4xl font-bold mb-2 text-slate-900">Find Your Next Flight</h1>
          <p className="text-slate-600 mb-6">Enter your travel details to begin.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* From */}
            <div className="relative">
               <InputIcon>
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
               </InputIcon>
               <input type="text" placeholder="From" value={originInput} onChange={(e) => setOriginInput(e.target.value)} className="w-full border-slate-300 pl-10 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"/>
               {suggestionLoading && originSuggestions.length === 0 && <div className="absolute right-4 top-2.5 text-gray-400 animate-spin">⏳</div>}
               {originSuggestions.length > 0 && (
                 <ul className="absolute bg-white border w-full mt-1 max-h-48 overflow-y-auto z-20 shadow-lg rounded-md">
                   {originSuggestions.map((city, i) => (
                     <li key={i} className="p-2 hover:bg-blue-50 cursor-pointer" onClick={() => selectOrigin(city)}>
                       {city.name}, {city.country_name} ({city.code})
                     </li>
                   ))}
                 </ul>
               )}
            </div>
            {/* To */}
            <div className="relative">
              <InputIcon>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 -rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                </InputIcon>
                <input type="text" placeholder="To" value={destinationInput} onChange={(e) => setDestinationInput(e.target.value)} className="w-full border-slate-300 pl-10 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"/>
                {suggestionLoading && destinationSuggestions.length === 0 && <div className="absolute right-4 top-2.5 text-gray-400 animate-spin">⏳</div>}
                {destinationSuggestions.length > 0 && (
                   <ul className="absolute bg-white border w-full mt-1 max-h-48 overflow-y-auto z-20 shadow-lg rounded-md">
                   {destinationSuggestions.map((city, i) => (
                     <li key={i} className="p-2 hover:bg-blue-50 cursor-pointer" onClick={() => selectDestination(city)}>
                       {city.name}, {city.country_name} ({city.code})
                     </li>
                   ))}
                 </ul>
               )}
            </div>
            {/* Depart & Return Dates */}
            <div className="relative">
              <InputIcon><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></InputIcon>
              <input type="date" value={departDate} onChange={(e) => setDepartDate(e.target.value)} className="w-full border-slate-300 pl-10 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"/>
            </div>
            <div className="relative">
              <InputIcon><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></InputIcon>
              <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} disabled={oneWay} className="w-full border-slate-300 pl-10 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:bg-slate-100 disabled:cursor-not-allowed"/>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                  <div className="relative">
                      <input type="checkbox" checked={!oneWay} onChange={() => setOneWay(!oneWay)} className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </div>
                  <span className="font-medium text-slate-700">Round Trip</span>
              </label>
              <button onClick={handleSearch} className="w-full sm:w-auto  bg-gradient-to-br from-indigo-700 via-purple-500 to-blue-500  text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-2 font-semibold" disabled={loading}>
                  {loading ? (
                  <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Searching...
                  </>
                  ) : (
                  <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                      Search Flights
                  </>
                  )}
              </button>
          </div>
        </div>
      </div>
    </div>
    <DestinationCarousel/>
    <PopularDestinations/>
    
    <FeatureHighlight/>
    <FAQFlight/>
    </>
  );
}