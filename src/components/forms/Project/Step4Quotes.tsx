"use client";
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../context/AppContext';

// Define props interface
interface Step4QuotesProps {
  onNext: () => void;
  onBack: () => void;
}

const Step4Quotes: React.FC<Step4QuotesProps> = ({ onNext, onBack }) => {
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
      <button onClick={onBack} className="absolute left-4 top-1/2 transform -translate-y-1/2">
        <img src="/images/back.png" alt="Go Back" className="w-6 h-6" />
      </button>
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
                className="eIzKEG transition-transform transform hover:scale-105"
                onClick={() => handleQuoteSelect(quote)}
                style={{
                  margin: '0px 0px 10px',
                  width: '170px',
                  height: '100px',
                  overflow: 'hidden',
                  display: 'inline-block',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  position: 'relative',
                  userSelect: 'none',
                  justifyContent: 'center',
                  alignItems: 'center',
                  border: '1px solid rgba(236, 236, 236, 0.43)',
                  boxShadow: selectedQuote === quote
                    ? 'rgba(254,79,0,0.5) 0px 22px 30px -8px'
                    : 'rgba(0, 0, 0, 0.07) 0px 22px 30px -8px',
                  transition: 'box-shadow 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  if (selectedQuote !== quote) {
                    e.currentTarget.style.boxShadow = 'rgba(254,79,0,0.5) 0px 22px 30px -8px';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedQuote !== quote) {
                    e.currentTarget.style.boxShadow = 'rgba(0, 0, 0, 0.07) 0px 22px 30px -8px';
                  }
                }}
              >
                <span className="text-[#2E5B5E] text-center block">{quote}</span>
              </button>
            ))}
          </div>

          <div className="mt-20 flex justify-center">
            <button
              type="submit"
              className={`w-full max-w-xs px-24 py-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent ${
                selectedQuote > 0
                  ? 'bg-[#FE4F00] text-white shadow-lg shadow-[rgba(254,79,0,0.5)] transform transition-transform translate-y-[-8px]'
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

export default Step4Quotes;
