"use client";
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../context/AppContext';
import servicesData from '../../../assets/assets.json';

// Define props interface
interface Step2SpecificationsProps {
  onNext: () => void;
  onBack: () => void;
}

const Step2Specifications: React.FC<Step2SpecificationsProps> = ({ onNext, onBack }) => {
  const appContext = useContext(AppContext);

  if (!appContext) {
    return null;
  }

  const { selectedService, serviceSpecifications, setServiceSpecifications, contractorPreferences, setContractorPreferences } = appContext;
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
    const updatedPreferences = [...new Set([...contractorPreferences, 'Licensed', 'Insured', 'Bonded', 'Top Rated'])];
    setContractorPreferences(updatedPreferences);
    console.log('Service Specifications:', selectedSpecs);
    console.log('Contractor Preferences:', updatedPreferences);
    onNext();
  };

  useEffect(() => {
    setSelectedSpecs(serviceSpecifications);
  }, [serviceSpecifications]);

  return (
    <div className="z-10 max-w-[100rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto relative">
      <button onClick={onBack} className="absolute left-4 top-1/2 transform -translate-y-1/2">
        <img src="/images/back.png" alt="Go Back" className="w-6 h-6" />
      </button>
      <div className="space-y-8">

        <div className='flex justify-center text-center mb-8'>
          <div className="max-w-[40rem] text-center">
            <h1 className="block text-2xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-3xl font-bold sm:font-bold md:font-semibold lg:font-semibold text-gray-800 dark:text-white">
            Pick the <span className="text-xorange">specifications</span> that match your project and let's get started!
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-12 flex flex-col h-full">
          
          <div
            className="flex flex-wrap justify-center"
            style={{ gap: '20px 30px', marginTop: '15px', width: '100%' }}
          >
            {selectedServiceData?.specifiedService.map((spec, index) => (
              <button
                key={index}
                type="button"
                className={`className="flex flex-col items-center justify-center w-[200px] sm:w-[180px] md:w-[200px] lg:w-[200px] h-[156px] border border-indigo-100 rounded-[20px] shadow-md p-4 transition-transform transform hover:scale-105 bg-white`}
                onClick={() => handleSpecSelect(spec)}
                style={{
                  boxShadow: selectedSpecs.includes(spec)
                    ? 'rgba(255, 85, 0,0.5) 0px 10px 25px -8px'
                    : 'rgba(0, 0, 0, 0.07) 0px 22px 30px -8px',
                  transition: 'box-shadow 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  if (!selectedSpecs.includes(spec)) {
                    e.currentTarget.style.boxShadow = 'rgba(255, 85, 0,0.5) 0px 10px 25px -8px';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!selectedSpecs.includes(spec)) {
                    e.currentTarget.style.boxShadow = 'rgba(0, 0, 0, 0.07) 0px 22px 30px -8px';
                  }
                }}
              >
                {/* <img src="/images/sample.png" alt={spec} className="w-16 h-16 mb-2 mx-auto" /> */}
                <span className="text-xpurple text-center block">{spec}</span>
              </button>
            ))}
            <button
              type="button"
              className={`className="flex flex-col items-center justify-center w-[200px] sm:w-[180px] md:w-[200px] lg:w-[200px] h-[156px] border border-indigo-100 rounded-[20px] shadow-md p-4 transition-transform transform hover:scale-105 bg-white`}
              onClick={() => handleSpecSelect("Other")}
              style={{
                boxShadow: selectedSpecs.includes("Other")
                  ? 'rgba(255, 85, 0,0.5) 0px 10px 25px -8px'
                  : 'rgba(0, 0, 0, 0.07) 0px 22px 30px -8px',
                transition: 'box-shadow 0.3s ease',
              }}
              onMouseEnter={(e) => {
                if (!selectedSpecs.includes("Other")) {
                  e.currentTarget.style.boxShadow = 'rgba(255, 85, 0,0.5) 0px 10px 25px -8px';
                }
              }}
              onMouseLeave={(e) => {
                if (!selectedSpecs.includes("Other")) {
                  e.currentTarget.style.boxShadow = 'rgba(0, 0, 0, 0.07) 0px 22px 30px -8px';
              }}}
            >
            {/* <img src="/images/sample.png" alt="Other" className="w-16 h-16 mb-2 mx-auto" /> */}
              <span className="text-xpurple text-center block">Other</span>
            </button>
          </div>

          <div className="mt-20 flex justify-center">
            <button
              type="submit"
              className={`w-full max-w-xs px-24 py-6 inline-flex justify-center items-center gap-x-2 text-lg font-medium rounded-lg border border-transparent ${
                selectedSpecs.length > 0
                  ? 'bg-xorange text-white shadow-lg shadow-[rgba(255,85,0,0.5)] transform transition-transform translate-y-[-8px]'
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