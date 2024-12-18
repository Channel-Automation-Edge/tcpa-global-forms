"use client";
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GradualSpacing from './ui/gradual-spacing';
import { motion } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import NavBar from './NavBar.tsx';
import posthog from 'posthog-js';

const Hero = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const appContext = useContext(AppContext);

  type HeroContentKey = 'default' | 'fresh' | 'scheduled' | 'past';

  const urlParams = new URLSearchParams(location.search);
  const segment = (urlParams.get('segment') as HeroContentKey) || 'default'; // Type-casting segment
  const firstnameParam = urlParams.get('firstname') || '';
  const stateParam = urlParams.get('state') || '';
  const zipParam = urlParams.get('zip') || '';

  const heroContent: Record<HeroContentKey, { h1: string; lede: string; ctaLabel: string }> = {
    default: {
      h1: "Instant Everything, Incredible Pricing",
      lede: "Connect with trusted contractors who have the skills and experience to get the job done right",
      ctaLabel: "Get Started Now",
    },
    fresh: {
      h1: "Instant Everything, Incredible Pricing",
      lede: zipParam ? `Hi First Name, find top contractors in ${stateParam} near ${zipParam} for your upcoming remodel and control your quotes`
           : stateParam ? `Hi First Name, find top contractors in ${stateParam} for your upcoming remodel and control your quotes`
           : "Hi First Name, find top contractors in your area for your upcoming remodel and control your quotes",
      ctaLabel: "Get Started Now",
    },
    scheduled: {
      h1: "Manage Your Home Project Matches",
      lede: zipParam ? `Hi First Name, find top contractors in ${stateParam} near ${zipParam} for your home project and control your matches`
           : stateParam ? `Hi First Name, find top contractors in ${stateParam} for your home project and control your matches`
           : "Hi First Name, find top contractors in your area for your home project and control your matches",
      ctaLabel: "See My Matches",
    },
    past: {
      h1: "Control Exclusive Discounts on Future Projects",
      lede: zipParam ? `Hi First Name, find top contractors in ${stateParam} near ${zipParam} for your next project and control exclusive discounts.`
           : stateParam ? `Hi First Name, find top contractors in ${stateParam} for your next project and control exclusive discounts.`
           : "Hi First Name, find top contractors in your area for your next project and control exclusive discounts.",
      ctaLabel: "Explore Exclusive Discounts",
    },
  };

  const currentHeroContent = heroContent[segment];

  if (!appContext) {
    return null; // Handle the case where appContext is not available
  }

  const { firstname } = appContext;

  const [buttonText, setButtonText] = useState("Get a Free Consultation Now");
  const [, setSubheadingText] = useState("Or select a service to get started");
  const [subheadingText1, setSubheadingText1] = useState("Connect with trusted contractors who have the skills and experience to get the job done right");
  
  const capitalizeFirstLetter = (input: string): string => {
    return input.charAt(0).toUpperCase() + input.slice(1);
  };

  const adjustedHeroContent = {
    ...currentHeroContent,
    lede: currentHeroContent.lede.replace('First Name', firstnameParam || '').trim(),
  };

  if (!firstnameParam) {
    adjustedHeroContent.lede = adjustedHeroContent.lede
      .replace(`Hi ${firstnameParam}, `, '')
      .replace(`Hi ${firstnameParam}! `, '')
      .replace(`Welcome back, ${firstnameParam}! `, '')
      .trim();

    // Capitalize the first letter of the resulting string
    adjustedHeroContent.lede = capitalizeFirstLetter(adjustedHeroContent.lede);
  }

  useEffect(() => {
    const selectedService = localStorage.getItem('selectedService');
    const dynamicSubheading = adjustedHeroContent.lede || `Hi ${firstnameParam}! Connect with trusted contractors who have the skills and experience to get the job done right`;

    if (selectedService && JSON.parse(selectedService) !== "") {
      setButtonText("Finish your Previous Quote");
      setSubheadingText("Or reset your progress and select another service");
    } else {
      setButtonText(adjustedHeroContent.ctaLabel);
    }

    // Set the dynamic subheading in both branches
    setSubheadingText1(dynamicSubheading);

  }, [adjustedHeroContent, firstnameParam]);

  // Function to append current URL parameters
  const navigateWithParams = (path: string) => {
    const currentParams = new URLSearchParams(location.search);
    navigate(`${path}?${currentParams.toString()}`);
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
      posthog.capture('cta clicked: New form created', {
        cta_label: buttonText,
        form_id: formId,
      });
    } else {
      console.log(`formId already exists: ${formId}`);
      posthog.capture('cta clicked: Form retrieved', {
        cta_label: buttonText,
        form_id: formId,
      });
    }
    appContext.setFormId(formId);
    navigateWithParams('/request-quotes');
  };

  return (
    <div>
      <div className="relative">
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
        <div className="absolute inset-0 bg-[#12121d99] opacity-100 z-[1]"></div> {/* Moved overlay after video and added z-index */}

        <div className="relative z-[2] w-full overflow-hidden"> {/* Added z-index to content container */}
          <NavBar />
          <div className="z-10 pb-12 md:pb-14 lg:pb-16 flex items-center justify-center flex-col px-4 mt-0 space-y-[25px]">
            {/* if segment is scheduled or past */}
            {segment === 'scheduled' || segment === 'past' ? (  
              <>
                <GradualSpacing
                className="hidden sm:block font-display text-center text-4xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-5xl font-semibold -tracking-widest text-white dark:text-white mt-14 lg:mt-20"
                text={adjustedHeroContent.h1}
              />

                <div className="block sm:hidden">
                <GradualSpacing
                className="font-display text-center text-[32px] font-bold -tracking-widest text-white dark:text-white mt-4"
                text={adjustedHeroContent.h1.split(' ').slice(0, 3).join(' ')}
              />
              <GradualSpacing
                className="font-display text-center text-[32px] font-bold -tracking-widest text-white dark:text-white"
                text={adjustedHeroContent.h1.split(' ').slice(3).join(' ')}
              />
            </div>
              </>   

            
            ) : ( 
            <>
              <GradualSpacing
                className="hidden sm:block font-display text-center text-4xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-5xl font-semibold -tracking-widest text-white dark:text-white mt-14 lg:mt-20"
                text='Instant Everything, Incredible Pricing'
              />
              <div className="block sm:hidden">
              <GradualSpacing
                className="font-display text-center text-[32px] font-bold -tracking-widest text-white dark:text-white mt-4"
                text='Instant Everything'
              />
              <GradualSpacing
                className="font-display text-center text-[32px] font-bold -tracking-widest text-white dark:text-white"
                text='Incredible Pricing'
              />
            </div>
            </>
            )}

            
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 1 }}
              transition={{ delay: 0.6 }}
              className="text-sm sm:text-sm md:text-base lg:text-base text-white/80 max-w-lg lg:max-w-[551px] text-center pb-4"
            >
              {firstname ? `${firstname}, ${subheadingText1}` : subheadingText1}
            </motion.p>

            <style>{`
              @keyframes wiggle {
                0%, 100% { transform: rotate(6deg); }
                25% { transform: rotate(8deg); }
                75% { transform: rotate(4deg); }
              }
            `}</style>

            <motion.button
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 1 }}
              transition={{ delay: 0.6 }}
              className="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-xorange text-xbg transition-transform transform hover:scale-105 relative mb-10"
              onClick={handleButtonClick}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
