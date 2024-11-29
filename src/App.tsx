import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home';
import RequestQuote from './pages/RequestQuote';
import ThankYou from './pages/ThankYou';
import "preline/preline";
import { IStaticMethods } from "preline/preline";
import { useEffect } from 'react';
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
      </Routes>
    </>
  );
}

export default App;

