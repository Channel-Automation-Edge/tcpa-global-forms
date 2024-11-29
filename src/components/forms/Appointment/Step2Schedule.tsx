"use client";
import React, { useContext, useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { AppContext } from '../../../context/AppContext';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';

// Define props interface
interface Step2ScheduleProps {
  onNext: () => void;
}

const Step2Schedule: React.FC<Step2ScheduleProps> = ({ onNext }) => {
  const appContext = useContext(AppContext);

  if (!appContext) {
    return null;
  }

  const { numberOfQuotes, appointment, scheduledAppointments, setScheduledAppointments } = appContext;
  const [currentAppointmentIndex, setCurrentAppointmentIndex] = useState(0);
  const [date, setDate] = useState<Date | undefined>(new Date());

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

  const formik = useFormik({
    initialValues: {
      date: appointment.date,
      optIn: appointment.optIn,
      contactPreferences: appointment.contactPreferences,
    },
    onSubmit: (values) => {
      const newAppointment = {
        ...values,
        id: currentAppointmentIndex + 1,
      };
      const updatedAppointments = [...scheduledAppointments];
      updatedAppointments[currentAppointmentIndex] = newAppointment;
      setScheduledAppointments(updatedAppointments);
      console.log('Scheduled Appointments:', updatedAppointments);

      if (currentAppointmentIndex < numberOfQuotes - 1) {
        setCurrentAppointmentIndex(currentAppointmentIndex + 1);
      } else {
        console.log('Final Scheduled Appointments:', updatedAppointments);
        onNext();
      }
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
    <form onSubmit={formik.handleSubmit}>
      <div className="mt-[-3px] p-4 shadow-lg rounded-md border border-gray-200 border-t-white"> 
        {/* this is the appointment card */}
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
            If this is not checked, we will contact/update you about your consultation.
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
    type="submit"
    className={`w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent ${
      formik.values.date
        ? 'bg-xorange text-white shadow-lg shadow-[rgba(254,139,16,0.5)] transform transition-transform'
        : 'bg-gray-200 text-white cursor-not-allowed'
    }`}
    disabled={!formik.values.date}
  >
    {currentAppointmentIndex < numberOfQuotes - 1 ? 'Save Changes' : 'Match with Local Contractors'}
  </button>
</div>

    </form>
  );

  return (
    <div className="z-10 max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <div className="max-w-xl mx-auto">
        <div className="text-center">
          <h1 className="block text-3xl font-bold text-primary dark:text-white">
            Schedule your FREE consultation
          </h1>
          <p className=" text-gray-600 dark:text-neutral-400 mt-4 mb-10">
            {numberOfQuotes === 1
              ? 'Select a date to be visited by one of our professional contractors to give you a free estimate.'
              : `You requested ${numberOfQuotes} FREE consultations. Set a date for each one to be visited by our professional contractors to give you a free estimate.`}
          </p>
        </div>

        {numberOfQuotes > 1 && (
          <div>
            <div className="sm:hidden">
              <label htmlFor="Tab" className="sr-only">Tab</label>
              <select
                id="Tab"
                className="w-full rounded-md border-gray-200"
                value={currentAppointmentIndex}
                onChange={(e) => setCurrentAppointmentIndex(Number(e.target.value))}
                disabled
              >
                {Array.from({ length: numberOfQuotes }, (_, index) => (
                  <option key={index} value={index}>
                    Appointment {index + 1}
                  </option>
                ))}
              </select>
            </div>

            <div className="hidden sm:block">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex w-full">
                  {Array.from({ length: numberOfQuotes }, (_, index) => (
                    <a
                      key={index}
                      className={`flex-1 border p-3 text-sm font-medium text-center ${
                        currentAppointmentIndex === index
                          ? 'rounded-t-lg border-gray-200 border-b-white text-xorange'
                          : 'border-transparent text-gray-500'
                      }`}
                    >
                      Consultation {index + 1}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        )}

        {renderAppointmentForm()}
      </div>
    </div>
  );
};

export default Step2Schedule;