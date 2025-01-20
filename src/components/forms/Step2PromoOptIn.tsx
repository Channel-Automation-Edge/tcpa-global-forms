"use client";
import React, { useContext, useState } from 'react';
import { AppContext } from '@/context/AppContext';
import ResetButton from '@/components/ui/resetButton';
import BackButton from '@/components/ui/backButton';

// Define props interface
interface Step2PromoOptInProps {
  onNext: () => void;
  onBack: () => void;
  onReset: () => void;
}

const Step2PromoOptIn: React.FC<Step2PromoOptInProps> = ({ onNext, onBack, onReset }) => {
  const appContext = useContext(AppContext);

  if (!appContext) {
    return null;
  }

  const { setForm, contractor } = appContext; // Access form and setForm from appContext
  const [loading, setLoading] = useState<boolean>(false);
  const accent_rgba = contractor.colors.accent_rgba || '0 10px 25px -6px rgba(0, 0, 0, 0.1)';

  const handleBack = () => {
    onBack();
  };

  const handleReset = () => {
    onReset();
  };

  const handleSelect = async (promo: string) => {
    setLoading(true); // Show spinner

    setForm((prevForm) => ({
      ...prevForm,
      promo: promo,
    }));
    localStorage.setItem('promo', JSON.stringify(promo));

    setLoading(false); // Hide spinner
    onNext();
  };

  return (
    <div className="z-10 max-w-[100rem] px-4 md:px-14 py-10 lg:py-14 mx-auto relative">
      <div className="absolute top-[-102px] custom-smallest:top-[-110px] small-stepper:top-[-115px] sm:top-[-121px] md:top-[-137px] left-0 w-full flex justify-between p-4">
        <BackButton onClick={handleBack} />
        <ResetButton onClick={handleReset} />
      </div>

      <div className="space-y-8">
        <div className='flex justify-center text-center mb-8'>
          <div className="max-w-[40rem] text-center">
            <h1 className="block text-2xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-3xl font-bold sm:font-bold md:font-semibold lg:font-semibold text-gray-800 dark:text-white">
              Don't miss out—claim your <span className="text-accentColor">special offer</span>
            </h1> 
          </div>
        </div>

        <div className="mt-12 flex flex-col h-full">
          <div className="flex flex-wrap justify-center gap-4 sm:gap-[20px]" style={{ marginTop: '15px', width: '100%' }}>
            {contractor.promos.map((promo: string) => (
              <button
                key={promo}
                type="button"
                className="flex flex-row sm:flex-col items-center justify-start sm:justify-center w-full sm:w-[200px] h-[80px] sm:h-[156px] border border-transparent rounded-xl shadow-md p-4 transition-transform transform hover:scale-100 sm:hover:scale-105 bg-white"
                onClick={() => handleSelect(promo)}
                style={{
                  boxShadow: 'rgba(0, 0, 0, 0.07) 0px 22px 30px -6px',
                  transition: 'box-shadow 0.3s ease',
                  borderColor: 'rgba(157, 176, 197, 0.25)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = accent_rgba + ' 0px 10px 25px -6px ';
                  e.currentTarget.style.borderColor = accent_rgba;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'rgba(0, 0, 0, 0.07) 0px 10px 25px -6px';
                  e.currentTarget.style.borderColor = 'rgba(157, 176, 197, 0.25)';
                }}
              >
                <span className="text-gray-800 text-base font-medium text-left sm:text-center ">{promo}</span>
              </button>
            ))}
          </div>
          {loading && (
            <div className="flex justify-center pt-20">
              <div className="animate-spin h-6 w-6 border-2 border-accentColor border-t-transparent rounded-full"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step2PromoOptIn;
