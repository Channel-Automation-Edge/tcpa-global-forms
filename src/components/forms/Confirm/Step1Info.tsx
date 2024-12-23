import React, { useContext, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AppContext } from '../../../context/AppContext';
import supabase from '../../../lib/supabaseClient';
import ResetButton from '@/components/ui/resetButton';
import posthog from 'posthog-js';
import PhoneInput from 'react-phone-number-input/input';


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
  const [loading, setLoading] = useState<boolean>(false);
  const [zipStatus, setZipStatus] = useState<'valid' | 'invalid' | null>(null);
  const [stateValue, setStateValue] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search);
    let localState = localStorage.getItem('state') || '';
    localState = localState.replace(/^"|"$/g, '');
    const initialState = state || localState || params.get('state') || '';
    return initialState;
  });
  const [zipError, setZipError] = useState<string | null>(null);
  const stepName = 'details_step1_confirmInfo';

  

  const handleReset = () => {
    posthog.capture('form_reset', {
      form_id: formId,
      zip: appContext.zip,
      service_id: appContext.selectedService,
      step: stepName,
    });
    onReset();
  };

  useEffect(() => {
    posthog.capture(stepName + '_start', {
      form_id: formId,
      service_id: appContext.selectedService,
      zip: appContext.zip,
    });
  }, [stepName]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialPhone = phone || params.get('phone');
    const numericPhone = initialPhone ? initialPhone.replace(/\D/g, '') : '';
    formik.setValues({
      firstname: firstname || params.get('firstname') || '',
      lastname: lastname || params.get('lastname') || '',
      zip: zip || params.get('zip') || '',
      state: state || params.get('state') || '',
      email: email || params.get('email') || '',
      phone: initialPhone ? `+1${numericPhone}` : '',
      termsAndPrivacyOptIn: termsAndPrivacyOptIn || false,
    });
    formik.setFieldTouched('termsAndPrivacyOptIn', true, true);
  }, [firstname, lastname, zip, state, email, phone, termsAndPrivacyOptIn]);


  useEffect(() => {
    setZipStatus('valid');
  }, []);

  const validationSchema = Yup.object({
    firstname: Yup.string().required('First name is required'),
    lastname: Yup.string().required('Last name is required'),
    zip: Yup.string().required('Zip code is required'),
    state: Yup.string().required('State is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    phone: Yup.string()
      .matches(/^\+1\d{10}$/, 'Phone number must be 10 digits')
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
    validationSchema,
    onSubmit: async (values) => {
      const rawPhone = values.phone.startsWith('+1') ? values.phone.slice(2) : values.phone;
      setLoading(true);
      setZip(values.zip);
      setState(stateValue);
      setEmail(values.email);
      setPhone(rawPhone);
      setFirstname(values.firstname);
      setLastname(values.lastname);
      setTermsAndPrivacyOptIn(values.termsAndPrivacyOptIn);

      try {
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
          const { error: updateError } = await supabase
            .from('Forms')
            .update({ updated_at: new Date().toISOString(), phone: rawPhone, state: stateValue })
            .eq('id', formId);
  
          if (updateError) {
            console.error('Error updating formId:', updateError);
            await sendErrorWebhook('Error updating formId', updateError);
            setLoading(false);
            return;
          }
  
        } else {
          const { error: insertError } = await supabase
            .from('Forms')
            .insert({ id: formId, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), phone: rawPhone, service: appContext.selectedService, state: stateValue });

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
      });
      setLoading(false);
      onNext();
    },
  });

  const handleZipBlur = async () => {
    const zip = formik.values.zip;
    if (zip.length < 4) {
      setZipError('Invalid ZIP Code');
      setZipStatus('invalid');
      setStateValue('');
      return;
    }
    setLoading(true);
    setZipStatus(null);
    setZipError(null);

    const { data: zipData, error: zipError } = await supabase
      .from('Zips')
      .select('stateCode')
      .lte('zipMin', parseInt(zip, 10))
      .gte('zipMax', parseInt(zip, 10))
      .single();

    if (zipError || !zipData) {
      setZipError('Invalid ZIP Code');
      setZipStatus('invalid');
      setStateValue('');
    } else {
      setStateValue(zipData.stateCode);
      setZipStatus('valid');
    }

    setLoading(false);
  };

  useEffect(() => {
    // Trigger validation on initial mount and when form values change
    const validateFields = async () => {
      await formik.validateForm();  // Trigger validation
    };
  
    validateFields();
  }, [formik.values]); // Run effect on form values change
  

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
      <div className="absolute top-[-53px]  left-0 w-full flex justify-end p-4">
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
              <div className="relative">
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
                {formik.errors.firstname ? (
                  <img
                    src="/images/warning.svg"
                    alt="Invalid"
                    className="absolute right-3 top-10 w-6"
                  />
                ) : (
                  <img
                    src="/images/tick.svg"
                    alt="Valid"
                    className="absolute right-6 top-11 w-4"
                  />
                )}
                {formik.touched.firstname && formik.errors.firstname && (
                  <div className="error text-sm text-red-500">{formik.errors.firstname}</div>
                )}
              </div>

              <div className="relative">
                <label htmlFor="lastname" className="block mb-2 text-base text-gray-700 font-medium dark:text-white">Last Name</label>
                <input
                  id="lastname"
                  name="lastname"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.lastname}
                  onBlur={formik.handleBlur}
                  className="py-3 px-4 block w-full border-gray-200 rounded-lg text-base focus:border-xorange focus:ring-xorange dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:ring-xorange"
                />
                {formik.errors.lastname ? (
                  <img
                    src="/images/warning.svg"
                    alt="Invalid"
                    className="absolute right-3 top-10 w-6"
                  />
                ) : (
                  <img
                    src="/images/tick.svg"
                    alt="Valid"
                    className="absolute right-6 top-11 w-4"
                  />
                )}
                {formik.touched.lastname && formik.errors.lastname && (
                  <div className="error text-sm text-red-500">{formik.errors.lastname}</div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                <div className="relative">
                  <label htmlFor="zip" className="block mb-2 text-sm text-gray-700 font-medium dark:text-white">ZIP Code</label>
                  <input
                    id="zip"
                    name="zip"
                    type="text"
                    maxLength={5}
                    onChange={(e) => {
                      formik.handleChange(e);
                      setStateValue('');
                      setZipStatus(null);
                      setZipError(null);
                    }}
                    onBlur={handleZipBlur}
                    value={formik.values.zip}
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-base focus:border-xorange focus:ring-xorange bg-white dark:border-neutral-700 dark:text-neutral-400 dark:focus:ring-xorange"
                  />
                  {loading ? (
                    <div className="absolute right-3 top-10 w-6 animate-spin h-6 border-2 border-xorange border-t-transparent rounded-full"></div>
                  ) : zipStatus === 'valid' ? (
                    <img src="/images/tick.svg" alt="Valid" className="absolute right-6 top-11 w-4" />
                  ) : zipStatus === 'invalid' ? (
                    <img src="/images/warning.svg" alt="Invalid" className="absolute right-3 top-10 w-6" />
                  ) : null}
                  {zipError && (
                    <div className="error text-sm text-red-500">{zipError}</div>
                  )}
                </div>

                <div className="relative">
                  <label htmlFor="state" className="block mb-2 text-sm text-gray-700 font-medium dark:text-white">State</label>
                  <input
                    id="state"
                    name="state"
                    type="text"
                    readOnly
                    value={stateValue}
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-base bg-gray-100 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 focus:border-gray-200 focus:ring-transparent cursor-default"
                  />
                  {stateValue ? (
                    <img src="/images/tick.svg" alt="Valid" className="absolute right-6 top-11 w-4" />
                  ) : (
                    <img src="/images/warning.svg" alt="Invalid" className="absolute right-3 top-10 w-6" />
                  )}
                </div>
              </div>

              <div className="relative">
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
                {formik.errors.email ? (
                  <img
                    src="/images/warning.svg"
                    alt="Invalid"
                    className="absolute right-3 top-10 w-6"
                  />
                ) : (
                  <img
                    src="/images/tick.svg"
                    alt="Valid"
                    className="absolute right-6 top-11 w-4"
                  />
                )}
                {formik.touched.email && formik.errors.email && (
                  <div className="error text-sm text-red-500">{formik.errors.email}</div>
                )}
              </div>

              <div className="relative">
                <label htmlFor="phone" className="block mb-2 text-sm text-gray-700 font-medium dark:text-white">Phone</label>
                <div className='flex items-start'>
                  <input className="py-3 px-4 block w-12 bg-gray-100 border-gray-200 border-r-transparent rounded-l-lg text-base focus:border-gray-200 focus:border-r-transparent focus:ring-transparent cursor-default" readOnly placeholder='+1'>
                  </input>
                  <PhoneInput
                    country="US"
                    id="phone"
                    name="phone"
                    maxLength={14}
                    value={formik.values.phone}
                    onChange={value => formik.setFieldValue('phone', value || '')}
                    onBlur={formik.handleBlur}
                    className="py-3 px-4 block w-full border-gray-200 rounded-r-lg text-base focus:border-xorange focus:ring-xorange dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:ring-xorange"
                  />
                </div>
                
                {formik.errors.phone ? (
                  <img
                    src="/images/warning.svg"
                    alt="Invalid"
                    className="absolute right-3 top-10 w-6"
                  />
                ) : (
                  <img
                    src="/images/tick.svg"
                    alt="Valid"
                    className="absolute right-6 top-11 w-4"
                  />
                )}
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
                  className="h-6 w-6 text-xorange border-gray-300 rounded focus:ring-xorange bg-white"
                />
                <label htmlFor="termsAndPrivacyOptIn" className="ml-4 block text-base text-gray-900 dark:text-gray-300">
                  I have read and agree to the 
                  <a href="https://projectquote.com/terms-and-conditions" target="_blank" rel="noopener noreferrer" className="text-xorange underline ml-1">
                    Terms & Conditions
                  </a> 
                  {" "}and 
                  <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-xorange underline ml-1">
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
                    formik.isValid && formik.values.termsAndPrivacyOptIn && !zipError
                      ? 'bg-xorange text-white hover:bg-xorangeDark shadow-lg shadow-[rgba(254,139,16,0.5)] transform transition-transform'
                      : 'bg-gray-200 text-white cursor-not-allowed'
                  }`}
                  disabled={!formik.isValid || !formik.values.termsAndPrivacyOptIn || !!zipError}
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
