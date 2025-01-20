import React, { useContext, useState } from 'react';
import { AppContext } from '@/context/AppContext';
import Services from '@/components/Services';

// Define props interface
interface Step1SelectionProps {
  onNext: () => void;
}

const Step1Selection: React.FC<Step1SelectionProps> = ({ onNext }) => {
  const appContext = useContext(AppContext);

  if (!appContext) {
    return null;
  }

  const { user, services, setSelectedService } = appContext;
  const [loading, setLoading] = useState<boolean>(false); // State to control spinner
  const params = new URLSearchParams(window.location.search);
  const initial = params.get('firstname');

  // Utility function to capitalize the first letter
  const capitalizeFirstLetter = (string: string | null) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const firstname = capitalizeFirstLetter(initial);

  // Filter services based on user's ZIP code
  const filteredServices = services.filter((service: any) => 
    service.zips_available && service.zips_available.includes(user.zip)
  );

  const handleServiceSelect = async (service: any) => {
    setLoading(true); // Show spinner
    setSelectedService(service); // Save the entire service item
    setLoading(false); // Hide spinner
    onNext();
  };

  return (
    <div className="z-10 max-w-[100rem] px-4 lg:px-14 py-10 lg:py-14 mx-auto relative">
      <div className="space-y-8">
        <div className='flex justify-center text-center mb-8'>
          <div className="max-w-[40rem] text-center">
            <h1 className="block text-2xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-3xl font-bold sm:font-bold md:font-semibold lg:font-semibold text-gray-800 dark:text-white">
              {firstname ? (
                <>
                  Hi {firstname}! Let's bring your{' '}
                  <span className="text-accentColor">future project</span> to life—choose what fits your vision below
                </>
              ) : (
                <>
                  Hi there! Let's bring your{' '}
                  <span className="text-accentColor">future project</span> to life—choose what fits your vision below
                </>
              )}
            </h1>
          </div>
        </div>

        <Services services={filteredServices} handleServiceSelect={handleServiceSelect} />

        {loading && (
          <div className="flex justify-center pt-20">
            <div className="animate-spin h-6 w-6 border-2 border-accentColor border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Step1Selection;
