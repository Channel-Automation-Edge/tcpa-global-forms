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

  const { setSelectedService } = appContext;

  const handleServiceSelect = (serviceId: number) => {
    setSelectedService(serviceId);
    console.log(`Selected service updated to: ${serviceId}`);
    onNext();
  };

  return (
    <div className="z-10 max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="block text-3xl font-bold text-primary dark:text-white">
            Let us know what you need
          </h1>
          <p className="mt-1 mb-12 text-gray-600 dark:text-neutral-400">
            Select a service you are interested in
          </p>
        </div>

        <div className=" flex flex-wrap justify-center"
            style={{ gap: '20px 30px', marginTop: '15px', width: '100%' }}>
              {servicesData.services.map((service) => (
                <div
                  key={service.id}
                  className="flex flex-col items-center justify-center w-[256px] sm:w-[180px] md:w-[256px] lg:w-[256px] h-[156px] border border-indigo-100 rounded-[20px] shadow-md p-4 transition-transform transform hover:scale-105 bg-lpurple"
                  onClick={() => handleServiceSelect(service.id)}
                  style={{boxShadow: 'rgba(0, 0, 0, 0.07) 0px 22px 30px -8px',
                    transition: 'box-shadow 0.3s ease',}}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = 'rgba(254,139,16,0.5) 0px 22px 30px -8px';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'rgba(0, 0, 0, 0.07) 0px 22px 30px -8px';
                  }}
                >
                  {/* <div className="w-10 h-10 mb-4 bg-xorange rounded-full flex items-center justify-center">
               
                  </div> */}
                  <span className="text-xpurple text-center">{service.name}</span>
                </div>
              ))}
            </div>
      </div>
    </div>
  );
};

export default Step1Selection;
