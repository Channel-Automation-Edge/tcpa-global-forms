import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home';
import RequestQuote from './pages/RequestQuote';
import ThankYou from './pages/ThankYou';

function App() {
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

