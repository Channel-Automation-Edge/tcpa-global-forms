import React, { createContext, useState, ReactNode, Dispatch, SetStateAction, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Define the Contractor interface
interface Contractor {
  id: number;
  name: string;
  address: string;
  logo: string;
  zip: string;
  state: string;
  services: number[];
  optIn: boolean;
}

// Define the Appointment interface
interface Appointment {
  id: number;
  date: string;
  time: string;
}

// Define the shape of your context data
interface AppContextType {
  cookiesAccepted: string[];
  cookieConsentId: string;
  resetForm: boolean;
  formId: string | null;
  businessName: string | null;
  firstname: string | null;
  lastname: string | null;
  zip: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  email: string | null;
  phone: string | null;
  state: string | null;
  selectedService: string | null;
  contractorServices: string[];
  serviceSpecification: string | null;
  contractorPreferences: string[];
  numberOfQuotes: number;
  promo: string;
  matchingContractors: Contractor[];
  generalOptIn: boolean;
  termsAndPrivacyOptIn: boolean;
  newsletterOptIn: boolean;
  appointment: Appointment;
  scheduledAppointments: Appointment[];
  type: string;
  consentedContractors: Contractor[];
  contactPreferences: string[];
  userNs: string | null;
  teamId: string | null;
  setResetForm: Dispatch<SetStateAction<boolean>>;
  setBusinessName: Dispatch<SetStateAction<string | null>>;
  setFirstname: Dispatch<SetStateAction<string | null>>;
  setFormId: Dispatch<SetStateAction<string | null>>;
  setLastname: Dispatch<SetStateAction<string | null>>;
  setZip: Dispatch<SetStateAction<string | null>>;
  setAddress1: Dispatch<SetStateAction<string | null>>;
  setAddress2: Dispatch<SetStateAction<string | null>>;
  setCity: Dispatch<SetStateAction<string | null>>;
  setEmail: Dispatch<SetStateAction<string | null>>;
  setPhone: Dispatch<SetStateAction<string | null>>;
  setState: Dispatch<SetStateAction<string | null>>;
  setSelectedService: Dispatch<SetStateAction<string | null>>;
  setContractorServices: Dispatch<SetStateAction<string[]>>;
  setServiceSpecification: Dispatch<SetStateAction<string | null>>;
  setContractorPreferences: Dispatch<SetStateAction<string[]>>;
  setCookiesAccepted: Dispatch<SetStateAction<string[]>>;
  setCookieConsentId: Dispatch<SetStateAction<string>>;
  setNumberOfQuotes: Dispatch<SetStateAction<number>>;
  setPromo: Dispatch<SetStateAction<string>>;
  setMatchingContractors: Dispatch<SetStateAction<Contractor[]>>;
  setGeneralOptIn: Dispatch<SetStateAction<boolean>>;
  setTermsAndPrivacyOptIn: Dispatch<SetStateAction<boolean>>;
  setNewsletterOptIn: Dispatch<SetStateAction<boolean>>;
  setAppointment: Dispatch<SetStateAction<Appointment>>;
  setScheduledAppointments: Dispatch<SetStateAction<Appointment[]>>;
  setType: Dispatch<SetStateAction<string>>;
  setConsentedContractors: Dispatch<SetStateAction<Contractor[]>>;
  setContactPreferences: Dispatch<SetStateAction<string[]>>;
  setUserNs: Dispatch<SetStateAction<string | null>>;
  setTeamId: Dispatch<SetStateAction<string | null>>;
}

// Create a context with an empty object as default value
export const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppContextProviderProps {
  children: ReactNode;
}

// Create the provider component
const AppContextProvider: React.FC<AppContextProviderProps> = ({ children }) => {
  const location = useLocation();
  
  const [cookiesAccepted, setCookiesAccepted] = useState<string[]>([]);
  const [cookieConsentId, setCookieConsentId] = useState<string>('');
  const [resetForm, setResetForm] = useState<boolean>(false);
  const [formId, setFormId] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState<string | null>(null);
  const [firstname, setFirstname] = useState<string | null>(null);
  const [lastname, setLastname] = useState<string | null>(null);
  const [zip, setZip] = useState<string | null>(null);
  const [address1, setAddress1] = useState<string | null>(null);
  const [address2, setAddress2] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);
  const [state, setState] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [contractorServices, setContractorServices] = useState<string[]>([]);
  const [serviceSpecification, setServiceSpecification] = useState<string | null>(null);
  const [contractorPreferences, setContractorPreferences] = useState<string[]>([]);
  const [numberOfQuotes, setNumberOfQuotes] = useState<number>(0);
  const [promo, setPromo] = useState<string>('');
  const [matchingContractors, setMatchingContractors] = useState<Contractor[]>([]);
  const [generalOptIn, setGeneralOptIn] = useState<boolean>(false);
  const [termsAndPrivacyOptIn, setTermsAndPrivacyOptIn] = useState<boolean>(false);
  const [newsletterOptIn, setNewsletterOptIn] = useState<boolean>(false);
  const [appointment, setAppointment] = useState<Appointment>({ id: 0, date: '', time: '' });
  const [scheduledAppointments, setScheduledAppointments] = useState<Appointment[]>([]);
  const [type, setType] = useState<string>('');
  const [consentedContractors, setConsentedContractors] = useState<Contractor[]>([]);
  const [contactPreferences, setContactPreferences] = useState<string[]>([]);
  const [userNs, setUserNs] = useState<string | null>(null);
  const [teamId, setTeamId] = useState<string | null>(null);

  // Initialize userNs and teamId from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setUserNs(params.get('user_ns'));
    setTeamId(params.get('team_id'));
  }, [location.search]);

  // initialize cookiesAccepted from local storage
  useEffect(() => {
    const storedCookies = localStorage.getItem('cookiesAccepted');
    const storedCookieConsentId = localStorage.getItem('cookieConsentId');
    if (storedCookies) {
      setCookiesAccepted(JSON.parse(storedCookies));
    }
    if (storedCookieConsentId) {
      setCookieConsentId(storedCookieConsentId);
    }
  }, []);
  

  return (
    <AppContext.Provider
      value={{
        cookiesAccepted,
        cookieConsentId,
        resetForm,
        formId,
        businessName,
        firstname,
        lastname,
        zip,
        address1,
        address2,
        city,
        email,
        phone,
        state,
        selectedService,
        contractorServices,
        serviceSpecification,
        contractorPreferences,
        numberOfQuotes,
        promo,
        matchingContractors,
        generalOptIn,
        termsAndPrivacyOptIn,
        newsletterOptIn,
        appointment,
        scheduledAppointments,
        type,
        consentedContractors,
        contactPreferences,
        userNs,
        teamId,
        setCookiesAccepted,
        setCookieConsentId,
        setResetForm,
        setFormId,
        setBusinessName,
        setFirstname,
        setLastname,
        setZip,
        setAddress1,
        setAddress2,
        setCity,
        setEmail,
        setPhone,
        setState,
        setSelectedService,
        setContractorServices,
        setServiceSpecification,
        setContractorPreferences,
        setNumberOfQuotes,
        setPromo,
        setMatchingContractors,
        setGeneralOptIn,
        setTermsAndPrivacyOptIn,
        setNewsletterOptIn,
        setAppointment,
        setScheduledAppointments,
        setType,
        setConsentedContractors,
        setContactPreferences,
        setUserNs,
        setTeamId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
