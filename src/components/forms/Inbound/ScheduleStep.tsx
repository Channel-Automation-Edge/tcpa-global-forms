"use client";
import React, { useContext, useState } from 'react';
import { useFormik } from 'formik';
import { AppContext } from '@/context/AppContext';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import BlurFade from '@/components/ui/blur-fade';

interface ScheduleStepProps {
  onNext: () => void;
}

const ScheduleStep: React.FC<ScheduleStepProps> = ({ onNext }) => {
  const appContext = useContext(AppContext);

  if (!appContext) {
    return null;
  }

  const { form, setForm, contractor } = appContext;
  const [loading, setLoading] = useState<boolean>(false); // State to control spinner

  // Static time slots displayed in AM/PM format
  const timeSlots = contractor.time_slots && contractor.time_slots.length > 0
    ? contractor.time_slots
    : ['10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'];

  const formik = useFormik({
    initialValues: {
      date: form.date || '', // Set initial date if it exists
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
      const formattedDate = format(date, 'yyyy-MM-dd');
      formik.setFieldValue('date', formattedDate);
    }
  };

  const [rawTime, setRawTime] = useState<string>('');

  const handleTimeSelect = (time: string) => {
    // Convert time to military format
    setRawTime(time);
    const timeMapping: Record<string, string> = {
      '10:00 AM': '10:00',
      '11:00 AM': '11:00',
      '1:00 PM': '13:00',
      '2:00 PM': '14:00',
      '3:00 PM': '15:00',
      '4:00 PM': '16:00',
      '5:00 PM': '17:00',
      '6:00 PM': '18:00',
      '7:00 PM': '19:00',
      '8:00 PM': '20:00',
    };
    formik.setFieldValue('time', timeMapping[time]);
  };

  return (
    <div className="z-10 max-w-[100rem] px-4 md:px-12 py-4 md:py-8 mx-auto relative">
      <div className="max-w-xl mx-auto">
        <div className='flex justify-center text-center mb-8'>
          <div className="max-w-[40rem] text-center">
            <h1 className="block text-2xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-3xl font-bold sm:font-bold md:font-semibold lg:font-semibold text-gray-800 dark:text-white">
              Great! Let's  
              <span className="text-accentColor"> Schedule your consultation</span>—pick a date and time for an expert to visit you for your quote
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
                    selected={formik.values.date ? new Date(formik.values.date) : undefined}
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
                    className={`py-3 px-4 w-28 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-300  ${
                      rawTime === time ? 'bg-accentColor text-white border-accentColor hover:bg-accentColor' : 'bg-white text-gray-800 hover:bg-gray-100'
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

export default ScheduleStep;
