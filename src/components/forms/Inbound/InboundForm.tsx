import { useContext, useState } from 'react';
import { AppContext } from '@/context/AppContext';
import Summary from './Summary';
import ScheduleStep from './ScheduleStep';
import InfoStep from './InfoStep';

const InboundForm = () => {
		const [currentStep, setCurrentStep] = useState<number>(1);
    const appContext = useContext(AppContext);
    // const location = useLocation();
    // const progress = (currentStep - 1) * 16.66;
    if (!appContext || !appContext.contractor || !appContext.services) {
      return null;
    }
		const [summary, setSummary] = useState<boolean>(false);

  
    const handleNextStep = () => {
			// if cuurent step is 3, then go back to 1
			if (currentStep === 3) {
				setCurrentStep(1);
			}
			// if curent step is 2
			else if (currentStep === 2) {
				if (summary) { // editing schedule
					setSummary(false);
					setCurrentStep(1);
				}
				else {
					setCurrentStep(3);
				}
			}
			else {
				setCurrentStep(currentStep + 1);
			}
    };

		// editing schedule
		const handleSchedule = () => {
			setCurrentStep(2);
			setSummary(true);
		};
		
    const handleBackStep = () => {
			setCurrentStep(currentStep - 1);
    };

    if (!appContext || !appContext.contractor || !appContext.services) {
      return null;
    }
  
    return (
      <div className=''>
        <div>
          {currentStep === 1 && <Summary onNext={handleNextStep} onSchedule={handleSchedule}/>}
          {currentStep === 2 && <ScheduleStep onNext={handleNextStep} />}
          {currentStep === 3 && <InfoStep onNext={handleNextStep} onBack={handleBackStep}/>}
        </div>
      </div>
    );
  };
  
  export default InboundForm;