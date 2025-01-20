import React, { useContext, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AppContext } from '@/context/AppContext';
import ResetButton from '@/components/ui/resetButton';
import BackButton from '@/components/ui/backButton';
import PhoneInput from 'react-phone-number-input/input';

interface Step1InfoProps {
  onNext: () => void;
  onReset: () => void;
  onBack: () => void;
}

const Step1Info: React.FC<Step1InfoProps> = ({ onNext, onReset, onBack }) => {
  const appContext = useContext(AppContext);

  if (!appContext) {
    return null;
  }

  const { user, form, setUser, setForm } = appContext;
  const [loading, setLoading] = useState<boolean>(false);

  const handleReset = () => {
    onReset();
  };

  const handleBack = () => {
    onBack();
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialPhone = user.phone || params.get('phone');
    const numericPhone = initialPhone ? initialPhone.replace(/\D/g, '') : '';
    formik.setValues({
      firstname: user.firstname || params.get('firstname') || '',
      lastname: user.lastname || params.get('lastname') || '',
      zip: user.zip || '', // Default to user.zip
      state: user.state || params.get('state') || '', // Default to URL parameter state or empty
      address1: user.address1 || params.get('address1') || '',
      address2: user.address2 || params.get('address2') || '',
      city: user.city || params.get('city') || '',
      email: user.email || params.get('email') || '',
      phone: initialPhone ? `+1${numericPhone}` : '',
      termsAndPrivacyOptIn: form.termsAndPrivacyOptIn || false,
    });
    formik.setFieldTouched('termsAndPrivacyOptIn', true, true);
  }, [user, form.termsAndPrivacyOptIn]);

  const validationSchema = Yup.object({
    firstname: Yup.string().required('First name is required'),
    lastname: Yup.string().required('Last name is required'),
    zip: Yup.string().required('Zip code is required'),
    state: Yup.string().required('State is required').max(2, 'State code must be 2 characters'),
    address1: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
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
      address1: '',
      address2: '',
      city: '',
      email: '',
      phone: '',
      firstname: '',
      lastname: '',
      termsAndPrivacyOptIn: false,
    },
    validationSchema,
    validateOnMount: true,
    onSubmit: async (values) => {
      console.log('submitting');
      const rawPhone = values.phone.startsWith('+1') ? values.phone.slice(2) : values.phone;
      setLoading(true);

      setUser((prevUser) => ({
        ...prevUser,
        zip: values.zip,
        state: values.state,
        email: values.email,
        phone: rawPhone,
        firstname: values.firstname,
        lastname: values.lastname,
        address1: values.address1,
        address2: values.address2,
        city: values.city,
      }));

      setForm((prevForm) => ({
        ...prevForm,
        termsAndPrivacyOptIn: values.termsAndPrivacyOptIn,
      }));

      setLoading(false);
      onNext();
    },
  });

  return (
    <div className="z-10 max-w-[100rem] px-4 lg:px-14 py-10 lg:py-14 mx-auto relative">
      <div className="absolute top-[-102px] custom-smallest:top-[-110px] small-stepper:top-[-115px] sm:top-[-121px] md:top-[-137px] left-0 w-full flex justify-between p-4">
        <BackButton onClick={handleBack} />
        <ResetButton onClick={handleReset} />
      </div>
      
      <div className="max-w-xl mx-auto">
        <div className='flex justify-center text-center mb-8'>
          <div className="max-w-[40rem] text-center">
            <h1 className="block text-2xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-3xl font-bold sm:font-bold md:font-semibold lg:font-semibold text-gray-800 dark:text-white">
            Please <span className="text-accentColor">confirm your information</span> so we can get everything ready for your project
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
                  className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-base focus:outline-none focus:ring-1 focus:border-accentColor
                  focus:ring-accentColor"
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
                  className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-base focus:outline-none focus:ring-1 focus:border-accentColor
                  focus:ring-accentColor"
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
                    readOnly
                    value={formik.values.zip}
                    className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-base bg-gray-100 dark:border-neutral-700 dark:text-neutral-400 cursor-default focus:outline-none"
                  />
                </div>

                <div className="relative">
                  <label htmlFor="state" className="block mb-2 text-sm text-gray-700 font-medium dark:text-white">State</label>
                  <input
                    id="state"
                    name="state"
                    type="text"
                    maxLength={2}
                    onChange={formik.handleChange}
                    value={formik.values.state}
                    onBlur={formik.handleBlur}
                    className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-base focus:outline-none focus:ring-1 focus:border-accentColor
                  focus:ring-accentColor dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
                  />
                  {formik.errors.state ? (
                    <img src="/images/warning.svg" alt="Invalid" className="absolute right-3 top-10 w-6" />
                  ) : (
                    <img src="/images/tick.svg" alt="Valid" className="absolute right-6 top-11 w-4" />
                  )}
                  {formik.touched.state && formik.errors.state && (
                    <div className="error text-sm text-red-500">{formik.errors.state}</div>
                  )}
                </div>
              </div>
              <div className="relative">
                <label htmlFor="city" className="block mb-2 text-sm text-gray-700 font-medium dark:text-white">City</label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.city}
                  onBlur={formik.handleBlur}
                  className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-base focus:outline-none focus:ring-1 focus:border-accentColor
                  focus:ring-accentColor"
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
                  className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-base focus:outline-none focus:ring-1 focus:border-accentColor
                  focus:ring-accentColor"
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
                  className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-base focus:outline-none focus:ring-1 focus:border-accentColor
                  focus:ring-accentColor"
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

              <div className="relative">
                <label htmlFor="email" className="block mb-2 text-sm text-gray-700 font-medium dark:text-white">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  onBlur={formik.handleBlur}
                  className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-base focus:outline-none focus:ring-1 focus:border-accentColor
                  focus:ring-accentColor"
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
                  <input className="py-3 px-4 block w-12 bg-gray-100 border border-gray-200 border-r-transparent rounded-l-lg text-base focus:border-gray-200 focus:border-r-transparent focus:ring-transparent cursor-default focus:outline-none" readOnly placeholder='+1'>
                  </input>
                  <PhoneInput
                    country="US"
                    id="phone"
                    name="phone"
                    maxLength={14}
                    value={formik.values.phone}
                    onChange={value => formik.setFieldValue('phone', value || '')}
                    onBlur={formik.handleBlur}
                    className="py-3 px-4 block w-full border border-gray-200 rounded-r-lg text-base focus:outline-none focus:ring-1 focus:border-accentColor
                  focus:ring-accentColor dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:ring-accentColor"
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
                  className="h-6 w-6 text-accentColor border-gray-300 rounded focus:ring-accentColor bg-white"
                />
                <label htmlFor="termsAndPrivacyOptIn" className="ml-4 block text-base text-gray-900 dark:text-gray-300">
                  I have read and agree to the 
                  <a href="https://projectquote.com/terms-and-conditions" target="_blank" rel="noopener noreferrer" className="text-accentColor underline ml-1">
                    Terms & Conditions
                  </a> 
                  {" "}and 
                  <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-accentColor underline ml-1">
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
                      ? 'bg-accentColor text-white hover:bg-accentDark transform transition-transform'
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
