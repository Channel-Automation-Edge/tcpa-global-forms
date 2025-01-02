import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '@/context/AppContext';
import supabase from '@/lib/supabaseClient';

interface Step1ServicesProps {
  onNext: () => void;
}

const Step1Services: React.FC<Step1ServicesProps> = ({ onNext }) => {
  const appContext = useContext(AppContext);

  if (!appContext) {
    return null;
  }

  const { contractorServices, setContractorServices } = appContext;
  const [services, setServices] = useState<any[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>(contractorServices || []);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from('Services')
          .select('*');

        if (error) {
          console.error('Error fetching services:', error);
          return;
        }

        setServices(data);
      } catch (err) {
        console.error('Unexpected error fetching services:', err);
      }
    };

    fetchServices();
  }, []);

  const handleServicesSelect = (serviceId: string) => {
    setSelectedServices(prev => {
      const isSelected = !prev.includes(serviceId);
      return isSelected ? [...prev, serviceId] : prev.filter(id => id !== serviceId);
    }); 
  };

  const handleSubmit = () => {
    setLoading(true);
    setContractorServices(selectedServices);
  
    // Save the selected services to local storage
    localStorage.setItem('selectedServices', JSON.stringify(selectedServices));
  
    setLoading(false);
    onNext();
  }
  
  return (
    <div className="z-10 max-w-[100rem] px-4 lg:px-14 py-10 lg:py-14 mx-auto relative">
      <div className="space-y-8">

        <div className='flex justify-center text-center mb-8'>
          <div className="max-w-[40rem] text-center">
            <h1 className="block text-2xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-3xl font-bold sm:font-bold md:font-semibold lg:font-semibold text-gray-800 dark:text-white">
              Hi there! What   <span className="text-xorange">services</span> does your company offer? Please select all that apply
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 sm:gap-[20px]" style={{ marginTop: '15px', width: '100%' }}>
          {services.map((service) => (
            <div
              key={service.id}
              className="flex flex-row sm:flex-col items-center justify-start sm:justify-center w-full sm:w-[210px] h-[80px] sm:h-[156px] border border-transparent rounded-xl shadow-md p-4 transition-transform transform hover:scale-100 sm:hover:scale-105 bg-white"
              onClick={() => handleServicesSelect(service.id.toString())}
              style={{
                boxShadow: selectedServices.includes(service.id.toString())
                  ? 'rgba(255, 81, 0, 0.7) 0px 10px 25px -6px'
                  : 'rgba(0, 0, 0, 0.07) 0px 22px 30px -6px',
                transition: 'box-shadow 0.3s ease',
                borderColor: selectedServices.includes(service.id.toString())
                  ? 'rgba(255, 81, 0, 0.7)'
                  : 'rgba(157, 176, 197, 0.25)',
              }}
              onMouseEnter={(e) => {
                if (!selectedServices.includes(service.id.toString())) {
                  e.currentTarget.style.boxShadow = 'rgba(255, 81, 0, 0.7) 0px 10px 25px -6px';
                  e.currentTarget.style.borderColor = 'rgba(255, 81, 0, 0.7)';
                }
              }}
              onMouseLeave={(e) => {
                if (!selectedServices.includes(service.id.toString())) {
                  e.currentTarget.style.boxShadow = 'rgba(0, 0, 0, 0.07) 0px 22px 30px -6px';
                  e.currentTarget.style.borderColor = 'rgba(157, 176, 197, 0.25)';
                }
              }}
            >
              <img
                src={service.photo}
                alt={service.name}
                className="w-12 h-12 sm:w-14 sm:h-14 sm:mb-4 ml-2 mr-4 sm:ml-0 sm:mr-0"
              />
              <span className="text-gray-800 text-base font-medium text-left sm:text-center">{service.name}</span>
            </div>
          ))}
        </div>

        <div className="mt-20 flex justify-center">
          <button
            type="button"
            className={`w-full max-w-xs px-24 py-5 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent ${
              selectedServices.length > 0
                ? 'bg-xorange text-white hover:bg-xorangeDark shadow-lg shadow-[rgba(254,139,16,0.5)] transform transition-transform translate-y-[-8px]'
                : 'bg-gray-200 text-white cursor-not-allowed'
            }`}
            onClick={handleSubmit}
            disabled={selectedServices.length === 0}
          >
            {loading ? (
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
            ) : (
              'Continue'
            )}
          </button>
        </div>

      </div>
    </div>
  );
}

export default Step1Services;
