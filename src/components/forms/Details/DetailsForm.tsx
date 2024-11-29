import { useState } from 'react';
import ProgressBar from '../../ui/ProgressBar';
import Step1Info from './Step1Info';
import Step2OptIn from './Step2OptIn';
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

  // const handleBackStep = () => {
  //   if (currentStep > 1) {
  //     setCurrentStep((prevStep) => prevStep - 1);
  //   }
  // }

  const progress = (currentStep - 1) * 33; 

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
        {currentStep === 1 && <Step1Info onNext={handleNextStep} />}
        {currentStep === 2 && <Step2OptIn onNext={handleNextStep} />}
        {currentStep === 3 && <Step3Invoice onNext={handleNextStep} />}
      </div>
    </div>
  );
};

export default DetailsForm;