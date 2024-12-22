import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home';
import RequestQuote from './pages/RequestQuote';
import ThankYou from './pages/ThankYou';
import "preline/preline";
import { IStaticMethods } from "preline/preline";
import { useEffect } from 'react';
import ConfirmDetails from './pages/ConfirmDetails';
import CookiePolicy from './pages/CookiePolicy';
import PrivacyPolicy from './pages/PrivacyPolicy';
declare global {
  interface Window {
    HSStaticMethods: IStaticMethods;
  }
}


function App() {
  const location = useLocation();

  useEffect(() => {
    window.HSStaticMethods.autoInit();
  }, [location.pathname]);
  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/request-quotes' element={<RequestQuote />} />
        <Route path='/thank-you' element={<ThankYou />} />
        <Route path='/confirm-details' element={<ConfirmDetails />} />
        <Route path='/cookie-policy' element={<CookiePolicy />} />
        <Route path='/privacy-policy' element={<PrivacyPolicy />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;

