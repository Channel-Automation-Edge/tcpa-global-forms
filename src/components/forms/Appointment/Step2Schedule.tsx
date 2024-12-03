"use client";
import React, { useContext, useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { AppContext } from '../../../context/AppContext';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';

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
        time: currentAppointment.time || '',
      });
    } else {
      setDate(new Date());
      formik.resetForm();
    }
  }, [currentAppointmentIndex]);

  const formik = useFormik({
    initialValues: {
      date: appointment.date,
      time: appointment.time || '',
    },
    validate: (values) => {
      const errors: { date?: string; time?: string } = {};
      if (!values.date) {
        errors.date = 'Date is required';
      }
      if (!values.time) {
        errors.time = 'Time is required';
      }
      return errors;
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

  const handleTimeSelect = (time: string) => {
    formik.setFieldValue('time', time);
    console.log('Selected Time:', time);
  };

  const renderAppointmentForm = () => (
    <form onSubmit={formik.handleSubmit}>
      <div className="mt-[-4px] p-4 shadow-lg rounded-md border border-gray-200 border-t-transparent">
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
                  today: new Date(),
                  disabled: [
                    { before: new Date() },
                    { after: new Date(new Date().setDate(new Date().getDate() + 20)) },
                    ...scheduledAppointments.map(appt => new Date(appt.date)).filter(apptDate => !date || apptDate.getTime() !== date.getTime()),
                  ],
                }}
                className=""
              />
            </div>
          </div>

          <h2 className="text-center mt-2 mb-4 text-xl font-semibold text-gray-800 dark:text-neutral-200">
            Select Time
          </h2>
          {/* Time Selection Buttons */}
          <div
            className="flex flex-wrap justify-center"
            style={{ gap: '10px', marginTop: '15px', width: '100%' }}
          >
            {['10am', '11am', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm'].map((time) => (
              <button
                key={time}
                type="button"
                className={`flex items-center justify-center w-[80px] h-[40px] border border-indigo-100 rounded-[10px] shadow-md p-2 transition-transform transform hover:scale-105 ${
                  formik.values.time === time ? 'bg-orange-100 text-xorange' : 'bg-white text-gray-800'
                }`}
                onClick={() => handleTimeSelect(time)}
              >
                {time}
              </button>
            ))}
          </div>

          {formik.values.time && (
            <div className="mt-2 text-center text-gray-700 dark:text-neutral-200">
              Selected Time: {formik.values.time}
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
            formik.values.date && formik.values.time
              ? 'bg-xorange text-white shadow-lg shadow-[rgba(254,139,16,0.5)] transform transition-transform'
              : 'bg-gray-200 text-white cursor-not-allowed'
          }`}
          disabled={!formik.values.date || !formik.values.time}
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
              >
                {Array.from({ length: numberOfQuotes }, (_, index) => (
                  <option key={index} value={index}>
                    Appointment {index + 1}
                  </option>
                ))}
              </select>
            </div>

            <div className="hidden sm:block">
              <div className="border-b-xbg border-gray-200">
                <nav className="-mb-px flex w-full">
                  {Array.from({ length: numberOfQuotes }, (_, index) => (
                    <a
                      key={index}
                      onClick={() => setCurrentAppointmentIndex(index)}
                      className={`flex-1 border p-3 text-sm font-medium text-center cursor-pointer ${
                        currentAppointmentIndex === index
                          ? 'rounded-t-lg border-gray-200 border-b-xbg text-xorange'
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