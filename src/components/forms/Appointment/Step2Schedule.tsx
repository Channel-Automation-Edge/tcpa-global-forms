"use client";
import React, { useContext, useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { AppContext } from '../../../context/AppContext';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import supabase from '../../../lib/supabaseClient';
import ResetButton from '@/components/ui/resetButton';

interface Step2ScheduleProps {
  onNext: () => void;
  onReset: () => void;
}

const Step2Schedule: React.FC<Step2ScheduleProps> = ({ onNext, onReset }) => {
  const appContext = useContext(AppContext);

  if (!appContext) {
    return null;
  }

  const { numberOfQuotes, appointment, scheduledAppointments, setScheduledAppointments, formId, phone } = appContext;
  const [currentAppointmentIndex, setCurrentAppointmentIndex] = useState(0);
  const [date, setDate] = useState<Date | undefined>();
  const [loading, setLoading] = useState<boolean>(false); // State to control spinner

  

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
    onSubmit: async (values) => {
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
        setLoading(true); // Show spinner

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
            // formId exists, update the updated_at column
            const { error: updateError } = await supabase
              .from('Forms')
              .update({ updated_at: new Date().toISOString() })
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
              .insert([{ id: formId, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), phone: phone }]);

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
    
        setLoading(false); // Hide spinner

        onNext();
      }
    },
  });

  useEffect(() => {
    const currentAppointment = scheduledAppointments[currentAppointmentIndex];
    if (currentAppointment) {
      setDate(new Date(currentAppointment.date));
      formik.setValues({
        date: currentAppointment.date,
        time: currentAppointment.time || '',
      });
    } else {
      setDate(undefined);  // Set to undefined instead of new Date()
      formik.resetForm();
    }
  }, [currentAppointmentIndex]);
  
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
                initialFocus
                modifiers={{
                  
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
            <div className="mt-2 text-center text-gray-700 dark:text-neutral-200 hidden">
              Selected Time: {formik.values.time}
            </div>
          )}
        </div>
      </div>
      <div className="mt-6 flex flex-col space-y-4">
        <button
          type="submit"
          className={`w-full py-5 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent ${
            formik.values.date && formik.values.time
              ? 'bg-xorange text-white hover:bg-xorangeDark shadow-lg shadow-[rgba(254,139,16,0.5)] transform transition-transform'
              : 'bg-gray-200 text-white cursor-not-allowed'
          }`}
          disabled={!formik.values.date || !formik.values.time}
        >
          {loading ? (
            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
          ) : (
            currentAppointmentIndex < numberOfQuotes - 1 ? 'Save Changes' : 'Match with Local Contractors'
          )}
        </button>
        {currentAppointmentIndex > 0 && (
          <button
            type="button"
            onClick={() => setCurrentAppointmentIndex(currentAppointmentIndex - 1)}
            className="w-full py-5 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-gray-600 text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
          >
            Previous
          </button>
        )}
      </div>

    </form>
  );

  return (
    <div className="z-10 max-w-[100rem] px-4 lg:px-14 py-10 lg:py-14 mx-auto relative">
      <div className="absolute top-[-102px] custom-smallest:top-[-110px] small-stepper:top-[-115px] sm:top-[-121px] md:top-[-137px] left-0 w-full flex justify-end p-4">
        <ResetButton onClick={onReset} />
      </div>
      <div className="max-w-xl mx-auto">
      <div className='flex justify-center text-center mb-8'>
            <div className="max-w-[40rem] text-center">
              <h1 className="block text-2xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-3xl font-bold sm:font-bold md:font-semibold lg:font-semibold text-gray-800 dark:text-white">
                {numberOfQuotes === 1 ? (
                  <>
                    Great! Let's  
                    <span className="text-xorange"> schedule your consultation</span>—pick a date and time for an expert to visit you for your quote
                  </>
                ) : (
                  <>
                    Great! Let's 
                    <span className="text-xorange"> schedule your consultations</span>—pick a date and time for each expert to visit you for your quote
                  </>
                )}
              </h1>
            </div>
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