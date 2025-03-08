import React from 'react';
import  { useState } from 'react'
function Header() {
  const [language, setLanguage] = useState('en');

  return (
    <header className="bg-pink shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">ASAL Farmer Assistant</h1>
        
        <div className="language-toggle flex">
          <button 
            className={`px-3 py-2 rounded-l-md ${language === 'en' ? 'bg-primary text-white' : 'bg-gray-100'}`}
            onClick={() => setLanguage('en')}
          >
            English
          </button>
          <button 
            className={`px-3 py-2 rounded-r-md ${language === 'sw' ? 'bg-primary text-white' : 'bg-gray-100'}`}
            onClick={() => setLanguage('sw')}
          >
            Kiswahili
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;