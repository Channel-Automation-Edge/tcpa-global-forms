import React, { useContext, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup'; // Import Yup for validation
import { AppContext } from '../../../context/AppContext';

interface Step1InfoProps {
  onNext: () => void;
}

const Step1Info: React.FC<Step1InfoProps> = ({ onNext }) => {
  const appContext = useContext(AppContext);

  if (!appContext) {
    return null;
  }

  const { zip, state, email, phone, firstname, lastname, termsAndPrivacyOptIn, setZip, setEmail, setPhone, setFirstname, setLastname, setState, setTermsAndPrivacyOptIn } = appContext;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    formik.setValues({
      firstname: params.get('firstname') || firstname || '',
      lastname: params.get('lastname') || lastname || '',
      zip: params.get('zip') || zip || '',
      state: params.get('state') || state || '',
      email: params.get('email') || email || '',
      phone: params.get('phone') || phone || '',
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
    onSubmit: (values) => {
      console.log("Form submitted with values:", values);
      setZip(values.zip);
      setState(values.state);
      setEmail(values.email);
      setPhone(values.phone);
      setFirstname(values.firstname);
      setLastname(values.lastname);
      setTermsAndPrivacyOptIn(values.termsAndPrivacyOptIn);

      // Move to the next step
      onNext();
    },
  });

  return (
    <div className="z-10 max-w-[100rem] px-4 lg:px-14 py-10 lg:py-14 mx-auto relative">
      
      <div className="max-w-xl mx-auto">
        <div className='flex justify-center text-center mb-8'>
          <div className="max-w-[40rem] text-center">
            <h1 className="block text-2xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-3xl font-bold sm:font-bold md:font-semibold lg:font-semibold text-gray-800 dark:text-white">
            Please <span className="text-xorange">confirm your information</span> so we can get everything ready for your project
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
                  className={`w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent ${
                    formik.isValid && formik.values.termsAndPrivacyOptIn
                      ? 'bg-xorange text-white shadow-lg shadow-[rgba(254,139,16,0.5)] transform transition-transform'
                      : 'bg-gray-200 text-white cursor-not-allowed'
                  }`}
                  disabled={!formik.isValid || !formik.values.termsAndPrivacyOptIn}
                >
                  Confirm Information
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