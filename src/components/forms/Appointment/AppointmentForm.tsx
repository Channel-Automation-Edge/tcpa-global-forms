import ProgressBar from '../../ui/ProgressBar';
import Step2Schedule from './Step2Schedule';
import Step3Contractors from './Step3Contractors';
import Step1Quotes from './Step1Quotes';
import useFormPersistence from '../../../hooks/useFormPersistence';

interface AppointmentFormProps {
  onSubmit: () => void;
  onReset: () => void;
  onNotify: () => void;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({onSubmit, onReset, onNotify }) => {
  const [currentStep, setCurrentStep, resetCurrentStep] = useFormPersistence('appointmentFormStep', 1);
  

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      
    }
  };

  const handleSubmitted = () => {
    resetCurrentStep(); 
    onSubmit();
  };

  const handleReset = () => {
    resetCurrentStep(); 
    onReset();
  };

  const handleNotify = () => {
    resetCurrentStep(); 
    onNotify();
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
              className="w-12 h-12 custom-smallest:w-14 custom-smallest:h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full border-2 border-lpurple object-cover"
            />
          </div>
        </div>
      </div>
      <div>
        {currentStep === 1 && <Step1Quotes onNext={handleNextStep} onReset={handleReset} />}
        {currentStep === 2 && <Step2Schedule onNext={handleNextStep} onReset={handleReset} />}
        {currentStep === 3 && <Step3Contractors onCompleted={handleSubmitted} onReset={handleReset} onNotify={handleNotify} />}
      </div>
    </div>
  );
};

export default AppointmentForm;
