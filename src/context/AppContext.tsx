import React, { createContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';

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
  setFirstname: Dispatch<SetStateAction<string | null>>;
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
  setTermsAndPrivacyOptIn: Dispatch<SetStateAction<boolean >>;
  setNewsletterOptIn: Dispatch<SetStateAction<boolean>>;
  setAppointment: Dispatch<SetStateAction<Appointment>>;
  setScheduledAppointments: Dispatch<SetStateAction<Appointment[]>>;
  setType: Dispatch<SetStateAction<string>>;
  setConsentedContractors: Dispatch<SetStateAction<Contractor[]>>;
}

// Create a context with an empty object as default value
export const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppContextProviderProps {
  children: ReactNode;
}

// Function to capitalize the first letter of a string
const capitalizeFirstLetter = (str: string | null): string | null => {
  if (str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  return str;
};

// Create the provider component
const AppContextProvider: React.FC<AppContextProviderProps> = ({ children }) => {
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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setFirstname(capitalizeFirstLetter(params.get('firstname')));
    setLastname(capitalizeFirstLetter(params.get('lastname')));
    setZip(params.get('zip') || null);
    setEmail(params.get('email') || null);
    setPhone(params.get('phone') || null);
    setState(params.get('state') || null);
  }, []);

  return (
    <AppContext.Provider
      value={{
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;