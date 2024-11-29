"use client";
import React from 'react';
import { motion } from 'framer-motion';

const HowItWorks: React.FC = () => {
  return (
    <div className='bg-xbg'>
      <div className="max-w-[85rem] grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 py-10 lg:py-20 px-4 sm:px-6 lg:px-8 mx-auto">
      
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 1 }} transition={{ delay: 0.6 }}>
        <div className="relative flex sm:pe-6">
          <img src="/images/step1.svg" alt="Step 1" className="shrink-0 size-10 mt-1" />
          <div className="ms-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">1: Tell Us What You Need</h3>
            <p className="mt-1 text-gray-600 dark:text-neutral-400">
            Let us know what your home needs. We’re here to help with projects big and small.
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 1 }} transition={{ delay: 0.7 }}>
        <div className="relative flex sm:pe-6">
          <img src="/images/step2.svg" alt="Step 2" className="shrink-0 size-10 mt-1" />
          <div className="ms-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">2: View Local Contractors</h3>
            <p className="mt-1 text-gray-600 dark:text-neutral-400">
            You’ll see a list of experts who can make your vision a reality.
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 1 }} transition={{ delay: 0.8 }}>
        <div className="relative flex sm:pe-6">
          <img src="/images/step3.svg" alt="Step 3" className="shrink-0 size-10 mt-1" />
          <div className="ms-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">3: Get Contacted for a Free Estimate</h3>
            <p className="mt-1 text-gray-600 dark:text-neutral-400">
            The experts you select will reach out to set up an estimate 
            </p>
          </div>
        </div>
      </motion.div>

    </div>
    </div>
    
  );
};

export default HowItWorks;
