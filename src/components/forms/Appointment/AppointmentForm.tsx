import { useState } from 'react';
import ProgressBar from '../../ui/ProgressBar';
import Step1Schedule from './Step1Schedule';
import Step2Contractors from './Step2Contractors';
import Step3ThankYou from './Step3ThankYou';

interface DetailsFormProps {
  onNext: () => void;
}

const DetailsForm: React.FC<DetailsFormProps> = ({ onNext }) => {
  const [currentStep, setCurrentStep] = useState(1);

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep((prevStep) => prevStep + 1);
    } else {
      onNext(); 
    }
  };


  const handleHome = () => {
    window.location.href = '/';
  }

  const progress = (currentStep - 1) * 33.3333339; 

  return (
    <div>
      <div className="mx-auto max-w-screen-xl px-4 pb-8 pt-3 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <div className="w-[600px]">
            <ProgressBar progress={progress} />
          </div>
        </div>
      </div>
      <div>
        {currentStep === 1 && <Step1Schedule onNext={handleNextStep}/>}
        {currentStep === 2 && <Step2Contractors onNext={handleNextStep}/>}
        {currentStep === 3 && <Step3ThankYou onHome={handleHome} />}
      </div>
    </div>
  );
};

export default DetailsForm;

