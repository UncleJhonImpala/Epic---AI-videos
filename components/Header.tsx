import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center mb-8">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 animate-gradient-text">
        Epic - AI Animations
      </h1>
      <p className="text-gray-400 mt-2 text-lg">Just toss a picture in and I'll make it a video.</p>
    </header>
  );
};

export default Header;