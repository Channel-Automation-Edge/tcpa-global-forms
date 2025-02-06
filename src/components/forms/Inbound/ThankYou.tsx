"use client";
import React, { useRef, useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ConfettiRef } from '@/components/ui/confetti';
import Confetti from '@/components/ui/confetti';
import HowItWorks from '@/components/HowItWorks';
import { AppContext } from '@/context/AppContext';
import Footer from '@/components/Footer';
import BlurFade from '@/components/ui/blur-fade';
import HeroVideoDialog from '@/components/ui/hero-video-dialog';
import Bathtub from '@/components/icons/Bathtub';
import Trowel from '@/components/icons/Trowel';
import Closet from '@/components/icons/Closet';
import Plumbing from '@/components/icons/Plumbing';
import Deck from '@/components/icons/Deck';
import Doors from '@/components/icons/Doors';
import Fence from '@/components/icons/Fence';
import Flooring from '@/components/icons/Floor';
import Garage from '@/components/icons/Garage';
import Gutter from '@/components/icons/Gutter';
import Foundation from '@/components/icons/Foundation';
import Kitchen from '@/components/icons/Kitchen';
import Roofing from '@/components/icons/Roofing';
import Siding from '@/components/icons/Siding';
import Shower from '@/components/icons/Shower';
import Windows from '@/components/icons/Windows';
import NavQuote from '@/components/NavQuote';
import Solar from '@/components/icons/Solar';


// Icon mapping
const iconMapping: Record<string, JSX.Element> = {
  'Bath': <Bathtub />,
  'Basement Waterproofing': <Trowel />,
  'Closet': <Closet />,
  'Plumbing': <Plumbing />,
  'Deck': <Deck />,
  'Doors': <Doors />,
  'Fence': <Fence />,
  'Flooring': <Flooring />,
  'Garage': <Garage />,
  'Gutters': <Gutter />,
  'Foundation': <Foundation />,
  'Kitchen': <Kitchen />,
  'Roofing': <Roofing />,
  'Siding': <Siding />,
  'Shower': <Shower />,
  'Windows': <Windows />,
  'Solar': <Solar />,
  // Add more mappings as needed
};

