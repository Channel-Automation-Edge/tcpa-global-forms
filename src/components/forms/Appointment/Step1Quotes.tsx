"use client";
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../context/AppContext';

// Define props interface
interface Step1QuotesProps {
  onNext: () => void;
}

const Step1Quotes: React.FC<Step1QuotesProps> = ({ onNext }) => {
  const appContext = useContext(AppContext);

  if (!appContext) {
    return null;
  }

  const { numberOfQuotes, setNumberOfQuotes } = appContext;
  const [selectedQuote, setSelectedQuote] = useState<number>(numberOfQuotes);

  const handleQuoteSelect = (quote: number) => {
    setSelectedQuote(quote);
    setNumberOfQuotes(quote);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setNumberOfQuotes(selectedQuote);
    console.log('Number of Quotes:', selectedQuote);
    onNext();
  };

  useEffect(() => {
    setSelectedQuote(numberOfQuotes);
  }, [numberOfQuotes]);

  return (
    <div className="z-10 max-w-[100rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto relative">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="block text-3xl font-bold text-primary dark:text-white">
            Request Quotes
          </h1>
          <p className="mt-1 text-gray-600 dark:text-neutral-400">
            How many quotes would you like to request?
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-12 flex flex-col h-full">
          <div
            className="flex flex-wrap justify-center"
            style={{ gap: '20px 30px', marginTop: '15px', width: '100%' }}
          >
            {[1, 2, 3].map((quote) => (
              <button
                key={quote}
                type="button"
                className={`className="flex flex-col items-center justify-center w-[200px] sm:w-[180px] md:w-[200px] lg:w-[200px] h-[120px] border border-indigo-100 rounded-[20px] shadow-md p-4 transition-transform transform hover:scale-105 bg-lpurple`}
                onClick={() => handleQuoteSelect(quote)}
                style={{
                  boxShadow: selectedQuote === quote
                    ? 'rgba(254,139,16,0.5) 0px 22px 30px -8px'
                    : 'rgba(0, 0, 0, 0.07) 0px 22px 30px -8px',
                  transition: 'box-shadow 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  if (selectedQuote !== quote) {
                    e.currentTarget.style.boxShadow = 'rgba(254,139,16,0.5) 0px 22px 30px -8px';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedQuote !== quote) {
                    e.currentTarget.style.boxShadow = 'rgba(0, 0, 0, 0.07) 0px 22px 30px -8px';
                  }
                }}
              >
                <span className="text-xpurple text-center block">{quote}</span>
              </button>
            ))}
          </div>

          <div className="mt-20 flex justify-center">
            <button
              type="submit"
              className={`w-full max-w-xs px-24 py-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent ${
                selectedQuote > 0
                  ? 'bg-xorange text-white shadow-lg shadow-[rgba(254,139,16,0.5)] transform transition-transform translate-y-[-8px]'
                  : 'bg-gray-200 text-white cursor-not-allowed'
              }`}
              disabled={selectedQuote === 0}
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Step1Quotes;
