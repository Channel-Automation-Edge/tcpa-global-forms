"use client";
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../context/AppContext';

// Define props interface
interface Step3PreferencesProps {
  onNext: () => void;
  onBack: () => void;
}

const Step3Preferences: React.FC<Step3PreferencesProps> = ({ onNext, onBack }) => {
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
    console.log('Contractor Preferences:', selectedPreferences);
    onNext();
  };

  useEffect(() => {
    setSelectedPreferences(contractorPreferences);
  }, [contractorPreferences]);

  return (
    <div className="z-10 max-w-[100rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto relative">
      <button onClick={onBack} className="absolute left-4 top-1/2 transform -translate-y-1/2">
        <img src="/images/back.png" alt="Go Back" className="w-6 h-6" />
      </button>
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="block text-3xl font-bold text-primary dark:text-white">
            Contractor Preferences
          </h1>
          <p className="mt-1 text-gray-600 dark:text-neutral-400">
            Select the preferences that apply to your contractor
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-12 flex flex-col h-full">
          <div
            className="flex flex-wrap justify-center"
            style={{ gap: '20px 30px', marginTop: '15px', width: '100%' }}
          >
            {['Licensed', 'Insured', 'Bonded', 'Top Rated'].map((preference, index) => (
              <button
                key={index}
                type="button"
                className={`eIzKEG transition-transform transform hover:scale-105`}
                onClick={() => handlePreferenceSelect(preference)}
                style={{
                  margin: '0px 0px 10px',
                  width: '170px',
                  height: '100px',
                  overflow: 'hidden',
                  display: 'inline-block',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  position: 'relative',
                  userSelect: 'none',
                  justifyContent: 'space-between',
                  border: '1px solid rgba(236, 236, 236, 0.43)',
                  boxShadow: selectedPreferences.includes(preference)
                    ? 'rgba(254,139,16,0.5) 0px 22px 30px -8px'
                    : 'rgba(0, 0, 0, 0.07) 0px 22px 30px -8px',
                  transition: 'box-shadow 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  if (!selectedPreferences.includes(preference)) {
                    e.currentTarget.style.boxShadow = 'rgba(254,139,16,0.5) 0px 22px 30px -8px';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!selectedPreferences.includes(preference)) {
                    e.currentTarget.style.boxShadow = 'rgba(0, 0, 0, 0.07) 0px 22px 30px -8px';
                  }
                }}
              >
                <span className="text-[#2E5B5E] text-center block">{preference}</span>
              </button>
            ))}
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
