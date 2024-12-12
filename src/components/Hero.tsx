"use client";
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GradualSpacing from './ui/gradual-spacing';
import { motion } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import NavBar from './NavBar.tsx';
import servicesData from '../assets/assets.json';
import BlurFade from './ui/blur-fade.tsx';
import useFormPersistence from '../hooks/useFormPersistence';
import useClearFormState from '../hooks/useClearFormState';
import supabase from '../lib/supabaseClient'; // Import your Supabase client


const Hero = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const appContext = useContext(AppContext);
  const [, , resetParentCurrentStep] = useFormPersistence('parentFormStep', 1);
  const [, setProjectCurrentStep, resetProjectCurrentStep] = useFormPersistence('projectFormStep', 1);
  const [, , resetDetailsCurrentStep] = useFormPersistence('detailsFormStep', 1);
  const [, , resetAppointmentCurrentStep] = useFormPersistence('appointmentFormStep', 1);
  
  if (!appContext) {
    return null; // Handle the case where appContext is not available
  }

  const {
    firstname,
    setSelectedService,
  } = appContext;

  const [buttonText, setButtonText] = useState("Get a Free Consultation Now");
  const [subheadingText, setSubheadingText] = useState("Or select a service to get started");

  useEffect(() => {
    const selectedService = localStorage.getItem('selectedService');
    if (selectedService && JSON.parse(selectedService) !== 0) {
      setButtonText("Finish your Previous Quote");
      setSubheadingText("Or reset your progress and select another service");
    }
  }, []);

  // Function to append current URL parameters
  const navigateWithParams = (path: string) => {
    const currentParams = new URLSearchParams(location.search);
    navigate(`${path}?${currentParams.toString()}`);
  };

  const clearFormState = useClearFormState();

  const handleServiceSelect = async (id: number) => {
    resetParentCurrentStep();
    resetProjectCurrentStep();
    resetDetailsCurrentStep();
    resetAppointmentCurrentStep();
    
    clearFormState(); // Clear form state
    
    // Set formId and update local storage
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
    appContext.setFormId(formId);

    // Set new service and update local storage
    setSelectedService(id);
    localStorage.setItem('selectedService', JSON.stringify(id));
    console.log('Reset form and setting Initial Service:', id);
    setProjectCurrentStep(2);
    navigateWithParams('/request-quotes');

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const phoneFromUrl = urlParams.get('phone') || null;
      // Check if formId exists in the database
      const { data, error } = await supabase
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
        const { error: updateError } = await supabase
          .from('Forms')
          .update({ updated_at: new Date().toISOString(), optIn_completion: false,
            appointment_completion: false,
            email_optIn: false,
            termsAndPrivacy_optIn: false,
            smsAndCall_optIn: false, })
          .eq('id', formId);

        if (updateError) {
          console.error('Error updating formId:', updateError);
          return;
        }

        console.log(`FormId ${formId} updated.`);
      } else {
        // formId does not exist, insert a new row
        const { error: insertError } = await supabase
          .from('Forms')
          .insert([{ id: formId, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), phone: phoneFromUrl }]);

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

  const handleButtonClick = () => {
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
    appContext.setFormId(formId);
    navigateWithParams('/request-quotes');
  };

  return (
    <div>
      <div className="relative min-h-screen">
        <div className="absolute inset-0 bg-[#21284de0] opacity-100"></div> {/* Overlay */}
        <div className="absolute inset-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            src="https://storage.googleapis.com/channel_automation/Webassets/video/homeprojectparterns-hero_9.0.10.webm"
          ></video>
        </div>

        <div className="relative w-full overflow-hidden">
          <NavBar />
          <div className="z-10 flex items-center justify-center flex-col px-4 mt-0 space-y-[25px]">
            <GradualSpacing
              className="hidden sm:block font-display text-center text-4xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-5xl font-semibold -tracking-widest text-off dark:text-white mt-[120px] md:mt-[160px]"
              text="The Easy Way to Fix Your Home"
            />

            <div className="block sm:hidden">
              <GradualSpacing
                className="font-display text-center text-4xl font-bold -tracking-widest text-off dark:text-white mt-[80px]"
                text="The Easy Way to"
              />
              <GradualSpacing
                className="font-display text-center text-4xl font-bold -tracking-widest text-off dark:text-white"
                text="Fix Your Home"
              />
            </div>

            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 1 }}
              transition={{ delay: 0.6 }}
              className="text-sm sm:text-sm md:text-base lg:text-base text-white/70 max-w-lg lg:max-w-[551px] text-center mt-8 mb-5"
            >
              {firstname ? `${firstname}, connect with trusted contractors who have the skills and experience to get the job done right` : 
              "Connect with trusted contractors who have the skills and experience to get the job done right"}
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 1 }}
              transition={{ delay: 0.6 }}
              className="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-xorange text-xbg transition-transform transform hover:scale-105"
              onClick={handleButtonClick}
              style={{boxShadow: 'rgba(0, 0, 0, 0.07) 0px 22px 30px -8px',
                transition: 'box-shadow 0.3s ease',}}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = 'rgba(255, 81, 0, 0.7) 0px 10px 25px -6px';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'rgba(0, 0, 0, 0.07) 0px 10px 25px -4px';
              }}
            >
              {buttonText}
              <svg
                className="shrink-0 size-4"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </motion.button>

            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 1 }}
              transition={{ delay: 0.6 }}
              className="text-sm sm:text-sm md:text-base lg:text-base text-white/70 max-w-lg lg:max-w-[551px] text-center mt-8 mb-5"
            >
              {subheadingText}
            </motion.p>

            <div className="flex flex-wrap max-w-[1206px] justify-center mt-5 pb-10" style={{ gap: '20px 30px' }}>
              {servicesData.services.map((service, index) => (
                <BlurFade
                  key={service.id}
                  delay={index * 0.15} // Incremental delay for staggered effect
                  inView
                  yOffset={8}
                >
                  <div
                    className="flex flex-row sm:flex-col items-center sm:items-center justify-between sm:justify-center w-full sm:w-[256px] h-[80px] sm:h-[156px] border border-gray-300 rounded-[20px] shadow-md p-4 transition-transform transform hover:scale-105"
                    onClick={() => handleServiceSelect(service.id)}
                    style={{boxShadow: 'rgba(0, 0, 0, 0.07) 0px 22px 30px -8px',
                      transition: 'box-shadow 0.3s ease'}}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = 'rgba(255, 81, 0, 0.7) 0px 10px 25px -6px';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = 'rgba(0, 0, 0, 0.07) 0px 10px 25px -6px';
                    }}
                  >
                    <img
                      src={service.photo}
                      alt={service.name}
                      className="w-12 h-12 sm:w-14 sm:h-14 sm:mb-4 ml-2 mr-4 sm:ml-0 sm:mr-0"
                    />
                    <span className="text-white text-center">{service.name}</span>
                  </div>
                </BlurFade>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
