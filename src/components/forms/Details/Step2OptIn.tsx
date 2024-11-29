"use client";
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../context/AppContext';

// Define props interface
interface Step2OptInProps {
  onNext: () => void;
}

const Step2OptIn: React.FC<Step2OptInProps> = ({ onNext }) => {
  const appContext = useContext(AppContext);

  if (!appContext) {
    return null;
  }

  const { promo, setPromo, newsletterOptIn, setNewsletterOptIn } = appContext;
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
    setNewsletterOptIn(event.target.checked);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!isOptInRequired || (isOptInRequired && newsletterOptIn)) {
      console.log('Promo:', selectedPromo);
      console.log('Newsletter Opt-In:', newsletterOptIn);
      console.log('Is Opt-In Required:', isOptInRequired);
      onNext();
    }
  };

  useEffect(() => {
    setSelectedPromo(promo);
    setIsOptInRequired(promo !== '' && !newsletterOptIn);
  }, [promo, newsletterOptIn]);

  return (
    <div className="z-10 max-w-[100rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto relative">
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
                className={`className="flex flex-col items-center justify-center w-[200px] sm:w-[180px] md:w-[200px] lg:w-[200px] h-[120px] border border-indigo-100 rounded-[20px] shadow-md p-4 transition-transform transform hover:scale-105 bg-lpurple`}
                onClick={() => handlePromoSelect(promoOption)}
                style={{

                  boxShadow: selectedPromo === promoOption
                    ? 'rgba(254,139,16,0.5) 0px 22px 30px -8px'
                    : 'rgba(0, 0, 0, 0.07) 0px 22px 30px -8px',
                  transition: 'box-shadow 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  if (selectedPromo !== promoOption) {
                    e.currentTarget.style.boxShadow = 'rgba(254,139,16,0.5) 0px 22px 30px -8px';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedPromo !== promoOption) {
                    e.currentTarget.style.boxShadow = 'rgba(0, 0, 0, 0.07) 0px 22px 30px -8px';
                  }
                }}
              >
                <span className="text-xpurple text-center block">{promoOption}</span>
              </button>
            ))}
          </div>

          <div className="flex justify-center mt-14 mb-10">
            <div className="w-[700px]">
              <div className="flex items-start">
                <input
                  id="newsletterOptIn"
                  name="newsletterOptIn"
                  type="checkbox"
                  checked={newsletterOptIn}
                  onChange={handleOptInChange}
                  className="h-4 w-4 text-xorange border-gray-300 rounded focus:ring-xorange"
                />
                <label htmlFor="newsletterOptIn" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                  I agree to receive special offers and promotions.
                </label>
              </div>
              {isOptInRequired && !newsletterOptIn && (
                <div className="text-sm text-red-400">
                  Please opt-in to receive the selected promo.
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              type="submit"
              className={`w-full max-w-xs px-24 py-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent ${
                (!isOptInRequired || (isOptInRequired && newsletterOptIn))
                  ? 'bg-xorange text-white shadow-lg shadow-[rgba(254,139,16,0.5)] transform transition-transform translate-y-[-4px]'
                  : 'bg-gray-200 text-white cursor-not-allowed'
              }`}
              disabled={isOptInRequired && !newsletterOptIn}
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