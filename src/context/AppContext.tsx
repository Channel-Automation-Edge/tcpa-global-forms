import React, { createContext, useState, ReactNode, Dispatch, SetStateAction, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Define the Contractor interface
interface Contractor {
  id: number;
  name: string;
  address: string;
  photo: string;
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
  resetForm: boolean;
  formId: string | null;
  firstname: string | null;
  lastname: string | null;
  zip: string | null;
  email: string | null;
  phone: string | null;
  state: string | null;
  selectedService: number;
  serviceSpecifications: string[];
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
  setFirstname: Dispatch<SetStateAction<string | null>>;
  setFormId: Dispatch<SetStateAction<string | null>>;
  setLastname: Dispatch<SetStateAction<string | null>>;
  setZip: Dispatch<SetStateAction<string | null>>;
  setEmail: Dispatch<SetStateAction<string | null>>;
  setPhone: Dispatch<SetStateAction<string | null>>;
  setState: Dispatch<SetStateAction<string | null>>;
  setSelectedService: Dispatch<SetStateAction<number>>;
  setServiceSpecifications: Dispatch<SetStateAction<string[]>>;
  setContractorPreferences: Dispatch<SetStateAction<string[]>>;
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
  
  const [resetForm, setResetForm] = useState<boolean>(false);
  const [formId, setFormId] = useState<string | null>(null);
  const [firstname, setFirstname] = useState<string | null>(null);
  const [lastname, setLastname] = useState<string | null>(null);
  const [zip, setZip] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);
  const [state, setState] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<number>(0);
  const [serviceSpecifications, setServiceSpecifications] = useState<string[]>([]);
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

  return (
    <AppContext.Provider
      value={{
        resetForm,
        formId,
        firstname,
        lastname,
        zip,
        email,
        phone,
        state,
        selectedService,
        serviceSpecifications,
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
        setResetForm,
        setFormId,
        setFirstname,
        setLastname,
        setZip,
        setEmail,
        setPhone,
        setState,
        setSelectedService,
        setServiceSpecifications,
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
