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
    setServiceSpecifications,
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
    setSelectedService(0);
    setServiceSpecifications([]);
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
    localStorage.removeItem('serviceSpecifications');
    localStorage.removeItem('promo');
    localStorage.removeItem('consentedContractors');
    localStorage.removeItem('numberOfQuotes');
    localStorage.removeItem('termsAndPrivacyOptIn');
  };

  return clearFormState;
};

export default useClearFormState;
