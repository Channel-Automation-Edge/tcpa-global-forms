import { useState } from 'react';
import ProgressBar from '../../ui/ProgressBar';
import Step1Info from './Step1Info';
import Step2PromoOptIn from './Step2PromoOptIn';
import Step3Invoice from './Step3Invoice';

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

  const progress = (currentStep - 1) * 33; 

  return (
    <div>
      <div className="mx-auto max-w-screen-xl px-4 pb-6 pt-6 sm:px-6 lg:px-8 relative">
        <div className="flex justify-center">
          <div className="w-[600px]">
            <ProgressBar progress={progress} />
          </div>
          <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <img
              src="/images/avatar.jpg"
              alt="Avatar"
              className="w-20 h-20 rounded-full border-2 border-lpurple object-cover"
            />
          </div>
        </div>
      </div>
      <div>
        {currentStep === 1 && <Step1Info onNext={handleNextStep} />}
        {currentStep === 2 && <Step2PromoOptIn onNext={handleNextStep} />}
        {currentStep === 3 && <Step3Invoice onNext={handleNextStep} />}
      </div>
    </div>
  );
};

export default DetailsForm;
