// Stepper.tsx
import React from 'react';

interface StepperProps {
  currentStep: number;
}

const Stepper: React.FC<StepperProps> = ({ currentStep }) => {
  const steps = [
    { title: 'Project', description: 'Tell us what you need' },
    { title: 'Details', description: 'Confirm your details' },
    { title: 'Free Consultation', description: 'Schedule your free consultation.' },
  ];

  return (
    <div>
      <h2 className="sr-only">Steps</h2>
      <div>
        <ol className="flex flex-nowrap divide-x divide-gray-100 overflow-hidden rounded-lg border border-gray-100 text-sm text-gray-500">
          {steps.map((step, index) => (
            <li
              key={index}
              className={`flex items-center justify-center gap-2 p-2 sm:p-4 ${
                currentStep === index + 1 ? 'bg-gray-50' : ''
              }`}
            >
              <svg
                className="size-7 shrink-0"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                />
              </svg>
              <p className="leading-none">
                <strong className="block font-medium">{step.title}</strong>
                <small className="mt-1 hidden sm:block">{step.description}</small>
              </p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default Stepper;