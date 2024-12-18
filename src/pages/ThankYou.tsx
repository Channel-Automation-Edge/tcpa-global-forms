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

const ThankYou: React.FC = () => {
  const appContext = useContext(AppContext);

  if (!appContext) {
    return null; // Handle the case where appContext is not available
  }

  const navigate = useNavigate();
  const confettiRef = useRef<ConfettiRef>(null);
  const [contractors, setContractors] = useState<any[]>([]); // State to hold contractors
  const [preferences, setPreferences] = useState<string[]>([]); // State to hold preferences

  useEffect(() => {
    // Load contractors from local storage
    const storedContractors = localStorage.getItem('summaryContractors');
    if (storedContractors) {
      setContractors(JSON.parse(storedContractors));
    }

    // Load summaryPreferences from local storage
    const storedPreferences = localStorage.getItem('summaryPreferences');
    if (storedPreferences) {
      setPreferences(JSON.parse(storedPreferences));
    }

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

  const handleGoHome = () => {
    localStorage.removeItem('summaryContractors');
    localStorage.removeItem('summaryPreferences');
    const params = window.location.search; // Get current URL parameters
    navigate('/' + params); // Redirect to home with existing URL parameters

  };

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
              className="text-sm sm:text-sm md:text-base lg:text-base text-white/80 max-w-lg lg:max-w-[551px] text-center mt-8 mb-5"
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

      {/* video  */}
      <div className="px-4 py-10 sm:px-6 md:px-8 lg:px-24 relative">
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
    </div>
      
      {/* Contractors Section */}
      <div className="px-4 pt-10 pb-20">
        <BlurFade delay={3 * 0.15} inView yOffset={15} className="text-center mb-6">
          <h2 className="font-semibold text-2xl md:text-3xl text-gray-800 dark:text-neutral-200">
            Your Possible <span className="text-xorange">Contractors</span>
          </h2>
          <p className="mt-2 md:mt-4 text-gray-500 dark:text-neutral-500">
            These are the possible contractors that will show up to your scheduled consultation/s
          </p>
        </BlurFade>
        <div className="mt-4 space-y-4">
          {contractors.map((contractor, index) => (
            <BlurFade key={contractor.id} delay={0.8 + index * 0.2} inView yOffset={15}>
              <div className="p-4 border rounded-lg shadow-sm bg-white dark:bg-neutral-800 dark:border-neutral-700 flex flex-row items-center max-w-[720px] mx-auto">
                <div className="flex items-center mb-0 mr-4" style={{ minWidth: '150px' }}>
                  <img src={contractor.logo} alt={contractor.name} className="w-16 h-16 rounded-full" />
                  <div className="ml-4">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">{contractor.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-neutral-400">{contractor.zip}, {contractor.state}</p>
                  </div>
                </div>
                <div className="flex-grow text-center mb-0 mx-3" >
                  <div className="flex flex-wrap gap-2 justify-start">
                    {preferences.map((preference: string, idx: number) => (
                      <span key={idx} className="py-1 px-2 inline-flex items-center gap-x-1 text-xs font-medium bg-teal-100 text-teal-800 rounded-full dark:bg-teal-500/10 dark:text-teal-500">
                        <svg className="shrink-0" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                          <path d="m9 12 2 2 4-4"></path>
                        </svg>
                        {preference}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </BlurFade>
          ))}
        </div>
      </div>

      {/* End of Contractors Section */}
      
      <Footer />
    </div>
  );
};

export default ThankYou;
