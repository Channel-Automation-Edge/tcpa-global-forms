"use client";
import React, { useContext } from 'react';
import { AppContext } from '../../../context/AppContext';
import servicesData from '../../../assets/assets.json';

// Define props interface
interface Step3InvoiceProps {
  onNext: () => void;
}

const Step3Invoice: React.FC<Step3InvoiceProps> = ({ onNext }) => {
  const appContext = useContext(AppContext);

  if (!appContext) {
    return null;
  }

  const {
    firstname,
    lastname,
    email,
    phone,
    zip,
    state,
    selectedService,
    serviceSpecifications,
    promo,
    numberOfQuotes,
  } = appContext;

  const currentDate = new Date();
  const proposalDate = currentDate.toLocaleDateString();
  const offerValidUntil = new Date(currentDate.setDate(currentDate.getDate() + 20)).toLocaleDateString();

  const selectedServiceName = servicesData.services.find(service => service.id === selectedService)?.name || 'Service';

  return (
    <div className="z-10 max-w-[100rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto relative">
      <div className="max-w-xl mx-auto">
        <div className="text-center">
          <h1 className="block text-3xl font-bold text-primary dark:text-white">
            Review Our Proposal
          </h1>
          <p className="mt-1 text-gray-600 dark:text-neutral-400">
            Please review the details below before submitting your request.
          </p>
        </div>

        <div className="mt-6 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8 bg-white">
          <div>
            <p className="text-sm text-gray-700 dark:text-white">Prepared for: {firstname} {lastname}</p>
            <p className="text-sm text-gray-700 dark:text-white">Email: {email}</p>
            <p className="text-sm text-gray-700 dark:text-white">Phone: {phone}</p>
            <p className="text-sm text-gray-700 dark:text-white">ZIP Code: {zip}</p>
            <p className="text-sm text-gray-700 dark:text-white">State: {state}</p>
          </div>
          <div>
            <p className="text-sm text-gray-700 dark:text-white">Proposal Date: {proposalDate}</p>
            <p className="text-sm text-gray-700 dark:text-white">Offer valid until: {offerValidUntil}</p>
          </div>

          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{selectedServiceName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Pending</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Dedicated Project Manager</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Included</td>
              </tr>
              {serviceSpecifications.map((spec, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{spec}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Pending</td>
                </tr>
              ))}
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Professional Contractors</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Included</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Priority Service</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Included</td>
              </tr>
            </tbody>
          </table>

          <div className="mt-4">
            <p className="text-sm text-gray-700 dark:text-white">Subtotal: Pending Final Review</p>
            {promo && <p className="text-sm text-gray-700 dark:text-white">Promo: {promo}</p>}
            <p className="text-sm text-gray-700 dark:text-white">Total: Pending Final Review</p>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-700 dark:text-white">
              Thank you, {firstname} {lastname}! We just need a bit more information to finalize your request. Please proceed to schedule your FREE appointment{numberOfQuotes > 1 ? 's' : ''} with our professional contractors. We'll match you with top contractors in your area. Alternatively, feel free to give us a call
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row justify-between sm:space-x-4 space-y-4 sm:space-y-0">
          <button
            type="button"
            className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-gray-600 text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
          >
            Call Us
          </button>
          <button
            type="button"
            onClick={onNext}
            className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-xorange text-white shadow-lg shadow-[rgba(102,89,83,0.5)]"
          >
            Claim Free Consultation
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default Step3Invoice;
