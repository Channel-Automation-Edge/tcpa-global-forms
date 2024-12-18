import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.tsx';
import AppContextProvider from './context/AppContext';
import posthog from 'posthog-js';


posthog.init('phc_AiqCxQNd3teE4QZVHRBd9Z3DZTL9otj9h0QK3WnpBLO', {
  api_host:'https://us.i.posthog.com',
  person_profiles: 'identified_only' // or 'always' to create profiles for anonymous users as well
})


createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AppContextProvider>
      <App />
    </AppContextProvider>
  </BrowserRouter>
);
