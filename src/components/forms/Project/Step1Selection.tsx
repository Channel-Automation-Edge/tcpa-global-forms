import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../../context/AppContext';
import supabase from '../../../lib/supabaseClient'; // Import your Supabase client
import posthog from 'posthog-js';

// Define props interface
interface Step1SelectionProps {
  onNext: () => void;
}

const Step1Selection: React.FC<Step1SelectionProps> = ({ onNext }) => {
  const appContext = useContext(AppContext);

  if (!appContext) {
    return null;
  }

  const { setSelectedService, formId } = appContext; // Ensure formId is included in the context
  const [loading, setLoading] = useState<boolean>(false); // State to control spinner
  const [services, setServices] = useState<any[]>([]); // State to store fetched services
  const stepName = 'project_step1_serviceSelect';
  const params = new URLSearchParams(window.location.search);
  const firstname = params.get('firstname');
  const userNs = params.get('user_ns');

  useEffect(() => {
    // Capture the start event for this step
    posthog.capture(stepName + '_start', {
      form_id: formId,
      service_id: appContext.selectedService,
      zip: appContext.zip,
    });

  }, [stepName]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from('Services')
          .select('*');

        if (error) {
          console.error('Error fetching services:', error);
          return;
        }

        setServices(data); // Set fetched services to state
      } catch (err) {
        console.error('Unexpected error fetching services:', err);
      }
    };

    fetchServices();
  }, []);

  const formatPhoneNumber = (phone:string) => {
    if (!phone || phone.length !== 10) {
      return phone; // Return the original value if it's not a 10-digit number
    }
  
    const areaCode = phone.slice(0, 3);
    const centralOfficeCode = phone.slice(3, 6);
    const lineNumber = phone.slice(6);
  
    return `+1 (${areaCode}) ${centralOfficeCode}-${lineNumber}`;
  };

  const handleServiceSelect = async (serviceId: string) => { // Assuming serviceId is a string
    setLoading(true); // Show spinner
    setSelectedService(serviceId);
    const urlParams = new URLSearchParams(window.location.search);
    const phoneFromUrl = urlParams.get('phone') || null;
    const formattedPhone = phoneFromUrl ? formatPhoneNumber(phoneFromUrl) : '';
    const storedCookies = JSON.parse(localStorage.getItem('acceptedCookies') || 'null');

    const storedCookieConsentId = JSON.parse(localStorage.getItem('consentId') || 'null');

    console.log('storedCookies:', storedCookies);
    console.log('storedCookieConsentId:', storedCookieConsentId);
    console.log('test');

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
        // formId exists
        const { error: updateError } = await supabase
          .from('Forms')
          .update({ updated_at: new Date().toISOString(), service: serviceId, user_ns: userNs, accepted_cookies: storedCookies, cookie_consent_id: storedCookieConsentId, cookie_updated_at: new Date().toISOString() })
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
          .insert([{ id: formId, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), phone: formattedPhone, service: serviceId, user_ns: userNs, state: appContext.state, accepted_cookies: storedCookies, cookie_consent_id: storedCookieConsentId, cookie_updated_at: new Date().toISOString() }]);

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

    posthog.capture('service_select', {
      step: stepName,
      form_id: formId,
      service_id: serviceId,
      zip: appContext.zip,
    });

    posthog.capture(stepName + '_complete', {
      form_id: formId,
      service_id: serviceId,
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
      }
    } catch (webhookError) {
      console.error('Error sending webhook:', webhookError);
    }
  };

  return (
    <div className="z-10 max-w-[100rem] px-4 lg:px-14 py-10 lg:py-14 mx-auto relative">
      <div className="space-y-8">

        <div className='flex justify-center text-center mb-8'>
          <div className="max-w-[40rem] text-center">
            <h1 className="block text-2xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-3xl font-bold sm:font-bold md:font-semibold lg:font-semibold text-gray-800 dark:text-white">
              {firstname ? (
                <>
                  Hi {firstname}! Let's bring your{' '}
                  <span className="text-xorange">future project</span> to life—choose what fits your vision below
                </>
              ) : (
                <>
                  Hi there! Let's bring your{' '}
                  <span className="text-xorange">dream project</span> to life—choose what fits your vision below
                </>
              )}
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 sm:gap-[20px]" style={{ marginTop: '15px', width: '100%' }}>
          {services.map((service) => (
            <div
              key={service.id}
              className="flex flex-row sm:flex-col items-center justify-start sm:justify-center w-full sm:w-[210px] h-[80px] sm:h-[156px] border border-transparent rounded-xl shadow-md p-4 transition-transform transform hover:scale-100 sm:hover:scale-105 bg-white"
              onClick={() => handleServiceSelect(service.id)}
              style={{
                boxShadow: 'rgba(0, 0, 0, 0.07) 0px 22px 30px -6px',
                transition: 'box-shadow 0.3s ease',
                borderColor: 'rgba(157, 176, 197, 0.25)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = 'rgba(255, 81, 0, 0.7) 0px 10px 25px -6px';
                e.currentTarget.style.borderColor = 'rgba(255, 81, 0, 0.7)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'rgba(0, 0, 0, 0.07) 0px 10px 25px -6px';
                e.currentTarget.style.borderColor = 'rgba(157, 176, 197, 0.25)';
              }}
            >
              <img
                src={service.photo}
                alt={service.name}
                className="w-12 h-12 sm:w-14 sm:h-14 sm:mb-4 ml-2 mr-4 sm:ml-0 sm:mr-0"
                
              />
              <span className="text-gray-800 text-base font-medium text-left sm:text-center">{service.name}</span>
            </div>
          ))}
        </div>

        {loading && (
          <div className="flex justify-center pt-20">
            <div className="animate-spin h-6 w-6  border-2 border-xorange border-t-transparent rounded-full"></div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Step1Selection;
