// ParentForm.tsx
import { useState, useContext } from 'react';
import ProjectForm from './Project/ProjectForm';
import DetailsForm from './Details/DetailsForm';
import AppointmentForm from './Appointment/AppointmentForm';
import Stepper from '../ui/Stepper';
import { AppContext } from '../../context/AppContext';

const ParentForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const appContext = useContext(AppContext);

  if (!appContext) {
    return null;
  }

  const { setSelectedService } = appContext;

  const handleNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handleReset = () => {
    setCurrentStep(1);
    // clear selected service
    setSelectedService(0);
  }

  return (
    <div className='bg-xbg min-h-screen'>
      <div className="mx-auto max-w-screen-xl px-4 pb-2 custom-smallest:pb-3 small-stepper:pb-3 sm:pb-4 md:pb-6 pt-2 sm:px-6 lg:px-8">
      <div className="flex justify-center">
          <Stepper currentStep={currentStep} />
        </div>
      </div>
      <div>
        {currentStep === 1 && <ProjectForm onNext={handleNextStep} />}
        {currentStep === 2 && <DetailsForm onNext={handleNextStep} />}
        {currentStep === 3 && <AppointmentForm onNext={handleNextStep} onReset={handleReset} />}
      </div>
    </div>
  );
};

export default ParentForm;
