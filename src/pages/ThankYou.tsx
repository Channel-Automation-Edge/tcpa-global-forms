"use client";
import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ConfettiRef } from '@/components/ui/confetti';
import Confetti from '@/components/ui/confetti';

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
    <div className="relative flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-xl mx-auto text-center z-10">
        <h1 className="block text-3xl font-bold text-primary dark:text-white">
          Thank You!
        </h1>
        <p className="mt-4 text-gray-600 dark:text-neutral-400">
          We appreciate your interest in our services. You can expect an update regarding your free consultation soon. Please check your email for the details.
        </p>
        <button
          onClick={handleGoHome}
          className="mt-6 py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-xorange text-white shadow-lg shadow-[rgba(254,139,16,0.5)] z-20"
        >
          Go to Home Page
        </button>
      </div>
      <Confetti
        ref={confettiRef}
        className="absolute left-0 top-0 z-0 w-full h-full"
      />
    </div>
  );
};

export default ThankYou;