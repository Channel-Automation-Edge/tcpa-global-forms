import ProgressBar from '../../ui/ProgressBar';
import Step1Info from './Step1Info';
import Step2PromoOptIn from './Step2PromoOptIn';
import Step3Invoice from './Step3Invoice';
import useFormPersistence from '../../../hooks/useFormPersistence';

interface DetailsFormProps {
  onNext: () => void;
  onReset: () => void;
}

const DetailsForm: React.FC<DetailsFormProps> = ({ onNext, onReset }) => {
  const [currentStep, setCurrentStep, resetCurrentStep] = useFormPersistence('detailsFormStep', 1);

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      resetCurrentStep(); 
      onNext(); 
    }
  };

  const handleBackStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    resetCurrentStep(); 
    onReset();
  };

  const progress = (currentStep - 1) * 33; 
  const notifyServiceAvailablility = false;

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
              className="w-12 h-12 custom-smallest:w-14 custom-smallest:h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full border-2 border-lpurple object-cover"
            />
          </div>
        </div>
      </div>
      <div>
        {currentStep === 1 && <Step1Info onNext={handleNextStep} onReset={handleReset} />}
        {currentStep === 2 && <Step2PromoOptIn onNext={handleNextStep} onBack={handleBackStep} onReset={handleReset} notifyServiceAvailablility = {notifyServiceAvailablility} />}
        {currentStep === 3 && <Step3Invoice onNext={handleNextStep} onReset={handleReset} />}
      </div>
    </div>
  );
};

export default DetailsForm;
