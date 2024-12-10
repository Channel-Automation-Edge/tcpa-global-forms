"use client";
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../context/AppContext';

// Define props interface
interface Step3PreferencesProps {
  onNext: () => void;
  onBack: () => void;
  onReset: () => void;
}

const Step3Preferences: React.FC<Step3PreferencesProps> = ({ onNext, onBack, onReset }) => {
  const appContext = useContext(AppContext);

  if (!appContext) {
    return null;
  }

  const { contractorPreferences, setContractorPreferences } = appContext;
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>(contractorPreferences);

  const handlePreferenceSelect = (preference: string) => {
    setSelectedPreferences(prev =>
      prev.includes(preference) ? prev.filter(p => p !== preference) : [...prev, preference]
    );
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setContractorPreferences(selectedPreferences);
    localStorage.setItem('contractorPreferences', JSON.stringify(contractorPreferences));
    console.log('Contractor Preferences:', selectedPreferences);
    onNext();
  };

  useEffect(() => {
    setSelectedPreferences(contractorPreferences);
  }, [contractorPreferences]);

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
            What <span className="text-xorange">kind of expert</span> are you looking for? Don't worry, choosing won't cost you a thing!
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-12 flex flex-col h-full">
          <div className="flex flex-wrap justify-center gap-4 sm:gap-[20px]" style={{ marginTop: '15px', width: '100%' }}>
            {['Licensed', 'Insured', 'Bonded', 'Top Rated'].map((preference, index) => {
              // Determine the correct icon based on the preference
              const iconSrc = {
                Licensed: '/images/license.svg',
                Insured: '/images/insured.svg',
                Bonded: '/images/bond.svg',
                'Top Rated': '/images/rated.svg',
              }[preference];

              return (
                <button
                  key={index}
                  type="button"
                  className="flex flex-row sm:flex-col items-center justify-start sm:justify-center w-full sm:w-[200px] h-[80px] sm:h-[156px] border border-transparent rounded-xl shadow-md p-4 transition-transform transform hover:scale-100 sm:hover:scale-105 bg-white"
                  onClick={() => handlePreferenceSelect(preference)}
                  style={{
                    boxShadow: selectedPreferences.includes(preference)
                      ? 'rgba(255, 81, 0, 0.7) 0px 10px 25px -6px'
                      : 'rgba(0, 0, 0, 0.07) 0px 22px 30px -6px',
                    transition: 'box-shadow 0.3s ease',
                    borderColor: selectedPreferences.includes(preference)
                      ? 'rgba(255, 81, 0, 0.7)'
                      : 'rgba(157, 176, 197, 0.25)',
                  }}
                  onMouseEnter={(e) => {
                    if (!selectedPreferences.includes(preference)) {
                      e.currentTarget.style.boxShadow = 'rgba(255, 81, 0, 0.7) 0px 10px 25px -6px';
                      e.currentTarget.style.borderColor = 'rgba(255, 81, 0, 0.7)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!selectedPreferences.includes(preference)) {
                      e.currentTarget.style.boxShadow = 'rgba(0, 0, 0, 0.07) 0px 22px 30px -6px';
                      e.currentTarget.style.borderColor = 'rgba(157, 176, 197, 0.25)';
                    }
                  }}
                >
                  <img
                    src={iconSrc}
                    alt={`${preference} icon`}
                    className="w-12 h-12 sm:w-14 sm:h-14 sm:mb-4 ml-2 mr-4 sm:ml-0 sm:mr-0"
                  />
                  <span className="text-gray-800 text-base font-medium text-center sm:text-left">{preference}</span>
                </button>
              );
            })}
          </div>


          <div className="mt-20 flex justify-center">
            <button
              type="submit"
              className={`w-full max-w-xs px-24 py-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent ${
                selectedPreferences.length > 0
                  ? 'bg-xorange text-white shadow-lg shadow-[rgba(254,139,16,0.5)] transform transition-transform translate-y-[-8px]'
                  : 'bg-gray-200 text-white cursor-not-allowed'
              }`}
              disabled={selectedPreferences.length === 0}
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Step3Preferences;
