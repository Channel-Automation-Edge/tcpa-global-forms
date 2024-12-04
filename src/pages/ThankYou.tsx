"use client";
import React, { useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ConfettiRef } from '@/components/ui/confetti';
import Confetti from '@/components/ui/confetti';
import HowItWorks from '@/components/HowItWorks';
import NavBar from '@/components/NavBar';
import GradualSpacing from '@/components/ui/gradual-spacing';
import { motion } from 'framer-motion';
import { AppContext } from '../context/AppContext';

const ThankYou: React.FC = () => {
  const appContext = useContext(AppContext);

  if (!appContext) {
    return null; // Handle the case where appContext is not available
  }
  const navigate = useNavigate();
  const confettiRef = useRef<ConfettiRef>(null);
  const { firstname } = appContext;

  useEffect(() => {
    confettiRef.current?.fire({});
  }, []);

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className='bg-xbg relative'>
      <div className="relative h-[450px] bg-[url('/images/hero.jpg')] bg-cover bg-center z-10">
        <div className="absolute inset-0 bg-[#21284de0] opacity-100"></div> {/* Overlay */}

        <div className="relative w-full overflow-hidden z-20">
          <NavBar />
          <div className="z-30 flex items-center justify-center flex-col px-4 mt-0 space-y-[25px]">
            <GradualSpacing
              className="hidden sm:block font-display text-center text-4xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-5xl font-bold -tracking-widest text-off dark:text-white mt-[120px] md:mt-[120px]"
              text="Your Dream Project is Taking Shape!"
            />

            <div className="block sm:hidden">
              <GradualSpacing
                className="font-display text-center text-4xl font-bold -tracking-widest text-off dark:text-white mt-[80px]"
                text="Your Dream Project"
              />
              <GradualSpacing
                className="font-display text-center text-4xl font-bold -tracking-widest text-off dark:text-white"
                text="is Taking Shape"
              />
            </div>

            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 1 }}
              transition={{ delay: 0.6 }}
              className="text-sm sm:text-sm md:text-md lg:text-lg text-white/70 max-w-lg lg:max-w-[551px] text-center mt-8 mb-5"
            >
              {firstname ? `${firstname}, connect with trusted contractors who have the skills and experience to get the job done right` : 
              "Here's an overview of your consultation details. Take a moment to review everything and make sure everything looks great."}
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 1 }}
              transition={{ delay: 0.6 }}
              className="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-xorange text-xbg transition-transform transform hover:scale-105 z-40"
              onClick={handleGoHome}
              style={{boxShadow: 'rgba(0, 0, 0, 0.07) 0px 22px 30px -8px',
                transition: 'box-shadow 0.3s ease',}}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = 'rgba(254,139,16,0.5) 0px 10px 20px -1px';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'rgba(0, 0, 0, 0.07) 0px 22px 30px -4px';
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
      <Confetti
        ref={confettiRef}
        className="absolute left-0 top-0 z-50 w-full h-full pointer-events-none"
      />
      <HowItWorks />
    </div>
    
  );
};

export default ThankYou;
