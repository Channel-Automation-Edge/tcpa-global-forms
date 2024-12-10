import { useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProjectForm from './Project/ProjectForm';
import DetailsForm from './Details/DetailsForm';
import AppointmentForm from './Appointment/AppointmentForm';
import Stepper from '../ui/Stepper';
import { AppContext } from '../../context/AppContext';
import useFormPersistence from '../../hooks/useFormPersistence';

const ParentForm = () => {
  const [currentStep, setCurrentStep, resetCurrentStep] = useFormPersistence(['parentFormStep'], 1);
  const appContext = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

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

    loadFromLocalStorage('selectedService', setSelectedService, 0);
    loadFromLocalStorage('matchingContractors', setMatchingContractors, []);
    loadFromLocalStorage('zip', setZip, '');
    loadFromLocalStorage('state', setState, '');
    loadFromLocalStorage('contractorPreferences', setContractorPreferences, []);
    loadFromLocalStorage('firstname', setFirstname, '');
    loadFromLocalStorage('lastname', setLastname, '');
    loadFromLocalStorage('email', setEmail, '');
    loadFromLocalStorage('phone', setPhone, '');
    loadFromLocalStorage('generalOptIn', setGeneralOptIn, false);
    loadFromLocalStorage('serviceSpecifications', setServiceSpecifications, []);
    loadFromLocalStorage('promo', setPromo, false);
    loadFromLocalStorage('consentedContractors', setConsentedContractors, []);
    loadFromLocalStorage('numberOfQuotes', setNumberOfQuotes, 0);
    loadFromLocalStorage('termsAndPrivacyOptIn', setTermsAndPrivacyOptIn, false);
  }, []);

  // Save context values to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('selectedService', JSON.stringify(selectedService));
    localStorage.setItem('matchingContractors', JSON.stringify(matchingContractors));
    localStorage.setItem('zip', JSON.stringify(zip));
    localStorage.setItem('state', JSON.stringify(state));
    localStorage.setItem('contractorPreferences', JSON.stringify(contractorPreferences));
    localStorage.setItem('firstname', JSON.stringify(firstname));
    localStorage.setItem('lastname', JSON.stringify(lastname));
    localStorage.setItem('email', JSON.stringify(email));
    localStorage.setItem('phone', JSON.stringify(phone));
    localStorage.setItem('generalOptIn', JSON.stringify(generalOptIn));
    localStorage.setItem('serviceSpecifications', JSON.stringify(serviceSpecifications));
    localStorage.setItem('promo', JSON.stringify(promo));
    localStorage.setItem('consentedContractors', JSON.stringify(consentedContractors));
    localStorage.setItem('numberOfQuotes', JSON.stringify(numberOfQuotes));
    localStorage.setItem('termsAndPrivacyOptIn', JSON.stringify(termsAndPrivacyOptIn));
  }, [
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
  ]);

  const clearFormState = () => {
    setSelectedService(0);
    setMatchingContractors([]);
    setZip('');
    setState('');
    setContractorPreferences([]);
    setFirstname('');
    setLastname('');
    setEmail('');
    setPhone('');
    setGeneralOptIn(false);
    setServiceSpecifications([]);
    setPromo('');
    setConsentedContractors([]);
    setNumberOfQuotes(0);
    setTermsAndPrivacyOptIn(false);
  };

  const navigateWithParams = (path: string) => {
    const currentParams = new URLSearchParams(location.search);
    navigate(`${path}?${currentParams.toString()}`);
  };

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleReset = () => {
    resetCurrentStep();
    clearFormState();
  };

  const handleSubmitted = () => {
    resetCurrentStep();
    clearFormState();
    navigateWithParams('/thank-you');
  };

  return (
    <div className='bg-xbg min-h-screen'>
      <div className="mx-auto max-w-screen-xl px-4 pb-2 custom-smallest:pb-3 small-stepper:pb-3 sm:pb-4 md:pb-6 pt-2 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <Stepper currentStep={currentStep} />
        </div>
      </div>
      <div>
        {currentStep === 1 && <ProjectForm onNext={handleNextStep} onReset={handleReset} />}
        {currentStep === 2 && <DetailsForm onNext={handleNextStep} onReset={handleReset} />}
        {currentStep === 3 && <AppointmentForm onSubmit={handleSubmitted} onReset={handleReset} />}
      </div>
    </div>
  );
};

export default ParentForm;

// 