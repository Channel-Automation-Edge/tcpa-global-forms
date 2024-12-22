import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-xpurple">
      <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center text-white text-sm">
        <div className="flex space-x-4">
          <a href="/privacy-policy" className="hover:underline">Privacy Policy</a>
          <a href="/cookie-policy" className="hover:underline">Cookie Policy</a>
        </div>
        <div>
          &copy; 2024 Home Project Partners
        </div>
      </div>
    </footer>
  );
};

export default Footer;
