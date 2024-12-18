import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../../context/AppContext';
import supabase from '../../../lib/supabaseClient';
import ResetButton from '@/components/ui/resetButton';
import posthog from 'posthog-js';

interface Step3InvoiceProps {
  onNext: () => void;
  onReset: () => void;
}

const Step3Invoice: React.FC<Step3InvoiceProps> = ({ onNext, onReset }) => {
  const appContext = useContext(AppContext);

  if (!appContext) {
    return null;
  }

  const {
    firstname,
    lastname,
    email,
    phone,
    zip,
    state,
    selectedService,
    serviceSpecifications,
    promo,
    numberOfQuotes,
    formId,
  } = appContext;

  const currentDate = new Date();
  const proposalDate = currentDate.toLocaleDateString();
  const offerValidUntil = new Date(currentDate.setDate(currentDate.getDate() + 20)).toLocaleDateString();
  const [loading, setLoading] = useState<boolean>(false); // State to control spinner
  const [selectedServiceName, setSelectedServiceName] = useState<string>('Service'); 
  const stepName = 'details_step3_invoice';

  const handleReset = () => {
    posthog.capture('form_reset', {
      form_id: appContext.formId,
      zip: appContext.zip,
      step: stepName,
      service_id: appContext.selectedService,
    });
    onReset();
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

        setSelectedServiceName(data.name); // Set the fetched service name
      } catch (err) {
        console.error('Unexpected error fetching service name:', err);
      }
    };

    fetchServiceName();
  }, [selectedService]);

  const handleCall = () => {
    posthog.capture('call_us', {
      form_id: formId,
      service_id: appContext.selectedService,
      zip: appContext.zip,
      step: stepName,
    });
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true); // Show spinner
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

        console.log(`FormId ${formId} updated.`);
      } else {
        // formId does not exist, insert a new row
        const { error: insertError } = await supabase
          .from('Forms')
          .insert([{ id: formId, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), phone: phone }]);

        if (insertError) {
          console.error('Error inserting formId:', insertError);
          await sendErrorWebhook('Error inserting formId', insertError);
          setLoading(false);
          return;
        }

        console.log(`FormId ${formId} inserted with phone: ${phone}`);
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
      } else {
        console.log('Error webhook sent successfully');
      }
    } catch (webhookError) {
      console.error('Error sending webhook:', webhookError);
    }
  };

  return (
    <div className="z-10 max-w-[100rem] px-4 lg:px-14 py-10 lg:py-14 mx-auto relative">
      
      <div className="absolute top-[-102px] custom-smallest:top-[-110px] small-stepper:top-[-115px] sm:top-[-121px] md:top-[-137px] left-0 w-full flex justify-end p-4">
        
      <ResetButton onClick={handleReset} />

      </div>

      <div className="max-w-xl mx-auto">

        <div className='flex justify-center text-center mb-8'>
          <div className="max-w-[40rem] text-center">
            <h1 className="block text-2xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-3xl font-bold sm:font-bold md:font-semibold lg:font-semibold text-gray-800 dark:text-white">
            Take a look at our proposal and let's connect you with the <span className="text-xorange">right experts</span> for your free consultation!
            </h1>
          </div>
        </div>

        <div className="mt-6 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8 bg-white">
        <div className="flex justify-between items-center mb-6">
          <img src="/images/logodark.svg" alt="Logo" className="h-10" />
          <h1 className="text-xl font-bold text-gray-700 dark:text-white">Proposal</h1>
        </div>
          <div className="text-sm text-gray-700 dark:text-neutral-400">
            <p>Prepared for: {firstname} {lastname}</p>
            <p>Email: {email}</p>
            <p>Phone: {phone}</p>
            <p>ZIP Code: {zip}</p>
            <p>State: {state}</p>
            <div className="mt-4">
              <p>Proposal Date: {proposalDate}</p>
              <p>Offer valid until: {offerValidUntil}</p>
            </div>
          </div>

          <table className="min-w-full divide-y divide-gray-200 mt-4">
            <thead>
              <tr>
                <th className="px-0 custom-350:px-2 custom-400:px-4 sm:px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Item</th>
                <th className="px-0 custom-350:px-2 custom-400:px-4 sm:px-6 py-3 bg-gray-50 text-xs font-medium text-gray-400 uppercase tracking-wider text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-0 custom-350:px-2 custom-400:px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">{selectedServiceName}</td>
                <td className="px-0 custom-350:px-2 custom-400:px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm text-red-600">Pending</td>
              </tr>
              <tr>
                <td className="px-0 custom-350:px-2 custom-400:px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">Project Manager</td>
                <td className="px-0 custom-350:px-2 custom-400:px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm text-green-600">Included</td>
              </tr>
              {serviceSpecifications.map((spec, index) => (
                <tr key={index}>
                  <td className="px-0 custom-350:px-2 custom-400:px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">{spec}</td>
                  <td className="px-0 custom-350:px-2 custom-400:px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm text-red-600">Pending</td>
                </tr>
              ))}
              <tr>
                <td className="px-0 custom-350:px-2 custom-400:px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">Professional Contractors</td>
                <td className="px-0 custom-350:px-2 custom-400:px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm text-green-600">Included</td>
              </tr>
              <tr>
                <td className="px-0 custom-350:px-2 custom-400:px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">Priority Service</td>
                <td className="px-0 text-right custom-350:px-2 custom-400:px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-green-600">Included</td>
              </tr>
            </tbody>
          </table>

          <div className="mt-4">
            <p className="text-sm text-gray-900">Subtotal: <span className='text-red-600'>Pending Final Review</span></p>
            {promo && <p className="text-sm text-gray-900 dark:text-neutral-400">Promo: <span className='text-green-600'>{promo}</span></p>}
            <p className="text-sm text-gray-900">Total: <span className='text-red-600'>Pending Final Review</span></p>
          </div>

          <div className="mt-6 text-left">
            <p className="text-sm text-gray-700 dark:text-white">
              Thank you, {firstname} {lastname}! We just need a bit more information to finalize your request. Please proceed to schedule your FREE appointment{numberOfQuotes > 1 ? 's' : ''} with our professional contractors. We'll match you with top contractors in your area. Alternatively, feel free to give us a call.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col space-y-4">
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full py-5 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-xorange text-white hover:bg-xorangeDark shadow-lg shadow-[rgba(102,89,83,0.5)]"
          >
            {loading ? (
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
            ) : (
              'Claim Free Consultation'
            )}
          </button>
          <button
            type="button"
            onClick={handleCall}
            className="w-full py-5 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-gray-600 text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
          >
            Call Us
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step3Invoice;


