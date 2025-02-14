"use client";
import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '@/context/AppContext';
import Bathtub from '@/components/icons/Bathtub';
import Trowel from '@/components/icons/Trowel';
import Closet from '@/components/icons/Closet';
import Plumbing from '@/components/icons/Plumbing';
import Deck from '@/components/icons/Deck';
import Garage from '@/components/icons/Garage';
import Gutter from '@/components/icons/Gutter';
import Foundation from '@/components/icons/Foundation';
import Flooring from '@/components/icons/Floor';
import Kitchen from '@/components/icons/Kitchen';
import Roofing from '@/components/icons/Roofing';
import Siding from '@/components/icons/Siding';
import Shower from '@/components/icons/Shower';
import Windows from '@/components/icons/Windows';
import Fence from '@/components/icons/Fence';
import { central } from '@/lib/supabaseClient';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTrigger, DialogClose, DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import ConfirmCheck from '@/components/icons/ConfirmCheck';
import Doors from '@/components/icons/Doors';
import { useNavigate } from 'react-router-dom';
import Solar from '@/components/icons/Solar';

// Icon mapping
const iconMapping: Record<string, JSX.Element> = {
  'Bath': <Bathtub />,
  'Basement Waterproofing': <Trowel />,
  'Closet': <Closet />,
  'Plumbing': <Plumbing />,
  'Deck': <Deck />,
  'Doors': <Doors />,
  'Fence': <Fence />,
  'Flooring': <Flooring />,
  'Garage': <Garage />,
  'Gutters': <Gutter />,
  'Foundation': <Foundation />,
  'Kitchen': <Kitchen />,
  'Roofing': <Roofing />,
  'Siding': <Siding />,
  'Shower': <Shower />,
  'Windows': <Windows />,
  'Solar': <Solar />,
  // Add more mappings as needed
};

// Define props interface
interface SummaryProps {
  onNext: () => void;
  onSchedule: () => void;
}