const ThankYou: React.FC = () => {
  const appContext = useContext(AppContext);
  if (!appContext) {
    return null; // Handle the case where data is not loaded yet
  }
  const navigate = useNavigate();
  const confettiRef = useRef<ConfettiRef>(null);
  const [slug, setSlug] = useState('');
  const { form, user, selectedService, contractor } = appContext;

  useEffect(() => {
    if (appContext && appContext.contractor) {
      setSlug(appContext.contractor.slug);
    }
  }, [appContext, appContext.contractor]);

  const handleGoHome = () => {
    const params = window.location.search;
    navigate(`/${slug}` + params);
  };

  useEffect(() => {
    confettiRef.current?.fire({});
    // Override the back button to redirect to "/"
    window.addEventListener('popstate', handleGoHome);
    return () => {
      window.removeEventListener('popstate', handleGoHome);
    };
  }, [navigate]);

  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(date);
  };

  const formatTime = (timeString: any) => {
    // Split the time string into hours and minutes
    const [hourStr, minuteStr] = timeString.split(':');
    let hour = parseInt(hourStr, 10);
    const minutes = minuteStr || '00'; // Default to '00' if no minutes part
  
    // Determine AM or PM period
    const period = hour >= 12 ? 'PM' : 'AM';
  
    // Convert hour to 12-hour format
    if (hour === 0) {
      hour = 12; // Midnight case
    } else if (hour > 12) {
      hour -= 12; // Convert to 12-hour format
    }
  
    return `${hour}:${minutes} ${period}`;
  };

  const formatPhoneNumber = (phone: any) => {
    if (!phone || phone.length !== 10) {
      return phone;
    }
  
    const areaCode = phone.slice(0, 3);
    const centralOfficeCode = phone.slice(3, 6);
    const lineNumber = phone.slice(6);
  
    return `+1 (${areaCode}) ${centralOfficeCode}-${lineNumber}`;
  };

  if  (!appContext.services || !appContext.contractor || !appContext.selectedService) {
    return null; // Handle the case where data is not loaded yet
  }

  const bRoll = contractor.content.b_roll || 'https://storage.googleapis.com/channel_automation/Webassets/video/homeprojectparterns-hero_9.0.10.webm';

  return (
    <div className='bg-white relative'>
      <NavQuote />
      <Confetti
        ref={confettiRef}
        className="absolute left-0 top-0 z-50 w-full h-full pointer-events-none"
      />
      {/* hero */}
      <div className="relative flex items-center">
        <div className="absolute inset-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            src={bRoll}
          ></video>
        </div>
        <div className="absolute inset-0 bg-[#12121d99] opacity-100 z-[1]"></div> {/* Moved overlay after video and added z-index */}

        <div className="relative z-[2] w-full overflow-hidden"> 
          <div className="z-10 flex items-center justify-center flex-col px-4 sm:pl-16 mt-0 space-y-6 md:space-y-8 py-14 md:py-16 lg:py-20">
            <BlurFade delay={2 * 0.20} yOffset={0}
              className="block font-display text-center text-4xl md:text-5xl lg:text-6xl font-semibold text-white max-w-4xl pointer-events-none">
              Your Appointment is Confirmed - See You Soon!
            </BlurFade>

            <BlurFade delay={3 * 0.20} yOffset={0}
              className="text-sm md:text-base lg:text-lg text-white/80 text-center max-w-4xl pointer-events-none"
            >
              Thank you for booking with us! Your appointment has been successfully confirmed. You'll receive a confirmation email with all the details shortly. We look forward to seeing you!
            </BlurFade>

            {/* <motion.div initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 1 }}
              transition={{ delay: 0.7 }} className="mt-5 lg:mt-8 flex flex-col items-start gap-2 sm:flex-row sm:gap-3">
              
              <InteractiveHoverButton className='bg-accentColor text-white border-transparent text-sm rounded-lg py-3' onClick={handleGoHome}>Go to Home Page</InteractiveHoverButton>
            </motion.div> */}
          </div>
        </div>
      </div>
      {/* end of hero */}


      <div className='max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 lg:py-14  space-y-12 sm:space-y-20 lg:space-y-24'>
        

        {/* Appointment Details */}
        <div className="space-y-6 sm:space-y-8">
          {/* <BlurFade delay={3 * 0.15} inView yOffset={0} className='text-center'>
            <h2 className="section_header">
            Here Are <span className="text-accentColor">Your Appointment</span> Details
            </h2>
          </BlurFade> */}
          <div className="flex justify-center"> 
            <div className="flex flex-wrap gap-4 max-w-screen-lg w-full sm:px-8 pointer-events-none">

              <BlurFade delay={6 * 0.15} yOffset={0} className="flex flex-col gap-4 flex-grow min-w-[250px] w-[600px] max-w-[100%]">
                <div className="bg-white border border-gray-200 rounded-md">
                  <div className="text-left mx-4 my-4">
                    <div className="flex items-center">
                    <div className="flex items-center text-green-600 mb-3">
                      <svg id="fi_4315445" enableBackground="new 0 0 512 512" height="24" viewBox="0 0 512 512" width="24" xmlns="http://www.w3.org/2000/svg" className='text-green-600 h-5'>
                        <path clipRule="evenodd" d="m256 0c-141.2 0-256 114.8-256 256s114.8 256 256 256 256-114.8 256-256-114.8-256-256-256z" fill="currentColor" fillRule="evenodd"></path>
                        <path d="m206.7 373.1c-32.7-32.7-65.2-65.7-98-98.4-3.6-3.6-3.6-9.6 0-13.2l37.7-37.7c3.6-3.6 9.6-3.6 13.2 0l53.9 53.9 138.6-138.7c3.7-3.6 9.6-3.6 13.3 0l37.8 37.8c3.7 3.7 3.7 9.6 0 13.2l-183.3 183.1c-3.6 3.7-9.5 3.7-13.2 0z" fill="#fff"></path>
                      </svg>
                        <p className="text-lg font-semibold ml-2">Appointment Confirmed</p>
                      </div>
                    </div>
                    <hr className='mb-4'></hr>
                    <div className="flex items-center mb-4 ml-4 md:ml-8 min-w-52">
                    <div className="w-14 h-14">{iconMapping[selectedService.name]}</div>
                      <div className="flex flex-wrap justify-between flex-grow">
                        <h3 className="text-lg font-medium text-gray-800 dark:text-white pl-6 pr-4">
                          {selectedService.name} {form.serviceSpecification ? form.serviceSpecification : 'Service'}
                        </h3>
                      </div>
                    </div>
                    {/* Schedule */}
                    {/* <hr className='mb-4'></hr>
                    {form.promo }
                    <p className="text-sm font-semibold text-gray-800 mb-3">Promo</p> */}
                    <hr className='mb-4'></hr>
                    <p className="text-sm font-semibold text-gray-800 mb-3">Scheduled Date and Time</p>
                    {form.date && form.time ? (
                      <div className="flex flex-wrap justify-between my-4 w-auto bg-gray-100 rounded-md pb-4 space-y-2">
                        <div className="flex items-center px-8 min-w-[200px] mt-2">
                          <img src="/images/calendar.svg" alt="Calendar" className="inline mr-2 h-5" />
                          <p className="text-base text-gray-800">{formatDate(form.date)}</p>
                        </div>

                        <div className="hidden sm:flex items-center px-8">
                          <img src="/images/clock.svg" alt="Clock" className="inline mr-2 h-5" />
                          <p className="text-base text-gray-800">{formatTime(form.time)}</p>

                          {user.timezone && ( 
                            <div className='flex items-center'>
                              <img src="/images/globe.svg" alt="Clock" className="inline ml-4 mr-2 h-5" />
                              <p className="text-base text-gray-800">{user.timezone}</p>
                            </div>)}

                        </div>


                        <div className="flex items-center px-8 sm:hidden">
                          <img src="/images/clock.svg" alt="Clock" className="inline mr-2 h-5" />
                          <p className="text-base text-gray-800">{formatTime(form.time)}</p>
                        </div>
                        {user.timezone && (
                          <div className="flex items-center px-8 sm:hidden">
                            <img src="/images/globe.svg" alt="Clock" className="inline mr-2 h-5" />
                            <p className="text-base text-gray-800">{user.timezone}</p>
                          </div>
                        )}

                      </div>
                    ) : (
                      <div className="flex flex-wrap justify-between my-4 w-auto bg-red-100 rounded-md py-4">
                        <div className="flex items-center px-8 min-w-[200px]">
                          <img src="/images/warning.svg" alt="warning" className="inline mr-2 h-5" />
                          <p className="text-base text-red-800">No schedule is set</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
              </BlurFade>

              <BlurFade delay={4 * 0.15} yOffset={0} className="flex-grow min-w-[250px] max-w-[100%] bg-white border border-gray-200 rounded-md h-auto">
                <div className='text-left mx-4 my-4'>
                  <p className='text-lg font-semibold text-gray-800 mb-3'>Customer Information</p>
                  <hr className='mb-4'></hr>
                  <p className='text-base text-gray-800 mb-3'>
                    <img src="/images/user.svg" alt="User" className="inline mr-2 h-5" />
                    {user.firstname} {user.lastname}
                  </p>
                  <p className='text-base text-gray-800 mb-3'>
                    <img src="/images/mail.svg" alt="Email" className="inline mr-2 h-5 " />
                    {user.email}
                  </p>
                  <p className='text-base text-gray-800 item-center mb-3'>
                    <img src="/images/telephone.svg" alt="Phone" className="inline mr-2 h-5" />
                    {formatPhoneNumber(user.phone)}
                  </p>
                  <p className='text-base text-gray-800 mb-3'>
                    <img src="/images/home.svg" alt="Location" className="inline mr-2 h-5" />
                    {user.address2 ? `${user.address1}, ${user.address2}` : `${user.address1}`}
                  </p>
                  <p className='text-base text-gray-800 mb-3'>
                    <img src="/images/city.svg" alt="Location" className="inline mr-2 h-5" />
                    {user.city}
                  </p>
                  <p className='text-base text-gray-800 mb-3'>
                    <img src="/images/location.svg" alt="Location" className="inline mr-2 h-5" />
                    {user.zip}, {user.state}
                  </p>
                </div>
              </BlurFade>
            </div>
          </div>
        </div>
        <HowItWorks />
        
        {/* video  */}
        <BlurFade delay={6 * 0.15} inView yOffset={0} className="relative">
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


      </div>


        
      <Footer />
    </div>
  );
};

export default ThankYou;
