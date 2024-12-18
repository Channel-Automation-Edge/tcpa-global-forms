import React, { useContext, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup'; // Import Yup for validation
import { AppContext } from '../../../context/AppContext';
import supabase from '../../../lib/supabaseClient';
import ResetButton from '@/components/ui/resetButton';
import posthog from 'posthog-js';

interface Step1InfoProps {
  onNext: () => void;
  onReset: () => void;
}

const Step1Info: React.FC<Step1InfoProps> = ({ onNext, onReset }) => {
  const appContext = useContext(AppContext);

  if (!appContext) {
    return null;
  }

  const { zip, state, email, phone, firstname, lastname, termsAndPrivacyOptIn, setZip, setEmail, setPhone, setFirstname, setLastname, setState, setTermsAndPrivacyOptIn, formId } = appContext;
  const [loading, setLoading] = useState<boolean>(false); // State to control spinner
  const stepName = 'notify_me_step1_confirmInfo';

  const handleReset = () => {
    posthog.capture('form_reset', {
      form_id: appContext.formId,
      zip: appContext.zip,
      service_id: appContext.selectedService,
      step: stepName,
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

    // Function to capture user exit event
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      posthog.capture('page_exit', {
        step: stepName,
        form_id: formId,
        service_id: appContext.selectedService,
        zip: appContext.zip,
      });
      event.preventDefault();// Prevent the default action to ensure the event is captured
    };
    window.addEventListener('beforeunload', handleBeforeUnload); // Add event listener for beforeunload
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload); // Cleanup function to remove the event listener
    };
  }, [stepName]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    formik.setValues({
      firstname: firstname || params.get('firstname') || '',
      lastname: lastname || params.get('lastname') || '',
      zip: zip || params.get('zip') || '',
      state: state || params.get('state') || '',
      email: email || params.get('email') || '',
      phone: phone || params.get('phone') || '',
      termsAndPrivacyOptIn: termsAndPrivacyOptIn || false,
    });
    formik.setFieldTouched('termsAndPrivacyOptIn', true, true);
  }, [firstname, lastname, zip, state, email, phone, termsAndPrivacyOptIn]);
  
  // Define the validation schema using Yup
  const validationSchema = Yup.object({
    firstname: Yup.string().required('First name is required'),
    lastname: Yup.string().required('Last name is required'),
    zip: Yup.string().required('Zip code is required'),
    state: Yup.string().required('State is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    phone: Yup.string()
      .matches(/^\d{10}$/, 'Phone number must be 10 digits')
      .required('Phone number is required'),
    termsAndPrivacyOptIn: Yup.boolean().oneOf([true], 'You must opt-in to continue'),
  });

  const formik = useFormik({
    initialValues: {
      zip: '',
      state: '',
      email: '',
      phone: '',
      firstname: '',
      lastname: '',
      termsAndPrivacyOptIn: false,
    },
    validationSchema, // Use Yup validation schema
    onSubmit: async (values) => {
      console.log("Form submitted with values:", values);
      setLoading(true); // Show spinner
      setZip(values.zip);
      setState(values.state);
      setEmail(values.email);
      setPhone(values.phone);
      setFirstname(values.firstname);
      setLastname(values.lastname);
      setTermsAndPrivacyOptIn(values.termsAndPrivacyOptIn);

      try {
        // Check if formId exists in the database
        const { data, error } = await supabase
          .from('Forms')
          .select('id, phone')
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
            .update({ updated_at: new Date().toISOString(), phone: values.phone })
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
            .insert({ id: formId, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), phone: values.phone });

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
      // Move to the next step
      onNext();
    },
    
  });

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
            Please <span className="text-xorange">confirm your information</span> so we can notify you when the service is available in your area
            </h1>
          </div>
        </div>
        <div className="mb-0 mt-6 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8 bg-white">
          <div className="mt-2">
            <form onSubmit={formik.handleSubmit} className="grid gap-4 lg:gap-6">
              <div>
                <label htmlFor="firstname" className="block mb-2 text-sm text-gray-700 font-medium dark:text-white">First Name</label>
                <input
                  id="firstname"
                  name="firstname"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.firstname}
                  onBlur={formik.handleBlur}
                  className="py-3 px-4 block w-full border-gray-200 rounded-lg text-base focus:border-xorange focus:ring-xorange dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:ring-xorange"
                />
                {formik.touched.firstname && formik.errors.firstname && (
                  <div className="error text-sm text-red-500">{formik.errors.firstname}</div>
                )}
              </div>

              <div>
                <label htmlFor="lastname" className="block mb-2 text-sm text-gray-700 font-medium dark:text-white">Last Name</label>
                <input
                  id="lastname"
                  name="lastname"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.lastname}
                  onBlur={formik.handleBlur}
                  className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-xorange focus:ring-xorange dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:ring-xorange"
                />
                {formik.touched.lastname && formik.errors.lastname && (
                  <div className="error text-sm text-red-500">{formik.errors.lastname}</div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                <div>
                  <label htmlFor="zip" className="block mb-2 text-sm text-gray-700 font-medium dark:text-white">ZIP Code</label>
                  <input
                    id="zip"
                    name="zip"
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.zip}
                    onBlur={formik.handleBlur}
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-base focus:border-xorange focus:ring-xorange dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:ring-xorange"
                  />
                  {formik.touched.zip && formik.errors.zip && (
                    <div className="error text-sm text-red-500">{formik.errors.zip}</div>
                  )}
                </div>

                <div>
                  <label htmlFor="state" className="block mb-2 text-sm text-gray-700 font-medium dark:text-white">State</label>
                  <input
                    id="state"
                    name="state"
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.state}
                    onBlur={formik.handleBlur}
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-base focus:border-xorange focus:ring-xorange dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:ring-xorange"
                  />
                  {formik.touched.state && formik.errors.state && (
                    <div className="error text-sm text-red-500">{formik.errors.state}</div>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block mb-2 text-sm text-gray-700 font-medium dark:text-white">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  onBlur={formik.handleBlur}
                  className="py-3 px-4 block w-full border-gray-200 rounded-lg text-base focus:border-xorange focus:ring-xorange dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:ring-xorange"
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="error text-sm text-red-500">{formik.errors.email}</div>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block mb-2 text-sm text-gray-700 font-medium dark:text-white">Phone</label>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.phone}
                  onBlur={formik.handleBlur}
                  className="py-3 px-4 block w-full border-gray-200 rounded-lg text-base focus:border-xorange focus:ring-xorange dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:ring-xorange"
                />
                {formik.touched.phone && formik.errors.phone && (
                  <div className="error text-sm text-red-500">{formik.errors.phone}</div>
                )}
              </div>

              <div className="flex items-start mt-4">
                <input
                  id="termsAndPrivacyOptIn"
                  name="termsAndPrivacyOptIn"
                  type="checkbox"
                  onChange={formik.handleChange}
                  checked={formik.values.termsAndPrivacyOptIn}
                  className="h-6 w-6 text-xorange border-gray-300 rounded focus:ring-xorange"
                />
                <label htmlFor="termsAndPrivacyOptIn" className="ml-4 block text-base text-gray-900 dark:text-gray-300">
                  I have read and agree to the 
                  <a href="https://projectquote.com/terms-and-conditions" target="_blank" rel="noopener noreferrer" className="text-xorange underline ml-1">
                    Terms & Conditions
                  </a> 
                  {" "}and 
                  <a href="https://projectquote.com/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-xorange underline ml-1">
                    Privacy Policy
                  </a>.
                </label>
              </div>
              {formik.errors.termsAndPrivacyOptIn && (
                <div className="text-sm text-red-500">
                  {formik.errors.termsAndPrivacyOptIn}
                </div>
              )}

              <div className="mt-6 grid">
                <button
                  type="submit"
                  className={`w-full py-5 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent ${
                    formik.isValid && formik.values.termsAndPrivacyOptIn
                      ? 'bg-xorange text-white hover:bg-xorangeDark shadow-lg shadow-[rgba(254,139,16,0.5)] transform transition-transform'
                      : 'bg-gray-200 text-white cursor-not-allowed'
                  }`}
                  disabled={!formik.isValid || !formik.values.termsAndPrivacyOptIn}
                  >
                  {loading ? (
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  ) : (
                    'Confirm Information'
                  )}
                </button>
              </div>
              <div className="mt-3 text-center">
                <p className="text-sm text-gray-500 dark:text-neutral-500">
                  {/* Additional information or disclaimer can go here */}
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1Info;