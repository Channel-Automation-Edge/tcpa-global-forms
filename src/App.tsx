import { Routes, Route, useLocation } from 'react-router-dom';
import "preline/preline";
import { IStaticMethods } from "preline/preline";
import { useContext, useEffect, useState } from 'react';
import "vanilla-cookieconsent/dist/cookieconsent.css";
import {central} from '@/lib/supabaseClient';
import { AppContext } from '@/context/AppContext';
import Inbound from './pages/Inbound';

declare global {
  interface Window {
    HSStaticMethods: IStaticMethods;
  }
}

function App() {
  const location = useLocation();
  const appContext = useContext(AppContext);
  const [loading, setLoading] = useState(false); // State to control rendering
  const params = new URLSearchParams(location.search);
  const companyId = params.get('company_id');

  if (!appContext) {
    return null;
  }

  const { setContractor, setServices, setLocations } = appContext;

  useEffect(() => {
    window.HSStaticMethods.autoInit();
  }, [location.pathname]);

  useEffect(() => {
    const fetchInitialData = async () => {
      const storedContractor = localStorage.getItem('contractor');
      const storedServices = localStorage.getItem('services');
      const storedLocations = localStorage.getItem('locations');

      if (storedContractor && storedServices && storedLocations) {
        // Load from local storage
        setContractor(JSON.parse(storedContractor));
        setServices(JSON.parse(storedServices));
        setLocations(JSON.parse(storedLocations));
        setLoading(false);
      } 
        // Fetch contractor
        console.log('Fetching contractor data...');
        try {
          const { data, error } = await central
            .from('contractors')
            .select('*')
            .eq('id', companyId)
            .single();

          if (error) {
            return;
          }
          if (data) {
            console.log('Contractor data fetched:', data);
            setContractor(data);
            localStorage.setItem('contractor', JSON.stringify(data));

            // Fetch services
            const { data: servicesData, error: servicesError } = await central
            .from('contractor_services')
            .select('*, services(name)')
            .eq('contractor_id', companyId);

            if (servicesError) {
              console.error('Error fetching services:', servicesError);
            } else {
              setServices(servicesData || []);
              localStorage.setItem('services', JSON.stringify(servicesData || []));
              console.log('Services fetched successfully');
            }

            // Fetch locations
            const { data: locationsData, error: locationsError } = await central
            .from('contractor_locations')
            .select('*')
            .eq('contractor_id', companyId);

            if (locationsError) {
              console.error('Error fetching locations:', locationsError);
            } else {
              setLocations(locationsData || []);
              localStorage.setItem('locations', JSON.stringify(locationsData || []));
              console.log('Locations fetched successfully');
            }
            setLoading(false);
          }
        } catch (err) {
          console.error('Unexpected error fetching data:', err);
          return;
        }
    };
    fetchInitialData();
  }, [companyId, setContractor, setServices, setLocations]);

  // log in console
  useEffect(() => {
    console.log('contractor', appContext.contractor);
    console.log('services', appContext.services);
    console.log('locations', appContext.locations);
    console.log('form', appContext.form);
    console.log('user', appContext.user);
  }
  , [appContext]);

  // Set custom colors from contractor data
  useEffect(() => {
    if (appContext && appContext.contractor && appContext.contractor.colors) {
      const accentColor = appContext.contractor.colors.accent || '#FA5100'; 
      const light = appContext.contractor.colors.light || '#E6E9FD';
      const dark = appContext.contractor.colors.dark || '#000000';
      const darker = appContext.contractor.colors.darker || '#000000';
      document.documentElement.style.setProperty('--light', light);
      document.documentElement.style.setProperty('--accent', accentColor);
      document.documentElement.style.setProperty('--darker', darker);
      document.documentElement.style.setProperty('--dark', dark);
    }
  }, [appContext]);

  if (loading) {
    return null; // Render nothing while loading
  }

  return (
    <>
      <Routes>
        <Route path='/' element={<Inbound />} />
        <Route path="*" element={<Inbound />} />
      </Routes>
    </>
  );
}

export default App;
