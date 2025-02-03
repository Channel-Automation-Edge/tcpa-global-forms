import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTrigger,
  DialogClose, DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AppContext } from '@/context/AppContext';
import InboundForm from '@/components/forms/Inbound/InboundForm';
import { central, company } from '@/lib/supabaseClient';
import useFormPersistence from '@/hooks/useFormPersistence';
import Testimonials from '@/components/Testimonials';
import HowItWorks from '@/components/HowItWorks';
import FAQ from '@/components/FAQ';
import Feature from '@/components/Feature';
import NavQuote from '@/components/NavQuote';

const Inbound = () => {
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const appContext = useContext(AppContext);
  const [, setCurrentStep] = useFormPersistence('InboundStep', 1);

  if (!appContext) {
    return null;
  }

  const { form, user, setSelectedService, setForm, setUser } = appContext;

  useEffect(() => {
    const handlePopState = () => {
      if (!isModalOpen) {
        setIsModalOpen(true);
        document.getElementById("modal")?.click();
      }
    };

    window.history.pushState(null, '', window.location.pathname + window.location.search);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [location.pathname, location.search, isModalOpen]);

  const handleLeave = () => {
    const params = window.location.search;
    window.location.href = '/inbound' + params;
    setCurrentStep(1);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Fetch service data from URL params
  useEffect(() => {
    const fetchService = async () => {
      const params = new URLSearchParams(location.search);
      const serviceId = params.get('service');

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

      setLoading(false); // Set loading to false after fetching
    };

    fetchService();
  }, [location.search, setSelectedService]);

  // Check if the appointment is already booked if formId is present or changed
  useEffect(() => {
    const checkBookingStatus = async () => {
      if (form.formId) {
        try {
          const { data, error } = await company
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

  if (loading) {
    return null;
  }

  return (
    <div className='bg-gray-50'>
      <NavQuote />  
      <InboundForm />
      {form.isBooked && (<HowItWorks />)}
      <Testimonials />
      <Feature />
      <FAQ />

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <button id='modal' className='hidden'></button>
        </DialogTrigger>
        <DialogTitle></DialogTitle>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <h4 className='text-md font-semibold'>Wait!</h4>
            <DialogDescription>
              Are you sure you want to leave this page? Don't worry, your changes will be saved.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button className='bg-gray-200 hover:bg-gray-300 text-gray-800' onClick={handleCloseModal}>Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button className='bg-accentColor hover:bg-accentDark' onClick={handleLeave}>Leave Page</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>


    </div>
  );
};

export default Inbound;
