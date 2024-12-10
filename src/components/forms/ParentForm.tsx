import { useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProjectForm from './Project/ProjectForm';
import DetailsForm from './Details/DetailsForm';
import AppointmentForm from './Appointment/AppointmentForm';
import Stepper from '../ui/Stepper';
import { AppContext } from '../../context/AppContext';
import useFormPersistence from '../../hooks/useFormPersistence';
import useClearFormState from '../../hooks/useClearFormState';
import supabase from '../../lib/supabaseClient';



const ParentForm = () => {
  const [currentStep, setCurrentStep, resetCurrentStep] = useFormPersistence('parentFormStep', 1);
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

    loadFromLocalStorage('selectedService', setSelectedService, 0);
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

  // Load formId from local storage on component mount
  useEffect(() => { let formId = localStorage.getItem('formID'); setFormId(formId); }, []);

  // Save context values to local storage whenever they change
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

  const clearFormState = useClearFormState();


  const navigateWithParams = (path: string) => {
    const currentParams = new URLSearchParams(location.search);
    navigate(`${path}?${currentParams.toString()}`);
  };

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleReset = async () => {
    resetCurrentStep();
    clearFormState();
  
    try {
      // Assuming formId is available in your context or component state
      const { formId } = appContext; // Ensure formId is accessible
  
      // Check if formId exists in the database
      const { data, error } = await supabase
        .from('Forms')
        .select('id')
        .eq('id', formId)
        .single();
  
      if (error && error.code !== 'PGRST116') {
        console.error('Error checking formId:', error);
        return;
      }
  
      if (data) {
        // formId exists, clear specific fields
        const { error: updateError } = await supabase
          .from('Forms')
          .update({
            optIn_completion: false,
            appointment_completion: false,
            email_optIn: false,
            termsAndPrivacy_optIn: false,
            smsAndCall_optIn: false,
          })
          .eq('id', formId);
  
        if (updateError) {
          console.error('Error clearing form fields:', updateError);
          return;
        }
  
        console.log(`FormId ${formId} fields cleared.`);
      }
    } catch (err) {
      console.error('Unexpected error during reset:', err);
    }
  };
  

  const handleSubmitted = () => {
    navigateWithParams('/thank-you');
    resetCurrentStep();
    clearFormState();
    setFormId('');
    localStorage.removeItem('formID');
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