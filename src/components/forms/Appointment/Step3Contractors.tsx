"use client";
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../context/AppContext';
import contractorsData from '../../../assets/assets.json';
import servicesData from '../../../assets/assets.json'; 

// Define props interface
interface Step3ContractorsProps {
  onCompleted: () => void;
  onReset: () => void;
}

const Step3Contractors: React.FC<Step3ContractorsProps> = ({ onCompleted, onReset }) => {
  const appContext = useContext(AppContext);

  if (!appContext) {
    return null;
  }

  const {
    selectedService,
    matchingContractors,
    setMatchingContractors,
    zip,
    state,
    contractorPreferences,
    firstname,
    lastname,
    email,
    phone,
    generalOptIn,
    serviceSpecifications,
    promo,
    consentedContractors,
    setConsentedContractors,
    numberOfQuotes,
    termsAndPrivacyOptIn
  } = appContext;

  const [error, setError] = useState<string | null>(null);
  const [contactDirectly, setContactDirectly] = useState<boolean>(false);
  const [contactPreferences, setContactPreferences] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  useEffect(() => {
    // Simulate loading process
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000); // 3-second delay

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const filteredContractors = contractorsData.contractors
      .filter(
        (contractor) =>
          contractor.services.includes(selectedService) &&
          contractor.zip === zip &&
          contractor.state === state
      )
      .map((contractor) => ({ ...contractor, optIn: false }));

    setMatchingContractors(filteredContractors);
  }, [selectedService, zip, state, setMatchingContractors]);

  const handleContractorOptInChange = (contractorId: number, checked: boolean) => {
    const updatedContractors = matchingContractors.map((contractor) =>
      contractor.id === contractorId ? { ...contractor, optIn: checked } : contractor
    );
    setMatchingContractors(updatedContractors);

    if (checked) {
      const selectedContractor = updatedContractors.find((contractor) => contractor.id === contractorId);
      if (selectedContractor) {
        setConsentedContractors((prev) => {
          const updatedConsentedContractors = [...prev, selectedContractor];
          console.log('Consented Contractors:', updatedConsentedContractors);
          return updatedConsentedContractors;
        });
      }
    } else {
      setConsentedContractors((prev) => {
        const updatedConsentedContractors = prev.filter((contractor) => contractor.id !== contractorId);
        console.log('Consented Contractors:', updatedConsentedContractors);
        return updatedConsentedContractors;
      });
    }

    if (consentedContractors.length === 0) {
      setContactPreferences([]);
    }
  };

  const handleContactPreferencesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    const newPreferences = checked
      ? [...contactPreferences, value]
      : contactPreferences.filter((pref) => pref !== value);
    setContactPreferences(newPreferences);
    console.log('Contact Preferences:', newPreferences);
  };

  const handleContactDirectlyChange = (checked: boolean) => {
    setContactDirectly(checked);
    if (!checked) {
      setContactPreferences([]);
      setConsentedContractors([]);
      setMatchingContractors((prev) =>
        prev.map((contractor) => ({ ...contractor, optIn: false }))
      );
    }
  };

  const handleSubmit = async () => {
    const serviceName = servicesData.services.find(
      (service) => service.id === selectedService
    )?.name || 'Unknown Service';

    const payload = {
      lead: {
        firstname,
        lastname,
        email,
        phone,
        generalOptIn,
        zip,
        state,
        service: serviceName,
        serviceSpecifications,
        contractorPreferences,
        promo,
      },
      error: null,
      type: 'appointment',
      matchingContractors,
      appointment: appContext.scheduledAppointments,
      consent: {
        general: {
          description: 'By clicking Confirm Details, I am providing my ESIGN signature and express written consent for Project Quotes to contact me at the number provided below for marketing purposes. This includes communication via automated technology, such as SMS/MMS messages, Al generative voice, and prerecorded and/or artificial voice messages. I acknowledge my consent is not required to obtain any goods or services and i can reach out to them directly at (888) 508-3081.',
          value: generalOptIn,
        },
        email: {
          description: 'By checking this box, you consent to receive marketing emails from us. You can unsubscribe at any time by clicking the "unsubscribe" link at the bottom of our emails or by contacting us at [your email address]. We will process your information in accordance with our Privacy Policy',
          value: appContext.newsletterOptIn,
        },
        oneToOne: {
          description: 'By clicking Confirm Consulation(s), I am providing my ESIGN signature and express written consent agreement to permit the company, or companies selected above, and parties calling on their behalf, to contact me at the number provided below for marketing purposes including through the use of automated technology, such as SMS/MMS messages, AI generative voice, and prerecorded and/or artificial voice messages. I acknowledge my consent is not required to obtain any goods or services and I can reach out to them directly at (888) 508-3081.',
          consentedContractors,
          contactPreferences,
        },
        termsAndPrivacy: {
          description: "I have read and accept the Terms & Conditions and Privacy Policy",
          value: termsAndPrivacyOptIn,
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
        throw new Error('Failed to send appointments');
      }

      console.log('Appointments sent successfully');
    } catch (err) {
      console.error('Error sending appointments:', err);
      setError((err as Error).message);
    }
    onCompleted();
  };

  const renderContractorCards = () => (
    <div className="mt-6 space-y-4">
      {matchingContractors.map((contractor) => (
        <div key={contractor.id} className="p-4 border rounded-lg shadow-sm bg-white dark:bg-neutral-800 dark:border-neutral-700 flex flex-row items-center max-w-[720px] mx-auto">
          <div className="flex items-center mb-0 mr-4" style={{ minWidth: '150px' }}>
            <img src={contractor.photo} alt={contractor.name} className="w-16 h-16 rounded-full" />
            <div className="ml-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">{contractor.name}</h3>
              <p className="text-sm text-gray-600 dark:text-neutral-400">{contractor.zip}, {contractor.state}</p>
            </div>
          </div>
          <div className="flex-grow text-center mb-0 mx-3" >
            <div className="flex flex-wrap gap-2 justify-start">
              {contractorPreferences.map((pref, idx) => (
                <span key={idx} className="py-1 px-2 inline-flex items-center gap-x-1 text-xs font-medium bg-teal-100 text-teal-800 rounded-full dark:bg-teal-500/10 dark:text-teal-500">
                  <svg className="shrink-0" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                    <path d="m9 12 2 2 4-4"></path>
                  </svg>
                  {pref}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="z-10 max-w-[100rem] px-4 lg:px-14 py-10 lg:py-14 mx-auto relative">
      {loading ? (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="animate-spin inline-block size-8 border-[3px] border-current border-t-transparent text-xorange rounded-full dark:text-xorange" role="status" aria-label="loading">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-2 text-xorange dark:text-xorange">Matching you with contractors...</p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          <div className="absolute top-[-102px] custom-smallest:top-[-110px] small-stepper:top-[-115px] sm:top-[-121px] md:top-[-137px] left-0 w-full flex justify-between p-4">
        <button className="items-center hidden ">
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
          <div className='flex justify-center text-center mb-8'>
            <div className="max-w-[40rem] text-center">
              <h1 className="block text-2xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-3xl font-bold sm:font-bold md:font-semibold lg:font-semibold text-gray-800 dark:text-white">
                {matchingContractors.length === 0 ? (
                  "Oh no! There are no experts in your area—please try another service"
                ) : (
                  <>
                    Great news! We <span className="text-xorange">found experts</span> in your area who are ready to help
                  </>
                )}
              </h1>
            </div>
          </div>

          {matchingContractors.length === 0 ? (
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={onReset}
                className="py-2 px-4 bg-xorange text-white rounded-lg hover:bg-xorange-dark"
              >
                Select Another Project
              </button>
            </div>
          ) : (
            <>
              {renderContractorCards()}

              {error && (
                <div className="mt-4 text-center text-red-600">
                  {error}
                </div>
              )}

              <div className="mt-10 mb-10 text-center">
                <p className="text-base text-gray-600  dark:text-neutral-400">
                  You will receive an update from us regarding your scheduled <strong>FREE  {numberOfQuotes > 1 ? 'consultations' : 'consultation'}</strong>.
                </p>
              </div>

              <div className="relative flex flex-col justify-center items-center space-y-4">
                <div className="w-full max-w-[45rem] text-left mt-4">
                  <div className="flex items-start">
                    <input
                      id="contactDirectly"
                      name="contactDirectly"
                      type="checkbox"
                      checked={contactDirectly}
                      onChange={(e) => handleContactDirectlyChange(e.target.checked)}
                      className="h-6 w-6 text-xorange border-gray-300 rounded focus:ring-xorange"
                    />
                    <label htmlFor="contactDirectly" className="ml-4 block text-base text-gray-800 dark:text-gray-300">
                      Optional: By checking this box, I authorize the assigned contractor(s) to contact me directly.
                    </label>
                  </div>
                </div>

                <div className="w-full max-w-[45rem]">
                  {contactDirectly && (
                    <div className="mt-1 text-left">
                      <p className="text-base text-gray-600 dark:text-neutral-400">
                        Select companies below to allow them to contact you regarding your {numberOfQuotes > 1 ? 'consultations' : 'consultation'}. Please note, the selected companies will contact you <strong>only if they are assigned</strong> to your consultation.
                      </p>
                      <div className="mt-4 space-y-2">
                        {matchingContractors.map((contractor) => (
                          <div key={contractor.id} className="flex items-center justify-left">
                            <input
                              id={`contractor-${contractor.id}`}
                              name={`contractor-${contractor.id}`}
                              type="checkbox"
                              checked={contractor.optIn}
                              onChange={(e) => handleContractorOptInChange(contractor.id, e.target.checked)}
                              className="h-6 w-6 text-xorange border-gray-300 rounded focus:ring-xorange"
                            />
                            <label htmlFor={`contractor-${contractor.id}`} className="ml-2 text-base text-gray-800 dark:text-gray-300">
                              {contractor.name}
                            </label>
                          </div>
                        ))}
                        <div className="mt-4">
                          <button
                            type="button"
                            onClick={() => {
                              const allSelected = matchingContractors.every((contractor) => contractor.optIn);
                              const updatedContractors = matchingContractors.map((contractor) => ({
                                ...contractor,
                                optIn: !allSelected,
                              }));
                              setMatchingContractors(updatedContractors);
                              setConsentedContractors(!allSelected ? updatedContractors : []);
                              console.log('Select All Contractors:', updatedContractors);
                            }}
                            className=" text-xorange text-sm hover:bg-xorange-dark"
                          >
                            {matchingContractors.every((contractor) => contractor.optIn) ? 'Deselect All' : 'Select All'}
                          </button>
                        </div>
                      </div>

                      {consentedContractors.length > 0 && (
                        <div className="mt-6 text-left">
                          <p className="text-base text-gray-800 dark:text-neutral-400">I prefer to be contacted through:</p>
                          <div className="mt-4 space-y-2">
                            {['phone', 'sms', 'email'].map((method) => (
                              <div key={method} className="flex items-left justify-left">
                                <input
                                  id={`contact-${method}`}
                                  name={`contact-${method}`}
                                  type="checkbox"
                                  value={method}
                                  checked={contactPreferences.includes(method)}
                                  onChange={handleContactPreferencesChange}
                                  className="h-6 w-6 text-xorange border-gray-300 rounded focus:ring-xorange"
                                />
                                <label htmlFor={`contact-${method}`} className="ml-2 text-base text-gray-800 dark:text-gray-300">
                                  {method.charAt(0).toUpperCase() + method.slice(1)}
                                </label>
                              </div>
                            ))}
                          </div>
                          <p className="mt-4 text-sm text-gray-700 dark:text-neutral-400">By clicking Confirm Consulation(s), I am providing my ESIGN signature and express written consent agreement to permit the company, or companies selected above, and parties calling on their behalf, to contact me at the number provided below for marketing purposes including through the use of automated technology, such as SMS/MMS messages, AI generative voice, and prerecorded and/or artificial voice messages. I acknowledge my consent is not required to obtain any goods or services and I can reach out to them directly at (888) 508-3081.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-20 flex justify-center">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full max-w-xs px-0 py-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-xorange text-white shadow-lg shadow-[rgba(254,139,16,0.5)] transform transition-transform translate-y-[-8px]"
                >
                  Confirm Consultation(s)
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Step3Contractors;