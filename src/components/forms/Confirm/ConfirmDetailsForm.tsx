import { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProgressBar from '@/components/ui/ProgressBar';
import Step1Info from '@/components/forms/Confirm/Step1Info';
import Step2PromoOptIn from '@/components/forms/Confirm/Step2PromoOptIn';
import useFormPersistence from '@/hooks/useFormPersistence';
import { AppContext } from '@/context/AppContext';
import useClearFormState from '@/hooks/useClearFormState';
import useResetDatabase from '@/hooks/useResetDatabase';
import { Dialog, DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DialogClose,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const ConfirmDetailsForm = () => {
  const [currentStep, setCurrentStep, resetCurrentStep] = useFormPersistence('ConfirmDetailsFormStep', 1);
  const appContext = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const clearFormState = useClearFormState();
  const resetDatabase = useResetDatabase();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!appContext) {
    return null;
  }

  const {
    selectedService,
    matchingContractors,
    zip,
    state,
    contractorPreferences,
    firstname,
    lastname,
    email,
    phone,
    generalOptIn,
    serviceSpecifications,
    promo,
    consentedContractors,
    numberOfQuotes,
    termsAndPrivacyOptIn,
    newsletterOptIn,
    scheduledAppointments,
    contactPreferences,
    setSelectedService,
    setMatchingContractors,
    setZip,
    setState,
    setContractorPreferences,
    setFirstname,
    setLastname,
    setEmail,
    setPhone,
    setGeneralOptIn,
    setServiceSpecifications,
    setPromo,
    setConsentedContractors,
    setNumberOfQuotes,
    setTermsAndPrivacyOptIn,
    setNewsletterOptIn,
    setScheduledAppointments,
    setContactPreferences,
    setFormId,
  } = appContext;

  // Load values from local storage on component mount
  useEffect(() => {
    const loadFromLocalStorage = (key: string, setValue: (value: any) => void, defaultValue: any) => {
      const savedValue = localStorage.getItem(key);
      if (savedValue !== null) {
        setValue(JSON.parse(savedValue));
      } else {
        setValue(defaultValue);
      }
    };

    loadFromLocalStorage('firstname', setFirstname, '');
    loadFromLocalStorage('lastname', setLastname, '');
    loadFromLocalStorage('email', setEmail, '');
    loadFromLocalStorage('phone', setPhone, '');
    loadFromLocalStorage('zip', setZip, '');
    loadFromLocalStorage('state', setState, '');

    loadFromLocalStorage('selectedService', setSelectedService, '');
    loadFromLocalStorage('serviceSpecifications', setServiceSpecifications, []);
    loadFromLocalStorage('contractorPreferences', setContractorPreferences, []);
    loadFromLocalStorage('promo', setPromo, false);
    loadFromLocalStorage('numberOfQuotes', setNumberOfQuotes, 0);

    loadFromLocalStorage('generalOptIn', setGeneralOptIn, false);
    loadFromLocalStorage('termsAndPrivacyOptIn', setTermsAndPrivacyOptIn, false);
    loadFromLocalStorage('newsletterOptIn', setNewsletterOptIn, false);
    
    loadFromLocalStorage('scheduledAppointments', setScheduledAppointments, []);
    loadFromLocalStorage('matchingContractors', setMatchingContractors, []);
    loadFromLocalStorage('consentedContractors', setConsentedContractors, []);
    loadFromLocalStorage('contactPreferences', setContactPreferences, []);

  }, []);

  useEffect(() => { let formId = localStorage.getItem('formID'); setFormId(formId); }, []);

  useEffect(() => {
    localStorage.setItem('firstname', JSON.stringify(firstname));
    localStorage.setItem('lastname', JSON.stringify(lastname));
    localStorage.setItem('email', JSON.stringify(email));
    localStorage.setItem('phone', JSON.stringify(phone));
    localStorage.setItem('zip', JSON.stringify(zip));
    localStorage.setItem('state', JSON.stringify(state));

    localStorage.setItem('selectedService', JSON.stringify(selectedService));
    localStorage.setItem('serviceSpecifications', JSON.stringify(serviceSpecifications));
    localStorage.setItem('contractorPreferences', JSON.stringify(contractorPreferences));
    localStorage.setItem('promo', JSON.stringify(promo));
    localStorage.setItem('numberOfQuotes', JSON.stringify(numberOfQuotes));

    localStorage.setItem('generalOptIn', JSON.stringify(generalOptIn));
    localStorage.setItem('termsAndPrivacyOptIn', JSON.stringify(termsAndPrivacyOptIn));
    localStorage.setItem('newsletterOptIn', JSON.stringify(newsletterOptIn));

    localStorage.setItem('scheduledAppointments', JSON.stringify(scheduledAppointments));
    localStorage.setItem('matchingContractors', JSON.stringify(matchingContractors));
    localStorage.setItem('consentedContractors', JSON.stringify(consentedContractors));
    localStorage.setItem('contactPreferences', JSON.stringify(contactPreferences));
  }, [
    firstname,
    lastname,
    email,
    phone,
    zip,
    state,
    selectedService,
    serviceSpecifications,
    contractorPreferences,
    promo,
    numberOfQuotes,
    generalOptIn,
    termsAndPrivacyOptIn,
    newsletterOptIn,
    scheduledAppointments,
    matchingContractors,
    consentedContractors,
    contactPreferences,
  ]);
  
  const navigateWithParams = (path: string) => {
    const currentParams = new URLSearchParams(location.search);
    navigate(`${path}?${currentParams.toString()}`);
  };

  const handleNextStep = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      document.getElementById("modal")?.click();

      
    }
  };

  const handleHome = () => {
    navigateWithParams('/');
    resetCurrentStep();
    clearFormState();
    setFormId('');
    localStorage.removeItem('formID');
  }


  const handleReset = async () => {
    resetCurrentStep();
    clearFormState();
    await resetDatabase();
    navigateWithParams('/request-quotes');
  };

  const progress = (currentStep - 1) * 50; 
  const notifyServiceAvailablility = true;


  return (
    <div>
      <div className="mx-auto mt-[30px] max-w-screen-xl px-4 pb-6 pt-6 sm:px-6 lg:px-8 relative">
        <div className="flex justify-center pr-[30px]">
          <div className="w-[600px]">
            <ProgressBar progress={progress} />
          </div>
          <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <img
              src="/images/avatar.jpg"
              alt="Avatar"
              className="w-12 h-12 custom-smallest:w-14 custom-smallest:h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full border-2 border-lpurple object-cover"
            />
          </div>
        </div>
      </div>
      <div>
        {currentStep === 1 && <Step1Info onNext={handleNextStep} onReset={handleReset} />}
        {currentStep === 2 && <Step2PromoOptIn onNext={handleNextStep} onReset={handleReset} notifyServiceAvailablility = {notifyServiceAvailablility}  />}
      </div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <button id='modal' className='hidden'></button>
        </DialogTrigger>
        <DialogTitle></DialogTitle>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <h4 className='text-md font-semibold'>We've Got You Covered!</h4>
            <DialogDescription>
            Thanks for letting us know what you're looking for! We're working hard to bring this service to your area, and we'll be sure to let you know as soon as it's available. Exciting updates are just around the corner!
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button className='bg-xorange hover:bg-xorangeDark' onClick={handleHome}>Go to Home Page</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ConfirmDetailsForm
