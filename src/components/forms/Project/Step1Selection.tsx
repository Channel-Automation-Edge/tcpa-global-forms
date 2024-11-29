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
    <div className="z-10 max-w-[100rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="block text-3xl font-bold text-primary dark:text-white">
            Let us know what you need
          </h1>
          <p className="mt-1 text-gray-600 dark:text-neutral-400">
            Select a service you are interested in
          </p>
        </div>

        <div className="mt-12 flex flex-wrap justify-center" style={{ gap: '20px 30px', marginTop: '15px', width: '100%' }}>
          {servicesData.services.map((service) => (
            <button
              key={service.id}
              type="button"
              className={`eIzKEG transition-transform transform hover:scale-105`}
              onClick={() => handleServiceSelect(service.id)}
              style={{
                margin: '0px 0px 10px',
                width: '170px',
                height: '200px',
                overflow: 'hidden',
                display: 'inline-block',
                borderRadius: '8px',
                cursor: 'pointer',
                position: 'relative',
                userSelect: 'none',
                justifyContent: 'space-between',
                border: '1px solid rgba(236, 236, 236, 0.43)',
                boxShadow: 'rgba(0, 0, 0, 0.07) 0px 22px 30px -8px',
                transition: 'box-shadow 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = 'rgba(254,139,16,0.5) 0px 22px 30px -8px';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'rgba(0, 0, 0, 0.07) 0px 22px 30px -8px';
              }}
            >
              <img src={service.photo} alt={service.name} className="w-16 h-16 mb-2 mx-auto" />
              <span className="text-[#2E5B5E] text-center block">{service.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Step1Selection;
