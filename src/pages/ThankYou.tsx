  "use client";
  import React, { useRef, useEffect, useState, useContext } from 'react';
  import { useNavigate } from 'react-router-dom';
  import type { ConfettiRef } from '@/components/ui/confetti';
  import Confetti from '@/components/ui/confetti';
  import HowItWorks from '@/components/HowItWorks';
  import NavBar from '@/components/NavBar';
  import GradualSpacing from '@/components/ui/gradual-spacing';
  import { motion } from 'framer-motion';
  import { AppContext } from '../context/AppContext';
  import Footer from '@/components/Footer';
  import BlurFade from '@/components/ui/blur-fade';
  import HeroVideoDialog from '@/components/ui/hero-video-dialog';
  import supabase from '../lib/supabaseClient';

  const ThankYou: React.FC = () => {
    const appContext = useContext(AppContext);
    const [servicePhoto, setServicePhoto] = useState<string>('');
    const [serviceName, setServiceName] = useState<string>('');
    const [foramttedPhone, setFormattedPhone] = useState<string>(''); 

    if (!appContext) {
      return null; // Handle the case where appContext is not available
    }

    const navigate = useNavigate();
    const confettiRef = useRef<ConfettiRef>(null);
    const {
      selectedService,
      matchingContractors,
      zip,
      state,
      contractorPreferences,
      firstname,
      lastname,
      email,
      phone,
      serviceSpecification,
      numberOfQuotes,
      scheduledAppointments,
      setSelectedService,
      setMatchingContractors,
      setZip,
      setState,
      setContractorPreferences,
      setFirstname,
      setLastname,
      setEmail,
      setPhone,
      setGeneralOptIn,
      setServiceSpecification,
      setPromo,
      setConsentedContractors,
      setNumberOfQuotes,
      setTermsAndPrivacyOptIn,
      setNewsletterOptIn,
      setScheduledAppointments,
      setContactPreferences,
      address1,
      address2,
      city,
      setAddress1,
      setAddress2,
      setCity,
    } = appContext;

    useEffect(() => {
      const loadFromLocalStorage = (key: string, setValue: (value: any) => void, defaultValue: any) => {
        const savedValue = localStorage.getItem(key);
        if (savedValue !== null) {
          setValue(JSON.parse(savedValue));
        } else {
          setValue(defaultValue);
        }
      };
  
      loadFromLocalStorage('firstname', setFirstname, '');
      loadFromLocalStorage('lastname', setLastname, '');
      loadFromLocalStorage('email', setEmail, '');
      loadFromLocalStorage('phone', setPhone, '');
      loadFromLocalStorage('zip', setZip, '');
      loadFromLocalStorage('state', setState, '');
      loadFromLocalStorage('address1', setAddress1, '');
      loadFromLocalStorage('address2', setAddress2, '');
      loadFromLocalStorage('city', setCity, '');
  
      loadFromLocalStorage('selectedService', setSelectedService, '');
      loadFromLocalStorage('serviceSpecification', setServiceSpecification, []);
      loadFromLocalStorage('contractorPreferences', setContractorPreferences, []);
      loadFromLocalStorage('promo', setPromo, false);
      loadFromLocalStorage('numberOfQuotes', setNumberOfQuotes, 0);
  
      loadFromLocalStorage('generalOptIn', setGeneralOptIn, false);
      loadFromLocalStorage('termsAndPrivacyOptIn', setTermsAndPrivacyOptIn, false);
      loadFromLocalStorage('newsletterOptIn', setNewsletterOptIn, false);
      
      loadFromLocalStorage('scheduledAppointments', setScheduledAppointments, []);
      loadFromLocalStorage('matchingContractors', setMatchingContractors, []);
      loadFromLocalStorage('consentedContractors', setConsentedContractors, []);
      loadFromLocalStorage('contactPreferences', setContactPreferences, []);
  
    }, []);

    useEffect(() => {
      
      // Trigger confetti
      confettiRef.current?.fire({});

      // Override the back button to redirect to "/"
      const handlePopState = () => {
        const params = window.location.search; // Get current URL parameters
        navigate('/' + params); // Redirect to home with existing URL parameters
      };

      window.addEventListener('popstate', handlePopState);

      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }, [navigate]);

    useEffect(() => {
      const fetchServiceDetails = async () => {
        const { data, error } = await supabase
          .from('Services')
          .select('photo, name')
          .eq('id', selectedService)
          .single();
        
        if (error) {
          console.error('Error fetching service details:', error);
        } else {
          setServicePhoto(data.photo);
          setServiceName(data.name);
        }
      };
    
      if (selectedService) {
        fetchServiceDetails();
      }

      setFormattedPhone(formatPhoneNumber(phone || ''));

    }, [phone]);

    
    const handleGoHome = () => {
      localStorage.removeItem('summaryContractors');
      localStorage.removeItem('summaryPreferences');
      const params = window.location.search; // Get current URL parameters
      navigate('/' + params); // Redirect to home with existing URL parameters

    };

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(date);
    };
    
    const formatTime = (timeString:string) => {
      // Use a regular expression to capture the hour and the period (am/pm)
      const match = timeString.match(/(\d+)(am|pm)/i);
      if (!match) {
        return timeString; // Return the original string if it doesn't match the expected format
      }
      
      const hour = parseInt(match[1], 10);
      const period = match[2].toUpperCase();
      
      // Format the time as "1:00 AM" or "11:00 PM"
      return `${hour}:00 ${period}`;
    };

    const formatPhoneNumber = (phone:string) => {
      if (!phone || phone.length !== 10) {
        return phone; // Return the original value if it's not a 10-digit number
      }
    
      const areaCode = phone.slice(0, 3);
      const centralOfficeCode = phone.slice(3, 6);
      const lineNumber = phone.slice(6);
    
      return `+1 (${areaCode}) ${centralOfficeCode}-${lineNumber}`;
    };


    const renderContractorCards = () => (
      <div className="mt-6 space-y-4">
        {matchingContractors.map((contractor) => (
          <div
            key={contractor.id}
            className="p-4 border rounded-lg shadow-sm bg-white dark:bg-neutral-800 dark:border-neutral-700 flex flex-col md:flex-row items-left max-w-[45rem] mx-auto"
          >
            <div className="flex items-center mb-4 md:mb-0 md:mr-4 min-w-52">
              <img src={contractor.logo} alt={contractor.name} className="w-16 h-16 rounded-full" />
              <div className="px-8">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">{contractor.name}</h3>
                <p className="text-sm text-gray-600 dark:text-neutral-400">{contractor.zip}, {contractor.state}</p>
              </div>
            </div>
            <div className="flex-grow text-center ml-0 md:ml-3 flex md:items-center">
              <div className="flex flex-wrap gap-2 justify-start">
                {contractorPreferences.map((pref, idx) => (
                  <span
                    key={idx}
                    className="py-1 px-2 inline-flex items-center gap-x-1 text-xs font-medium bg-teal-100 text-teal-800 rounded-full dark:bg-teal-500/10 dark:text-teal-500"
                  >
                    <svg
                      className="shrink-0"
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                      <path d="m9 12 2 2 4-4"></path>
                    </svg>
                    {pref}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );

    return (
      <div className='bg-white relative'>
        {/* hero */}
        <div className="relative bg-[url('/images/hero.jpg')] bg-cover bg-center z-10">
          <div className="absolute inset-0 bg-[#12121d99] opacity-100"></div> {/* Overlay */}

          <div className="relative w-full overflow-hidden z-20">
            <NavBar />
            <div className="z-10 pb-12 md:pb-14 lg:pb-16 flex items-center justify-center flex-col px-4 mt-0 space-y-[25px]">
              <GradualSpacing
                className="hidden sm:block font-display text-center text-4xl  sm:text-4xl md:text-5xl lg:text-5xl xl:text-5xl font-semibold -tracking-widest text-white dark:text-white mt-14 lg:mt-20"
                text="Your Dream Project is Taking Shape!"
              />

              <div className="block sm:hidden">
                <GradualSpacing
                  className="font-display text-center text-[32px] font-bold -tracking-widest text-white dark:text-white mt-4"
                  text="Your Dream Project"
                />
                <GradualSpacing
                  className="font-display text-center text-[32px] font-bold -tracking-widest text-white dark:text-white"
                  text="is Taking Shape"
                />
              </div>

              <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 1 }}
                transition={{ delay: 0.6 }}
                className="text-sm sm:text-sm md:text-base lg:text-base text-white/80 max-w-lg lg:max-w-[551px] text-center pb-4"
              >
                Here's an overview of your consultation details. Take a moment to review everything and make sure everything looks great
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 1 }}
                transition={{ delay: 0.6 }}
                className="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-xorange text-xbg transition-transform transform hover:scale-105 relative mb-10"
                onClick={handleGoHome}
                style={{
                  boxShadow: 'rgba(0, 0, 0, 0.07) 0px 22px 30px -8px',
                  transition: 'box-shadow 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = 'rgba(255, 81, 0, 0.7) 0px 10px 25px -6px';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'rgba(0, 0, 0, 0.07) 0px 10px 25px -4px';
                }}
              >
                Go to Home Page
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
            </div>
          </div>
        </div>
        {/* end of hero */}

        <Confetti
          ref={confettiRef}
          className="absolute left-0 top-0 z-50 w-full h-full pointer-events-none"
        />
        <HowItWorks />
        <BlurFade delay={3 * 0.15} inView yOffset={15} className='text-center'>
          <h2 className="font-semibold text-2xl md:text-3xl text-gray-800 dark:text-neutral-200 mt-8">
          Please Review Your <span className="text-xorange">Details</span>
          </h2>
        </BlurFade>
        <div className="flex justify-center mt-10"> 
          <BlurFade delay={4 * 0.15} inView yOffset={15} className="flex flex-wrap gap-4 max-w-screen-lg w-full px-4 sm:px-8">
            <div className="flex flex-col gap-4 flex-grow min-w-[250px] max-w-[100%] sm:w-[calc(50%-1rem)]">
            <div className="border border-gray-200 rounded-md">
              <div className="text-left mx-4 my-4">
                <p className="text-lg font-semibold text-gray-800 mb-4">Project Specification</p>
                {/* <p className="text-base font-normal text-gray-600 mb-4">Your future project details</p> */}
                <div className="flex items-center mb-4 ml-8 min-w-52">
                  <img src={servicePhoto} className="w-14 h-14" />
                  <div className="px-8 flex items-center flex-grow justify-between">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{serviceName} Service</h3>
                    <span className="max-w-40 truncate whitespace-nowrap inline-block py-1.5 px-3 rounded-lg text-xs font-medium bg-orange-100 text-xorange ml-auto">
                      {serviceSpecification}
                    </span>
                  </div>
                </div>
              </div>
            </div>
              <div className="border border-gray-200 rounded-md h-auto">
                <div className='text-left mx-4 my-4'>
                  <p className='text-lg font-semibold text-gray-800 mb-4'>Consultation Details</p>
                  <p className='text-base font-normal text-gray-600 mb-4'>You scheduled {numberOfQuotes} {numberOfQuotes > 1 ? 'consultations' : 'consultation'}</p>
                  {scheduledAppointments.map((appointment, index) => (
                    <div key={index} className="flex flex-wrap justify-between mt-4 w-auto bg-gray-100 rounded-md py-4">
                      <div className="flex items-center px-8 min-w-[200px]">
                        <img src="/images/calendar.svg" alt="Calendar" className="inline mr-2 h-5" />
                        <p className="text-base text-gray-800">{formatDate(appointment.date)}</p>
                      </div>
                      <div className="flex items-center px-8">
                        <img src="/images/clock.svg" alt="Clock" className="inline mr-2 h-5" />
                        <p className="text-base text-gray-800">{formatTime(appointment.time)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            <div className="flex-grow min-w-[250px] max-w-[100%] sm:max-w-[30%] sm:w-[calc(50%-1rem)] border border-gray-200 rounded-md h-auto">
              <div className='text-left mx-4 my-4'>
                <p className='text-lg font-semibold text-gray-800 mb-4'>Customer Information</p>
                <p className='text-base text-gray-600 mb-3'>
                  <img src="/images/user.svg" alt="User" className="inline mr-2 h-5" />
                  {firstname} {lastname}
                </p>
                <p className='text-base text-gray-600 mb-3'>
                  <img src="/images/mail.svg" alt="Email" className="inline mr-2 h-5 " />
                  {email}
                </p>
                <p className='text-base text-gray-600 item-center mb-3'>
                  <img src="/images/telephone.svg" alt="Phone" className="inline mr-2 h-5" />
                  {foramttedPhone}
                </p>
                <p className='text-base text-gray-600 mb-3'>
                  <img src="/images/home.svg" alt="Location" className="inline mr-2 h-5" />
                  {address2 ? `${address1}, ${address2}` : `${address1}`}
                </p>
                <p className='text-base text-gray-600 mb-3'>
                  <img src="/images/city.svg" alt="Location" className="inline mr-2 h-5" />
                  {city}
                </p>
                <p className='text-base text-gray-600 mb-3'>
                  <img src="/images/location.svg" alt="Location" className="inline mr-2 h-5" />
                  {zip}, {state}
                </p>
              </div>
            </div>
          </BlurFade>
        </div>
        

        {/* video  */}
        <BlurFade delay={3 * 0.15} inView yOffset={15} className="px-4 py-10 sm:px-6 md:px-8 lg:px-24 relative">
        <HeroVideoDialog
          className="dark:hidden block"
          animationStyle="from-center"
          videoSrc="https://storage.googleapis.com/channel_automation/Webassets/homeprojectpartners/What%20to%20Expect.mp4"
          thumbnailSrc="images/howto_thumbnail.jpg"
          thumbnailAlt="How To Video"
        />
        <HeroVideoDialog
          className="hidden dark:block"
          animationStyle="from-center"
          videoSrc="https://storage.googleapis.com/channel_automation/Webassets/homeprojectpartners/What%20to%20Expect.mp4"
          thumbnailSrc="images/howto_thumbnail.jpg"
          thumbnailAlt="How To Video"
        />
        </BlurFade>
        
        <div className="px-4 pt-10 pb-20">
          <BlurFade delay={3 * 0.15} inView yOffset={15} className="text-center mb-6">
          

          {matchingContractors.length > 0 && (
          <div>
          <h2 className="font-semibold text-2xl md:text-3xl text-gray-800 dark:text-neutral-200">
          Your Possible <span className="text-xorange">Contractors</span>
          </h2>
          <p className="mt-2 md:mt-4 text-gray-600 dark:text-neutral-500">
            These are the possible contractors that will show up to your scheduled consultation/s
          </p>
          {renderContractorCards()}
          </div>
          
          )}
        
            
          </BlurFade>

        </div>

        
          
          <Footer />
      </div>
    );
  };

  export default ThankYou;
