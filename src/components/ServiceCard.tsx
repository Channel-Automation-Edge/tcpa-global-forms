import React from 'react';

// Define the props interface
interface ServiceCardProps {
  id: number;
  name: string;
  photo: string;
  description: string;
  handleButtonClick: (id: number) => void;
}

// Component definition
const ServiceCard: React.FC<ServiceCardProps> = ({ id, name, photo, description, handleButtonClick }) => {
  return (
    <div className="relative w-full h-[320px]">
      <div
        className="w-full h-full rounded-[12px] bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: `url(${photo})` }}
      >
        <div
          className="absolute inset-0 rounded-[12px]"
          style={{
            background: 'linear-gradient(0deg, rgba(28, 28, 27, 0.60) 0.18%, rgba(36, 36, 35, 0.56) 40.36%, rgba(117, 117, 112, 0.22) 73.97%, rgba(167, 167, 159, 0.00) 99.88%)',
          }}
        ></div>
        <div className="relative z-10">
          <h3 className="absolute top-[185px] left-[38px] text-xl font-medium text-white">{name}</h3>
          <p className="absolute top-[220px] left-[38px] pr-2 text-pretty text-xs text-white">{description}</p>
          <div className="absolute top-[270px] left-[38px]">
            <a
              className="group relative inline-flex items-center overflow-hidden rounded bg-black px-8 py-3 text-white focus:outline-none focus:ring active:bg-[var(--accent-light)]"
              href="#"
              onClick={() => handleButtonClick(id)}
            >
              <span className="absolute -start-full transition-all group-hover:start-4">
                <svg
                  className="size-5 rtl:rotate-180"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </span>

              <span className="text-sm font-medium transition-all group-hover:ms-4">Get Estimate</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
