"use client";
import React, { useContext, useState } from 'react';
import { AppContext } from '@/context/AppContext';
import ResetButton from '@/components/ui/resetButton';
import BackButton from '@/components/ui/backButton';
import Bathtub from '@/components/icons/Bathtub';
import Trowel from '@/components/icons/Trowel';
import Closet from '@/components/icons/Closet';
import Plumbing from '@/components/icons/Plumbing';
import Deck from '@/components/icons/Deck';
import {company} from '@/lib/supabaseClient';
import { Dialog, DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DialogClose,
  DialogTitle
} from '@/components/ui/dialog2';
import { Button } from '@/components/ui/button';
import ConfirmCheck from '../icons/ConfirmCheck';

// Icon mapping
const iconMapping: Record<string, JSX.Element> = {
  'Bath': <Bathtub />,
  'Basement Waterproofing': <Trowel />,
  'Closet': <Closet />,
  'Plumbing': <Plumbing />,
  'Deck': <Deck />,
  // Add more mappings as needed
};

// Define props interface
interface SummaryProps {
  onNext: () => void;
  onBack: () => void;
  onReset: () => void;
}

const Summary: React.FC<SummaryProps> = ({ onNext, onBack, onReset }) => {
  const appContext = useContext(AppContext);

  if (!appContext) {
    return null;
  }

  const { form, setForm, user, contractor, selectedService } = appContext; // Access selectedService from appContext
  const [loading, setLoading] = useState<boolean>(false);

	const handleRedirect = () => {
		onNext();
	};

  const handleBack = () => {
    onBack();
  };

  const handleReset = () => {
    onReset();
  };

  const payload = {
    user,
    form,
    contractor,
    selectedService,
    consent: {
      general: {
        description: 'By choosing "Email", "SMS/MMS" and/or "AI or Pre-recorded Voice", and clicking "Confirm Booking" and submitting this form, I am providing my ESIGN signature and express written consent agreement to permit data.fid43, and parties calling on its behalf, to contact me at the number I have provided in this form for marketing purposes including through the use of automated technology I agreed to.',
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

		try {
			const { data, error } = await company
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
						form_id: form.formId,
						service_specification: form.serviceSpecification,
						promo: form.promo,
						opt_in: form.generalOptIn,
						date: form.date,
						time: form.time,
						contact_preferences: form.contactPreferences,
						service: selectedService.services.name,
					},
				]);
	
			if (error) {
				console.error('Error inserting data:', error);
				// Optionally, handle the error here (e.g., show a notification)
			} else {
				console.log('Data inserted successfully:', data);
				// Optionally, handle the success here (e.g., navigate to a new page or show a success message)
			}
		} catch (err) {
			console.error('Unexpected error:', err);
			// Optionally, handle unexpected errors here
		} finally {
		}
		
	};

  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(date);
  };
  
  const formatTime = (timeString: any) => {
    const match = timeString.match(/(\d+)(am|pm)/i);
    if (!match) {
      return timeString;
    }
    
    const hour = parseInt(match[1], 10);
    const period = match[2].toUpperCase();
    
    return `${hour}:00 ${period}`;
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

  const contactOptions = [
    { name: 'Calls / SMS', id: 'sms' },
    { name: 'Email', id: 'email' },
    { name: 'AI Generated Calls', id: 'ai' },
  ];

  const handleContactPreferenceChange = (id: string, isChecked: boolean) => {
    setForm((prevForm) => {
      const updatedPreferences = isChecked
        ? [...prevForm.contactPreferences, id]
        : prevForm.contactPreferences.filter(pref => pref !== id);
      return {
        ...prevForm,
        contactPreferences: updatedPreferences,
      };
    });
  };

  return (
		<div>
			<div className="z-10 max-w-[100rem] px-4 md:px-12 py-4 md:py-8 mx-auto relative">
				<div className="absolute top-[-102px] custom-smallest:top-[-110px] small-stepper:top-[-115px] sm:top-[-121px] md:top-[-137px] left-0 w-full flex justify-between p-4">
					<BackButton onClick={handleBack} />
					<ResetButton onClick={handleReset} />
				</div>

				<div className="space-y-8">
					<div className='flex justify-center text-center'>
						<div className="max-w-[40rem] text-center">
							<h1 className="block text-2xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-3xl font-bold sm:font-bold md:font-semibold lg:font-semibold text-gray-800 dark:text-white">
								Great! Please review your details and schedule your <span className="text-accentColor">free assessment</span> below!
							</h1> 
						</div>
					</div>

					<div className="flex justify-center mt-10"> 
						<div className="flex flex-wrap gap-4 max-w-screen-lg w-full sm:px-8">
							<div className="flex flex-col gap-4 flex-grow min-w-[250px] max-w-[100%] ">
								<div className="bg-white border border-gray-200 rounded-md">
									<div className="text-left mx-4 my-4">
										<p className="text-lg font-semibold text-gray-800 mb-3">Service Details</p>
										<hr className='mb-4'></hr>
										<div className="flex items-center mb-4 ml-4 md:ml-8 min-w-52">
											<div className="w-14 h-14">{iconMapping[selectedService.services.name]}</div>
											<div className="flex flex-wrap justify-between flex-grow">
												<h3 className="text-lg font-medium text-gray-800 dark:text-white pl-6 pr-4">
													{selectedService.services.name} Service
												</h3>
												<span className="mt-2 ml-6 sm:mt-0 sm:ml-0  max-w-full sm:max-w-none whitespace-nowrap sm:whitespace-normal py-1.5 px-3 rounded-lg text-xs font-medium bg-accentLight border border-accentColor text-accentColor">
													{form.serviceSpecification}
												</span>
											</div>
										</div>
									</div>
								</div>

								<div className="bg-white border border-gray-200 rounded-md h-auto">
									<div className='text-left mx-4 my-4'>
										<p className='text-lg font-semibold text-gray-800 mb-3'>Appointment Schedule</p>
										<hr className='mb-4'></hr>
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
									</div>
								</div>
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

					<div className="mt-4 flex justify-center items-center">
						<div className="justify-center sm:mx-8 max-w-[960px]">
							<div className="flex items-start mt-4">
								<input
									type="checkbox"
									id="generalOptIn"
									name="generalOptIn"
									checked={form.generalOptIn}
									onChange={handleGeneralOptInChange}
									className="size-4 rounded border-gray-300"
								/>
								<label htmlFor="generalOptIn" className="ml-4 block text-base text-gray-900 dark:text-gray-300">{!form.generalOptIn && <span className="text-red-500">* </span>}
									I agree to receiving updates about my free assesment through my chosen contact preferences. I understand that I can opt-out anytime.
								</label>
							</div>
							{form.generalOptIn && (
								<div> 
									<p className="text-sm font-semibold text-gray-800 mt-4">How would you like to receive updates?</p>  
									<div className='flex flex-wrap items-start mt-2'> 
										{contactOptions.map((option) => (
											<label
												key={option.id}
												htmlFor={option.id}
												className="flex cursor-pointer text-gray-600 items-center gap-4 rounded-lg border border-gray-200 p-3 transition hover:bg-gray-50 has-[:checked]:bg-accentLight has-[:checked]:border-accentColor has-[:checked]:text-accentColor bg-white w-full sm:w-[15rem] mr-2 mt-2"
											>
												<div className="flex items-center">
													&#8203;
													<input
														type="checkbox"
														className="size-4 rounded border-gray-300"
														id={option.id}
														checked={form.contactPreferences.includes(option.id)}
														onChange={(e) => handleContactPreferenceChange(option.id, e.target.checked)}
													/>
												</div>

												<div>
													<p className="text-sm ">{option.name}</p>
												</div>
											</label>
										))}
									</div>

									<div className="mt-4 text-sm text-gray-600 dark:text-neutral-400">
										By choosing "Email", "SMS/MMS" and/or "AI or Pre-recorded Voice", and clicking "Confirm Booking" and submitting this form, I am providing my ESIGN signature and express written consent agreement to permit {contractor.name}, and parties calling on its behalf, to contact me at the number I have provided in this form for marketing purposes including through the use of automated technology I agreed to.
										My phone number where {contractor.name} may contact me is: {formatPhoneNumber(user.phone)}
									</div>
								</div>
							)}

							<button
								onClick={handleConfirmBooking}
								className={`mt-4 w-full py-5 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent ${
									form.generalOptIn && form.contactPreferences.length > 0
												? 'bg-accentColor text-white hover:bg-accentDark transform transition-transform'
												: 'bg-gray-200 text-white cursor-not-allowed'
										}`}
										disabled={loading || !form.generalOptIn || form.contactPreferences.length === 0}  // Disable button if generalOptIn is not true
							>
								{loading ? (
									<div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
								) : (
									'Confirm Booking'
								)}
							</button>
						</div>
					</div>
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
						Your booking has been confirmed, and you will receive updates shortly regarding your Free Assesment. We look forward to helping you bring your project to life.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild className='items-center'>
              <Button className='bg-accentColor hover:bg-accentDark w-full' onClick={handleRedirect}>OK</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
		</div> 
  );
};

export default Summary;
