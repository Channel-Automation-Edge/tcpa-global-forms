"use client";
import React, { useContext } from 'react';
import { AppContext } from '../../../context/AppContext';
import servicesData from '../../../assets/assets.json';

// Define props interface
interface Step1SelectionProps {
  onNext: () => void;
}

const Step1Selection: React.FC<Step1SelectionProps> = ({ onNext }) => {
  const appContext = useContext(AppContext);

  if (!appContext) {
    return null;
  }

  const { setSelectedService, firstname } = appContext;

  const handleServiceSelect = (serviceId: number) => {
    setSelectedService(serviceId);
    console.log(`Selected service updated to: ${serviceId}`);
    onNext();
  };

  return (
    <div className="z-10 max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <div className="space-y-8">
      
        <div className='flex justify-center text-center mb-8'>
          <div className="max-w-[40rem] text-center">
            <h1 className="block text-2xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-3xl font-bold sm:font-bold md:font-semibold lg:font-semibold text-gray-800 dark:text-white">
              {firstname ? (
                <>
                  Hi {firstname}! Let's bring your{' '}
                  <span className="text-xorange">future project</span> to life—choose what fits your vision below
                </>
              ) : (
                <>
                  Hi there! Let's bring your{' '}
                  <span className="text-xorange">dream project</span> to life—choose what fits your vision below
                </>
              )}
            </h1>
          </div>
        </div>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-[20px]" style={{ marginTop: '15px', width: '100%' }}>
            {servicesData.services.map((service) => (
              <div
                key={service.id}
                className="flex flex-row sm:flex-col items-center justify-start sm:justify-center w-full sm:w-[256px] h-[80px] sm:h-[156px] border border-transparent rounded-xl shadow-md p-4 transition-transform transform hover:scale-100 sm:hover:scale-105 bg-white"
                onClick={() => handleServiceSelect(service.id)}
                style={{
                  boxShadow: 'rgba(0, 0, 0, 0.07) 0px 22px 30px -6px',
                  transition: 'box-shadow 0.3s ease',
                  borderColor: 'rgba(157, 176, 197, 0.25)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = 'rgba(255, 81, 0, 0.7) 0px 10px 25px -6px';
                  e.currentTarget.style.borderColor = 'rgba(255, 81, 0, 0.7)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'rgba(0, 0, 0, 0.07) 0px 22px 30px -6px';
                  e.currentTarget.style.borderColor = 'rgba(157, 176, 197, 0.25)';
                }}
              >
                <img
                  src={service.photo}
                  alt={service.name}
                  className="w-12 h-12 sm:w-14 sm:h-14 sm:mb-4 ml-2 mr-4 sm:ml-0 sm:mr-0"
                  style={{ filter: 'invert(100%) sepia(0%) saturate(0%) hue-rotate(180deg) brightness(0%) contrast(90%) invert(18%) sepia(10%) saturate(504%) hue-rotate(185deg) brightness(90%) contrast(96%)' }}
                />
                <span className="text-gray-800 text-base font-medium text-center sm:text-left">{service.name}</span>
              </div>
            ))}
          </div>







      </div>
    </div>
  );
};

export default Step1Selection;
