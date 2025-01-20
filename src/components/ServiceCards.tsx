import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext'; // Ensure AppContext is correctly imported
import useClearFormState from '../hooks/useClearFormState';
import { useNavigate, useLocation } from 'react-router-dom';
import BlurFade from './ui/blur-fade';
import Services from './Services';

const ServiceCards: React.FC = () => {
  const appContext = useContext(AppContext);
  if (!appContext) {
    return null;
  }

  const { contractor, services, user, setUser, form, setForm } = appContext;

  const navigate = useNavigate();
  const location = useLocation();
  const clearFormState = useClearFormState();

  const urlParams = new URLSearchParams(location.search);
  const zipParam = urlParams.get('zip') || '';
  const initialZip = user.zip && user.zip.trim() !== '' ? user.zip : zipParam; 
  const [zip, setZip] = useState<string>(initialZip);
  const [isZipValid, setIsZipValid] = useState<boolean>(initialZip.length >= 4 && initialZip.length <= 5);

  const [showZipInput, setShowZipInput] = useState<boolean>(true);
  const [buttonText, setButtonText] = useState<string>("");


  // Update button text based on form progress
    useEffect(() => {
      const step = localStorage.getItem('formStep');
  
      if (step !== null && step !== "1") {
        setButtonText("Finish your Previous Quote");
        setShowZipInput(false);  // Hide ZIP input
      } else {
        setButtonText(contractor.content.services_cta || "See Available Services");
        setShowZipInput(true);  // Show ZIP input
      }
    }, [appContext.contractor, appContext.services]);

  const handleButtonClick = () => {
    let formId = form.formId;

    // If formId is not set, create a new formId
    if (!formId) {
      clearFormState();

      const dateTime = new Date().toISOString().replace(/[-:.T]/g, '').slice(0, 14); // YYYYMMDDHHMMSS format
      const randomString = generateRandomString(6);

      formId = `${contractor.id}-${dateTime}-${randomString}`;
      console.log('Generated formId:', formId);
    } else {
      console.log('Using existing form ID:', formId);
    }

    // Update the form and user object in context
    setForm((prevForm) => ({
      ...prevForm,
      formId: formId,
    }));

    setUser((prevUser) => ({
      ...prevUser,
      zip: zip,  // Save the zip code to the user context
    }));

    navigateWithParams('/request-quotes');
  };

  const handleZipChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\D/g, ''); // Remove non-numeric characters
    if (value.length <= 5) {  // Max length of 5
      setZip(value);
      setIsZipValid(value.length >= 4); // Valid if length is 4 or 5
    }
  };

  //   if (!appContext) {
  //     return;
  //   }

  //   const { form, setForm } = appContext;
  //   const urlParams = new URLSearchParams(location.search);
  //   const phoneParam = urlParams.get('phone') || '';

  //   resetCurrentStep();
  //   clearFormState();

  //   let formId = localStorage.getItem('formID');
  //   if (!formId) {
  //     // Generate a new formId if it doesn't exist
  //     const phone = phoneParam || generateRandomString(9);

  //     const dateTime = new Date().toISOString().replace(/[-:.T]/g, '').slice(0, 14); // YYYYMMDDHHMMSS format
  //     const randomString = generateRandomString(4);

  //     formId = `${phone}-${dateTime}-${randomString}`;
  //     localStorage.setItem('formID', formId);
  //   }

  //   // Update the form object in context
  //   setForm({
  //     ...form,
  //     formId: formId,
  //     selectedService: serviceId,
  //   });

  //   console.log('Selected service:', serviceId);
  //   console.log('Form ID:', formId);
  //   console.log(appContext.form);
  //   console.log(services);

  //   // Update local storage
  //   localStorage.setItem('selectedService', JSON.stringify(serviceId));
  //   setCurrentStep(2);
  //   navigateWithParams('/request-quotes');
  // };

  // Function to generate a random string
  const generateRandomString = (length: number): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  // Function to append current URL parameters
  const navigateWithParams = (path: string) => {
    const currentParams = new URLSearchParams(location.search);
    navigate(`${path}?${currentParams.toString()}`);
  };

  const test = () => {
    console.log('test');
  }

  return (
    <div className="z-10 max-w-[100rem] px-4 py-10 lg:py-14 mx-auto relative bg-white">
      <div className="text-center">
        <BlurFade delay={3 * 0.15} yOffset={15} className="font-semibold text-2xl md:text-3xl text-gray-800 dark:text-neutral-200">
            Check out the <span className="text-accentColor">services</span> we offer
        </BlurFade>
        <p className="mt-2 md:mt-4 text-gray-500 dark:text-neutral-500"></p>
      </div>
      <Services services={services} handleServiceSelect={test} />
      <div className='flex justify-center'>
        <div className="mt-5 lg:mt-8 flex flex-col items-center gap-2 sm:flex-row sm:gap-3">
          {showZipInput && (
            <div className="w-full sm:w-auto">
              <input 
                type="text" 
                id="hero-input" 
                name="hero-input" 
                className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-accentColor text-center" 
                placeholder="Enter ZIP Code" 
                value={zip}
                onChange={handleZipChange}
              /> 
            </div>
          )}
          <button 
            className="w-full sm:w-auto py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-accentColor bg-white text-accentColor hover:bg-accentLight disabled:opacity-50 disabled:pointer-events-none" 
            onClick={handleButtonClick} 
            disabled={!isZipValid && showZipInput} // Disable button if zip is not valid
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCards;
