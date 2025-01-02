import { useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from '@/context/AppContext';
import useFormPersistence from '@/hooks/useFormPersistence';
import Step1Services from './Step1Services';
import Step2Info from './Step2Info';
import Step3CallUs from './Step3CallUs';


const ContractorForm = () => {
    const [currentStep, setCurrentStep, resetCurrentStep] = useFormPersistence('ContractorFormStep', 1);
    // const [, , resetProjectCurrentStep] = useFormPersistence('projectFormStep', 1);
    const appContext = useContext(AppContext);
    const navigate = useNavigate();
    const location = useLocation();
  
    if (!appContext) {
      return null;
    }
  
    const {
      firstname,
      lastname,
      email,
      phone,
      zip,
      state,
      setFirstname,
      setLastname,
      setEmail,
      setPhone,
      setZip,
      setState,
      contractorServices,
      setContractorServices,
      
    } = appContext;
  
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
      loadFromLocalStorage('contractorServices', setContractorServices, []);
  
    }, []);
  
    // Save context values to local storage whenever they change
    useEffect(() => {
      localStorage.setItem('firstname', JSON.stringify(firstname));
      localStorage.setItem('lastname', JSON.stringify(lastname));
      localStorage.setItem('email', JSON.stringify(email));
      localStorage.setItem('phone', JSON.stringify(phone));
      localStorage.setItem('zip', JSON.stringify(zip));
      localStorage.setItem('state', JSON.stringify(state));
      localStorage.setItem('contractorServices', JSON.stringify(contractorServices));
    }, [
      firstname,
      lastname,
      email,
      phone,
      zip,
      state,
      contractorServices
    ]);
  
    // const clearFormState = useClearFormState();
    // const resetDatabase = useResetDatabase();
  
  
    const navigateWithParams = (path: string) => {
      const currentParams = new URLSearchParams(location.search);
      navigate(`${path}?${currentParams.toString()}`);
    };
  
    const handleNextStep = () => {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      } else {
        navigateWithParams('/');
        resetCurrentStep();
        
      }
    };
  
    // const handleReset = async () => {
    //   resetCurrentStep();
    // //   resetProjectCurrentStep();
    // //   resetDetailsCurrentStep();
    // //   resetAppointmentCurrentStep();
    //   clearFormState();
    // };
  
    const handleBackStep = () => {
      setCurrentStep(currentStep - 1);
    }
    
  
    // const handleSubmitted = () => {
      
    // //   resetProjectCurrentStep();
    // //   resetDetailsCurrentStep();
    // //   resetAppointmentCurrentStep();
    // //   setFormId('');
    // //   localStorage.removeItem('formID');
    // };

  
    return (
      <div className='bg-xbg min-h-screen'>
        <div className="mx-auto max-w-screen-xl px-4 pb-2 custom-smallest:pb-3 small-stepper:pb-3 sm:pb-4 md:pb-6 pt-2 sm:px-6 lg:px-8">
        
        </div>
        <div>
        
          {currentStep === 1 && <Step1Services onNext={handleNextStep}/>}
          {currentStep === 2 && <Step2Info onNext={handleNextStep} onBack={handleBackStep}/>}
          {currentStep === 3 && <Step3CallUs onNext={handleNextStep}/>}
        </div>
      </div>
    );
  };
   ;
  export default ContractorForm;