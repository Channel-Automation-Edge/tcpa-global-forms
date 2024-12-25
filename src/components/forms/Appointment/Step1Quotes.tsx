"use client";
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../context/AppContext';
import supabase from '../../../lib/supabaseClient';
import ResetButton from '@/components/ui/resetButton';
import posthog from 'posthog-js';
import BackButton from '@/components/ui/backButton';


interface Step1QuotesProps {
  onNext: () => void;
  onReset: () => void;
  onBack: () => void;
}

const Step1Quotes: React.FC<Step1QuotesProps> = ({ onNext, onReset, onBack }) => {
  const appContext = useContext(AppContext);

  if (!appContext) {
    return null;
  }

  const { numberOfQuotes, setNumberOfQuotes, formId, phone } = appContext;
  const [selectedQuote, setSelectedQuote] = useState<number>(numberOfQuotes);
  const [loading, setLoading] = useState<boolean>(false); // State to control spinner
  const stepName = 'appointment_step1_setQuotes';

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
      service_id: appContext.selectedService,
      step: stepName,
      previous_step: 'detail_step3_invoice',
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


  const handleQuoteSelect = (quote: number) => {
    setSelectedQuote(quote);
    posthog.capture('quote_selected', {
      quote: quote,
      form_id: formId,
      service_id: appContext.selectedService,
      zip: appContext.zip,
      step: stepName,
    }); 
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setNumberOfQuotes(selectedQuote);

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
          .update({ updated_at: new Date().toISOString() })
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
          .insert([{ id: formId, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), phone: phone, service: appContext.selectedService, state: appContext.state }]);

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
      form_id: formId,
      service_id: appContext.selectedService,
      zip: appContext.zip,
      quote: selectedQuote,
    });
    setLoading(false); // Hide spinner
    onNext();
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

  useEffect(() => {
    setSelectedQuote(numberOfQuotes);
  }, [numberOfQuotes]);

  const getBadgeText = (quote: number) => {
    switch (quote) {
      case 1:
        return "Basic";
      case 2:
        return "Optimal";
      case 3:
        return "Comprehensive";
      default:
        return "";
    }
  };

  return (
    <div className="z-10 max-w-[100rem] px-4 lg:px-14 py-10 lg:py-14 mx-auto relative">
      <div className="absolute top-[-102px] custom-smallest:top-[-110px] small-stepper:top-[-115px] sm:top-[-121px] md:top-[-137px] left-0 w-full flex justify-between p-4">
        <BackButton onClick={handleBack} />
        <ResetButton onClick={handleReset} />
      </div>
      <div className="space-y-8">
        <div className='flex justify-center text-center mb-8'>
          <div className="max-w-[40rem] text-center">
            <h1 className="block text-2xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-3xl font-bold sm:font-bold md:font-semibold lg:font-semibold text-gray-800 dark:text-white">
            How many free consultations would you like to schedule? Each one will be handled by a <span className="text-xorange">dedicated expert</span>!
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-12 flex flex-col h-full">
        <div className="flex flex-wrap justify-center gap-4 sm:gap-[20px]" style={{ marginTop: '15px', width: '100%' }}>
  {[1, 2, 3].map((quote) => (
    <button
      key={quote}
      type="button"
      className="flex flex-row sm:flex-col items-center justify-start sm:justify-center w-full sm:w-[200px] h-[80px] sm:h-[120px] border border-transparent rounded-xl shadow-md p-4 transition-transform transform hover:scale-100 sm:hover:scale-105 bg-white"
      onClick={() => handleQuoteSelect(quote)}
      style={{
        boxShadow: selectedQuote === quote
          ? 'rgba(255, 81, 0, 0.7) 0px 10px 25px -6px'
          : 'rgba(0, 0, 0, 0.07) 0px 22px 30px -6px',
        transition: 'box-shadow 0.3s ease',
        borderColor: selectedQuote === quote
          ? 'rgba(255, 81, 0, 0.7)'
          : 'rgba(157, 176, 197, 0.25)',
      }}
      onMouseEnter={(e) => {
        if (selectedQuote !== quote) {
          e.currentTarget.style.boxShadow = 'rgba(255, 81, 0, 0.7) 0px 10px 25px -6px';
          e.currentTarget.style.borderColor = 'rgba(255, 81, 0, 0.7)';
        }
      }}
      onMouseLeave={(e) => {
        if (selectedQuote !== quote) {
          e.currentTarget.style.boxShadow = 'rgba(0, 0, 0, 0.07) 0px 22px 30px -6px';
          e.currentTarget.style.borderColor = 'rgba(157, 176, 197, 0.25)';
        }
      }}
    >
      <span className="text-gray-800 text-base font-medium text-center sm:text-left">{quote}</span>
      <span className="ml-4 sm:ml-0 text-xs font-semibold text-gray-700">{getBadgeText(quote)}</span>
    </button>
  ))}
</div>


          <div className="mt-20 flex justify-center">
            <button
              type="submit"
              className={`w-full max-w-xs px-24 py-5 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent ${
                selectedQuote > 0
                  ? 'bg-xorange text-white hover:bg-xorangeDark shadow-lg shadow-[rgba(254,139,16,0.5)] transform transition-transform translate-y-[-8px]'
                  : 'bg-gray-200 text-white cursor-not-allowed'
              }`}
              disabled={selectedQuote === 0}
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

export default Step1Quotes;
