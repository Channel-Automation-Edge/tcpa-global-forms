import { useContext } from 'react';
import { AppContext } from '@/context/AppContext';

const Footer: React.FC = () => {
  const appContext = useContext(AppContext);

  if (!appContext) {
    return null;
  }

  const { contractor } = appContext;


  return (
    <footer className="bg-accentDark">
      <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center text-white text-sm">
        <div className="flex space-x-4">
          <a href="/privacy-policy" className="hover:underline">Privacy Policy</a>
          <a href="/cookie-policy" className="hover:underline">Cookie Policy</a>
        </div>
        <div>

          &copy; 2024 {contractor?.name} 
        </div>
      </div>
    </footer>
  );
};

export default Footer;
