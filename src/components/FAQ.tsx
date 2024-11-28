import React, { useState } from 'react';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    id: 1,
    question: "What areas do you serve?",
    answer: "We serve to connect you with various service providers covering a wide range of areas, including [list specific cities, states, or regions]. If you're unsure if your area is covered, please contact us and we'll be happy to let you know.",
  },
  {
    id: 2,
    question: "How do I find a contractor on your website?",
    answer: "Our website automatically matches you to available contractors by your location, service, or name. We have a database of independent contractors who have registered on our website to make their information available to homeowners like you.",
  },
  {
    id: 3,
    question: "How do I know if a contractor on your website is reliable and trustworthy?",
    answer: "We take steps to verify the credentials and qualifications of the contractors who register on our website. However, we are not responsible for the work or services provided by these contractors. We recommend that you do your own research and due diligence before hiring a contractor.",
  },
  {
    id: 4,
    question: "What is the process for getting a quote from a contractor on your website?",
    answer: "You can contact a contractor directly through our website to request a quote. The contractor will then contact you to discuss your project and provide a detailed quote.",
  },
  {
    id: 5,
    question: "Do you offer any guarantees or warranties on the work of the contractors on your website?",
    answer: "No, we do not offer any guarantees or warranties on the work of the contractors on our website. We are a platform that connects homeowners with independent contractors, and we are not responsible for the work or services provided by these contractors. Notwithstanding, most of the contractors who register with us offer such guarantees or warranties. You may ask them about it during a free in-home consultation.",
  },
  {
    id: 6,
    question: "How do I file a complaint about a contractor on your website?",
    answer: "If you have a complaint about a contractor on our website, please contact us and we will do our best to resolve the issue. However, please note that we are not responsible for the work or services provided by these contractors.",
  },
  {
    id: 7,
    question: "How do I manage communication after I've been contacted by a contractor?",
    answer: "Our platform facilitates the initial connection. After a contractor contacts you, you'll communicate with them directly and can manage your preferences (e.g., frequency, method of contact) with them individually.",
  },
];

const FAQ: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      {/* Grid */}
      <div className="grid md:grid-cols-5 gap-10">
        <div className="md:col-span-2">
          <div className="max-w-xs">
            <h2 className="text-2xl font-bold md:text-4xl md:leading-tight dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="mt-1 hidden md:block text-gray-600 dark:text-neutral-400">
              Here are some of the most common questions we receive.
            </p>
          </div>
        </div>
        {/* End Col */}

        <div className="md:col-span-3">
          {/* Accordion */}
          <div className="hs-accordion-group divide-y divide-gray-200 dark:divide-neutral-700">
            {faqData.map((item, index) => (
              <div className="hs-accordion pt-6 pb-3" key={item.id}>
                <button
                  className="hs-accordion-toggle group pb-3 inline-flex items-center justify-between gap-x-3 w-full md:text-lg font-semibold text-start text-gray-800 rounded-lg transition hover:text-gray-500 focus:outline-none focus:text-gray-500 dark:text-neutral-200 dark:hover:text-neutral-400 dark:focus:text-neutral-400"
                  aria-expanded={activeIndex === index}
                  aria-controls={`hs-basic-with-title-and-arrow-stretched-collapse-${item.id}`}
                  onClick={() => toggleAccordion(index)}
                >
                  {item.question}
                  <svg
                    className={`hs-accordion-active:${activeIndex === index ? 'block' : 'hidden'} shrink-0 size-5 text-gray-600 group-hover:text-gray-500 dark:text-neutral-400`}
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
                    <path d={`m${activeIndex === index ? '18 15-6-6-6 6' : '6 9 6 6 6-6'}`} />
                  </svg>
                </button>
                <div
                  id={`hs-basic-with-title-and-arrow-stretched-collapse-${item.id}`}
                  className={`hs-accordion-content ${activeIndex === index ? 'block' : 'hidden'} w-full overflow-hidden transition-[height] duration-300`}
                  role="region"
                  aria-labelledby={`hs-basic-with-title-and-arrow-stretched-heading-${item.id}`}
                >
                  <p className="text-gray-600 dark:text-neutral-400">
                    {item.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {/* End Accordion */}
        </div>
        {/* End Col */}
      </div>
      {/* End Grid */}
    </div>
  );
};

export default FAQ;
