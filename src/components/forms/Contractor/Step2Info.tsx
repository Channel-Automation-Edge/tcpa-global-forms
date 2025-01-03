import BackButton from '@/components/ui/backButton';
import React, { useContext, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AppContext } from '@/context/AppContext';
import supabase from '@/lib/supabaseClient';
import PhoneInput from 'react-phone-number-input/input';

interface Step2InfoProps {
  onNext: () => void;
  onBack: () => void;
}

const Step2Info: React.FC<Step2InfoProps> = ({ onNext, onBack }) => {
  const appContext = useContext(AppContext);
  
    if (!appContext) {
      return null;
    }

    const { zip, state, email, phone, firstname, lastname, address1, address2, city, businessName, setZip, setEmail, setPhone, setFirstname, setLastname, setState, setAddress1, setAddress2, setCity, setBusinessName } = appContext;
    const [loading, setLoading] = useState<boolean>(false);
    const [zipStatus, setZipStatus] = useState<'valid' | 'invalid' | null>(null);
    const [stateValue, setStateValue] = useState<string>('');
    const [zipError, setZipError] = useState<string | null>(null);

    useEffect(() => {
      formik.setValues({
        businessName: businessName || '',
        address1: address1 || '',
        address2: address2 || '',
        city: city || '',
        firstname: firstname || '',
        lastname: lastname || '',
        zip: zip || '',
        state: state || '',
        email: email || '',
        phone: phone || '',
      });
    }, [businessName, firstname, lastname, zip, state, email, phone]);

    const validationSchema = Yup.object({
      businessName: Yup.string().required('Business name is required'),
      address1: Yup.string().required('Address is required'),
      city: Yup.string().required('City is required'),
      firstname: Yup.string().required('First name is required'),
      lastname: Yup.string().required('Last name is required'),
      zip: Yup.string().required('Zip code is required'),
      state: Yup.string().required('State is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      phone: Yup.string()
      .matches(/^\+1\d{10}$/, 'Phone number must be 10 digits')
      .required('Phone number is required'),
    });

    const formik = useFormik({
      initialValues: {
        zip: '',
        state: '',
        email: '',
        phone: '',
        firstname: '',
        lastname: '',
        businessName: '',
        address1: '',
        address2: '',
        city: '',
      },
      validationSchema,
      validateOnMount: true,
      onSubmit: async (values) => {
        console.log('submitting');
        const rawPhone = values.phone.startsWith('+1') ? values.phone.slice(2) : values.phone;
        setLoading(true);
      
        // Save values to AppContext
        setZip(values.zip);
        setState(stateValue);
        setEmail(values.email);
        setPhone(rawPhone);
        setFirstname(values.firstname);
        setLastname(values.lastname);
        setBusinessName(values.businessName);
        setAddress1(values.address1);
        setAddress2(values.address2);
        setCity(values.city);
      
        // Insert into Supabase
        try {
          const { data, error } = await supabase.from('ContractorApplications').insert([
            {
              business_name: values.businessName,
              phone: rawPhone,
              zip: values.zip,
              state: stateValue,
              address1: values.address1,
              address2: values.address2,
              city: values.city,
              email: values.email,
              firstname: values.firstname,
              lastname: values.lastname,
              services: appContext.contractorServices,

            }
          ]);
      
          // Send webhook
          await fetch('https://hkdk.events/09d0txnpbpzmvq', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              message: 'New application submitted',
              type: 'contractor',
              applicationData: {
                business_name: values.businessName,
                phone: rawPhone,
                zip: values.zip,
                state: stateValue,
                address1: values.address1,
                address2: values.address2,
                city: values.city,
                email: values.email,
                firstname: values.firstname,
                lastname: values.lastname,
                services: appContext.contractorServices,
              },
              error: error ? error.message : null
            })
          });
      
          if (error) {
            console.error('Error inserting data:', error);
          } else {
            console.log('Data inserted successfully:', data);
          }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Unknown error';
          console.error('Unexpected error:', errorMessage);
          await fetch('https://hkdk.events/09d0txnpbpzmvq', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              message: 'Error submitting application',
              error: errorMessage
            })
          });
        }
      
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
        console.log('ZIP code is invalid (too short)');
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
        console.log('ZIP code validation failed:', zipError);
      } else {
        const stateCode = zipData.stateCode;
        setStateValue(stateCode);
        formik.setFieldValue('state', stateCode); // Set the state field value
        formik.setFieldTouched('state', true, false); // Mark the state field as touched
        setZipStatus('valid');
        console.log('ZIP code is valid, state:', stateCode);
      }
    
      setLoading(false);
    };

    useEffect(() => {
      const formattedPhone = phone ? `+1${phone.replace(/\D/g, '')}` : '';
      formik.setValues({
        businessName: businessName || '',
        firstname: firstname || '',
        lastname: lastname || '',
        zip: zip || '',
        state: state || '',
        address1: address1 || '',
        address2: address2 || '',
        city: city || '',
        email: email || '',
        phone: formattedPhone, // Ensure phone is in E.164 format
      });
    }, [businessName, firstname, lastname, zip, state, email, phone, address1, address2, city]);
    

  useEffect(() => {
    const fetchStateCode = async () => {
      const zip = formik.values.zip;
      if (formik.values.zip && formik.values.zip.length >= 5) {
        try {
          const { data: zipData, error: zipError } = await supabase
            .from('Zips')
            .select('stateCode')
            .lte('zipMin', parseInt(zip, 10))
            .gte('zipMax', parseInt(zip, 10))
            .single();
  
          if (zipError || !zipData) {
            console.error('Error fetching state code:', zipError);
            setStateValue('');
          } else {
            setStateValue(zipData.stateCode);
          }
        } catch (error) {
          console.error('Unexpected error fetching state code:', error);
          setStateValue('');
        }
      } else {
        setStateValue('');
      }
    };
  
    fetchStateCode();
  }, [formik.values.zip]);

  // useEffect(() => {

  //   console.log('Firstname:', formik.values.firstname, formik.errors.firstname ? 'Invalid' : 'Valid');
  //   console.log('Lastname:', formik.values.lastname, formik.errors.lastname ? 'Invalid' : 'Valid');
  //   console.log('ZIP:', formik.values.zip, formik.errors.zip ? 'Invalid' : 'Valid');
  //   console.log('State:', formik.values.state, formik.errors.state ? 'Invalid' : 'Valid');
  //   console.log('Email:', formik.values.email, formik.errors.email ? 'Invalid' : 'Valid');
  //   console.log('Phone:', formik.values.phone, formik.errors.phone ? 'Invalid' : 'Valid');
  // }, [formik.values, formik.errors]);
  
  
    
  
  return (
    <div className="z-10 max-w-[100rem] px-4 lg:px-14 py-10 lg:py-14 mx-auto relative">
      <div className="absolute top-[-102px] custom-smallest:top-[-110px] small-stepper:top-[-115px] sm:top-[-121px] md:top-[-137px] left-0 w-full flex justify-between p-4">
        <BackButton onClick={onBack} />
      </div>
      
      <div className="max-w-xl mx-auto">
        <div className='flex justify-center text-center mb-8'>
          <div className="max-w-[40rem] text-center">
            <h1 className="block text-2xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-3xl font-bold sm:font-bold md:font-semibold lg:font-semibold text-gray-800 dark:text-white">
            Please <span className="text-xorange">confirm your information</span> so we can get everything ready to grow your business
            </h1>
          </div>
        </div>
        <div className="mb-0 mt-6 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8 bg-white">
          <div className="mt-2">
            <form onSubmit={formik.handleSubmit} className="grid gap-4 lg:gap-6">
            <div className="text-left sm:text-center mb-2">
              <h2 className="text-lg lg:text-xl font-semibold text-gray-700">
                Company Information
              </h2>
            </div>
            <div className="relative">
                <label htmlFor="businessName" className="block mb-2 text-sm text-gray-700 font-medium dark:text-white">Company Name</label>
                <input
                  id="businessName"
                  name="businessName"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.businessName}
                  onBlur={formik.handleBlur}
                  className="py-3 px-4 block w-full border-gray-200 rounded-lg text-base focus:border-xorange focus:ring-xorange dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:ring-xorange"
                />
                {formik.errors.businessName ? (
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
                {formik.touched.businessName && formik.errors.businessName && (
                  <div className="error text-sm text-red-500">{formik.errors.businessName}</div>
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
              {/* address1, address2, city */}
              <div className="relative">
                <label htmlFor="city" className="block mb-2 text-sm text-gray-700 font-medium dark:text-white">City</label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.city}
                  onBlur={formik.handleBlur}
                  className="py-3 px-4 block w-full border-gray-200 rounded-lg text-base focus:border-xorange focus:ring-xorange dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:ring-xorange"
                />
                {formik.errors.city ? (
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
                {formik.touched.city && formik.errors.city && (
                  <div className="error text-sm text-red-500">{formik.errors.city}</div>
                )}
              </div>
              <div className="relative">
                <label htmlFor="address1" className="block mb-2 text-sm text-gray-700 font-medium dark:text-white">Address Line 1</label>
                <input
                  id="address1"
                  name="address1"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.address1}
                  onBlur={formik.handleBlur}
                  className="py-3 px-4 block w-full border-gray-200 rounded-lg text-base focus:border-xorange focus:ring-xorange dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:ring-xorange"
                />
                {formik.errors.address1 ? (
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
                {formik.touched.address1 && formik.errors.address1 && (
                  <div className="error text-sm text-red-500">{formik.errors.address1}</div>
                )}
              </div>
              <div className="relative">
                <label htmlFor="address2" className="block mb-2 text-sm text-gray-700 font-medium dark:text-white">Address Line 2</label>
                <input
                  id="address2"
                  name="address2"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.address2}
                  onBlur={formik.handleBlur}
                  className="py-3 px-4 block w-full border-gray-200 rounded-lg text-base focus:border-xorange focus:ring-xorange dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:ring-xorange"
                />
                {formik.values.address2 && !formik.errors.address2 && (
                  <img
                    src="/images/tick.svg"
                    alt="Valid"
                    className="absolute right-6 top-11 w-4"
                  />
                )}
                {formik.touched.address2 && formik.errors.address2 && (
                  <div className="error text-sm text-red-500">{formik.errors.address2}</div>
                )}
              </div>

              

              
              <div className="text-left sm:text-center mt-6 mb-2">
              <h2 className="text-lg lg:text-xl font-semibold text-gray-700">
              Representative Information
              </h2>
            </div>
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
                <label htmlFor="lastname" className="block mb-2 text-sm text-gray-700 font-medium dark:text-white">Last Name</label>
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
                


              

              <div className="mt-6 grid">
                <button
                  type="submit"
                  className={`w-full py-5 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent ${
                    formik.isValid && !zipError
                      ? 'bg-xorange text-white hover:bg-xorangeDark shadow-lg shadow-[rgba(254,139,16,0.5)] transform transition-transform'
                      : 'bg-gray-200 text-white cursor-not-allowed'
                  }`}
                  disabled={!formik.isValid || !!zipError}
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
}

export default Step2Info
