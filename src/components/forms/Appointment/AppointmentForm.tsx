import { useState } from 'react';
import ProgressBar from '../../ui/ProgressBar';
import { useNavigate } from 'react-router-dom';
import Step2Schedule from './Step2Schedule';
import Step3Contractors from './Step3Contractors';
import Step1Quotes from './Step1Quotes';

interface DetailsFormProps {
  onNext: () => void;
  onReset: () => void;
}



const DetailsForm: React.FC<DetailsFormProps> = ({ onNext, onReset }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();


  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep((prevStep) => prevStep + 1);
    } else {
      onNext(); 
    }
  };

  const handleCompleted = () => {
    navigate('/thank-you');
  };

  const handleReset = () => {
    onReset();
  };

  const progress = (currentStep - 1) * 33.33339; 

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
        {currentStep === 1 && <Step1Quotes onNext={handleNextStep}/>}
        {currentStep === 2 && <Step2Schedule onNext={handleNextStep}/>}
        {currentStep === 3 && <Step3Contractors onCompleted={handleCompleted} onReset={handleReset}/>}

      </div>
    </div>
  );
};

export default DetailsForm;

