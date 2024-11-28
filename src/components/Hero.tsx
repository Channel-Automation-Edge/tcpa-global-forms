"use client";
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import GradualSpacing from './ui/gradual-spacing';
import { motion } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import NavBar from './NavBar.tsx';

const Hero = () => {
  const navigate = useNavigate();
  const appContext = useContext(AppContext);

  if (!appContext) {
    return null; // Handle the case where appContext is not available
  }

  const { firstname} = appContext;

  const handleButtonClick = () => {
    navigate('/request-quotes');
  };

  return (
    <div>
      <div className="relative h-[600px] bg-[url('/images/hero.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-[#000000b8] opacity-70"></div> {/* Overlay */}

        <div className="absolute top-0 w-full h-full overflow-hidden">
          <NavBar />
          <div className="z-10 flex items-center justify-center flex-col  px-4 mt-5">
            <GradualSpacing
              className="font-display text-center text-5xl sm:text-4xl md:text-4xl lg:text-4xl xl:text-5xl font-bold -tracking-widest text-off dark:text-white mt-[120px] md:mt-[160px]"
              text="The Easy Way to Fix Your Home"
            />

            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 1 }}
              transition={{ delay: 0.6 }}
              className="text-lg sm:text-sm md:text-lg text-white/70 max-w-lg lg:max-w-[40rem] text-center mt-8 mb-5"
            >
              {firstname ? `${firstname}, connect with trusted contractors who have the skills and experience to get the job done right` : 
              "Connect with trusted contractors who have the skills and experience to get the job done right"}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center justify-center w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl px-4 py-2"
            >
              <button
                className="inline-flex justify-center items-center gap-x-3 text-center bg-[#FFD469] shadow-lg shadow-[#4D4637] hover:shadow-primary border border-transparent text-primary text-sm font-medium rounded-full focus:outline-none focus:shadow-primary py-3 px-6"
                onClick={handleButtonClick}
              >
                Get a Free Consultation Now
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
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
