"use client";
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../context/AppContext';

// Define props interface
interface Step2OptInProps {
  onNext: () => void;
  onBack: () => void;
}

const Step2OptIn: React.FC<Step2OptInProps> = ({ onNext, onBack }) => {
  const appContext = useContext(AppContext);

  if (!appContext) {
    return null;
  }

  const { promo, setPromo, generalOptIn, setGeneralOptIn } = appContext;
  const [selectedPromo, setSelectedPromo] = useState<string>(promo);
  const [isOptInRequired, setIsOptInRequired] = useState<boolean>(false);

  const handlePromoSelect = (selectedPromo: string) => {
    if (selectedPromo === promo) {
      setPromo('');
      setSelectedPromo('');
      setIsOptInRequired(false);
    } else {
      setPromo(selectedPromo);
      setSelectedPromo(selectedPromo);
      setIsOptInRequired(true);
    }
  };

  const handleOptInChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGeneralOptIn(event.target.checked);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!isOptInRequired || (isOptInRequired && generalOptIn)) {
      console.log('Promo:', selectedPromo);
      console.log('General Opt-In:', generalOptIn);
      onNext();
    }
  };

  useEffect(() => {
    setSelectedPromo(promo);
  }, [promo]);

  return (
    <div className="z-10 max-w-[100rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto relative">
      <button onClick={onBack} className="absolute left-4 top-1/2 transform -translate-y-1/2">
        <img src="/images/back.png" alt="Go Back" className="w-6 h-6" />
      </button>
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="block text-3xl font-bold text-primary dark:text-white">
            Don’t Miss Out, Claim your Special Offer!
          </h1>
          <p className="mt-1 text-gray-600 dark:text-neutral-400">
            Select a promo and opt-in to receive special offers.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-12 flex flex-col h-full">
          <div
            className="flex flex-wrap justify-center"
            style={{ gap: '20px 30px', marginTop: '15px', width: '100%' }}
          >
            {['10% Off', 'Free Labor', 'Mystery Promo', 'Discounted Materials'].map((promoOption) => (
              <button
                key={promoOption}
                type="button"
                className="eIzKEG transition-transform transform hover:scale-105"
                onClick={() => handlePromoSelect(promoOption)}
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
                  justifyContent: 'center',
                  alignItems: 'center',
                  border: '1px solid rgba(236, 236, 236, 0.43)',
                  boxShadow: selectedPromo === promoOption
                    ? 'rgba(254,79,0,0.5) 0px 22px 30px -8px'
                    : 'rgba(0, 0, 0, 0.07) 0px 22px 30px -8px',
                  transition: 'box-shadow 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  if (selectedPromo !== promoOption) {
                    e.currentTarget.style.boxShadow = 'rgba(254,79,0,0.5) 0px 22px 30px -8px';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedPromo !== promoOption) {
                    e.currentTarget.style.boxShadow = 'rgba(0, 0, 0, 0.07) 0px 22px 30px -8px';
                  }
                }}
              >
                <span className="text-[#2E5B5E] text-center block">{promoOption}</span>
              </button>
            ))}
          </div>

          <div className="flex justify-center mt-14 mb-10">
            <div className="w-[700px]">
              <div className="flex items-start">
                <input
                  id="generalOptIn"
                  name="generalOptIn"
                  type="checkbox"
                  checked={generalOptIn}
                  onChange={handleOptInChange}
                  className="h-4 w-4 text-[#FE4F00] border-gray-300 rounded focus:ring-[#FE4F00]"
                />
                <label htmlFor="generalOptIn" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                  I agree to receive special offers and promotions.
                </label>
              </div>
              {isOptInRequired && !generalOptIn && (
                <div className="text-sm text-red-500">
                  Please opt-in to receive the selected promo.
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              type="submit"
              className={`w-full max-w-xs px-24 py-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent ${
                (!isOptInRequired || (isOptInRequired && generalOptIn))
                  ? 'bg-[#FE4F00] text-white shadow-lg shadow-[rgba(254,79,0,0.5)] transform transition-transform translate-y-[-4px]'
                  : 'bg-gray-200 text-white cursor-not-allowed'
              }`}
              disabled={isOptInRequired && !generalOptIn}
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Step2OptIn;
