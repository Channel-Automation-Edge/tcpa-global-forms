"use client";
import React, { useContext } from 'react';
import { AppContext } from '../../../context/AppContext';
import servicesData from '../../../assets/assets.json';

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

        <div className='flex justify-center text-center mb-8'>
          <div className="max-w-[40rem] text-center">
            <h1 className="block text-2xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-3xl font-bold sm:font-bold md:font-semibold lg:font-semibold text-gray-800 dark:text-white">
            Take a look at our proposal and let's connect you with the <span className="text-xorange">right experts</span> for your free consultation!
            </h1>
          </div>
        </div>

        <div className="mt-6 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8 bg-white">
        <div className="flex justify-between items-center mb-6">
          <img src="/images/logodark.svg" alt="Logo" className="h-10" />
          <h1 className="text-xl font-bold text-gray-700 dark:text-white">Proposal</h1>
        </div>
          <div className="text-sm text-gray-700 dark:text-neutral-400">
            <p>Prepared for: {firstname} {lastname}</p>
            <p>Email: {email}</p>
            <p>Phone: {phone}</p>
            <p>ZIP Code: {zip}</p>
            <p>State: {state}</p>
            <div className="mt-4">
              <p>Proposal Date: {proposalDate}</p>
              <p>Offer valid until: {offerValidUntil}</p>
            </div>
          </div>

          <table className="min-w-full divide-y divide-gray-200 mt-4">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Item</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{selectedServiceName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">Pending</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Dedicated Project Manager</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">Included</td>
              </tr>
              {serviceSpecifications.map((spec, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{spec}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">Pending</td>
                </tr>
              ))}
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Professional Contractors</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">Included</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Priority Service</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">Included</td>
              </tr>
            </tbody>
          </table>

          <div className="mt-4">
            <p className="text-sm text-gray-900">Subtotal: <span className='text-red-600'>Pending Final Review</span></p>
            {promo && <p className="text-sm text-gray-900 dark:text-neutral-400">Promo: <span className='text-green-600'>{promo}</span></p>}
            <p className="text-sm text-gray-900">Total: <span className='text-red-600'>Pending Final Review</span></p>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-700 dark:text-white">
              Thank you, {firstname} {lastname}! We just need a bit more information to finalize your request. Please proceed to schedule your FREE appointment{numberOfQuotes > 1 ? 's' : ''} with our professional contractors. We'll match you with top contractors in your area. Alternatively, feel free to give us a call.
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
