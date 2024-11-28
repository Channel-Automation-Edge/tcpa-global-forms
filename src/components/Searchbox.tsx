import React, { useState, useContext, useEffect, useRef } from 'react';
import { AppContext } from '../context/AppContext';
import servicesData from '../assets/assets.json';

const Searchbox: React.FC = () => {
  const appContext = useContext(AppContext);
  const comboBoxRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [filteredServices, setFilteredServices] = useState(servicesData.services);

  if (!appContext) {
    return null;
  }

  const { selectedService, setSelectedService } = appContext;

  useEffect(() => {
    console.log('Updated Initial Service:', selectedService);
  }, [selectedService]);

  useEffect(() => {
    const filterServices = () => {
      const lowerCaseQuery = query.toLowerCase();
      setFilteredServices(
        servicesData.services.filter(service =>
          service.name.toLowerCase().includes(lowerCaseQuery) ||
          service.type.toLowerCase().includes(lowerCaseQuery)
        )
      );
    };

    filterServices();
  }, [query]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsOpen(true);
  };

  const handleInputFocus = () => {
    if (query.trim() === '') {
      setFilteredServices(servicesData.services);
    }
    setIsOpen(true);
  };

  const handleSelectChange = (serviceName: string, serviceId: number) => {
    setSelectedService(serviceId);
    setQuery(serviceName);
    setIsOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (comboBoxRef.current && !comboBoxRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full" ref={comboBoxRef}>
      <input
        type="text"
        name="hs-search-article-1"
        id="hs-search-article-1"
        className="py-2.5 px-4 block w-full border-transparent rounded-lg focus:border-secondary focus:ring-secondary dark:bg-neutral-900 dark:border-transparent dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
        placeholder="Select a service"
        value={query}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
      />
      {isOpen && filteredServices.length > 0 && (
        <div
          className="absolute z-[9999] w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto dark:bg-neutral-900 dark:border-neutral-700"
        >
          {filteredServices.map(service => (
            <div
              key={service.id}
              className="cursor-pointer py-2 px-4 w-full text-sm text-left text-gray-800 hover:bg-gray-100 rounded-lg focus:outline-none focus:bg-gray-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-200 dark:focus:bg-neutral-800"
              onClick={() => handleSelectChange(service.name, service.id)}
              role="option"
            >
              {service.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Searchbox;
