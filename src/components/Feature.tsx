import React, { useContext } from 'react';
import { AppContext } from '@/context/AppContext';

const Feature: React.FC = () => {
  const appContext = useContext(AppContext);

  if (!appContext || !appContext.contractor) {
    return null; // Return null if appContext or contractor is not available
  }

  const { contractor } = appContext;
  const imageUrl = contractor.content.feature_photo || '/images/feature.jpg';
  const defaultHeader = (
    <>
      Your <span className="text-accentColor">Dream Home</span>, Our Expertise
    </>
  );
  const featureHeader = contractor.content.feature_header || defaultHeader;
  const featureDescription = contractor.content.feature_description || `At ${contractor.name}, we specialize in turning your house into a home. Our team of experienced professionals is dedicated to providing top-notch home improvement services tailored to your needs`;
  const featureList = contractor.content.feature_list || [
    'Skilled Professionals',
    'Excellence Guaranteed',
    'No Hidden Costs'
  ];

  return (
    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      {/* Grid */}
      <div className="md:grid md:grid-cols-2 md:items-center md:gap-12 xl:gap-32">
        <div>
          <img className="rounded-xl" src={imageUrl} alt="Features Image" />
        </div>
        {/* End Col */}

        <div className="mt-5 sm:mt-10 lg:mt-0">
          <div className="space-y-6 sm:space-y-8">
            {/* Title */}
            <div className="space-y-2 md:space-y-4">
              <h2 className="section_header">
                {featureHeader}
              </h2>
              <p className="section_description">
                {featureDescription}
              </p>
            </div>
            {/* End Title */}

            {/* List */}
            <ul className="space-y-2 sm:space-y-4">
              {featureList.map((item: string, index: number) => (
                <li key={index} className="flex gap-x-3">
                  <span className="mt-0.5 size-5 flex justify-center items-center rounded-full bg-accentLight text-accentColor dark:bg-blue-800/30 dark:text-accentColor">
                    <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  </span>
                  <div className="grow">
                    <span className="text-sm sm:text-base text-gray-500 dark:text-neutral-500">
                      {item}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
            {/* End List */}
          </div>
        </div>
        {/* End Col */}
      </div>
      {/* End Grid */}
    </div>
  );
};

export default Feature;
