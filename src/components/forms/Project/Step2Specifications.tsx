"use client";
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../context/AppContext';
import servicesData from '../../../assets/assets.json';

// Define props interface
interface Step2SpecificationsProps {
  onNext: () => void;
  onBack: () => void;
  onReset: () => void;
}

const Step2Specifications: React.FC<Step2SpecificationsProps> = ({ onNext, onBack, onReset }) => {
  const appContext = useContext(AppContext);

  if (!appContext) {
    return null;
  }

  const { selectedService, serviceSpecifications, setServiceSpecifications} = appContext;
  const selectedServiceData = servicesData.services.find(service => service.id === selectedService);
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>(serviceSpecifications);

  const handleSpecSelect = (spec: string) => {
    setSelectedSpecs(prev =>
      prev.includes(spec) ? prev.filter(s => s !== spec) : [...prev, spec]
    );
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setServiceSpecifications(selectedSpecs);
    // Save the current context state to local storage
    localStorage.setItem('serviceSpecifications', JSON.stringify(selectedSpecs));

    console.log('Service Specifications:', selectedSpecs);
    onNext();
  };

  useEffect(() => {
    setSelectedSpecs(serviceSpecifications);
  }, [serviceSpecifications]);

  return (
    <div className="z-10 max-w-[100rem] px-4 md:px-14 py-10 lg:py-14 mx-auto relative">

      <div className="absolute top-[-102px] custom-smallest:top-[-110px] small-stepper:top-[-115px] sm:top-[-121px] md:top-[-137px] left-0 w-full flex justify-between p-4">
        <button onClick={onBack} className="flex items-center">
          <img
            src="/images/back.svg"
            alt="Go Back"
            className="w-4 md:w-6 h-4 md:h-6 transition-colors duration-200 hover:filter hover:brightness-0"
          />
        </button>
        <button onClick={onReset} className="flex items-center">
          <img
            src="/images/reset.svg"
            alt="Reset"
            className="w-4 md:w-6 h-4 md:h-6 transition-colors duration-200 hover:filter hover:brightness-0"
          />
        </button>
      </div>



      <div className="space-y-8">

        <div className='flex justify-center text-center mb-8'>
          <div className="max-w-[40rem] text-center">
            <h1 className="block text-2xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-3xl font-bold sm:font-bold md:font-semibold lg:font-semibold text-gray-800 dark:text-white">
            Pick the <span className="text-xorange">specifications</span> that match your project and let's get started!
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-12 flex flex-col h-full">
          
        <div className="flex flex-wrap justify-center gap-4 sm:gap-[20px]" style={{ marginTop: '15px', width: '100%' }}>
  {selectedServiceData?.specifiedService.map((spec, index) => (
    <button
      key={index}
      type="button"
      className="flex flex-row sm:flex-col items-center justify-start sm:justify-center w-full sm:w-[200px] h-[80px] sm:h-[120px] border border-transparent rounded-xl shadow-md p-4 transition-transform transform hover:scale-100 sm:hover:scale-105 bg-white"
      onClick={() => handleSpecSelect(spec)}
      style={{
        boxShadow: selectedSpecs.includes(spec)
          ? 'rgba(255, 81, 0, 0.7) 0px 10px 25px -6px'
          : 'rgba(0, 0, 0, 0.07) 0px 22px 30px -6px',
        transition: 'box-shadow 0.3s ease',
        borderColor: selectedSpecs.includes(spec)
          ? 'rgba(255, 81, 0, 0.7)'
          : 'rgba(157, 176, 197, 0.25)',
      }}
      onMouseEnter={(e) => {
        if (!selectedSpecs.includes(spec)) {
          e.currentTarget.style.boxShadow = 'rgba(255, 81, 0, 0.7) 0px 10px 25px -6px';
          e.currentTarget.style.borderColor = 'rgba(255, 81, 0, 0.7)';
        }
      }}
      onMouseLeave={(e) => {
        if (!selectedSpecs.includes(spec)) {
          e.currentTarget.style.boxShadow = 'rgba(0, 0, 0, 0.07) 0px 22px 30px -6px';
          e.currentTarget.style.borderColor = 'rgba(157, 176, 197, 0.25)';
        }
      }}
    >
      <span className="text-gray-800 text-base font-medium sm:text-center text-left">{spec}</span>
    </button>
  ))}
  <button
    type="button"
    className="flex flex-row sm:flex-col items-center justify-start sm:justify-center w-full sm:w-[200px] h-[80px] sm:h-[120px] border border-transparent rounded-xl shadow-md p-4 transition-transform transform hover:scale-100 sm:hover:scale-105 bg-white"
    onClick={() => handleSpecSelect("Other")}
    style={{
      boxShadow: selectedSpecs.includes("Other")
        ? 'rgba(255, 81, 0, 0.7) 0px 10px 25px -6px'
        : 'rgba(0, 0, 0, 0.07) 0px 22px 30px -6px',
      transition: 'box-shadow 0.3s ease',
      borderColor: selectedSpecs.includes("Other")
        ? 'rgba(255, 81, 0, 0.7)'
        : 'rgba(157, 176, 197, 0.25)',
    }}
    onMouseEnter={(e) => {
      if (!selectedSpecs.includes("Other")) {
        e.currentTarget.style.boxShadow = 'rgba(255, 81, 0, 0.7) 0px 10px 25px -6px';
        e.currentTarget.style.borderColor = 'rgba(255, 81, 0, 0.7)';
      }
    }}
    onMouseLeave={(e) => {
      if (!selectedSpecs.includes("Other")) {
        e.currentTarget.style.boxShadow = 'rgba(0, 0, 0, 0.07) 0px 22px 30px -6px';
        e.currentTarget.style.borderColor = 'rgba(157, 176, 197, 0.25)';
    }}}
  >
    <span className="text-gray-800 text-base font-medium sm:text-center text-left">Other</span>
  </button>
</div>



          <div className="mt-20 flex justify-center">
            <button
              type="submit"
              className={`w-full max-w-xs px-24 py-6 inline-flex justify-center items-center gap-x-2 text-base font-medium rounded-lg border border-transparent ${
                selectedSpecs.length > 0
                  ? 'bg-xorange text-white hover:bg-xorangeDark shadow-lg shadow-[rgba(255,85,0,0.5)] transform transition-transform translate-y-[-8px]'
                  : 'bg-gray-200 text-white cursor-not-allowed'
              }`}
              disabled={selectedSpecs.length === 0}
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Step2Specifications;