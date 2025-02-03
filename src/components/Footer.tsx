import { useContext, useEffect, useState } from 'react';
import { AppContext } from '@/context/AppContext';
import { useLocation } from 'react-router-dom';

const Footer: React.FC = () => {
  const appContext = useContext(AppContext);

  if (!appContext) {
    return null;
  }

  const { contractor } = appContext;
  const [slug, setSlug] = useState('');
  const location = useLocation();
  const currentParams = new URLSearchParams(location.search);
      
  useEffect(() => {
    if (appContext && appContext.contractor) {
      setSlug(appContext.contractor.slug);
    }
  }, [appContext, appContext.contractor]);


  return (
    <footer className="bg-accentDark">
      <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center text-white text-sm">
        <div className="flex space-x-4">
          <a href={`/privacy-policy/${slug}?${currentParams.toString()}`} className="hover:underline">Privacy Policy</a>
          <a href={`/cookie-policy/${slug}?${currentParams.toString()}`}  className="hover:underline">Cookie Policy</a>
        </div>
        <div>

          &copy; 2024 {contractor?.name} 
        </div>
      </div>
    </footer>
  );
};

export default Footer;
