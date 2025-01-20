"use client";
import React, { useContext, useState } from 'react';
import { useFormik } from 'formik';
import { AppContext } from '@/context/AppContext';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import ResetButton from '@/components/ui/resetButton';
import BlurFade from '@/components/ui/blur-fade';
import BackButton from '@/components/ui/backButton';

interface Step2ScheduleProps {
  onNext: () => void;
  onReset: () => void;
  onBack: () => void;
}

const Step2Schedule: React.FC<Step2ScheduleProps> = ({ onNext, onReset, onBack }) => {
  const appContext = useContext(AppContext);

  if (!appContext) {
    return null;
  }

  const { form, setForm, contractor } = appContext;
  const [date, setDate] = useState<Date | undefined>();
  const [loading, setLoading] = useState<boolean>(false); // State to control spinner

  const timeSlots = contractor.time_slots && contractor.time_slots.length > 0
    ? contractor.time_slots
    : ['10am', '11am', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm'];

  const formik = useFormik({
    initialValues: {
      date: form.date || '',
      time: form.time || '',
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
      setLoading(true); // Show spinner

      setForm((prevForm) => ({
        ...prevForm,
        date: values.date,
        time: values.time,
      }));

      setLoading(false); // Hide spinner
      onNext();
    },
  });

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setDate(date);
      const formattedDate = format(date, 'yyyy-MM-dd');
      formik.setFieldValue('date', formattedDate);
    }
  };

  const handleTimeSelect = (time: string) => {
    formik.setFieldValue('time', time);
  };

  return (
    <div className="z-10 max-w-[100rem] px-4 md:px-12 py-4 md:py-8 mx-auto relative">
      <div className="absolute top-[-102px] custom-smallest:top-[-110px] small-stepper:top-[-115px] sm:top-[-121px] md:top-[-137px] left-0 w-full flex justify-between p-4">
        <BackButton onClick={onBack} />
        <ResetButton onClick={onReset} />
      </div>
      <div className="max-w-xl mx-auto">
        <div className='flex justify-center text-center mb-8'>
          <div className="max-w-[40rem] text-center">
            <h1 className="block text-2xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-3xl font-bold sm:font-bold md:font-semibold lg:font-semibold text-gray-800 dark:text-white">
              Great! Let's  
              <span className="text-accentColor">schedule your consultation</span>—pick a date and time for an expert to visit you for your quote
            </h1>
          </div>
        </div>

        <form onSubmit={formik.handleSubmit}>
          <div className="mt-4 rounded-lg px-4 py-4 shadow-lg sm:px-6 sm:py-4 lg:px-8 bg-white">
            <BlurFade delay={0.1} duration={0.4} blur='0px' inView yOffset={0} className="flex-grow">
              <h2 className="text-center mt-2 mb-4 text-xl font-semibold text-gray-800 dark:text-neutral-200">
                Select a date
              </h2>
              <div className="flex justify-center mb-4">
                <div className="rounded-lg small-stepper:border small-stepper:border-gray-300 small-stepper:p-4 small-stepper:shadow-xl sm:p-6 lg:p-8 small-stepper:bg-white">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateChange}
                    initialFocus
                    modifiers={{
                      disabled: [
                        { before: new Date() },
                        { from: new Date(), to: new Date(new Date().setDate(new Date().getDate() + 3)) },
                        { after: new Date(new Date().setDate(new Date().getDate() + 20)) },
                      ]
                    }}
                  />
                </div>
              </div>

              <h2 className="text-center mt-6 mb-4 text-xl font-semibold text-gray-800 dark:text-neutral-200">
                Select Time
              </h2>
              <div
                className="flex flex-wrap justify-center pb-2"
                style={{ gap: '10px', marginTop: '15px', width: '100%' }}
              >
                {timeSlots.map((time: string) => (
                  <button
                    key={time}
                    type="button"
                    className={`py-3 px-4 w-20 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-300  ${
                      formik.values.time === time ? 'bg-accentColor text-white border-accentColor hover:bg-accentColor' : 'bg-white text-gray-800 hover:bg-gray-100'
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
                  ? 'bg-accentColor text-white hover:bg-accentDark transform transition-transform'
                  : 'bg-gray-200 text-white cursor-not-allowed'
              }`}
              disabled={!formik.values.date || !formik.values.time}
            >
              {loading ? (
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                'Continue'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Step2Schedule;
