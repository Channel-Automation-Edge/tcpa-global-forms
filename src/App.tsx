import { Routes, Route, useLocation } from 'react-router-dom';
import "preline/preline";
import { IStaticMethods } from "preline/preline";
import { useContext, useEffect, useState } from 'react';
import "vanilla-cookieconsent/dist/cookieconsent.css";
import {central} from '@/lib/supabaseClient';
import { AppContext } from '@/context/AppContext';
import Inbound from './pages/Inbound';
import ThankYou from './components/forms/Inbound/ThankYou';

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
  const serviceId = params.get('service');

  if (!appContext) {
    return null;
  }

  const { setContractor, setServices, setLocations, contractor, setSelectedService, form, setForm, setUser, user } = appContext;

  useEffect(() => {
    window.HSStaticMethods.autoInit();
  }, [location.pathname]);

  // Fetch contractor data, services, locations, and selected service
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
            
            // Fetch selected service
            if (serviceId) {
              try {
                const { data, error } = await central
                  .from('services')
                  .select('*')
                  .eq('id', serviceId)
                  .single();
      
                if (error) {
                  console.error('Error fetching service:', error);
                } else {
                  setSelectedService(data);
                }
              } catch (err) {
                console.error('Unexpected error:', err);
              }
            }
            setLoading(false)
          }
        } catch (err) {
          console.error('Unexpected error fetching data:', err);
          return;
        }
    };
    fetchInitialData();
  }, [location.search]);

  // Update the document title and favicon
  useEffect(() => {
    if (contractor) {
      document.title = contractor.name;
      const favicon = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
      if (favicon) {
        favicon.href = contractor.favicon;
      } else {
        const newFavicon = document.createElement('link');
        newFavicon.rel = 'icon';
        newFavicon.href = contractor.favicon;
        document.head.appendChild(newFavicon);
      }
    }
  }, [contractor]);

  // Check if the appointment is already booked if formId is present or changed
  useEffect(() => {
    const checkBookingStatus = async () => {
      if (form.formId) {
        try {
          const { data, error } = await central
            .from('bookings') 
            .select('*')
            .eq('id', form.formId)
            .single();

          if (error) {
            console.error('Error fetching appointment:', error);
            
          } else {
            // form is already booked, save to form
            setForm(prevForm => ({
                ...prevForm,
                formId: data.id,
                serviceSpecification: data.service_specification,
                promo: data.promo,
                generalOptIn: data.opt_in,
                date: data.date,
                time: data.time,
                isBooked: data.is_booked,
            }));

            setUser(prevUser => ({ 
                ...prevUser,
                firstname: data.firstname,
                lastname: data.lastname,
                email: data.email,
                phone: data.phone,
                zip: data.zip,
                address1: data.address1,
                address2: data.address2,
                city: data.city,
                state: data.state,
                userNs: data.user_ns,
            }));
            
          }
        } catch (err) {
          console.error('Unexpected error:', err);
          
        }
      } else {
      }
    };

    checkBookingStatus();
  }, [form.formId]);

  // fetch zip if user.zip is present or changed
  useEffect(() => {
    const fetchZip = async () => {
      if (user.zip) {
        try {
          const { data, error } = await central
            .from('zips')
            .select('*')
            .eq('zip', user.zip)
            .single();

          if (error) {
            console.error('Error fetching zip:', error);
          } else {
            setUser(prevUser => ({
              ...prevUser,
              city: data.city,
              state: data.state_id,
              timezone: data.timezone,
            }));
          }
        } catch (err) {
          console.error('Unexpected error:', err);
        }
      }
    };

    fetchZip();
  }, [user.zip]);

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
        <Route path='/:slug' element={<Inbound />} />
        <Route path='/summary/:slug' element={<ThankYou />} />
        <Route path="*" element={<Inbound />} />
      </Routes>
    </>
  );
}

export default App;
