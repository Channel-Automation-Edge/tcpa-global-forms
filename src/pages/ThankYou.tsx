"use client";
import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ConfettiRef } from '@/components/ui/confetti';
import Confetti from '@/components/ui/confetti';
import HowItWorks from '@/components/HowItWorks';

const ThankYou: React.FC = () => {
  const navigate = useNavigate();
  const confettiRef = useRef<ConfettiRef>(null);

  useEffect(() => {
    confettiRef.current?.fire({});
  }, []);

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="flex items-center justify-center min-h-screen relative">
      <div className="z-10 max-w-[100rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto space-y-8 text-center">
        <div>
          <h1 className="block text-3xl font-bold text-primary dark:text-white">
            Thank You!
          </h1>
          <p className="mt-1 text-gray-600 dark:text-neutral-400 max-w-[85rem] mx-auto">
            We appreciate your interest in our services. You can expect an update regarding your free consultation soon. Please check your email for the details.
          </p>
        </div>

        <div>
          <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
            Here's What to Expect:
          </h1>
          <HowItWorks />
        </div>
            
        <div className="mt-6">
          <button
            onClick={handleGoHome}
            className="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-xorange text-white shadow-lg shadow-[rgba(254,139,16,0.5)]"
          >
            Go to Home Page
          </button>
        </div>
      </div>
      
      <Confetti
        ref={confettiRef}
        className="absolute left-0 top-0 z-0 w-full h-full"
      />
    </div>
  );
};

export default ThankYou;
