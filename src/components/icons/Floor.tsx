import React, { useContext } from 'react';
import { AppContext } from '@/context/AppContext';

const Flooring: React.FC = () => {
  const appContext = useContext(AppContext);
  if (!appContext) {
    return null;
  }
  const { contractor } = appContext;
  const { accent, dark, darker } = contractor.content;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width="512"
      height="512"
      x="0"
      y="0"
      viewBox="0 0 512 512"
      xmlSpace="preserve"
      className="w-12 h-12 sm:w-14 sm:h-14 sm:mb-4 ml-2 mr-4 sm:ml-0 sm:mr-0"
    >
      <g>
        <path
          fill={dark}
          d="m467.863 300.586 43.375-11.637c.45-.12.762-.531.762-.996V165.285c0-10.824-8.773-19.598-19.598-19.598H119.066c-10.824 0-19.593 8.774-19.593 19.598v185.39c0 10.825 8.77 19.598 19.593 19.598h373.336c10.825 0 19.598-8.773 19.598-19.597v-28.38c0-.41-.246-.78-.621-.944l-43.656-18.825c-.899-.386-.805-1.687.14-1.941zm0 0"
          opacity="1"
          className=""
        />
        <path
          fill={darker}
          d="M398.996 250.34c21.125 0 38.254-17.125 38.254-38.254v-66.399H119.066c-10.82 0-19.593 8.774-19.593 19.598v85.055zm0 0"
          opacity="1"
          className=""
        />
        <path
          fill={accent}
          d="M392.934 0H19.598C8.773 0 0 8.773 0 19.598v185.394c0 10.82 8.773 19.594 19.598 19.594h373.336c10.82 0 19.593-8.774 19.593-19.594V19.598C412.527 8.773 403.754 0 392.934 0zm0 0"
          opacity="1"
          className=""
        />
        <path
          fill={dark}
          d="M412.527 118.91V96.22c-8.015 9.957-22.582 24.828-30.859 32-31.043 26.926-71.836 43.988-114.863 48.054-31.903 3-63.067-.855-100.5-6.21l-2.742-.395c-32.938-4.703-67-9.566-101.028-7.29-21.078 1.419-45.078 8.774-62.535 15.919v16.308c17.531-7.812 43.129-15.886 63.54-17.257 32.46-2.18 65.73 2.574 97.901 7.172l2.739.39c30.218 4.324 67.824 9.707 104.03 6.297 46.114-4.355 89.9-22.7 123.282-51.652 5.61-4.86 13.668-12.774 21.035-20.645zM0 24.672C30.523 28.129 60.566 44.05 89.664 59.48c10.734 5.692 20.871 11.067 31.086 15.88 21.555 10.148 43.313 16.203 64.668 17.995a88.01 88.01 0 0 0 7.656.329c16.485 0 30.852-4.72 41.02-13.594 7.687-6.719 11.87-15.64 12.422-26.512.547-10.734-2.653-23.379-9.246-36.558-2.883-5.758-6.375-11.524-10.254-17.02h-18.942c12.457 14.71 24.309 36.195 23.461 52.816-.344 6.75-2.734 11.977-7.308 15.973-11.63 10.152-28.512 10.387-37.547 9.617-19.575-1.64-39.606-7.234-59.54-16.62-9.89-4.657-19.874-9.954-30.449-15.56C66.832 30.392 36.016 14.052 3.305 9.95c-.2-.09-.403-.168-.61-.238A19.485 19.485 0 0 0 0 19.598zm0 0"
          opacity="1"
          className=""
        />
        <path
          fill={dark}
          d="M296.008 38.184c6.105 26.898-.516 53.742-16.863 68.39-12.461 11.164-29.133 14.844-40.926 15.961-14.817 1.406-30.317-.187-45.301-1.726l-2.55-.262c-52.466-5.363-108.782-9.227-165.15-1.258-8.066 1.137-18.484 3.195-25.218 4.594v15.328c8.648-1.84 19.707-4 27.313-5.07 54.785-7.739 110.011-3.938 161.53 1.324l2.54.262c15.71 1.617 31.957 3.285 48.25 1.742 20.129-1.91 37.25-8.73 49.52-19.727 10.71-9.594 18.242-22.937 21.78-38.594 3.184-14.085 3.083-29.398-.296-44.285-2.098-9.265-7.785-23.156-13.168-34.863h-16.574c5.933 12.27 12.96 28.684 15.113 38.184zm0 0"
          opacity="1"
          className=""
        />
        <g fill={darker}>
          <path d="M99.473 279.172h97.437c4.145 0 7.5-3.356 7.5-7.5s-3.355-7.5-7.5-7.5H99.473zM512 184.754h-33.695a7.497 7.497 0 0 0-7.5 7.5c0 4.144 3.355 7.5 7.5 7.5H512zM467.723 302.527c-.899-.386-.805-1.687.14-1.941l25.094-6.734H302.684a7.5 7.5 0 0 0-7.5 7.5c0 4.144 3.355 7.5 7.5 7.5h179.71zm0 0" />
        </g>
      </g>
    </svg>
  );
};

export default Flooring;
