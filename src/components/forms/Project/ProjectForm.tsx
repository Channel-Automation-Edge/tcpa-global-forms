import Step1Selection from './Step1Selection';
import ProgressBar from '../../ui/ProgressBar';
import Step3Specifications from './Step3Specifications';
import Step4Preferences from './Step4Preferences';
import useFormPersistence from '../../../hooks/useFormPersistence';


interface ProjectFormProps {
  onNext: () => void;
  onReset: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ onNext, onReset}) => {
  const [currentStep, setCurrentStep, resetCurrentStep] = useFormPersistence('projectFormStep', 1);

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      onNext(); // Notify ParentForm to move to the next step
      
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

  // const handleNotify = () => {
  //   resetCurrentStep(); 
  //   onNotify();
  // };



  const progress = (currentStep - 1) * 25;

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
        {currentStep === 1 && <Step1Selection onNext={handleNextStep} />}
        {currentStep === 2 && <Step3Specifications onNext={handleNextStep} onBack={handleBackStep} onReset={handleReset} />}
        {currentStep === 3 && <Step4Preferences onNext={handleNextStep} onBack={handleBackStep} onReset={handleReset} />}
      </div>
    </div>
  );
};

export default ProjectForm;
