import { useState, useEffect, useContext } from 'react';
import Step1Selection from './Step1Selection';
import ProgressBar from '../../ui/ProgressBar';
import Step2Specifications from './Step2Specifications';
import Step3Preferences from './Step3Preferences';
import { AppContext } from '../../../context/AppContext';

interface ProjectFormProps {
  onNext: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ onNext }) => {
  const appContext = useContext(AppContext);

  if (!appContext) {
    return null;
  }

  const { selectedService } = appContext;

  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    if (selectedService) {
      setCurrentStep(2);
    }
  }, [selectedService]);

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep((prevStep) => prevStep + 1);
    } else {
      onNext(); // Call the onNext function from ParentForm when the last step is completed
    }
  };

  const handleBackStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prevStep) => prevStep - 1);
    }
  };

  const progress = (currentStep - 1) * 33.333339;

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
        {currentStep === 1 && <Step1Selection onNext={handleNextStep} />}
        {currentStep === 2 && <Step2Specifications onNext={handleNextStep} onBack={handleBackStep} />}
        {currentStep === 3 && <Step3Preferences onNext={handleNextStep} onBack={handleBackStep} />}
      </div>
    </div>
  );
};

export default ProjectForm;



