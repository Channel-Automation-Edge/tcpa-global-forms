import React, { useContext, useState } from 'react';
import { AppContext } from '../../../context/AppContext';

interface Step3CallUsProps {
  onNext: () => void;
}

const Step3CallUs: React.FC<Step3CallUsProps> = ({ onNext }) => {
  const appContext = useContext(AppContext);

  if (!appContext) {
    return null;
  }

  const {
    firstname,
  } = appContext;

  const [loading] = useState<boolean>(false); // State to control spinner

  const handleCall = () => {
    window.location.href = 'tel:+18594075999'; //added by izzy
  }

  return (
    <div className="z-10 max-w-[100rem] px-4 lg:px-14 py-10 lg:py-14 mx-auto relative">

      <div className="max-w-2xl mx-auto">

        <div className='flex justify-center text-center mb-8'>
          <div className="max-w-[40rem] text-center">
            <h1 className="block text-2xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-3xl font-bold sm:font-bold md:font-semibold lg:font-semibold text-gray-800 dark:text-white">
            Hi {firstname}! We're
                  <span className="text-xorange"> thrilled</span> to have you with us!
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-400 mt-2">
            Thanks for joining Home Project Partners! Our sales team will be in touch soon to assist you with your account. If you're eager to get started, feel free to give us a call!
            </p>
          </div>
        </div>


        <div className="mt-6 flex flex-col space-y-4">
          <button
            type="button"
            onClick={handleCall}
            className="w-full py-5 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-xorange text-white hover:bg-xorangeDark shadow-lg shadow-[rgba(102,89,83,0.5)]"
          >
            {loading ? (
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
            ) : (
              'Call Us'
            )}
          </button>
          <button
            type="button"
            onClick={onNext}
            className="w-full py-5 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-gray-500 text-white hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
          >
            Go Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step3CallUs;



