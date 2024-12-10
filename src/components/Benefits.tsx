import React from 'react';
import BlurFade from './ui/blur-fade';

const Benefits: React.FC = () => {
  return (
    <div className='bg-xbg'>
      <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">

      <BlurFade delay={3 * 0.15} inView yOffset={15} className="text-center mb-12">
          <h2 className="font-semibold text-2xl md:text-3xl text-gray-800 dark:text-neutral-200">
          Why Homeowners <span className="text-xorange">Love Us</span>
          </h2>
          <p className="mt-2 md:mt-4 text-gray-500 dark:text-neutral-500">

          </p>
      </BlurFade>

      {/* Grid */}
      <div className="grid sm:grid-cols-3 gap-8 md:gap-12 grid-auto-[1fr]">

        {/* Icon Block */}
        <BlurFade delay={4 * 0.15} inView yOffset={15} className="relative flex gap-x-5 rounded-xl p-4">
        <div className="absolute inset-0 bg-lpurple opacity-90 rounded-xl"></div>
          <svg
            className="shrink-0 mt-1 size-6 text-xorange dark:text-xorange z-10"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 10v12" />
            <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
          </svg>
          <div className="grow z-10">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Personalized Solutions
            </h3>
            <p className="mt-1 text-gray-600 dark:text-neutral-400">
            Get a customized assessment of your home's specific needs and receive tailored recommendations from our experienced contractors
            </p>
          </div>
        </BlurFade>
        {/* End Icon Block */}

        {/* Icon Block */}
        <BlurFade delay={4.5 * 0.15} inView yOffset={15} className="relative flex gap-x-5 rounded-xl p-4">
        <div className="absolute inset-0 bg-lpurple opacity-90 rounded-xl"></div>
          <svg
            className="shrink-0 mt-1 size-6 text-xorange dark:text-xorange z-10"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 10v12" />
            <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
          </svg>
          <div className="grow z-10">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Expert Advice
            </h3>
            <p className="mt-1 text-gray-600 dark:text-neutral-400">
            Take advantage of our contractors' expertise and get valuable insights on how to improve your home's functionality, safety, and value
            </p>
          </div>
        </BlurFade>
        {/* End Icon Block */}

        {/* Icon Block */}
        <BlurFade delay={5 * 0.15} inView yOffset={15} className="relative flex gap-x-5 rounded-xl p-4">
        <div className="absolute inset-0 bg-lpurple opacity-90 rounded-xl"></div>
          <svg
            className="shrink-0 mt-1 size-6 text-xorange dark:text-xorange z-10"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
          <div className="grow z-10">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Priority Scheduling
            </h3>
            <p className="mt-1 text-gray-600 dark:text-neutral-400">
            Get priority access to our contractors' schedules. This means that you'll be able to get your project started sooner, and you'll have a better chance of getting the contractor you want
            </p>
          </div>
        </BlurFade>
        {/* End Icon Block */}

        {/* Icon Block */}
        <BlurFade delay={5.5 * 0.15} inView yOffset={15} className="relative h- flex gap-x-5 rounded-xl p-4">
        <div className="absolute inset-0 bg-lpurple opacity-90 rounded-xl"></div>
          <svg
            className="shrink-0 mt-1 size-6 text-xorange dark:text-xorange z-10"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <div className="grow z-10">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            No Obligation
            </h3>
            <p className="mt-1 text-gray-600 dark:text-neutral-400">
            Schedule a free consultation with no strings attached. Use the consultation to explore different options
            </p>
          </div>
        </BlurFade>
        {/* End Icon Block */}

        {/* Icon Block */}
        <BlurFade delay={6 * 0.15} inView yOffset={15}  className="relative flex gap-x-5 rounded-xl p-4">
        <div className="absolute inset-0 bg-lpurple opacity-90 rounded-xl"></div>
          <svg
            className="shrink-0 mt-1 size-6 text-xorange dark:text-xorange z-10"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <div className="grow z-10">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Accurate Estimates
            </h3>
            <p className="mt-1 text-gray-600 dark:text-neutral-400">
            Our contractors provide detailed, itemized estimates that outline the scope of work, materials, and labor costs
            </p>
          </div>
        </BlurFade>
        {/* End Icon Block */}

        {/* Icon Block */}
        <BlurFade delay={6.5 * 0.15} inView yOffset={15} className="relative flex gap-x-5 rounded-xl p-4">
        <div className="absolute inset-0 bg-lpurple opacity-90 rounded-xl"></div>
          <svg
            className="shrink-0 mt-1 size-6 text-xorange dark:text-xorange z-10"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <div className="grow z-10">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Trust and Peace of Mind
            </h3>
            <p className="mt-1 text-gray-600 dark:text-neutral-400">
            Get to know our contractors and experience the peace of mind that comes with working with trusted professionals
            </p>
          </div>
        </BlurFade>
        {/* End Icon Block */}
      </div>

      

      {/* End Grid */}
    </div>
    </div>
    
  );
};

export default Benefits;
