"use client";
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../context/AppContext';

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

  const getBadgeText = (quote: number) => {
    switch (quote) {
      case 1:
        return "Basic";
      case 2:
        return "Optimal";
      case 3:
        return "Comprehensive";
      default:
        return "";
    }
  };

  return (
    <div className="z-10 max-w-[100rem] px-4 lg:px-14 py-10 lg:py-14 mx-auto relative">
      <div className="space-y-8">
        <div className='flex justify-center text-center mb-8'>
          <div className="max-w-[40rem] text-center">
            <h1 className="block text-2xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-3xl font-bold sm:font-bold md:font-semibold lg:font-semibold text-gray-800 dark:text-white">
            How many free consultations would you like to schedule? Each one will be handled by a <span className="text-xorange">dedicated expert</span>!
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-12 flex flex-col h-full">
        <div className="flex flex-wrap justify-center gap-4 sm:gap-[20px]" style={{ marginTop: '15px', width: '100%' }}>
  {[1, 2, 3].map((quote) => (
    <button
      key={quote}
      type="button"
      className="flex flex-row sm:flex-col items-center justify-start sm:justify-center w-full sm:w-[200px] h-[80px] sm:h-[120px] border border-transparent rounded-xl shadow-md p-4 transition-transform transform hover:scale-100 sm:hover:scale-105 bg-white"
      onClick={() => handleQuoteSelect(quote)}
      style={{
        boxShadow: selectedQuote === quote
          ? 'rgba(255, 81, 0, 0.7) 0px 10px 25px -6px'
          : 'rgba(0, 0, 0, 0.07) 0px 22px 30px -6px',
        transition: 'box-shadow 0.3s ease',
        borderColor: selectedQuote === quote
          ? 'rgba(255, 81, 0, 0.7)'
          : 'rgba(157, 176, 197, 0.25)',
      }}
      onMouseEnter={(e) => {
        if (selectedQuote !== quote) {
          e.currentTarget.style.boxShadow = 'rgba(255, 81, 0, 0.7) 0px 10px 25px -6px';
          e.currentTarget.style.borderColor = 'rgba(255, 81, 0, 0.7)';
        }
      }}
      onMouseLeave={(e) => {
        if (selectedQuote !== quote) {
          e.currentTarget.style.boxShadow = 'rgba(0, 0, 0, 0.07) 0px 22px 30px -6px';
          e.currentTarget.style.borderColor = 'rgba(157, 176, 197, 0.25)';
        }
      }}
    >
      <span className="text-gray-800 text-base font-medium text-center sm:text-left">{quote}</span>
      <span className="ml-4 sm:ml-0 text-xs font-semibold text-gray-700">{getBadgeText(quote)}</span>
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
