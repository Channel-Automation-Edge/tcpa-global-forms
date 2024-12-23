"use client";
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../context/AppContext';
import supabase from '../../../lib/supabaseClient';
import ResetButton from '@/components/ui/resetButton';
import posthog from 'posthog-js';
import { Button } from '@/components/ui/button';

// Define props interface
interface Step3ContractorsProps {
  onCompleted: () => void;
  onReset: () => void;
  onNotify: () => void;
}

const Step3Contractors: React.FC<Step3ContractorsProps> = ({ onCompleted, onReset, onNotify }) => {
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
    generalOptIn,
    serviceSpecification,
    promo,
    consentedContractors,
    setConsentedContractors,
    numberOfQuotes,
    termsAndPrivacyOptIn,
    userNs,
    teamId,
    contactPreferences,
    setContactPreferences,
    formId
  } = appContext;

  const [error, setError] = useState<string | null>(null);
  const [contactDirectly, setContactDirectly] = useState<string | null>(null);
  const [matchloading, setMatchLoading] = useState<boolean>(true); // Initial Loading state
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const stepName = 'appointment_step3_contractors';

  const handleReset = () => {
    posthog.capture('form_reset', {
      form_id: appContext.formId,
      zip: appContext.zip,
      step: stepName,
      service_id: selectedService,
    });
    onReset();
  };

  const handleNewService = () => {
    posthog.capture('select_new_service', {
      form_id: appContext.formId,
      zip: appContext.zip,
      service_id: selectedService,
      step: stepName,
    });
    onReset();
  }

  const handleNotify = () => {
    posthog.capture('notify_me', {
      form_id: appContext.formId,
      zip: appContext.zip,
      service_id: selectedService,
      step: stepName,
    });
    onNotify();
  };
  
  // Capture the start event for this step
  useEffect(() => {
      // Capture the start event for this step
      posthog.capture(stepName + '_start', {
        form_id: formId,
        service_id: appContext.selectedService,
        zip: appContext.zip,
      });
    }, [stepName]);

  useEffect(() => {
      // Fetch contractors from Supabase
    const fetchContractors = async () => {
      try {
      const { data, error } = await supabase
        .from('Contractors')
        .select('*')
        .filter('services', 'cs', `["${selectedService}"]`)
        .filter('statesServed', 'cs', `["${state}"]`);

      if (error) {
        console.error('Error fetching contractors:', error);
        setError('Error fetching contractors');
        return;
      }

      const filteredContractors = data.map((contractor: any) => ({ ...contractor, optIn: false }));
      setMatchingContractors(filteredContractors);

      // Capture the result in PostHog
      if (filteredContractors.length === 0) {
        posthog.capture('no_contractors_found', {
          form_id: appContext.formId,
          zip: appContext.zip,
          service_id: selectedService,
          step: stepName,
        });
      } else {
        posthog.capture('contractors_found', {
          form_id: appContext.formId,
          zip: appContext.zip,
          service_id: selectedService,
          step: stepName,
        });
      }
    } catch (err) {
      console.error('Unexpected error fetching contractors:', err);
      setError('Unexpected error fetching contractors');
    } finally {
      setMatchLoading(false);
    } 
  };
      appContext.selectedService = localStorage.getItem('selectedService');
      appContext.state = localStorage.getItem('state');
      appContext.matchingContractors = JSON.parse(localStorage.getItem('matchingContractors') || '[]');
      appContext.consentedContractors = [];
  
      if (appContext.matchingContractors.length > 0) { 
        setMatchLoading(false);
        return;
      } else {
        fetchContractors();
      }
    
  }, []);

  

  const handleContractorOptInChange = (contractorId: number, contractorName: string, checked: boolean) => {
    const updatedContractors = matchingContractors.map((contractor) =>
      contractor.id === contractorId ? { ...contractor, optIn: checked } : contractor
    );
    setMatchingContractors(updatedContractors);
  
    // Capture the event with PostHog
    posthog.capture('contractor_optin_toggled', {
      contractor_id: contractorId,
      contractor_name: contractorName,
      state: checked ? 'opted_in' : 'opted_out',
      step: 'your_step_name', // Replace with the relevant step or context
      user_id: 'your_user_id', // Replace with actual user/session ID if available
    });
  
    if (checked) {
      const selectedContractor = updatedContractors.find((contractor) => contractor.id === contractorId);
      if (selectedContractor) {
        setConsentedContractors((prev) => {
          const updatedConsentedContractors = [...prev, selectedContractor];
          return updatedConsentedContractors;
        });
      }
    } else {
      setConsentedContractors((prev) => {
        const updatedConsentedContractors = prev.filter((contractor) => contractor.id !== contractorId);
        return updatedConsentedContractors;
      });
    }
  };
  
  const handleContactPreferencesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    const newPreferences = checked
      ? [...contactPreferences, value]
      : contactPreferences.filter((pref) => pref !== value);
  
    setContactPreferences(newPreferences);
  
    // Capture the toggled preference in PostHog
    posthog.capture('contact_preference_toggled', {
      preference: value,
      state: checked ? 'selected' : 'deselected',
      step: 'your_step_name', // Replace with the relevant step or context
      user_id: 'your_user_id', // Replace with actual user/session ID if available
    });
    };
  

  const handleContactDirectlyChange = (contact: string) => {
    setContactDirectly(contact);

    setContactPreferences([]);
    setConsentedContractors([]);
    setMatchingContractors((prev) =>
      prev.map((contractor) => ({ ...contractor, optIn: false }))
    );

    // Capture the event with PostHog
    posthog.capture('contractor_contact_toggled', {
      state: contactDirectly == 'Yes' ? 'opted_in' : 'opted_out',
      form_id: formId,
      service_id: appContext.selectedService,
      zip: appContext.zip,
      step: stepName,
    });

  };

  const formatPhoneNumber = (phone:string) => {
    if (!phone || phone.length !== 10) {
      return phone; // Return the original value if it's not a 10-digit number
    }
  
    const areaCode = phone.slice(0, 3);
    const centralOfficeCode = phone.slice(3, 6);
    const lineNumber = phone.slice(6);
  
    return `+1 (${areaCode}) ${centralOfficeCode}-${lineNumber}`;
  };
  

  const handleSubmit = async () => {
    const serviceName = selectedService; 
    const formattedPhone = appContext.phone ? formatPhoneNumber(appContext.phone) : '';

    const payload = {
      lead: {
        firstname,
        lastname,
        email,
        phone: formattedPhone,
        generalOptIn,
        zip,
        state,
        service: serviceName,
        serviceSpecification,
        contractorPreferences,
        promo,
      },
      error: null,
      type: 'appointment',
      user_ns: userNs,
      team_id: teamId,
      matchingContractors,
      appointment: appContext.scheduledAppointments,
      consent: {
        sms: {
          description: 'By clicking Confirm Details, I am providing my ESIGN signature and express written consent for Home Project Partners to contact me at the number provided below for marketing purposes. This includes communication via automated technology, such as SMS/MMS messages, Al generative voice, and prerecorded and/or artificial voice messages. I acknowledge my consent is not required to obtain any goods or services and i can reach out to them directly at (888) 508-3081.',
          value: generalOptIn,
        },
        call: {
          description: 'By clicking Confirm Details, I am providing my ESIGN signature and express written consent for Home Project Partners to contact me at the number provided below for marketing purposes. This includes communication via automated technology, such as SMS/MMS messages, Al generative voice, and prerecorded and/or artificial voice messages. I acknowledge my consent is not required to obtain any goods or services and i can reach out to them directly at (888) 508-3081.',
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
    setLoading(true); // Show spinner

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

    } catch (err) {
      console.error('Error sending appointments:', err);
      setError((err as Error).message);
    }
    try {
      // Check if formId exists in the database
      const { data, error } = await supabase
        .from('Forms')
        .select('id')
        .eq('id', formId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking formId:', error);
        await sendErrorWebhook('Error checking formId', error);
        setLoading(false);
        return;
      }

      if (data) {
        // formId exists, update the updated_at column
        const { error: updateError } = await supabase
          .from('Forms')
          .update({ updated_at: new Date().toISOString(), appointment_completion: true })
          .eq('id', formId);

        if (updateError) {
          console.error('Error updating formId:', updateError);
          await sendErrorWebhook('Error updating formId', updateError);
          setLoading(false);
          return;
        }
      } else {
        // formId does not exist, insert a new row
        const { error: insertError } = await supabase
          .from('Forms')
          .insert([{ id: formId, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), appointment_completion: true, phone: formattedPhone, service: appContext.selectedService, state: appContext.state }]);

        if (insertError) {
          console.error('Error inserting formId:', insertError);
          await sendErrorWebhook('Error inserting formId', insertError);
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      await sendErrorWebhook('Unexpected error', err);
      setLoading(false);
      return;
    }

    posthog.capture(stepName + '_complete', {
      form_id: appContext.formId,
      service_id: appContext.selectedService,
      zip: appContext.zip,
    });
    setLoading(false); // Hide spinner
    onCompleted();
  };

  // Function to send a webhook with error details
  const sendErrorWebhook = async (message: string, error: any) => {
    try {
      const response = await fetch('https://hkdk.events/09d0txnpbpzmvq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: {
            message,
            details: error.message || error,
          },
          formId,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        console.error('Failed to send error webhook');
      }
    } catch (webhookError) {
      console.error('Error sending webhook:', webhookError);
    }
  };

  const renderContractorCards = () => (
    <div className="mt-6 space-y-4">
      {matchingContractors.map((contractor) => (
        <div key={contractor.id} className="p-4 border rounded-lg shadow-sm bg-white dark:bg-neutral-800 dark:border-neutral-700 flex flex-row items-center max-w-[720px] mx-auto">
          <div className="flex items-center mb-0 mr-4" style={{ minWidth: '150px' }}>
            <img src={contractor.logo} alt={contractor.name} className="w-16 h-16 rounded-full" />
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
      {matchloading ? (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="animate-spin inline-block size-8 border-[3px] border-current border-t-transparent text-xorange rounded-full dark:text-xorange" role="status" aria-label="loading">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-2 text-xorange dark:text-xorange">Matching you with contractors...</p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          <div className="absolute top-[-102px] custom-smallest:top-[-110px] small-stepper:top-[-115px] sm:top-[-121px] md:top-[-137px] left-0 w-full flex justify-end p-4">
        <ResetButton onClick={handleReset} />
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
            <div className="mt-6 flex flex-col sm:flex-row sm:justify-center sm:space-x-4">
              <button
              type="button"
              onClick={handleNewService}
              className="w-full sm:max-w-xs sm:flex-1 mb-4 sm:mb-0 py-5 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-gray-600 text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
              >
              Select Another Service
              </button>
              <button
                type="button"
                onClick={handleNotify}
                className="w-full sm:max-w-xs sm:flex-1 py-5 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-xorange text-white hover:bg-xorangeDark shadow-lg shadow-[rgba(102,89,83,0.5)]"
              >
                Notify Me
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
                  We will assign your <strong>FREE {numberOfQuotes > 1 ? 'consultations' : 'consultation'}</strong> to {numberOfQuotes > 1 ? 'contractors' : 'a contractor'} from the list above. Expect updates from us soon!
                </p>
              </div>

              <div className="relative flex flex-col justify-center items-center space-y-4">
                {/* <div className="w-full max-w-[45rem] text-left mt-4">
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
                </div> */}
                <div className="w-full max-w-[45rem] text-left mt-4">
                  <div className="flex items-start">
                  <p className='text-gray-600'><span className='text-red-500'> {contactDirectly == 'Yes' || contactDirectly == 'No' ? '' : '*' } </span>Would you like your assigned {numberOfQuotes > 1 ? 'contractors' : 'contractor'} to contact you directly?</p>
                  </div>
                  <div className='mt-4'>
                    <Button onClick={() => handleContactDirectlyChange('Yes')} className={`py-3 px-4 w-20 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-100 mr-4 ${
                  contactDirectly === 'Yes' ? 'bg-orange-200 text-xorange border-xorange hover:bg-orange-200' : 'bg-white text-gray-800 '
                }`}>
                      Yes
                    </Button>
                    <Button onClick={() => handleContactDirectlyChange('No')} className={`py-3 px-4 w-20 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-100 ${
                  contactDirectly === 'No' ? 'bg-orange-200 text-xorange border-xorange hover:bg-orange-200' : 'bg-white text-gray-800'
                }`}>
                      No
                    </Button>
                  </div> 
                </div>

                <div className="w-full max-w-[45rem]">
                  {contactDirectly == 'Yes' && (
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
                            onChange={(e) => handleContractorOptInChange(contractor.id, contractor.name, e.target.checked)}
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
                            }}
                            className=" text-xorange text-sm hover:bg-xorange-dark"
                          >
                            {matchingContractors.every((contractor) => contractor.optIn) ? 'Deselect All' : 'Select All'}
                          </button>
                        </div>
                      </div>

                      {consentedContractors.length > 0 && (
                        <div className="mt-6 text-left">
                          <p className="text-base text-gray-600 dark:text-neutral-400">I consent to be contacted through:</p>
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
                className={`w-full max-w-xs px-24 py-5 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent ${
                  (contactDirectly === null || 
                  (contactDirectly === 'Yes' && (consentedContractors.length === 0 || contactPreferences.length === 0)))
                  ? 'bg-gray-200 text-white cursor-not-allowed' // Disabled styles
                  : 'bg-xorange text-white hover:bg-xorangeDark shadow-lg shadow-[rgba(254,139,16,0.5)] transform transition-transform translate-y-[-8px]' // Enabled styles
                }`}
                disabled={
                  contactDirectly === null || 
                  (contactDirectly === 'Yes' && (consentedContractors.length === 0 || contactPreferences.length === 0))
                }
              >
                {loading ? (
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                ) : (
                  'Confirm Consultation(s)'
                )}
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
