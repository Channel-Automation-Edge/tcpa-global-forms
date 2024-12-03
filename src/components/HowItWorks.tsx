"use client";
import React from 'react';
import BlurFade from './ui/blur-fade';

const HowItWorks: React.FC = () => {
  return (
    <div>
      <BlurFade delay={1 * 0.15} inView yOffset={0} className="max-w-[85rem] grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 py-10 lg:py-10 px-4 sm:px-6 lg:px-8 mx-auto">
      
      
        <BlurFade delay={1 * 0.15} inView yOffset={15} className="relative flex sm:pe-6">
          <img src="/images/step1.svg" alt="Step 1" className="shrink-0 size-10 mt-1" />
          <div className="ms-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">1: Expert Assignment</h3>
            <p className="mt-1 text-gray-600 dark:text-neutral-400">
            After reviewing your project details, we will assign experienced contractors who specialize in your area of need. These experts are selected based on their ability to best meet your project requirements and preferences.
            </p>
          </div>
        </BlurFade>


      
        <BlurFade delay={2 * 0.15} inView yOffset={15} className="relative flex sm:pe-6">
          <img src="/images/step2.svg" alt="Step 2" className="shrink-0 size-10 mt-1" />
          <div className="ms-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">2: Consultation Scheduling</h3>
            <p className="mt-1 text-gray-600 dark:text-neutral-400">
            You will receive an update from us regarding the scheduled date and time for your free consultation. This ensures that you are fully prepared and available for the meeting with the contractor.
            </p>
          </div>
        </BlurFade>



        <BlurFade delay={3 * 0.15} inView yOffset={15} className="relative flex sm:pe-6">
          <img src="/images/step3.svg" alt="Step 3" className="shrink-0 size-10 mt-1" />
          <div className="ms-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">3: On-Site Visit and Free Quote</h3>
            <p className="mt-1 text-gray-600 dark:text-neutral-400">
            The assigned contractor will visit your location at the scheduled time to discuss your project in detail. During this visit, they will conduct an assessment and provide you with a customized free quote, outlining the scope of work and associated costs. 
            </p>
          </div>
        </BlurFade>


    </BlurFade>
    </div>
    
  );
};

export default HowItWorks;
