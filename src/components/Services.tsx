import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import servicesData from '../assets/assets.json';
import { AppContext } from '../context/AppContext'; 

const Services: React.FC = () => {
  const navigate = useNavigate();
  const appContext = useContext(AppContext);

  if (!appContext) {
    return null; // Handle the case where appContext is not available
  }

  const { setSelectedService } = appContext;

  const handleServiceSelect = (id: number) => {
    setSelectedService(id);
    console.log('Setting Initial Service:', id);
    navigate('/request-quotes'); // Navigate to FormPage
  };

  return (
    <div className="max-w-[85rem] py-10 lg:py-10 px-4 sm:px-6 lg:px-8 mx-auto">
      <div className="max-w-2xl pb-12 mx-auto text-center">
        <h2 className="font-bold text-2xl md:text-3xl text-gray-800 dark:text-neutral-200">
        Your Project, Your Price – Request a Quote
        </h2>
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
              e.currentTarget.style.boxShadow = 'rgba(254,79,0,0.5) 0px 22px 30px -8px';
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
  );
};

export default Services;
