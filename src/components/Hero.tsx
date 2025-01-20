"use client";
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GradualSpacing from './ui/gradual-spacing';
import { motion } from 'framer-motion';
import { AppContext } from '@/context/AppContext';
import NavBar from './NavBar.tsx';
import useClearFormState from '@/hooks/useClearFormState.tsx';

const Hero = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const appContext = useContext(AppContext);
  const clearFormState = useClearFormState();

  if (!appContext) {
    return null; 
  }

  const { contractor, setForm, setUser, user, form } = appContext; // Include user from appContext
  const urlParams = new URLSearchParams(location.search);
  const firstnameParam = urlParams.get('firstname') || '';
  const stateParam = urlParams.get('state') || '';
  const zipParam = urlParams.get('zip') || '';

  // Default content
  const defaultH1 = "Instant Everything, Incredible Pricing";
  const defaultLede = zipParam
    ? `Hi ${firstnameParam}, find top contractors in ${stateParam} near ${zipParam} for your upcoming remodel and control your quotes`
    : stateParam
    ? `Hi ${firstnameParam}, find top contractors in ${stateParam} for your upcoming remodel and control your quotes`
    : "Hi there, find top contractors in your area for your upcoming remodel and control your quotes";
  const defaultCtaLabel = "Get Started Now";

  const heroH1 = contractor.content.hero_h1 || defaultH1;
  const heroLede = contractor.content.hero_lede || defaultLede;
  const heroCtaLabel = contractor.content.hero_cta || defaultCtaLabel;

  const [buttonText, setButtonText] = useState("Get a Free Consultation Now");
  const [, setSubheadingText] = useState("Or select a service to get started");
  const [subheadingText1, setSubheadingText1] = useState(heroLede);
  
  const initialZip = user.zip && user.zip.trim() !== '' ? user.zip : zipParam; // Use user.zip if available, otherwise url zip
  const [zip, setZip] = useState<string>(initialZip);  // Initialize zip state
  const [isZipValid, setIsZipValid] = useState<boolean>(initialZip.length >= 4 && initialZip.length <= 5); // Validate initial zip

  const [showZipInput, setShowZipInput] = useState<boolean>(true);  // State to control ZIP input visibility

  // Update button text based on form progress
  useEffect(() => {
    const step = localStorage.getItem('formStep');

    if (step !== null && step !== "1") {
      setButtonText("Finish your Previous Quote");
      setSubheadingText("Or reset your progress and select another service");
      setShowZipInput(false);  // Hide ZIP input
    } else {
      setButtonText(heroCtaLabel);
      setShowZipInput(true);  // Show ZIP input
    }
    setSubheadingText1(heroLede);
  }, [appContext.contractor, appContext.services, heroLede, heroCtaLabel]);

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
    let formId = form.formId;

    // If formId is not set, create a new formId
    if (!formId) {
      clearFormState();

      const dateTime = new Date().toISOString().replace(/[-:.T]/g, '').slice(0, 14); // YYYYMMDDHHMMSS format
      const randomString = generateRandomString(6);

      formId = `${contractor.id}-${dateTime}-${randomString}`;
      console.log('Generated formId:', formId);
    } else {
      console.log('Using existing form ID:', formId);
    }

    // Update the form and user object in context
    setForm((prevForm) => ({
      ...prevForm,
      formId: formId,
    }));

    setUser((prevUser) => ({
      ...prevUser,
      zip: zip,  // Save the zip code to the user context
    }));

    navigateWithParams('/request-quotes');
  };

  const handleZipChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\D/g, ''); // Remove non-numeric characters
    if (value.length <= 5) {  // Max length of 5
      setZip(value);
      setIsZipValid(value.length >= 4); // Valid if length is 4 or 5
    }
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
            <GradualSpacing
              className="hidden sm:block font-display text-center text-4xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-5xl font-semibold -tracking-widest text-white dark:text-white mt-14 lg:mt-20"
              text={heroH1}
            />
            <div className="block sm:hidden">
              <GradualSpacing
                className="font-display text-center text-[32px] font-bold -tracking-widest text-white dark:text-white mt-4"
                text={heroH1.split(' ').slice(0, 3).join(' ')}
              />
              <GradualSpacing
                className="font-display text-center text-[32px] font-bold -tracking-widest text-white dark:text-white"
                text={heroH1.split(' ').slice(3).join(' ')}
              />
            </div>

            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 1 }}
              transition={{ delay: 0.6 }}
              className="text-sm sm:text-sm md:text-base lg:text-base text-white/80 max-w-lg lg:max-w-[551px] text-center pb-4"
            >
              {subheadingText1}
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 1 }}
              transition={{ delay: 0.7 }} className="mt-5 lg:mt-8 flex flex-col items-center gap-2 sm:flex-row sm:gap-3">
              {showZipInput && (
                <div className="w-full sm:w-auto">
                  <input 
                    type="text" 
                    id="hero-input" 
                    name="hero-input" 
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-accentColor text-center" 
                    placeholder="Enter ZIP Code" 
                    value={zip}
                    onChange={handleZipChange}
                  /> 
                </div>
              )}
              <button 
                className="w-full sm:w-auto py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-accentColor text-white hover:bg-accentDark focus:outline-none focus:bg-accentDark disabled:opacity-50 disabled:pointer-events-none" 
                onClick={handleButtonClick} 
                disabled={!isZipValid && showZipInput} // Disable button if zip is not valid
              >
                {buttonText}
              </button>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
