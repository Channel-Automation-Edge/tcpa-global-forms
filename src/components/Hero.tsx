"use client";
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import GradualSpacing from './ui/gradual-spacing';
import { motion } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import NavBar from './NavBar.tsx';
import servicesData from '../assets/assets.json';

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
      <div className="relative h-screen bg-[url('/images/hero.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-[#21284d99] opacity-100"></div> {/* Overlay */}

        <div className="absolute top-0 w-full h-full overflow-hidden">
          <NavBar />
          <div className="z-10 flex items-center justify-center flex-col px-4 mt-0 space-y-[25px]">
            <GradualSpacing
              className="font-display text-center text-4xl sm:text-4xl md:text-4xl lg:text-4xl xl:text-5xl font-bold -tracking-widest text-off dark:text-white mt-[120px] md:mt-[160px]"
              text="The Easy Way to Fix Your Home"
            />

            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 1 }}
              transition={{ delay: 0.6 }}
              className="text-lg sm:text-sm md:text-lg text-white/70 max-w-lg lg:max-w-[551px] text-center mt-8 mb-5"
            >
              {firstname ? `${firstname}, connect with trusted contractors who have the skills and experience to get the job done right` : 
              "Connect with trusted contractors who have the skills and experience to get the job done right"}
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 1 }}
              transition={{ delay: 0.6 }}
              className=" py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-xorange text-gray shadow-md shadow-[rgba(214,196,158,0.4)]"
              
              onClick={handleButtonClick}
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
              className="text-lg sm:text-sm md:text-lg text-white/70 max-w-lg lg:max-w-[551px] text-center mt-8 mb-5"
            >
              Or select a service to get started
            </motion.p>

            <div className="flex flex-wrap max-w-[1206px] justify-center mt-5" style={{ gap: '20px 30px' }}>
              {servicesData.services.map((service) => (
                <div
                  key={service.id}
                  className="flex flex-col items-center justify-center w-[256px] sm-w-[180px] h-[156px] border border-gray-300 rounded-[20px] shadow-md p-4"
                  onClick={() => handleServiceSelect(service.id)}
                >
                  <div className="w-10 h-10 mb-4 bg-white rounded-full flex items-center justify-center">
                    {/* <img src={service.photo} alt={service.name} className="w-12 h-12" /> */}
                  </div>
                  <span className="text-white text-center">{service.name}</span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
