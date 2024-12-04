"use client";
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../context/AppContext';

// Define props interface
interface Step2PromoOptInProps {
  onNext: () => void;
}

const Step2PromoOptIn: React.FC<Step2PromoOptInProps> = ({ onNext }) => {
  const appContext = useContext(AppContext);

  if (!appContext) {
    return null;
  }

  const { promo, setPromo, newsletterOptIn, setNewsletterOptIn, generalOptIn, setGeneralOptIn, phone, firstname, lastname, email, zip, state, selectedService, serviceSpecifications, contractorPreferences, termsAndPrivacyOptIn } = appContext;
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

  const handleNewsletterOptInChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewsletterOptIn(event.target.checked);
  };

  const handleGeneralOptInChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGeneralOptIn(event.target.checked);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (generalOptIn && (!isOptInRequired || (isOptInRequired && newsletterOptIn))) {
      const payload = {
        lead: {
          firstname,
          lastname,
          email,
          phone,
          termsAndPrivacyOptIn,
          zip,
          state,
          selectedService,
          serviceSpecifications,
          contractorPreferences,
          promo: selectedPromo,
        },
        error: null,
        type: 'lead',
        consent: {
          SMS: {
            description: 'By clicking Confirm Details, I am providing my ESIGN signature and express written consent for Project Quotes to contact me at the number provided below for marketing purposes. This includes communication via automated technology, such as SMS/MMS messages, Al generative voice, and prerecorded and/or artificial voice messages. I acknowledge my consent is not required to obtain any goods or services and i can reach out to them directly at (888) 508-3081.',
            termsAndPrivacyOptIn,
          },
          Newsletter: {
            description: 'By checking this box, you consent to receive marketing emails from us. You can unsubscribe at any time by clicking the "unsubscribe" link at the bottom of our emails or by contacting us at [your email address]. We will process your information in accordance with our Privacy Policy',
            newsletterOptIn,
          },
          TermsAndPrivacy: {
            description: "I have read and accept the Terms & Conditions and Privacy Policy",
            termsAndPrivacy: termsAndPrivacyOptIn,
          },
        },
      };

      try {
        const response = await fetch('https://hkdk.events/09d0txnpbpzmvq', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error('Failed to send lead information');
        }

        console.log('Lead information sent successfully');
      } catch (err) {
        console.error('Error sending lead information:', err);
      }

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
        <div className='flex justify-center text-center mb-8'>
          <div className="max-w-[40rem] text-center">
            <h1 className="block text-2xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-3xl font-bold sm:font-bold md:font-semibold lg:font-semibold text-gray-800 dark:text-white">
            Don't miss out—claim your <span className="text-xorange">special offer</span> when you subscribe to our newsletter
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-12 flex flex-col h-full">
        <div className="flex flex-wrap justify-center gap-4 sm:gap-[20px]" style={{ marginTop: '15px', width: '100%' }}>
  {['10% Off', 'Free Labor', 'Mystery Promo', 'Discounted Materials'].map((promoOption) => (
    <button
      key={promoOption}
      type="button"
      className="flex flex-row sm:flex-col items-center justify-start sm:justify-center w-full sm:w-[200px] h-[80px] sm:h-[120px] border border-transparent rounded-xl shadow-md p-4 transition-transform transform hover:scale-100 sm:hover:scale-105 bg-white"
      onClick={() => handlePromoSelect(promoOption)}
      style={{
        boxShadow: selectedPromo === promoOption
          ? 'rgba(255, 81, 0, 0.7) 0px 10px 25px -6px'
          : 'rgba(0, 0, 0, 0.07) 0px 22px 30px -6px',
        transition: 'box-shadow 0.3s ease',
        borderColor: selectedPromo === promoOption
          ? 'rgba(255, 81, 0, 0.7)'
          : 'rgba(157, 176, 197, 0.25)',
      }}
      onMouseEnter={(e) => {
        if (selectedPromo !== promoOption) {
          e.currentTarget.style.boxShadow = 'rgba(255, 81, 0, 0.7) 0px 10px 25px -6px';
          e.currentTarget.style.borderColor = 'rgba(255, 81, 0, 0.7)';
        }
      }}
      onMouseLeave={(e) => {
        if (selectedPromo !== promoOption) {
          e.currentTarget.style.boxShadow = 'rgba(0, 0, 0, 0.07) 0px 22px 30px -6px';
          e.currentTarget.style.borderColor = 'rgba(157, 176, 197, 0.25)';
        }
      }}
    >
      <span className="text-gray-800 text-base font-medium text-center sm:text-left">{promoOption}</span>
    </button>
  ))}
</div>


          <div className="flex justify-center mt-14 mb-10">
            <div className="mx-auto max-w-[900px]">
              <div className="flex items-start">
                <input
                  id="newsletterOptIn"
                  name="newsletterOptIn"
                  type="checkbox"
                  checked={newsletterOptIn}
                  onChange={handleNewsletterOptInChange}
                  className="h-6 w-6 mt text-xorange border-gray-300 rounded focus:ring-xorange"
                />
                <label htmlFor="newsletterOptIn" className="ml-4 block text-base text-gray-900 dark:text-gray-300">
                  I would like to receive marketing emails from Project Quotes. I understand that I can unsubscribe at any time.
                </label>
              </div>
              {newsletterOptIn && (
                <div className="mt-2 text-sm text-gray-600 dark:text-neutral-400 ml-10">
                  By agreeing, I consent to receive marketing emails from Project Quotes. I can unsubscribe at any time by clicking the "unsubscribe" link at the bottom of our emails or by contacting us at projectquotes@email.com. We will process your information in accordance with our Privacy Policy.
                </div>
              )}
              {isOptInRequired && !newsletterOptIn && (
                <div className="text-sm text-red-500 mt-2">
                  Please opt-in to receive the selected promo.
                </div>
              )}
              <div className="flex items-start mt-4">
                <input
                  id="generalOptIn"
                  name="generalOptIn"
                  type="checkbox"
                  checked={generalOptIn}
                  onChange={handleGeneralOptInChange}
                  className="h-6 w-6 mt-0 text-xorange border-gray-300 rounded focus:ring-xorange"
                />
                <label htmlFor="generalOptIn" className="ml-4 block text-base text-gray-900 dark:text-gray-300">{!generalOptIn && <span className="text-red-500">* </span>}
                  I agree to receiving updates about my project through SMS messages. I understand that I can opt-out anytime.
                  
                </label>
              </div>
              {generalOptIn && (
                <div className="mt-2 text-sm text-gray-600 dark:text-neutral-400 ml-10">
                  By agreeing, I am providing my ESIGN signature and express written consent for Project Quotes to contact me at the number provided below for marketing purposes. This includes communication via automated technology, such as SMS/MMS messages, AI generative voice, and prerecorded and/or artificial voice messages. I acknowledge my consent is not required to obtain any goods or services and I can reach out to them directly at (888) 508-3081.
                  <br />
                  My phone number where Project Quotes may contact me is: {phone}
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              type="submit"
              className={`w-full max-w-xs px-24 py-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent ${
                generalOptIn && (!isOptInRequired || (isOptInRequired && newsletterOptIn))
                  ? 'bg-xorange text-white shadow-lg shadow-[rgba(254,139,16,0.5)] transform transition-transform translate-y-[-4px]'
                  : 'bg-gray-200 text-white cursor-not-allowed'
              }`}
              disabled={!generalOptIn || (isOptInRequired && !newsletterOptIn)}
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Step2PromoOptIn;