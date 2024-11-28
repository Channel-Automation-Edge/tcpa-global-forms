"use client";
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
// import servicesData from '../assets/assets.json';
import { AppContext } from '../context/AppContext';
import Searchbox from './Searchbox';
import DotPattern from './ui/dot-pattern';
import { cn } from "@/lib/utils";


const Search: React.FC = () => {
    const navigate = useNavigate();
    const appContext = useContext(AppContext);

    if (!appContext) {
        return null; // Handle the case where appContext is not available
    }

    const { selectedService } = appContext;

    const handleButtonClick = () => {
        console.log('Resetting selected services and navigating with Initial Service:', selectedService);
        navigate('/formpage'); // Navigate to FormPage
    };
  return (
    <div className="relative overflow-hidden">
      <DotPattern
        className={cn(
          "[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]",
        )}
      />

      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-10 pt-[50px] pb-[280px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold md:text-3xl text-gray-800 dark:text-neutral-200">Your Project, Your Price – Request a Quote</h2>
          <p className="mt-3 text-gray-600 dark:text-neutral-400">
          Connect with trusted professionals and get an estimate tailored to your project needs—quick, easy, and free!
          </p>
          <div className="mt-7 sm:mt-12 mx-auto max-w-xl relative">
            {/* Form */}
            <form>
              <div className="relative z-10 flex gap-x-3 p-3 bg-white border rounded-lg shadow-lg shadow-gray-100 dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-gray-900/20">
                <div className="w-full">
                  <label
                    htmlFor="hs-search-article-1"
                    className="block text-sm text-gray-700 font-medium dark:text-white"
                  >
                    <span className="sr-only">Select a service</span>
                  </label>
                  <Searchbox />
                </div>
                <div>
                  <a
                    className="size-[46px] inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-secondary text-white hover:bg-secondary focus:outline-none focus:bg-secondary disabled:opacity-50 disabled:pointer-events-none"
                    onClick={handleButtonClick}
                  >
                    
                    <svg
                      className="shrink-0 size-5"
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
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.3-4.3" />
                    </svg>
                  </a>
                </div>
              </div>
            </form>
            {/* End Form */}

            {/* SVG Element */}
            <div className="hidden md:block absolute top-0 end-0 -translate-y-12 translate-x-20">
              <svg
                className="w-16 h-auto text-accent"
                width="121"
                height="135"
                viewBox="0 0 121 135"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 16.4754C11.7688 27.4499 21.2452 57.3224 5 89.0164"
                  stroke="currentColor"
                  strokeWidth="10"
                  strokeLinecap="round"
                />
                <path
                  d="M33.6761 112.104C44.6984 98.1239 74.2618 57.6776 83.4821 5"
                  stroke="currentColor"
                  strokeWidth="10"
                  strokeLinecap="round"
                />
                <path
                  d="M50.5525 130C68.2064 127.495 110.731 117.541 116 78.0874"
                  stroke="currentColor"
                  strokeWidth="10"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            {/* End SVG Element */}

            {/* SVG Element */}
            <div className="hidden md:block absolute bottom-0 start-0 translate-y-10 -translate-x-32">
              <svg
                className="w-40 h-auto text-accent "
                width="347"
                height="188"
                viewBox="0 0 347 188"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 82.4591C54.7956 92.8751 30.9771 162.782 68.2065 181.385C112.642 203.59 127.943 78.57 122.161 25.5053C120.504 2.2376 93.4028 -8.11128 89.7468 25.5053C85.8633 61.2125 130.186 199.678 180.982 146.248L214.898 107.02C224.322 95.4118 242.9 79.2851 258.6 107.02C274.299 134.754 299.315 125.589 309.861 117.539L343 93.4426"
                  stroke="currentColor"
                  strokeWidth="7"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            {/* End SVG Element */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;