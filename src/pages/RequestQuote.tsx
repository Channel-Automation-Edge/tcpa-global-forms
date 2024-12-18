// import React, { useState, useEffect, useRef } from 'react';
import ParentForm from "@/components/forms/ParentForm";
// import { useLocation } from 'react-router-dom';

const RequestQuote = () => {
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const modalRef = useRef<HTMLDivElement>(null);
  // const location = useLocation();

  // const handleCancel = () => {
  //   setIsModalOpen(false);
  //   window.history.pushState(null, '', window.location.pathname + window.location.search); // Restore the current state with parameters
  // };

  // const handleConfirm = () => {
  //   setIsModalOpen(false);
  //   const params = window.location.search; // Get current URL parameters
  //   window.location.href = '/' + params; // Redirect to home with existing URL parameters
  // };

  // const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
  //   if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
  //     handleCancel();
  //   }
  // };

  // useEffect(() => {
  //   const handlePopState = () => {
  //     setIsModalOpen(true);
  //     window.history.pushState(null, '', window.location.pathname + window.location.search); // Push state to prevent navigation
  //   };

  //   window.history.pushState(null, '', window.location.pathname + window.location.search); // Initial push to track back navigation
  //   window.addEventListener('popstate', handlePopState);

  //   return () => {
  //     window.removeEventListener('popstate', handlePopState);
  //   };
  // }, [location.pathname, location.search]);

  return (
    <div>
      <ParentForm />

      {/* {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={handleBackdropClick}>
          <div ref={modalRef} className="bg-white rounded-xl overflow-hidden shadow-md w-full max-w-md transform transition-transform duration-300 scale-95 zoom-in">
            <div className="flex justify-between items-center px-4 py-4 border-b">
              <h3 className="font-bold text-gray-800">Wait!</h3>
              <button onClick={handleCancel} className="text-gray-500 hover:text-gray-700">
                <svg className="shrink-0 size-5" fill="none" width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
                  <path d="M18 6 L6 18"></path>
                  <path d="M6 6 L18 18"></path>
                </svg>
              </button>
            </div>
            <div className="p-4">
              <p className="text-gray-800">
                You're only a few steps away from receiving your free consultation. Don't worry, your progress will be saved.
              </p>
            </div>
            <div className="flex justify-end items-center gap-x-2 px-4 py-3 border-t">
              <button onClick={handleCancel} className="py-2 px-3 bg-white text-gray-800 text-sm font-medium rounded-lg border border-gray-200 shadow-sm hover:bg-gray-50">Cancel</button>
              <button onClick={handleConfirm} className="py-2 px-3 bg-xorange text-white rounded-lg text-sm font-medium hover:bg-xorangeDark">Proceed</button>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default RequestQuote;
