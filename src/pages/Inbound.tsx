import { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTrigger,
  DialogClose, DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AppContext } from '@/context/AppContext';
import InboundForm from '@/components/forms/Inbound/InboundForm';
import useFormPersistence from '@/hooks/useFormPersistence';
import Testimonials from '@/components/Testimonials';
import FAQ from '@/components/FAQ';
import Feature from '@/components/Feature';
import NavQuote from '@/components/NavQuote';

const Inbound = () => {
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const appContext = useContext(AppContext);
  const [, setCurrentStep] = useFormPersistence('InboundStep', 1);
  const navigate = useNavigate();

  if (!appContext) {
    return null;
  }

  const { form } = appContext;
  const navigateWithParams = (path: string) => {
    const currentParams = new URLSearchParams(location.search);
    navigate(`${path}?${currentParams.toString()}`);
  };
  const [slug, setSlug] = useState('');

  useEffect(() => {
    if (appContext && appContext.contractor) {
      setSlug(appContext.contractor.slug);
    }
  }, [appContext, appContext.contractor]);

  // Modal to confirm leaving page
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

  // If form.isBooked, redirect to thank you page
  useEffect(() => {
    if (form.isBooked == true) {
      navigateWithParams(`/summary/${slug}`);
      console.log('form is booked');
      setLoading(false);
    } else {
      console.log('form is not booked');
      setLoading(false);
    }
  }, [form.isBooked]);

  if  (!appContext.services || !appContext.contractor || !appContext.selectedService) {
    return null; // Handle the case where data is not loaded yet
  }

  if (loading) {
    return null;
  }

  return (
    <div className='bg-gray-50'>
      <NavQuote />  
      
      <div className='max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-12 space-y-12 sm:space-y-20 lg:space-y-24'>
        <InboundForm />
        <Testimonials />
        <Feature />
        <FAQ />
      </div>

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
              <Button className='bg-accentColor hover:bg-accentDark mb-2' onClick={handleLeave}>Leave Page</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>


    </div>
  );
};

export default Inbound;
