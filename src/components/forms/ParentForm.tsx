import { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Stepper from '../ui/Stepper';
import { AppContext } from '@/context/AppContext';
import useFormPersistence from '@/hooks/useFormPersistence';
import useClearFormState from '@/hooks/useClearFormState';
import Step1Selection from './Step1Selection';
import Step3Specifications from './Step3Specifications';
import ProgressBar from '../ui/ProgressBar';
import Step1Info from './Step1Info';
import Step2PromoOptIn from './Step2PromoOptIn';
import Step2Schedule from './Step2Schedule';
import Summary from './Summary';

const ParentForm = () => {
  const [currentStep, setCurrentStep, resetCurrentStep] = useFormPersistence('formStep', 1);
  const appContext = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const clearFormState = useClearFormState();
  // const resetDatabase = useResetDatabase();
  const progress = (currentStep - 1) * 16.66;
  if (!appContext) {
    return null;
  }
  const { setForm, contractor } = appContext;

  const navigateWithParams = (path: string) => {
    const currentParams = new URLSearchParams(location.search);
    navigate(`${path}?${currentParams.toString()}`);
  };

  const handleNextStep = () => {
    if (currentStep === 3) {
      if (contractor.promos && contractor.promos.length > 0) {
        setCurrentStep(currentStep + 1);
        console.log('promo exists', contractor.promos);
      } else {
        setCurrentStep(currentStep + 2);
        console.log('promo does not exist');
      }
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleReset = async () => {
    resetCurrentStep();
    clearFormState();
    // await resetDatabase();
  };

  const handleBackStep = () => {
    if (currentStep === 5) {
      if (contractor.promos && contractor.promos.length > 0) {
        setCurrentStep(currentStep - 1);
      } else {
        setCurrentStep(currentStep - 2);
      }
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmitted = () => {
    navigateWithParams('/');
    resetCurrentStep();
    clearFormState();

    setForm(prev => ({ ...prev, formId: null })); 
    localStorage.removeItem('formID');
  };

  return (
    <div className='bg-xbg min-h-screen'>
      <div className="mx-auto max-w-screen-xl px-4 pb-2 custom-smallest:pb-3 small-stepper:pb-3 sm:pb-4 md:pb-6 pt-2 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <Stepper currentStep={currentStep} />
        </div>
      </div>
      <div className="mx-auto max-w-screen-xl px-4 pb-6 pt-6 sm:px-6 lg:px-8 relative">
        <div className="flex justify-center">
          <div className="w-[600px]">
            <ProgressBar progress={progress} />
          </div>
          <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <img
              src="/images/avatar.jpg"
              alt="Avatar"
              className="w-12 h-12 custom-smallest:w-14 custom-smallest:h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full border-2 border-accentLight object-cover"
            />
          </div>
        </div>
      </div>
      <div>
        {currentStep === 1 && <Step1Selection onNext={handleNextStep} />}
        {currentStep === 2 && <Step3Specifications onNext={handleNextStep} onBack={handleBackStep} onReset={handleReset} />}
        {currentStep === 3 && <Step1Info onNext={handleNextStep} onReset={handleReset} onBack={handleBackStep}/>}
        {currentStep === 4 && <Step2PromoOptIn onNext={handleNextStep} onBack={handleBackStep} onReset={handleReset} />}
        {currentStep === 5 && <Step2Schedule onNext={handleNextStep} onReset={handleReset} onBack={handleBackStep} />}
        {currentStep === 6 && <Summary onNext={handleSubmitted} onReset={handleReset} onBack={handleBackStep} />}
      </div>
    </div>
  );
};

export default ParentForm;
