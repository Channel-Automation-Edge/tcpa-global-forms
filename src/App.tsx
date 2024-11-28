import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home';
import RequestQuote from './pages/RequestQuote';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/request-quotes' element={<RequestQuote />} />
      </Routes>
    </>
  );
}

export default App;

