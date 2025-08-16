import React from 'react';

const PopularDestinations = () => {
  const destinations = [
    { name: 'Paris', image: 'https://placehold.co/400x300/F06292/FFFFFF?text=Paris', price: '450' },
    { name: 'Tokyo', image: 'https://placehold.co/400x300/BA68C8/FFFFFF?text=Tokyo', price: '700' },
    { name: 'New York', image: 'https://placehold.co/400x300/4FC3F7/FFFFFF?text=New+York', price: '380' },
    { name: 'Sydney', image: 'https://placehold.co/400x300/81C784/FFFFFF?text=Sydney', price: '950' },
    { name: 'Dubai', image: 'https://placehold.co/400x300/FFD54F/FFFFFF?text=Dubai', price: '550' },
    { name: 'London', image: 'https://placehold.co/400x300/FF8A65/FFFFFF?text=London', price: '420' },
  ];

  return (
    <>
      <style>
        {`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeInUp {
            animation: fadeInUp 0.5s ease-out forwards;
          }
        `}
      </style>
      <div className="mb-12 mt-10 max-w-7xl m-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 text-center animate-fadeInUp">
          Popular Destinations
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((destination, index) => (
            <div
              key={destination.name}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group animate-fadeInUp"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <img
                src={destination.image}
                alt={destination.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="p-5">
                <h3 className="text-xl font-semibold text-slate-800 mb-2">{destination.name}</h3>
                <p className="text-slate-600 text-sm">Flights starting from</p>
                <p className="text-2xl font-bold text-blue-600 mt-2">${destination.price}</p>
                <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300">
                  View Flights
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default PopularDestinations;
