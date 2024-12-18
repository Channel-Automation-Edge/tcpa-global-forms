import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '../context/AppContext'; // Ensure AppContext is correctly imported
import supabase from '../lib/supabaseClient';
import useFormPersistence from '../hooks/useFormPersistence';
import useClearFormState from '../hooks/useClearFormState';
import { useNavigate, useLocation } from 'react-router-dom';
import BlurFade from './ui/blur-fade';
import posthog from 'posthog-js';

const ServiceCards: React.FC = () => {
  const [services, setServices] = useState<any[]>([]);
  const supabaseClient = supabase;
  const appContext = useContext(AppContext);
  const selectedService = localStorage.getItem('selectedService');
  const navigate = useNavigate();
  const location = useLocation();
  const clearFormState = useClearFormState();
  const [, , resetParentCurrentStep] = useFormPersistence('parentFormStep', 1);
  const [, setProjectCurrentStep, resetProjectCurrentStep] = useFormPersistence('projectFormStep', 1);
  const [, , resetDetailsCurrentStep] = useFormPersistence('detailsFormStep', 1);
  const [, , resetAppointmentCurrentStep] = useFormPersistence('appointmentFormStep', 1);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await supabaseClient
          .from('Services')
          .select('*');

        if (error) {
          console.error('Error fetching services:', error);
          return;
        }

        setServices(data); // Store fetched services
      } catch (err) {
        console.error('Unexpected error fetching services:', err);
      }
    };

    fetchServices();
  }, [supabaseClient]);

  const handleServiceSelect = async (serviceId: string) => {
    if (!appContext) {
      return;
    }
  
    const { setSelectedService, setFormId } = appContext;
    resetParentCurrentStep();
    resetProjectCurrentStep();
    resetDetailsCurrentStep();
    resetAppointmentCurrentStep();
  
    clearFormState(); // Clear form state
  
    let formId = localStorage.getItem('formID');
    if (!formId) {
      const urlParams = new URLSearchParams(location.search);
      const phone = urlParams.get('phone') || generateRandomString(9);
  
      const dateTime = new Date().toISOString().replace(/[-:.T]/g, '').slice(0, 14); // YYYYMMDDHHMMSS format
      const randomString = generateRandomString(4);
  
      formId = `${phone}-${dateTime}-${randomString}`;
      localStorage.setItem('formID', formId);
      console.log(`formId set: ${formId}`);
    } else {
      console.log(`formId already exists: ${formId}`);
    }
    setFormId(formId);
  
    // Set new service and update local storage
    setSelectedService(serviceId); // Use serviceId here
    localStorage.setItem('selectedService', JSON.stringify(serviceId));
    console.log('Reset form and setting Initial Service:', serviceId);
    setProjectCurrentStep(2);
    navigateWithParams('/request-quotes');  

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const phoneFromUrl = urlParams.get('phone') || null;
      // Check if formId exists in the database
      const { data, error } = await supabaseClient
        .from('Forms')
        .select('id')
        .eq('id', formId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking formId:', error);
        return;
      }

      if (data) {
        // formId exists, update the updated_at column
        const { error: updateError } = await supabaseClient
          .from('Forms')
          .update({
            updated_at: new Date().toISOString(),
            optIn_completion: false,
            appointment_completion: false,
            email_optIn: false,
            termsAndPrivacy_optIn: false,
            smsAndCall_optIn: false,
            service: serviceId,
            phone: phoneFromUrl,
          })
          .eq('id', formId);

        if (updateError) {
          console.error('Error updating formId:', updateError);
          return;
        }

        console.log(`FormId ${formId} updated.`);
      } else {
        // formId does not exist, insert a new row
        const { error: insertError } = await supabaseClient
          .from('Forms')
          .insert([{ id: formId, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), phone: phoneFromUrl, service: serviceId }]);

        if (insertError) {
          console.error('Error inserting formId:', insertError);
          return;
        }

        console.log(`FormId ${formId} inserted with phone: ${phoneFromUrl}`);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      return;
    }
    posthog.capture('service_select', {
      step: 'landing page',
      form_id: formId,
      service_id: serviceId,
      zip: appContext.zip,
    });
    
  };

  // Function to generate a random string
  const generateRandomString = (length: number): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  // Function to append current URL parameters
  const navigateWithParams = (path: string) => {
    const currentParams = new URLSearchParams(location.search);
    navigate(`${path}?${currentParams.toString()}`);
  };

  return (
    <div className="z-10 max-w-[100rem] px-4 py-10 lg:py-14 mx-auto relative bg-white">
        <div className="text-center">
          {selectedService && JSON.parse(selectedService) !== "" ? (

            <BlurFade delay={3 * 0.15}  yOffset={15} className="font-semibold text-2xl md:text-3xl text-gray-800 dark:text-neutral-200 mt-6">
            Or select another <span className="text-xorange">service</span> to reset your progress

            </BlurFade>) : (

            <BlurFade delay={3 * 0.15}  yOffset={15} className="font-semibold text-2xl md:text-3xl text-gray-800 dark:text-neutral-200 mt-6">
            Or select a <span className="text-xorange">service</span> to get started

            </BlurFade>)
          }
          <p className="mt-2 md:mt-4 text-gray-500 dark:text-neutral-500"></p>
        </div>
      <div className="space-y-8">
      <div className="flex flex-wrap justify-center gap-4 sm:gap-[20px]" style={{ marginTop: '15px', width: '100%' }}>
      {services.map((service, index) => (
        <BlurFade
          key={service.id}
          delay={index * 0.1} // Incremental delay for staggered effect
                  inView
                  yOffset={8}
          className="flex flex-row sm:flex-col items-center justify-start sm:justify-center w-full sm:w-[210px] h-[80px] sm:h-[156px] border border-transparent rounded-xl shadow-md p-4 transition-transform transform hover:scale-100 sm:hover:scale-105 bg-white"
          onClick={() => handleServiceSelect(service.id)}
          style={{
            boxShadow: 'rgba(0, 0, 0, 0.07) 0px 22px 30px -6px',
            transition: 'box-shadow 0.3s ease',
            borderColor: 'rgba(157, 176, 197, 0.25)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = 'rgba(255, 81, 0, 0.7) 0px 10px 25px -6px';
            e.currentTarget.style.borderColor = 'rgba(255, 81, 0, 0.7)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'rgba(0, 0, 0, 0.07) 0px 10px 25px -6px';
            e.currentTarget.style.borderColor = 'rgba(157, 176, 197, 0.25)';
          }}
        >
          <img
            src={service.photo}
            alt={service.name}
            className="w-12 h-12 sm:w-14 sm:h-14 sm:mb-4 ml-2 mr-4 sm:ml-0 sm:mr-0"
            
          />
          <span className="text-gray-800 text-base font-medium text-left sm:text-center">{service.name}</span>
        </BlurFade>
      ))}
    </div>
      </div>
    </div>
    
  );
};

export default ServiceCards;
