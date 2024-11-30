"use client";
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import GradualSpacing from './ui/gradual-spacing';
import { motion } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import NavBar from './NavBar.tsx';
import servicesData from '../assets/assets.json';
import BlurFade from './ui/blur-fade.tsx';

const Hero = () => {
  const navigate = useNavigate();
  const appContext = useContext(AppContext);

  if (!appContext) {
    return null; // Handle the case where appContext is not available
  }

  const { firstname } = appContext;
  const { setSelectedService } = appContext;

  const handleServiceSelect = (id: number) => {
    setSelectedService(id);
    console.log('Setting Initial Service:', id);
    navigate('/request-quotes'); // Navigate to FormPage
  };
  
  const handleButtonClick = () => {
    navigate('/request-quotes');
  };

  return (
    <div>
      <div className="relative min-h-screen bg-[url('/images/hero.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-[#21284d99] opacity-100"></div> {/* Overlay */}

        <div className="relative w-full overflow-hidden">
          <NavBar />
          <div className="z-10 flex items-center justify-center flex-col px-4 mt-0 space-y-[25px]">
            {/* Large screen text */}
            <GradualSpacing
              className="hidden sm:block font-display text-center text-4xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-5xl font-bold -tracking-widest text-off dark:text-white mt-[120px] md:mt-[160px]"
              text="The Easy Way to Fix Your Home"
            />

            {/* Small screen split text */}
            <div className="block sm:hidden">
              <GradualSpacing
                className="font-display text-center text-4xl font-bold -tracking-widest text-off dark:text-white mt-[120px]"
                text="The Easy Way to"
              />
              <GradualSpacing
                className="font-display text-center text-4xl font-bold -tracking-widest text-off dark:text-white"
                text="Fix Your Home"
              />
            </div>

            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 1 }}
              transition={{ delay: 0.6 }}
              className="text-sm sm:text-sm md:text-md lg:text-lg text-white/70 max-w-lg lg:max-w-[551px]  text-center mt-8 mb-5"
            >
              {firstname ? `${firstname}, connect with trusted contractors who have the skills and experience to get the job done right` : 
              "Connect with trusted contractors who have the skills and experience to get the job done right"}
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 1 }}
              transition={{ delay: 0.6 }}
              className="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-xorange text-gray-800 transition-transform transform hover:scale-105"
              onClick={handleButtonClick}
              style={{boxShadow: 'rgba(0, 0, 0, 0.07) 0px 22px 30px -8px',
                transition: 'box-shadow 0.3s ease',}}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = 'rgba(254,139,16,0.5) 0px 10px 20px -1px';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'rgba(0, 0, 0, 0.07) 0px 22px 30px -4px';
              }}
            >
              Get a Free Consultation Now
              <svg
                className="shrink-0 size-4"
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
                <path d="m9 18 6-6-6-6" />
              </svg>
            </motion.button>

            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 1 }}
              transition={{ delay: 0.6 }}
              className="text-sm sm:text-sm md:text-md lg:text-lg text-white/70 max-w-lg lg:max-w-[551px]  text-center mt-8 mb-5"
            >
              Or select a service to get started
            </motion.p>

            <div className="flex flex-wrap max-w-[1206px] justify-center mt-5 pb-10" style={{ gap: '20px 30px' }}>
  {servicesData.services.map((service, index) => (
    <BlurFade
      key={service.id}
      delay={index * 0.15} // Incremental delay for staggered effect
      inView
      yOffset={8}
    >
      <div
        className="flex flex-col items-center justify-center w-[256px] sm:w-[180px] md:w-[256px] lg:w-[256px] h-[156px] border border-gray-300 rounded-[20px] shadow-md p-4 transition-transform transform hover:scale-105"
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
        <div className="w-10 h-10 mb-4 bg-white rounded-full flex items-center justify-center">
          {/* Placeholder for service icon */}
        </div>
        <span className="text-white text-center">{service.name}</span>
      </div>
    </BlurFade>
  ))}
</div>


          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;