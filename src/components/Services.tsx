import React, { useContext } from 'react';import Bathtub from './icons/Bathtub';
import { AppContext } from '@/context/AppContext';
import Trowel from './icons/Trowel';
import BlurFade from './ui/blur-fade';
import Closet from './icons/Closet';
import Plumbing from './icons/Plumbing';
import Deck from './icons/Deck';
import Doors from './icons/Doors';
import Garage from './icons/Garage';
import Gutter from './icons/Gutter';
import Foundation from './icons/Foundation';
import Flooring from './icons/Floor';
import Kitchen from './icons/Kitchen';
import Roofing from './icons/Roofing';
import Siding from './icons/Siding';
import Shower from './icons/Shower';
import Windows from './icons/Windows';
import Fence from './icons/Fence';

interface Service {
  id: string;
  services: { name: string };
}

// Icon mapping
const iconMapping: Record<string, JSX.Element> = {
  'Bath': <Bathtub />,
  'Basement Waterproofing': <Trowel />,
  'Closet': <Closet />,
  'Plumbing': <Plumbing />,
  'Deck': <Deck />,
  'Doors': <Doors />,
  'Fence': <Fence />,
  'Flooring': <Flooring />,
  'Garage': <Garage />,
  'Gutters': <Gutter />,
  'Foundation': <Foundation />,
  'Kitchen': <Kitchen />,
  'Roofing': <Roofing />,
  'Siding': <Siding />,
  'Shower': <Shower />,
  'Windows': <Windows />,
  // Add more mappings as needed
};

interface ServicesProps {
  services: Service[];
  handleServiceSelect: (service: Service) => void;
}

const Services: React.FC<ServicesProps> = ({ services, handleServiceSelect }) => {

  const appContext = useContext(AppContext);

  if (!appContext) {
    return null;
  }

  const accent_rgba = appContext.contractor.colors.accent_rgba || '0 10px 25px -6px rgba(0, 0, 0, 0.1)';

  return (
    <div>
      <div className="space-y-8">
        <div className="flex flex-wrap justify-center gap-4 sm:gap-[20px]" style={{ marginTop: '15px', width: '100%' }}>
          {services.length > 0 ? (
            services.map((service, index) => (
              <BlurFade
                key={service.id}
                delay={index * 0.1} // Incremental delay for staggered effect
                yOffset={8}
                className="flex flex-row sm:flex-col items-center justify-start sm:justify-center w-full sm:w-[210px] h-[80px] sm:h-[156px] border border-transparent rounded-xl shadow-md p-4 transition-transform transform hover:scale-100 sm:hover:scale-105 bg-white cursor-default"
                onClick={() => handleServiceSelect(service)}
                style={{
                  boxShadow: 'rgba(0, 0, 0, 0.07) 0px 22px 30px -6px',
                  transition: 'box-shadow 0.3s ease',
                  borderColor: 'rgba(157, 176, 197, 0.25)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = accent_rgba + ' 0px 10px 25px -6px ';
                  e.currentTarget.style.borderColor = accent_rgba;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'rgba(0, 0, 0, 0.07) 0px 10px 25px -6px';
                  e.currentTarget.style.borderColor = 'rgba(157, 176, 197, 0.25)';
                }}
              >
                {iconMapping[service.services.name]}
                <span className="text-gray-800 text-base font-medium text-left sm:text-center">{service.services.name}</span>
              </BlurFade>
            ))
          ) : (
            <BlurFade delay={3 * 0.15} yOffset={15} className="text-center text-gray-500 mt-8">
              Sorry, we don't serve your area at the moment.
            </BlurFade>
          )}
        </div>
      </div>
    </div>
  );
};

export default Services;
