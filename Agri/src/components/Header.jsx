import React from 'react';
import Logo from "./../assets/Agr Fikia.png";

function Header() {
  const [language, setLanguage] = React.useState('en');

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Replace text with logo */}
        <img src={Logo} alt="AgriFikia Logo" className="h-20 w-auto" />

        <div className="language-toggle flex">
          <button 
            className={`px-3 py-2 rounded-l-md ${language === 'en' ? 'bg-green-400 text-black' : 'bg-green-100'}`}
            onClick={() => setLanguage('en')}
          >
            English
          </button>
          <button 
            className={`px-3 py-2 rounded-r-md ${language === 'sw' ? 'bg-green-400 text-black' : 'bg-green-100'}`}
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
