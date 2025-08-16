import React from 'react';

const FeatureHighlight = () => {
  const features = [
    {
      title: 'Best Price Guarantee',
      description: 'Find the lowest fares with our intelligent price comparison engine.',
      icon: '💰'
    },
    {
      title: '24/7 Customer Support',
      description: 'Our dedicated team is here to assist you anytime, anywhere.',
      icon: '📞'
    },
    {
      title: 'Easy Booking Process',
      description: 'Book your flights in just a few clicks, hassle-free.',
      icon: '✨'
    },
    {
      title: 'Secure Payments',
      description: 'Your transactions are safe and secure with our advanced encryption.',
      icon: '🔒'
    },
  ];

  return (
    <>
      <style>
        {`
          @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-scaleIn {
            animation: scaleIn 0.6s ease-out forwards;
          }
        `}
      </style>
      <div className="mb-12 bg-white/60 backdrop-blur-lg p-8 max-w-7xl m-auto rounded-2xl shadow-lg border border-white/30">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-10 text-center animate-fadeIn">
          Why Book With Us?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="text-center p-6 bg-blue-50 rounded-xl shadow-md transform hover:scale-105 transition-transform duration-300 animate-scaleIn"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">{feature.title}</h3>
              <p className="text-slate-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default FeatureHighlight;