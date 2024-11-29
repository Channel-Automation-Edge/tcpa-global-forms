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
        <div className="text-center">
          <h1 className="block text-3xl font-bold text-primary dark:text-white">
            Specify Your Needs
          </h1>
          <p className="mt-1 text-gray-600 dark:text-neutral-400">
            Select the specifications that apply to your selected service
          </p>
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
                className={`eIzKEG transition-transform transform hover:scale-105`}
                onClick={() => handleSpecSelect(spec)}
                style={{
                  margin: '0px 0px 10px',
                  width: '170px',
                  height: '200px',
                  overflow: 'hidden',
                  display: 'inline-block',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  position: 'relative',
                  userSelect: 'none',
                  justifyContent: 'space-between',
                  border: '1px solid rgba(236, 236, 236, 0.43)',
                  boxShadow: selectedSpecs.includes(spec)
                    ? 'rgba(254,139,16,0.5) 0px 22px 30px -8px'
                    : 'rgba(0, 0, 0, 0.07) 0px 22px 30px -8px',
                  transition: 'box-shadow 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  if (!selectedSpecs.includes(spec)) {
                    e.currentTarget.style.boxShadow = 'rgba(254,139,16,0.5) 0px 22px 30px -8px';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!selectedSpecs.includes(spec)) {
                    e.currentTarget.style.boxShadow = 'rgba(0, 0, 0, 0.07) 0px 22px 30px -8px';
                  }
                }}
              >
                <img src="/images/sample.png" alt={spec} className="w-16 h-16 mb-2 mx-auto" />
                <span className="text-[#2E5B5E] text-center block">{spec}</span>
              </button>
            ))}
            <button
              type="button"
              className={`eIzKEG transition-transform transform hover:scale-105`}
              onClick={() => handleSpecSelect("Other")}
              style={{
                margin: '0px 0px 10px',
                width: '170px',
                height: '200px',
                overflow: 'hidden',
                display: 'inline-block',
                borderRadius: '8px',
                cursor: 'pointer',
                position: 'relative',
                userSelect: 'none',
                justifyContent: 'space-between',
                border: '1px solid rgba(236, 236, 236, 0.43)',
                boxShadow: selectedSpecs.includes("Other")
                  ? 'rgba(254,139,16,0.5) 0px 22px 30px -8px'
                  : 'rgba(0, 0, 0, 0.07) 0px 22px 30px -8px',
                transition: 'box-shadow 0.3s ease',
              }}
              onMouseEnter={(e) => {
                if (!selectedSpecs.includes("Other")) {
                  e.currentTarget.style.boxShadow = 'rgba(254,139,16,0.5) 0px 22px 30px -8px';
                }
              }}
              onMouseLeave={(e) => {
                if (!selectedSpecs.includes("Other")) {
                  e.currentTarget.style.boxShadow = 'rgba(0, 0, 0, 0.07) 0px 22px 30px -8px';
              }}}
            >
            <img src="/images/sample.png" alt="Other" className="w-16 h-16 mb-2 mx-auto" />
              <span className="text-[#2E5B5E] text-center block">Other</span>
            </button>
          </div>

          <div className="mt-20 flex justify-center">
            <button
              type="submit"
              className={`w-full max-w-xs px-24 py-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent ${
                selectedSpecs.length > 0
                  ? 'bg-xorange text-white shadow-lg shadow-[rgba(254,139,16,0.5)] transform transition-transform translate-y-[-8px]'
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