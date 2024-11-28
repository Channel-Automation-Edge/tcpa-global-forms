"use client";
import React from 'react';

// Define props interface
interface Step3ThankYouProps {
  onHome: () => void;
}

const Step3ThankYou: React.FC<Step3ThankYouProps> = ({ onHome }) => {
  return (
    <div className="z-10 max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <div className="max-w-xl mx-auto text-center">
        <h1 className="block text-3xl font-bold text-primary dark:text-white">
          Thank You!
        </h1>
        <p className="mt-4 text-gray-600 dark:text-neutral-400">
          We appreciate your interest in our services. You can expect an update regarding your free consultation soon. Please check your email for the details.
        </p>
        <button
          onClick={onHome}
          className="mt-6 py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-[#FE4F00] text-white shadow-lg shadow-[rgba(254,79,0,0.5)]"
        >
          Go to Home Page
        </button>
      </div>
    </div>
  );
};

export default Step3ThankYou;