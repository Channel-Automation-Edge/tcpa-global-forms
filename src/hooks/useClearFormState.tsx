import { useContext } from 'react';
import { AppContext } from '@/context/AppContext'; // Ensure AppContext is correctly imported

const useClearFormState = () => {
  const appContext = useContext(AppContext);

  if (!appContext) {
    throw new Error('useClearFormState must be used within an AppContextProvider');
  }

  const { setUser, setForm, setSelectedService } = appContext;

  const clearFormState = () => {
    setUser(prev => ({
      ...prev,
      firstname: null,
      lastname: null,
      address1: null,
      address2: null,
      city: null,
      email: null,
      phone: null,
      state: null,
      userNs: null,
    }));

    setForm(prev => ({
      ...prev,
      serviceSpecification: null,
      promo: '',
      generalOptIn: false,
      termsAndPrivacyOptIn: false,
      contactPreferences: [],
      date: null,
      time: null,
    }));

    setSelectedService(null);
  };

  return clearFormState;
};

export default useClearFormState;
