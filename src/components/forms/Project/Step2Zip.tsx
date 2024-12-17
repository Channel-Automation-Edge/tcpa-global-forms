"use client";
import React, { useContext, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { AppContext } from '../../../context/AppContext';
import supabase from '../../../lib/supabaseClient';
import ResetButton from '@/components/ui/resetButton';
import BackButton from '@/components/ui/backButton';

interface Step2ZipProps {
    onNext: () => void;
    onBack: () => void;
    onReset: () => void;
    onNotify: () => void;
}

const Step2Zip: React.FC<Step2ZipProps> = ({ onNext, onBack, onReset, onNotify }) => {
  const appContext = useContext(AppContext);

  if (!appContext) {
    return null;
  }

  const { selectedService, setZip, setState, zip } = appContext;
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [serviceName, setServiceName] = useState<string>(''); // Service name from Services table

  useEffect(() => {
    const fetchServiceName = async () => {
      if (!selectedService) {
        setMessage('No service selected.');
        return;
      }

      const { data, error } = await supabase
        .from('Services')
        .select('name')
        .eq('id', selectedService)
        .single();

      if (error) {
        console.error('Error fetching service name:', error.message);
        return;
      }

      if (data) {
        setServiceName(data.name);
      }
    };

    fetchServiceName();
  }, [selectedService]);

  const formik = useFormik({
    initialValues: {
      zip: zip || new URLSearchParams(window.location.search).get('zip') || '',
    },
    onSubmit: async (values) => {
      setLoading(true);
      const zip = parseInt(values.zip, 10);
      if (isNaN(zip)) {
        setMessage('Please enter a valid ZIP Code');
        setLoading(false);
        return;
      }

      // Find stateCode from Zips table
      const { data: zipData, error: zipError } = await supabase
        .from('Zips')
        .select('stateCode')
        .lte('zipMin', zip)
        .gte('zipMax', zip)
        .single();

      if (zipError || !zipData || zip === 0) {
        setMessage('Please enter a valid ZIP Code');
        setLoading(false);
        return;
      }

      const stateCode = zipData.stateCode;
      setState(stateCode);
      setZip(zip.toString());
      

      // Find contractor from Contractors table
      try {
        const { data: contractors, error: contractorError } = await supabase
          .from('Contractors')
          .select('*')
          .filter('statesServed', 'cs', `["${stateCode}"]`)
          .filter('services', 'cs', `["${selectedService}"]`)
          .limit(1);

        if (contractorError) {
          console.error('Error fetching contractors:', contractorError.message);
          setMessage('Error checking for contractors');
          setLoading(false);
          return;
        }

        if (contractors && contractors.length > 0) {
          onNext(); // Proceed to the next step if a contractor is found
        } else {
          setMessage(`Sorry, we currently do not have any experts in your area that provide ${serviceName} services. Select another service or get notified when this service is available in your area.`);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setMessage('Unexpected error checking for contractors');
      }

      setLoading(false);
    },
  });

  return (
    <div className="z-10 max-w-[100rem] px-4 md:px-14 py-10 lg:py-14 mx-auto relative">
      <div className="absolute top-[-102px] custom-smallest:top-[-110px] small-stepper:top-[-115px] sm:top-[-121px] md:top-[-137px] left-0 w-full flex justify-between p-4">
        <BackButton onClick={onBack} />
        <ResetButton onClick={onReset} />
      </div>
      <div className="space-y-8">
        <div className='flex justify-center text-center mb-8'>
          <div className="max-w-[40rem] text-center">
            <h1 className="block text-2xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-3xl font-bold sm:font-bold md:font-semibold lg:font-semibold text-gray-800 dark:text-white">
              Confirm your ZIP Code so we can check if <span className='text-xorange'>{serviceName} </span> services are available in your area
            </h1>
          </div>
        </div>

        <form onSubmit={formik.handleSubmit} className="mt-12 flex flex-col h-full">
          <div className="flex flex-col sm:flex-row my-6 justify-center items-center sm:space-x-4">
            <input
              id="zip"
              name="zip"
              type="text"
              value={formik.values.zip}
              onChange={formik.handleChange}
              className="py-4 px-4 text-center block border-gray-200 rounded-lg text-base focus:border-xorange focus:ring-xorange dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:ring-xorange"
              placeholder="Enter ZIP Code"
            />
            <button
            type="submit"
            className={`w-full max-w-[209px] sm:w-[210px] mt-4 sm:mt-0 py-4 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent transition-colors duration-75 ${ // Use transition-colors for color transitions
                formik.isValid
                ? 'bg-white text-xorange border border-xorange transform hover:scale-105'
                : 'bg-gray-200 text-white cursor-not-allowed'
            }`}
            disabled={!formik.isValid}
            >
            {loading ? (
                <div className="animate-spin h-5 w-5 border-2 border-xorange border-t-transparent rounded-full"></div>
            ) : (
                'Confirm ZIP Code'
            )}
            </button>

          </div>

          {message && (
            <div className="mt-4 text-center text-red-600 flex justify-center">
                <div className='max-w-[40rem]'>
                {message}
                </div>
              
            </div>
          )}

          {message && !message.includes('Please enter a valid ZIP Code') && (
            <div className="mt-6 flex flex-col sm:flex-row sm:justify-center sm:space-x-4">
                <button
                type="button"
                onClick={onReset}
                className="w-full sm:max-w-xs sm:flex-1 mb-4 sm:mb-0 py-5 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-gray-600 text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
              >
                Select Another Service
                </button>
              <button
                type="button"
                onClick={onNotify}
                className="w-full sm:max-w-xs sm:flex-1 py-5 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-xorange text-white hover:bg-xorangeDark shadow-lg shadow-[rgba(102,89,83,0.5)]"
              >
                Notify Me
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Step2Zip;
