"use client";
import React, { useContext, useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { AppContext } from '../../../context/AppContext';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import supabase from '../../../lib/supabaseClient';
import ResetButton from '@/components/ui/resetButton';
import BlurFade from '@/components/ui/blur-fade';
import { Dialog, DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DialogClose,
  DialogTitle
 } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import posthog from 'posthog-js';

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
  const [, setUnsavedChanges] = useState(false);
  const [initialValues, setInitialValues] = useState({ date: '', time: '' });
  const [targetIndex, setTargetIndex] = useState<number | null>(null);
  const stepName = 'appointment_step2_schedule';

  const handleReset = () => {
    posthog.capture('form_reset', {
      form_id: appContext.formId,
      zip: appContext.zip,
      step: stepName,
      service_id: appContext.selectedService,
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
        
        posthog.capture(stepName + '_complete', {
          form_id: formId,
          service_id: appContext.selectedService,
          zip: appContext.zip,
        });
        setLoading(false); // Hide spinner
        onNext();
      }
    },
  });

  // Update useEffect to handle initial values more accurately
  useEffect(() => {
    const currentAppointment = scheduledAppointments[currentAppointmentIndex];
    if (currentAppointment) {
      // Appointment exists, use its values as initial
      const initDate = currentAppointment.date;
      const initTime = currentAppointment.time || '';
      setInitialValues({ date: initDate, time: initTime });
      setDate(new Date(initDate));
      formik.setValues({
        date: initDate,
        time: initTime,
      });
    } else {
      // No saved appointment, consider it unchanged initially
      setInitialValues({ date: '', time: '' });
      setDate(undefined);
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

    // Update handleDateChange and handleTimeSelect to track unsaved changes
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setDate(date);
      const formattedDate = format(date, 'yyyy-MM-dd');
      formik.setFieldValue('date', formattedDate);
      setUnsavedChanges(true); // Mark changes as unsaved
      console.log('Selected Date:', formattedDate);
    }
  };

  const handleTimeSelect = (time: string) => {
    formik.setFieldValue('time', time);
    setUnsavedChanges(true); // Mark changes as unsaved
    console.log('Selected Time:', time);
  };

  // Updated handleNavigation to check for unsaved changes more accurately
  const handleNavigation = (index: number) => {
    const currentAppointment = scheduledAppointments[currentAppointmentIndex];
    const hasChanges =
      (currentAppointment && (formik.values.date !== initialValues.date || formik.values.time !== initialValues.time)) ||
      (!currentAppointment && (formik.values.date !== '' || formik.values.time !== ''));
      
    if (hasChanges) {

      document.getElementById("modal")?.click();
      setTargetIndex(index);
    } else {
      setCurrentAppointmentIndex(index);
    }
  };


    // Handle saving changes and navigation
  const handleSaveChanges = () => {
    formik.handleSubmit();
    setUnsavedChanges(false);
  };

  // Handle discarding changes and navigating
  const handleDiscardChanges = () => {
    if (targetIndex !== null) {
      setCurrentAppointmentIndex(targetIndex);
    }
    setUnsavedChanges(false);
  };


  const renderAppointmentForm = () => (
    <form onSubmit={formik.handleSubmit}>
      <div className="mt-4 rounded-lg px-4 py-4 shadow-lg sm:px-6 sm:py-4 lg:px-8 bg-white">
        <BlurFade key={currentAppointmentIndex} delay={0.1} duration={0.4} blur='none' inView yOffset={0} className="flex-grow">
          <h2 className="text-center mt-2 mb-4 text-xl font-semibold text-gray-800 dark:text-neutral-200">
            Select a date
          </h2>
          <div className="flex justify-center mb-4">
            <div className="rounded-lg small-stepper:border small-stepper:border-gray-300  small-stepper:p-4 small-stepper:shadow-xl sm:p-6 lg:p-8 small-stepper:bg-white">
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

          <h2 className="text-center mt-6 mb-4 text-xl font-semibold text-gray-800 dark:text-neutral-200">
            Select Time
          </h2>
          {/* Time Selection Buttons */}
          <div
            className="flex flex-wrap justify-center pb-2"
            style={{ gap: '10px', marginTop: '15px', width: '100%' }}
          >
            {['10am', '11am', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm'].map((time) => (
              <button
                key={time}
                type="button"
                className={`py-3 px-4 w-20 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-100 ${
                  formik.values.time === time ? 'bg-xorange text-white border-xorange hover:bg-xorange' : 'bg-white text-gray-800'
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
        </BlurFade>
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

      <Dialog>
        <DialogTrigger asChild>
          <button id='modal' className='hidden'></button>
        </DialogTrigger>
        <DialogTitle></DialogTitle>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <h4 className='text-md font-semibold'>Unsaved Changes</h4>
            <DialogDescription>
              You have unsaved changes. Do you want to save them?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
          <DialogClose>
            <Button className='bg-gray-200 hover:bg-gray-300 text-gray-800' onClick={handleDiscardChanges}>Discard Changes</Button>
          </DialogClose>

          <DialogClose>
            <Button className='bg-xorange hover:bg-xorangeDark' onClick={handleSaveChanges}>Save Changes</Button>

          </DialogClose>
          
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="absolute top-[-102px] custom-smallest:top-[-110px] small-stepper:top-[-115px] sm:top-[-121px] md:top-[-137px] left-0 w-full flex justify-end p-4">
        <ResetButton onClick={handleReset} />
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


    <div className="flex w-full">
      <div className="flex bg-gray-100  rounded-lg transition p-1 dark:bg-neutral-700 dark:hover:bg-neutral-600 w-full">
        <nav className="flex gap-x-1 w-full" aria-label="Tabs" role="tablist" aria-orientation="horizontal">
          {Array.from({ length: numberOfQuotes }, (_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleNavigation(index)}
              className={`flex-1 py-3 px-1 small-stepper:px-3 sm:px-4 inline-flex items-center justify-center gap-x-2 bg-transparent text-xs small-stepper:text-sm font-medium rounded-lg transition ${
                currentAppointmentIndex === index
                  ? 'bg-white text-xorange dark:bg-neutral-800 dark:text-neutral-400'
                  : 'text-gray-500  focus:outline-none hover:bg-gray-200 focus:text-xorange dark:text-neutral-400 dark:hover:text-white dark:focus:text-white'
              }`}
              id={`segment-item-${index}`}
              aria-selected={currentAppointmentIndex === index}
              role="tab"
            >
              Consultation {index + 1}
            </button>
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