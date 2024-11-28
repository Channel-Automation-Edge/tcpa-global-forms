// ParentForm.tsx
import { useState } from 'react';
import ProjectForm from './Project/ProjectForm';
import DetailsForm from './Details/DetailsForm';
import AppointmentForm from './Appointment/AppointmentForm';
import Stepper from '../ui/Stepper';

const ParentForm = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const handleNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  // const handleRestart = () => {
  //   setCurrentStep(1); // Go back to Step 1
  // };

  // const handleHome = () => {
  //   // Reset any other state needed for a clean start
  // };

  return (
    <div>
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex justify-center">
          <Stepper currentStep={currentStep} />
        </div>
      </div>
      <div>
        {currentStep === 1 && <ProjectForm onNext={handleNextStep} />}
        {currentStep === 2 && <DetailsForm onNext={handleNextStep} />}
        {currentStep === 3 && <AppointmentForm onNext={handleNextStep} />}
      </div>
    </div>
  );
};

export default ParentForm;


// ?firstname=Tricia&lastname=Pastrano&email=email@example.com&phone=1234567890&zip=12345&state=IL