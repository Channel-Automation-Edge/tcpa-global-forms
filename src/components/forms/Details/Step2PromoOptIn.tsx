"use client";
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../context/AppContext';
import supabase from '../../../lib/supabaseClient';
import ResetButton from '@/components/ui/resetButton';
import BackButton from '@/components/ui/backButton';
import posthog from 'posthog-js';

// Define props interface
interface Step2PromoOptInProps {
  onNext: () => void;
  onBack: () => void;
  onReset: () => void;
  notifyServiceAvailablility: boolean;
}

const Step2PromoOptIn: React.FC<Step2PromoOptInProps> = ({ onNext, onBack, onReset, notifyServiceAvailablility }) => {
  const appContext = useContext(AppContext);

  if (!appContext) {
    return null;
  }

  const { promo, setPromo, newsletterOptIn, setNewsletterOptIn, generalOptIn, setGeneralOptIn, phone, firstname, lastname, email, zip, state, selectedService, serviceSpecification, contractorPreferences, termsAndPrivacyOptIn, userNs, teamId, formId } = appContext;
  const [selectedPromo, setSelectedPromo] = useState<string>(promo);
  const [isOptInRequired, setIsOptInRequired] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false); // State to control spinner
  const [serviceName, setServiceName] = useState<string>('Unknown Service'); // State to store the service name
  const stepName = 'details_step2_optIn';

  const handleReset = () => {
    posthog.capture('form_reset', {
      form_id: appContext.formId,
      zip: appContext.zip,
      step: stepName,
      service_id: appContext.selectedService,
    });
    onReset();
  };
  
  const handleBack = () => { 
    posthog.capture('form_back', {
      form_id: appContext.formId,
      zip: appContext.zip,
      service_id: selectedService,
      step: stepName,
      previous_step: 'details_step1_confirmInfo',
    });
    onBack(); 
  };

  useEffect(() => {
    // Capture the start event for this step
    posthog.capture(stepName + '_start', {
      form_id: formId,
      service_id: appContext.selectedService,
      zip: appContext.zip,
    });

  }, [stepName]);

  useEffect(() => {
    const fetchServiceName = async () => {
      if (!selectedService) return;

      try {
        const { data, error } = await supabase
          .from('Services')
          .select('name')
          .eq('id', selectedService)
          .single();

        if (error) {
          console.error('Error fetching service name:', error);
          return;
        }

        setServiceName(data.name); // Set the fetched service name
      } catch (err) {
        console.error('Unexpected error fetching service name:', err);
      }
    };

    fetchServiceName();
  }, [selectedService]);

  // prevent preselect
  useEffect(() => {
    setSelectedPromo('');
    setPromo('');
    setIsOptInRequired(false);
  }, []);

  const handlePromoSelect = (promoOption: string) => {
    const isSelected = selectedPromo === promoOption;
  
    if (isSelected) {
      setSelectedPromo('');
      setIsOptInRequired(false);
    } else { 
      setSelectedPromo(promoOption);
      setIsOptInRequired(true);
    }
  
    // Capture the event with PostHog
    posthog.capture('promo_toggled', {
      promo: promoOption,
      state: isSelected ? 'deselected' : 'selected',
      form_id: formId,
      service_id: appContext.selectedService,
      zip: appContext.zip,
      step: stepName,
    });
  };

  const handleNewsletterOptInChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    setNewsletterOptIn(isChecked);
  
    // Capture the event with PostHog
    posthog.capture('email_optIn_toggled', {
      email_optIn: isChecked ? 'opted_in' : 'opted_out',
      form_id: formId,
      service_id: appContext.selectedService,
      zip: appContext.zip,
      step: stepName,    });
  };
  

  const handleGeneralOptInChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    setGeneralOptIn(isChecked);

    // Capture the event with PostHog
    posthog.capture('smsAndCall_optIn_toggled', {
      smsAndCall_optIn: isChecked ? 'opted_in' : 'opted_out',
      form_id: formId,
      service_id: appContext.selectedService,
      zip: appContext.zip,
      step: stepName,
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (generalOptIn && (!isOptInRequired || (isOptInRequired && newsletterOptIn))) {
      setLoading(true); // Show spinner
      setPromo(selectedPromo);

      const payload = {
        lead: {
          firstname,
          lastname,
          email,
          phone,
          zip,
          state,
          service: serviceName, // Use the fetched service name
          serviceSpecification,
          contractorPreferences,
          promo: selectedPromo,
        },
        error: null,
        type: 'lead',
        notify_service_availability: notifyServiceAvailablility,
        user_ns: userNs,
        team_id: teamId,
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
            value: newsletterOptIn,
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
          throw new Error('Failed to send lead information');
        }

        console.log('Lead information sent successfully');
      } catch (err) {
        console.error('Error sending lead information:', err);
      }

      // Update the database
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
            .update({
              updated_at: new Date().toISOString(),
              optIn_completion: true,
              smsAndCall_optIn: generalOptIn,
              email_optIn: newsletterOptIn,
              termsAndPrivacy_optIn: termsAndPrivacyOptIn,
              phone: phone,
              notify_service_availability: notifyServiceAvailablility,
            })        
            .eq('id', formId);
  
          if (updateError) {
            console.error('Error updating formId:', updateError);
            await sendErrorWebhook('Error updating formId', updateError);
            setLoading(false);
            return;
          }
  
          console.log(`FormId ${formId} updated.`);
        } else {
          // formId does not exist, insert a new row
          const { error: insertError } = await supabase
            .from('Forms')
            .insert([{
              id: formId,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              optIn_completion: true,
              smsAndCall_optIn: generalOptIn,
              email_optIn: newsletterOptIn,
              termsAndPrivacy_optIn: termsAndPrivacyOptIn,
              phone: phone,
              notify_service_availability: notifyServiceAvailablility,
            }]);
          if (insertError) {
            console.error('Error inserting formId:', insertError);
            await sendErrorWebhook('Error inserting formId', insertError);
            setLoading(false);
            return;
          }
  
          console.log(`FormId ${formId} inserted.`);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        await sendErrorWebhook('Unexpected error', err);
        setLoading(false);
        return;
      }
      posthog.capture(stepName + '_complete', {
        form_id: formId,
        service_id: appContext.selectedService,
        zip: appContext.zip,
        promo: selectedPromo,
        email_optIn: newsletterOptIn,
        smsAndCall_optIn: generalOptIn,
      });
      setLoading(false); // Hide spinner
      onNext();
    }
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
      } else {
        console.log('Error webhook sent successfully');
      }
    } catch (webhookError) {
      console.error('Error sending webhook:', webhookError);
    }
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
                  I would like to receive marketing emails from Home Project Partners. I understand that I can unsubscribe at any time.
                </label>
              </div>
              {newsletterOptIn && (
                <div className="mt-2 text-sm text-gray-600 dark:text-neutral-400 ml-10">
                  By agreeing, I consent to receive marketing emails from Home Project Partners. I can unsubscribe at any time by clicking the "unsubscribe" link at the bottom of our emails or by contacting us at projectquotes@email.com. We will process your information in accordance with our Privacy Policy.
                </div>
              )}
              {isOptInRequired && !newsletterOptIn && (
                <div className="text-sm text-red-500 mt-2">
                  To claim the special offer, you must opt-in to email.
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
                  By agreeing, I am providing my ESIGN signature and express written consent for Home Project Partners to contact me at the number provided below for marketing purposes. This includes communication via automated technology, such as SMS/MMS messages, AI generative voice, and prerecorded and/or artificial voice messages. I acknowledge my consent is not required to obtain any goods or services and I can reach out to them directly at (888) 508-3081.
                  <br />
                  My phone number where Home Project Partners may contact me is: {phone}
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              type="submit"
              className={`w-full max-w-xs px-24 py-5 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent ${
                generalOptIn && (!isOptInRequired || (isOptInRequired && newsletterOptIn))
                  ? 'bg-xorange text-white hover:bg-xorangeDark shadow-lg shadow-[rgba(254,139,16,0.5)] transform transition-transform translate-y-[-4px]'
                  : 'bg-gray-200 text-white cursor-not-allowed'
              }`}
              disabled={!generalOptIn || (isOptInRequired && !newsletterOptIn)}
              >
              {loading ? (
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                'Continue'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Step2PromoOptIn;