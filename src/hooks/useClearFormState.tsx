import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const useClearFormState = () => {
  const appContext = useContext(AppContext);

  if (!appContext) {
    throw new Error('useClearFormState must be used within an AppContextProvider');
  }

  const {
    setFirstname,
    setLastname,
    setEmail,
    setPhone,
    setZip,
    setState,
    setSelectedService,
    setServiceSpecification,
    setContractorPreferences,
    setPromo,
    setNumberOfQuotes,
    setGeneralOptIn,
    setTermsAndPrivacyOptIn,
    setNewsletterOptIn,
    setScheduledAppointments,
    setMatchingContractors,
    setConsentedContractors,
    setContactPreferences,
  } = appContext;

  const clearFormState = () => {
    setFirstname('');
    setLastname('');
    setEmail('');
    setPhone('');
    setZip('');
    setState('');
    setSelectedService(''); // Set to an empty string to reset the selected service
    setServiceSpecification('');
    setContractorPreferences([]);
    setPromo('');
    setNumberOfQuotes(0);
    setGeneralOptIn(false);
    setTermsAndPrivacyOptIn(false);
    setNewsletterOptIn(false); 
    setScheduledAppointments([]); 
    setMatchingContractors([]);
    setConsentedContractors([]);
    setContactPreferences([]); 

    localStorage.removeItem('selectedService');
    localStorage.removeItem('matchingContractors');
    localStorage.removeItem('zip');
    localStorage.removeItem('state');
    localStorage.removeItem('contractorPreferences');
    localStorage.removeItem('firstname');
    localStorage.removeItem('lastname');
    localStorage.removeItem('email');
    localStorage.removeItem('phone');
    localStorage.removeItem('generalOptIn');
    localStorage.removeItem('serviceSpecification');
    localStorage.removeItem('promo');
    localStorage.removeItem('consentedContractors');
    localStorage.removeItem('numberOfQuotes');
    localStorage.removeItem('termsAndPrivacyOptIn');
    localStorage.removeItem('newsletterOptIn');
    localStorage.removeItem('scheduledAppointments');
    localStorage.removeItem('contactPreferences');
  };

  return clearFormState;
};

export default useClearFormState;