const Summary: React.FC<SummaryProps> = ({ onNext, onSchedule }) => {
  const appContext = useContext(AppContext);

  if (!appContext) {
    return null;
  }

  const { form, setForm, user, contractor, selectedService } = appContext;
  const [loading, setLoading] = useState<boolean>(false);
  const [validAppointment, setValidAppointment] = useState<boolean>(false);
  const [hideOptIn, setHideOptIn] = useState<boolean>(false);
  const navigate = useNavigate();
  const navigateWithParams = (path: string) => {
    const currentParams = new URLSearchParams(location.search);
    navigate(`${path}?${currentParams.toString()}`);
  };
  const [slug, setSlug] = useState('');

  useEffect(() => {
    if (appContext && appContext.contractor) {
      setSlug(appContext.contractor.slug);
    }
  }, [appContext, appContext.contractor]);

  // Check if form is valid
  useEffect(() => {
    // Check if all required fields are filled
    if (
      form.date &&
      form.time &&
      user.firstname &&
      user.lastname &&
      user.address1 &&
      user.city &&
      user.state &&
      user.zip &&
      user.email &&
      user.phone &&
      selectedService
    ) {
      setValidAppointment(true);
    } else {
      setValidAppointment(false);
    }
  }, [form, user, selectedService]);

  // validate form
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
  
    // Check if the required parameters exist and are not empty
    if (
      params.has('adate') && params.get('adate') &&
      params.has('atime') && params.get('atime') &&
      params.has('firstname') && params.get('firstname') &&
      params.has('lastname') && params.get('lastname') &&
      params.has('address1') && params.get('address1') &&
      params.has('city') && params.get('city') &&
      params.has('state') && params.get('state') &&
      params.has('zip') && params.get('zip') &&
      params.has('email') && params.get('email') &&
      params.has('phone') && params.get('phone') &&
      params.has('service') && params.get('service')
    ) {
      setHideOptIn(false);
    } else {
      setHideOptIn(true);
    }
  }, []);
  

  const handleRefresh = () => {
    window.location.reload();

  };

  const payload = {
    user,
    form,
    contractor,
    selectedService,
    consent: {
      general: {
        description: 'By checking the box above, I provide my ESIGN and express written consent for {appContext.contractor.name} and its authorized partners to contact me at the phone number and email address I have provided in this form. This may include marketing communications sent using automated technology, such as calls, texts, or emails. I understand that this consent is not required to make a purchase.',
        value: form.generalOptIn,
      },
    },
  };

  const handleConfirmBooking = async () => {
    setLoading(true);

    try {
      const response = await fetch('https://hkdk.events/w8wqxy2op6oty4', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to send appointments');
      }
    } catch (err) {
      console.error('Error sending appointments:', err);
    }

    setLoading(false);
    document.getElementById("dialog")?.click();

    // Insert data to database
    try {
      const { data, error } = await central
        .from('bookings')
        .insert([
          {
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            phone: user.phone,
            address1: user.address1,
            address2: user.address2,
            city: user.city,
            state: user.state,
            zip: user.zip,
            user_ns: user.userNs,
            service_specification: form.serviceSpecification,
            promo: form.promo,
            opt_in: form.generalOptIn,
            date: form.date,
            time: form.time,
            service_name: selectedService.name,
            service_id: selectedService.id,
            is_booked: true,
            id: form.formId,
          },
        ]);

      if (error) {
        console.error('Error inserting data:', error);
      } else {
        console.log('Data inserted successfully:', data);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    }
    navigateWithParams(`/summary/${slug}`);
  };

  const formatDate = (dateString:any) => {
    // Split the date string into components
    const [year, month, day] = dateString.split('-');
  
    // Create a new Date object using local timezone
    const date = new Date(year, month - 1, day); // Month is 0-indexed
  
    // Format the date manually to ensure consistency
    return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(date);
  };
  

  const formatTime = (timeString: string) => {
    // Split the time string into hours and minutes
    const [hourStr, minuteStr] = timeString.split(':');
    let hour = parseInt(hourStr, 10);
    const minutes = minuteStr || '00'; // Default to '00' if no minutes part
  
    // Determine AM or PM period
    const period = hour >= 12 ? 'PM' : 'AM';
  
    // Convert hour to 12-hour format
    if (hour === 0) {
      hour = 12; // Midnight case
    } else if (hour > 12) {
      hour -= 12; // Convert to 12-hour format
    }
  
    return `${hour}:${minutes} ${period}`;
  };

  const formatPhoneNumber = (phone: any) => {
    if (!phone || phone.length !== 10) {
      return phone;
    }

    const areaCode = phone.slice(0, 3);
    const centralOfficeCode = phone.slice(3, 6);
    const lineNumber = phone.slice(6);

    return `+1 (${areaCode}) ${centralOfficeCode}-${lineNumber}`;
  };

  const handleGeneralOptInChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    setForm((prevForm) => ({
      ...prevForm,
      generalOptIn: isChecked,
    }));
  };

  const handleSetAppointment = () => {
    console.log('Set appointment');
    onNext();
  };

  return (
    <div>
      <div className="z-10">
        <div className="space-y-8">
          <div className='flex justify-center text-center'>
            <div className="max-w-[60rem] text-center">
              <h1 className="section_header">
                {validAppointment
                  ? form.isBooked
                    ? 'Your Appointment is Confirmed - See You Soon!'
                    : 'Almost There! Confirm Your Appointment Now'
                  : `Hi ${user.firstname}, ready to schedule your appointment?`}
              </h1>
              {!hideOptIn && (
            <div >
              <p className="section_description text-center mt-2 sm:mt-4">
              {form.isBooked
                ? 'Thank you for booking with us! Your appointment has been successfully confirmed. You’ll receive a confirmation email with all the details shortly. We look forward to seeing you!'
                  : `Please review the information below and click “Confirm Appointment” to finalize your booking`}
                </p>
              </div>
          )}
            </div>
          </div>
          <div className="flex justify-center">
            <div className="flex flex-wrap gap-4 max-w-screen-lg w-full sm:px-8">
              <div className="flex flex-col gap-4 flex-grow min-w-[250px] w-[600px] max-w-[100%]">
                <div className="bg-white border border-gray-200 rounded-md">
                  <div className="text-left mx-4 my-4">
                  <div className="flex items-center">
                    {form.isBooked ? (
                      <div className="flex items-center text-green-600 mb-3">
                        <svg id="fi_4315445" enableBackground="new 0 0 512 512" height="24" viewBox="0 0 512 512" width="24" xmlns="http://www.w3.org/2000/svg" className='text-green-600 h-5'>
                          <path clipRule="evenodd" d="m256 0c-141.2 0-256 114.8-256 256s114.8 256 256 256 256-114.8 256-256-114.8-256-256-256z" fill="currentColor" fillRule="evenodd"></path>
                          <path d="m206.7 373.1c-32.7-32.7-65.2-65.7-98-98.4-3.6-3.6-3.6-9.6 0-13.2l37.7-37.7c3.6-3.6 9.6-3.6 13.2 0l53.9 53.9 138.6-138.7c3.7-3.6 9.6-3.6 13.3 0l37.8 37.8c3.7 3.7 3.7 9.6 0 13.2l-183.3 183.1c-3.6 3.7-9.5 3.7-13.2 0z" fill="#fff"></path>
                        </svg>
                        <p className="text-lg font-semibold ml-2">Appointment Confirmed</p>
                      </div>
                    ) : (
                      <div className="flex items-center text-yellow-500 mb-3">
                        <svg id="fi_9759344" enableBackground="new 0 0 32 32" height="24" viewBox="0 0 32 32" width="24" xmlns="http://www.w3.org/2000/svg"
                        className='text-yellow-500 h-5'>
                          <g>
                            <path d="m28.8 9-5.8-5.8c-.8-.8-1.8-1.2-2.9-1.2h-8.3c-1 0-2 .4-2.8 1.2l-5.8 5.8c-.8.8-1.2 1.8-1.2 2.9v8.3c0 1.1.4 2.1 1.2 2.8l5.8 5.8c.8.7 1.8 1.2 2.8 1.2h8.3c1.1 0 2.1-.4 2.8-1.2l5.9-5.9c.7-.8 1.2-1.8 1.2-2.8v-8.3c0-1-.4-2-1.2-2.8z" fill="#ffc107"></path>
                            <path d="m15.8 24.7c-2.3.1-1.9-3.9.3-3.4 2.3-.1 2 3.9-.3 3.4zm.2-5.5c-.6 0-.9-.3-.9-1l-.7-9.2c-.1-.9.6-1.7 1.5-1.8s1.7.6 1.8 1.5v.3l-.7 9.2c-.1.7-.4 1-1 1z" fill="#eee"></path>
                          </g>
                        </svg>
                        <p className="text-lg font-semibold ml-2">No Appointment Requested</p>
                      </div>
                    )}
                  </div>
                    <hr className='mb-4'></hr>
                    <div className="flex items-center mb-4 ml-4 md:ml-8 min-w-52">
                      <div className="w-14 h-14">{iconMapping[selectedService.name]}</div>
                      <div className="flex flex-wrap justify-between flex-grow">
                      <h3 className="text-lg font-medium text-gray-800 dark:text-white pl-6 pr-4">
                        {selectedService.name} {form.serviceSpecification ? form.serviceSpecification : 'Service'}
                      </h3>

                        {/* <span className="mt-2 ml-6 sm:mt-0 sm:ml-0  max-w-full sm:max-w-none whitespace-nowrap sm:whitespace-normal py-1.5 px-3 rounded-lg text-xs font-medium bg-accentLight border border-accentColor text-accentColor">
                          
                        </span> */}
                      </div>
                    </div>
                    {/* Schedule */}
                    <hr className='mb-4'></hr>
                    <p className="text-sm font-semibold text-gray-800 mb-3">Scheduled Date and Time</p>
                    {form.date && form.time ? (
                      <div className="flex flex-wrap justify-between my-4 w-auto bg-gray-100 rounded-md pb-4 space-y-2">
                        <div className="flex items-center px-8 min-w-[200px] mt-2">
                          <img src="/images/calendar.svg" alt="Calendar" className="inline mr-2 h-5" />
                          <p className="text-base text-gray-800">{formatDate(form.date)}</p>
                        </div>

                        <div className="hidden sm:flex items-center px-8">
                          <img src="/images/clock.svg" alt="Clock" className="inline mr-2 h-5" />
                          <p className="text-base text-gray-800">{formatTime(form.time)}</p>
                          
                          {user.timezone && ( 
                            <div className='flex items-center'>
                              <img src="/images/globe.svg" alt="Clock" className="inline ml-4 mr-2 h-5" />
                              <p className="text-base text-gray-800">{user.timezone}</p>
                            </div>)}

                        </div>


                        <div className="flex items-center px-8 sm:hidden">
                          <img src="/images/clock.svg" alt="Clock" className="inline mr-2 h-5" />
                          <p className="text-base text-gray-800">{formatTime(form.time)}</p>
                        </div>
                        {user.timezone && (
                          <div className="flex items-center px-8 sm:hidden">
                            <img src="/images/globe.svg" alt="Clock" className="inline mr-2 h-5" />
                            <p className="text-base text-gray-800">{user.timezone}</p>
                          </div>
                        )}

                      </div>
                    ) : (
                      <div className="flex flex-wrap justify-between my-4 w-auto bg-red-100 rounded-md py-4">
                        <div className="flex items-center px-8 min-w-[200px]">
                          <img src="/images/warning.svg" alt="warning" className="inline mr-2 h-5" />
                          <p className="text-base text-red-800">Choose a date and time that works for you</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* <div className="bg-white border border-gray-200 rounded-md h-auto">
                  <div className='text-left mx-4 my-4'>
                    <p className='text-lg font-semibold text-gray-800 mb-3'>Appointment Schedule</p>
                    <hr className='mb-4'></hr>
                    {form.date && form.time ? (
                      <div className="flex flex-wrap justify-between my-4 w-auto bg-gray-100 rounded-md py-4">
                        <div className="flex items-center px-8 min-w-[200px]">
                          <img src="/images/calendar.svg" alt="Calendar" className="inline mr-2 h-5" />
                          <p className="text-base text-gray-800">{formatDate(form.date)}</p>
                        </div>
                        <div className="flex items-center px-8">
                          <img src="/images/clock.svg" alt="Clock" className="inline mr-2 h-5" />
                          <p className="text-base text-gray-800">{formatTime(form.time)}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap justify-between my-4 w-auto bg-red-100 rounded-md py-4">
                        <div className="flex items-center px-8 min-w-[200px]">
                          <img src="/images/warning.svg" alt="warning" className="inline mr-2 h-5" />
                          <p className="text-base text-red-800">No schedule is set</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div> */}
                <button className='hidden' onClick={onSchedule}></button>
              </div>

              <div className="flex-grow min-w-[250px] max-w-[100%] bg-white border border-gray-200 rounded-md h-auto">
                <div className='text-left mx-4 my-4'>
                  <p className='text-lg font-semibold text-gray-800 mb-3'>Customer Information</p>
                  <hr className='mb-4'></hr>
                  <p className='text-base text-gray-800 mb-3'>
                    <img src="/images/user.svg" alt="User" className="inline mr-2 h-5" />
                    {user.firstname} {user.lastname}
                  </p>
                  <p className='text-base text-gray-800 mb-3'>
                    <img src="/images/mail.svg" alt="Email" className="inline mr-2 h-5 " />
                    {user.email}
                  </p>
                  <p className='text-base text-gray-800 item-center mb-3'>
                    <img src="/images/telephone.svg" alt="Phone" className="inline mr-2 h-5" />
                    {formatPhoneNumber(user.phone)}
                  </p>
                  <p className='text-base text-gray-800 mb-3'>
                    <img src="/images/home.svg" alt="Location" className="inline mr-2 h-5" />
                    {user.address2 ? `${user.address1}, ${user.address2}` : `${user.address1}`}
                  </p>
                  <p className='text-base text-gray-800 mb-3'>
                    <img src="/images/city.svg" alt="Location" className="inline mr-2 h-5" />
                    {user.city}
                  </p>
                  <p className='text-base text-gray-800 mb-3'>
                    <img src="/images/location.svg" alt="Location" className="inline mr-2 h-5" />
                    {user.zip}, {user.state}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {!form.isBooked && (
            <div className="flex justify-center items-center">
              <div className="justify-center sm:mx-8 w-[960px]">
                {hideOptIn && (
                  <div>
                    <p className="text-center text-sm text-gray-600 dark:text-neutral-400 mt-4">
                {validAppointment
                  ? form.isBooked
                    ? 'Thank you for booking with us! Your appointment has been successfully confirmed. You’ll receive a confirmation email with all the details shortly. We look forward to seeing you!'
                    : `You’ve provided all the required details for your appointment. Please review the information below and click “Confirm Appointment” to finalize your booking`
                  : `Click the button below to request your free consultation and take the first step toward your home improvement goals.`}
                  </p>
                </div>
                )}

                {!hideOptIn  && !form.isBooked && (
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="generalOptIn"
                      name="generalOptIn"
                      checked={form.generalOptIn}
                      onChange={handleGeneralOptInChange}
                      className="size-4 rounded border-gray-300 text-accentColor focus:ring-accentColor"
                    />
                    <label htmlFor="generalOptIn" className="ml-4 block text-base text-gray-900 dark:text-gray-300">
                      {!form.generalOptIn && <span className="text-red-500">* </span>}
                      Yes, I agree to receiving updates about my free assessment. I understand that I can opt-out anytime.
                    </label>
                  </div>
                )}
                {!hideOptIn && form.generalOptIn && !form.isBooked && (
                  <div>
                    <div className="mt-4 text-sm text-gray-600 dark:text-neutral-400">
                    By checking the box above, I provide my ESIGN and express written consent for {appContext.contractor.name} and its authorized partners to contact me at the phone number and email address I have provided in this form. This may include marketing communications sent using automated technology, such as calls, texts, or emails. I understand that this consent is not required to make a purchase.
                    </div>
                  </div>
                )}


                {!validAppointment && (
                  <div>
                    <div className='flex justify-center mt-8'>
                      <button
                      onClick={handleSetAppointment}
                        className='mt-4 w-full py-5 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-accentColor text-white hover:bg-accentDark transform transition-transform'
                        disabled={loading }
                      >
                        {loading ? (
                          <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                        ) : (
                          'Request an Appointment'
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Display only if validAppointment is true and form.isBooked is false */}
                {validAppointment && !form.isBooked && (
                  <div className="">
                    <button
                      onClick={handleConfirmBooking}
                      className={`mt-4 w-full py-5 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent ${
                        form.generalOptIn
                          ? 'bg-accentColor text-white hover:bg-accentDark transform transition-transform'
                          : 'bg-gray-200 text-white cursor-not-allowed'
                      }`}
                      disabled={loading || !form.generalOptIn}  // Disable button if generalOptIn is not true
                    >
                      {loading ? (
                        <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                      ) : (
                        'Confirm Appointment'
                      )}
                    </button>
                  </div>
                )}

              
              </div>
            </div>
          )}
        </div>
      </div>

      
      <Dialog>
        <DialogTrigger asChild>
          <button id='dialog' className='hidden'></button>
        </DialogTrigger>
        <DialogTitle></DialogTitle>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className='items-center'>
            <ConfirmCheck />
            <h4 className='text-lg sm:text-xl font-semibold text-center py-1'>Awesome!</h4>
            <DialogDescription>
              Your booking has been confirmed, and you will receive updates shortly regarding your Free Assessment. We look forward to helping you bring your project to life.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild className='items-center'>
              <Button className='bg-accentColor hover:bg-accentDark w-full' onClick={handleRefresh}>OK</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Summary;
