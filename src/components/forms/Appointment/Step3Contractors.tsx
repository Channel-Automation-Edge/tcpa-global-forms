"use client";
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../context/AppContext';
import contractorsData from '../../../assets/assets.json';
import { Calendar } from '@/components/ui/calendar';
import { useFormik } from 'formik';
import { format } from 'date-fns';

// Define props interface
interface Step3ContractorsProps {
  onCompleted: () => void;
}

interface FormValues {
  date: string;
  optIn: boolean;
  contactPreferences: string[];
}

const Step3Contractors: React.FC<Step3ContractorsProps> = ({ onCompleted }) => {
  const appContext = useContext(AppContext);

  if (!appContext) {
    return null;
  }

  const { selectedService, numberOfQuotes, matchingContractors, setMatchingContractors, scheduledAppointments, setScheduledAppointments, zip, state, contractorPreferences, firstname, lastname, email, phone, generalOptIn, serviceSpecifications, promo } = appContext;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAppointmentIndex, setCurrentAppointmentIndex] = useState(0);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const filteredContractors = contractorsData.contractors.filter(contractor =>
      contractor.services.includes(selectedService) && contractor.zip === zip && contractor.state === state
    ).slice(0, numberOfQuotes);

    setMatchingContractors(filteredContractors);

    const updatedAppointments = scheduledAppointments.map((appointment, index) => ({
      ...appointment,
      contractor: filteredContractors[index] || appointment.contractor,
    })).filter(appointment => appointment.contractor);

    setScheduledAppointments(updatedAppointments);
  }, [selectedService, numberOfQuotes, zip, state, setMatchingContractors, setScheduledAppointments]);

  useEffect(() => {
    const currentAppointment = scheduledAppointments[currentAppointmentIndex];
    if (currentAppointment) {
      setDate(new Date(currentAppointment.date));
      formik.setValues({
        date: currentAppointment.date,
        optIn: currentAppointment.optIn,
        contactPreferences: currentAppointment.contactPreferences,
      });
    } else {
      setDate(new Date());
      formik.resetForm();
    }
  }, [currentAppointmentIndex]);

  const formik = useFormik<FormValues>({
    initialValues: {
      date: '',
      optIn: false,
      contactPreferences: [],
    },
    onSubmit: async (values) => {
      const updatedAppointments = [...scheduledAppointments];
      updatedAppointments[currentAppointmentIndex] = {
        ...updatedAppointments[currentAppointmentIndex],
        date: values.date,
        optIn: values.optIn,
        contactPreferences: values.contactPreferences,
      };
      setScheduledAppointments(updatedAppointments);
      console.log('Scheduled Appointments:', updatedAppointments);
      setIsModalOpen(false);

      const payload = {
        lead: {
          firstname,
          lastname,
          email,
          phone,
          generalOptIn,
          zip,
          state,
          selectedService,
          serviceSpecifications,
          contractorPreferences,
          promo,
        },
        error: null,
        appointments: updatedAppointments,
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
          throw new Error('Failed to send appointments');
        }

        console.log('Appointments sent successfully');
        
      } catch (err) {
        console.error('Error sending appointments:', err);
        setError((err as Error).message);
      }
      onCompleted();
    },
  });

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setDate(date);
      const formattedDate = format(date, 'yyyy-MM-dd');
      formik.setFieldValue('date', formattedDate);
      console.log('Selected Date:', formattedDate);
    }
  };

  const handleOptInChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    formik.setFieldValue('optIn', event.target.checked);
  };

  const handleContactPreferencesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    const newPreferences = checked
      ? [...formik.values.contactPreferences, value]
      : formik.values.contactPreferences.filter((pref) => pref !== value);
    formik.setFieldValue('contactPreferences', newPreferences);
  };

  const renderAppointmentForm = () => (
    <form className="mt-0 flex flex-col h-full">
      <div className="flex-grow">
          <h2 className="text-center mt-2 mb-4 text-xl font-semibold text-gray-800 dark:text-neutral-200">
            Select a date
          </h2>
          <div className="flex justify-center mb-4">
            <div className="border border-gray-300 p-2">
            <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateChange}
                modifiers={{
                  today: new Date(), // Ensures the current date is always highlighted
                  disabled: [
                    { before: new Date() }, // Disable all previous dates
                    { after: new Date(new Date().setDate(new Date().getDate() + 20)) }, // Disable dates after 20 days from today
                    ...scheduledAppointments.map(appt => new Date(appt.date)).filter(apptDate => !date || apptDate.getTime() !== date.getTime()), // Exclude selected date from being disabled
                  ],
                }}
                modifiersStyles={{
                  
                }}
                className=""
              />
            </div>
          </div>
          <div className="mt-6 mx-6 flex items-center">
            <input
              id="optIn"
              name="optIn"
              type="checkbox"
              checked={formik.values.optIn}
              onChange={handleOptInChange}
              className="h-4 w-4 text-xorange border-gray-300 rounded focus:ring-xorange"
            />
            <label htmlFor="optIn" className="ml-2 text-sm text-gray-900 dark:text-gray-300">
              Opt-in for the designated contractor to contact me
            </label>
          </div>
          <p className="text-sm mt-2 text-gray-500 dark:text-neutral-400 mx-6">
            If this is not checked, we will contact/update you about your appointment.
          </p>
          {formik.values.optIn && (
            <div className="mt-4">
              <label className="block mb-2 text-sm text-gray-700 font-medium dark:text-white">Preferred Contact Method</label>
              <div className="flex flex-col">
                {['phone', 'email', 'sms'].map((method) => (
                  <div key={method} className="flex items-center mb-2">
                    <input
                      id={method}
                      name="contactPreferences"
                      type="checkbox"
                      value={method}
                      checked={formik.values.contactPreferences.includes(method)}
                      onChange={handleContactPreferencesChange}
                      className="h-4 w-4 text-xorange border-gray-300 rounded focus:ring-xorange"
                    />
                    <label htmlFor={method} className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                      {method.charAt(0).toUpperCase() + method.slice(1)}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      <div className="mt-6 flex flex-col sm:flex-row justify-between sm:space-x-4 space-y-4 sm:space-y-0">
        {currentAppointmentIndex > 0 && (
          <button
            type="button"
            onClick={() => setCurrentAppointmentIndex(currentAppointmentIndex - 1)}
            className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-gray-600 text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
          >
            Previous
          </button>
        )}
        <button
          type="button"
          onClick={() => formik.handleSubmit()}
          className={`w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent ${
            formik.values.date
              ? 'bg-xorange text-white shadow-lg shadow-[rgba(254,139,16,0.5)] transform transition-transform'
              : 'bg-gray-400 text-gray-700 cursor-not-allowed'
          }`}
          disabled={!formik.values.date}
        >
          Save changes
        </button>
      </div>
    </form>
  );

  const renderContractorCards = () => (
    <div className="mt-6 space-y-4">
      {scheduledAppointments.map((appointment, index) => (
        <div key={index} className="p-4 border rounded-lg shadow-sm bg-white dark:bg-neutral-800 dark:border-neutral-700 flex flex-col sm:flex-row items-start sm:items-center max-w-[950px] mx-auto">
          <div className="flex items-center mb-4 sm:mb-0 sm:mr-4" style={{ minWidth: '150px' }}>
            <img src={appointment.contractor?.photo} alt={appointment.contractor?.name} className="w-16 h-16 rounded-full" />
            <div className="ml-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{appointment.contractor?.name}</h3>
              <p className="text-sm text-gray-600 dark:text-neutral-400">{appointment.contractor?.zip}, {appointment.contractor?.state}</p>
            </div>
          </div>
          <div className="flex-grow sm:text-center mb-4 sm:mb-0">
            <p className="text-sm text-gray-600 dark:text-neutral-400">Scheduled Date:</p>
            <span className="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium border border-gray-800 text-gray-800 dark:border-neutral-200 dark:text-white">
              {appointment.date}
            </span>
          </div>
          <div className="flex-grow sm:text-center mb-4 sm:mb-0 mx-3" style={{ width: '300px' }}>
            
            <div className="flex flex-wrap gap-2 justify-start">
              {contractorPreferences.map((pref, idx) => (
                <span key={idx} className="py-1 px-2 inline-flex items-center gap-x-1 text-xs font-medium bg-teal-100 text-teal-800 rounded-full dark:bg-teal-500/10 dark:text-teal-500">
                  <svg className="shrink-0" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                    <path d="m9 12 2 2 4-4"></path>
                  </svg>
                  {pref}
                </span>
              ))}
            </div>
          </div>
          <div className="sm:text-right">
            <button
              type="button"
              className="mt-4 sm:mt-0 w-auto py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-[#2E5B5E] text-white "
              onClick={() => {
                setCurrentAppointmentIndex(index);
                setIsModalOpen(true);
              }}
            >
              Change Date
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="z-10 max-w-[100rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="block text-3xl font-bold text-primary dark:text-white">
            {matchingContractors.length === 0
              ? 'No contractors are available in your area for the selected project.'
              : matchingContractors.length < numberOfQuotes
              ? `We only have ${matchingContractors.length} contractors available in your area`
              : 'Your contractors are ready!'}
          </h1>
          <p className="mt-1 text-gray-600 dark:text-neutral-400">
            {matchingContractors.length === 0
              ? 'Please select another project.'
              : 'We matched you with contractors in your area that meet your project specifications and contractor preferences.'}
          </p>
        </div>

        {matchingContractors.length > 0 && renderContractorCards()}

        {error && (
          <div className="mt-4 text-center text-red-600">
            {error}
          </div>
        )}

        <div className="mt-20 flex justify-center">
          <button
            type="button"
            onClick={() => formik.handleSubmit()}
            className={`w-full max-w-xs px-0 py-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent ${
              scheduledAppointments.some(appt => appt.date)
                ? 'bg-xorange text-white shadow-lg shadow-[rgba(254,139,16,0.5)] transform transition-transform translate-y-[-8px]'
                : 'bg-gray-200 text-white cursor-not-allowed'
            }`}
            disabled={!scheduledAppointments.some(appt => appt.date)}
          >
            Request Free Consultation
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div id="hs-scale-animation-modal" className="hs-overlay fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Change Appointment Date</h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={() => setIsModalOpen(false)}
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mt-4">
              {renderAppointmentForm()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step3Contractors;