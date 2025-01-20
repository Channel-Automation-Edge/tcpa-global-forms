import React, { useContext } from 'react';
import { AppContext } from '@/context/AppContext';

const Garage: React.FC = () => {
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
      viewBox="0 0 512.001 512"
      xmlSpace="preserve"
      className="w-12 h-12 sm:w-14 sm:h-14 sm:mb-4 ml-2 mr-4 sm:ml-0 sm:mr-0"
    >
      <g>
        <path
          fill={dark}
          d="M499.324 398.523H12.676c-7 0-12.676-5.671-12.676-12.671V87.64a10.27 10.27 0 0 1 7.172-9.793L250.406.863a18.547 18.547 0 0 1 11.192 0l243.23 76.985A10.27 10.27 0 0 1 512 87.64v298.21c0 7-5.676 12.672-12.676 12.672zm0 0"
          opacity="1"
          className=""
        />
        <path
          fill={darker}
          d="M504.828 77.848 261.594.863a18.547 18.547 0 0 0-11.192 0L231.43 6.871l224.257 70.977a10.274 10.274 0 0 1 7.172 9.793v310.882h36.465c7 0 12.676-5.671 12.676-12.671V87.64a10.27 10.27 0 0 0-7.172-9.793zm0 0"
          opacity="1"
          className=""
        />
        <path
          fill="#ffffff"
          d="M452.094 398.523H57.945V110.266a9 9 0 0 1 9-9h376.149a9 9 0 0 1 9 9zm0 0"
          opacity="1"
          className=""
        />
        <path
          fill="#ffffff"
          d="M442.773 101.266H413.18c6.785 0 12.285 5.5 12.285 12.285v284.972h26.629V110.586c0-5.145-4.172-9.32-9.32-9.32zm0 0"
          opacity="1"
          className=""
        />
        <path
          fill={darker}
          d="M442.773 101.266H67.262c-5.145 0-9.32 4.175-9.32 9.32v54.488h394.152v-54.488c0-5.145-4.172-9.32-9.32-9.32zm0 0"
          opacity="1"
          className=""
        />
        <path
          fill={darker}
          d="M442.773 101.266H413.18c6.785 0 12.285 5.5 12.285 12.285v51.523h26.629v-54.488c0-5.145-4.172-9.32-9.32-9.32zm0 0"
          opacity="1"
          className=""
        />
        <path
          fill="#ffffff"
          d="M369.895 299.602H138.48l17.793-76.153c2.942-12.594 14.172-21.504 27.106-21.504h141.613c12.934 0 24.164 8.91 27.11 21.504zm0 0"
          opacity="1"
          className=""
        />
        <path
          fill="#ffffff"
          d="M352.102 223.453c-2.946-12.598-14.176-21.504-27.11-21.504h-12.531l9.8 41.938c1.321 5.648-2.964 11.047-8.761 11.047H148.914l-10.434 44.668h231.415zm0 0"
          opacity="1"
          className=""
        />
        <path
          fill={dark}
          d="M395.223 242.047h-30.801l-4.758-20.363c-3.785-16.196-18.043-27.504-34.672-27.504H183.38c-16.629 0-30.887 11.308-34.668 27.504l-4.758 20.363h-30.8c-4.29 0-7.766 3.476-7.766 7.766s3.476 7.765 7.765 7.765h27.172l-5.277 22.59h15.95l12.839-54.95a19.994 19.994 0 0 1 19.547-15.507h141.61a19.994 19.994 0 0 1 19.546 15.508l12.84 54.949h15.95l-5.278-22.59h27.172a7.765 7.765 0 0 0 0-15.531zm0 0"
          opacity="1"
          className=""
        />
        <path
          fill={darker}
          d="M175.563 398.453H157.28c-5.8 0-10.5-4.703-10.5-10.5v-22.297h39.781v21.797c0 6.074-4.921 11-11 11zM350.594 398.453h-18.285c-5.797 0-10.5-4.703-10.5-10.5v-22.297h39.785v21.797c0 6.074-4.926 11-11 11zm0 0"
          opacity="1"
          className=""
        />
        <path
          fill={darker}
          d="M173.906 365.656v20.137c0 6.992-5.668 12.66-12.66 12.66h13.93c6.289 0 11.39-5.101 11.39-11.39v-21.407zM348.934 365.656v20.137c0 6.992-5.668 12.66-12.657 12.66h13.926c6.29 0 11.39-5.101 11.39-11.39v-21.407zm0 0"
          opacity="1"
          className=""
        />
        <path
          fill={accent}
          d="M374.934 367.824H134.438c-8.282 0-15-6.715-15-15v-73.187c0-8.285 6.718-15 15-15h240.496c7.734 0 14 6.265 14 14v75.187c0 7.735-6.266 14-14 14zm0 0"
          opacity="1"
          className=""
        />
        <path
          fill={dark}
          d="M374.438 264.637h-32.102v74.195c0 8.008-6.492 14.496-14.496 14.496H119.492c.535 8.094 7.25 14.496 15.48 14.496h239.465c8.008 0 14.497-6.488 14.497-14.496v-74.195c0-8.008-6.489-14.496-14.497-14.496zm0 0"
          opacity="1"
          className=""
        />
        <path
          fill={dark}
          d="M183.531 309.734c0 10.926-8.86 19.782-19.785 19.782-10.922 0-19.781-8.856-19.781-19.782s8.86-19.78 19.781-19.78c10.926 0 19.785 8.855 19.785 19.78zM364.406 309.734c0 10.926-8.855 19.782-19.781 19.782s-19.781-8.856-19.781-19.782 8.855-19.78 19.781-19.78 19.781 8.855 19.781 19.78zm0 0"
          opacity="1"
          className=""
        />
        <path
          fill={darker}
          d="M167.488 290.316a19.678 19.678 0 0 1 2.317 9.286c0 10.925-8.856 19.78-19.782 19.78-1.28 0-2.527-.132-3.738-.362 3.324 6.242 9.895 10.496 17.461 10.496 10.926 0 19.785-8.856 19.785-19.782 0-9.644-6.91-17.668-16.043-19.418zM348.363 290.316a19.681 19.681 0 0 1 2.32 9.286c0 10.925-8.859 19.78-19.785 19.78-1.277 0-2.527-.132-3.738-.362 3.328 6.242 9.899 10.496 17.465 10.496 10.926 0 19.781-8.856 19.781-19.782 0-9.644-6.906-17.668-16.043-19.418zm0 0"
          opacity="1"
          className=""
        />
        <path
          fill={dark}
          d="M297.602 342.012h-86.829a3 3 0 0 1-3-3v-18.985c0-1.66 1.344-3 3-3h86.829c1.656 0 3 1.34 3 3v18.985a3 3 0 0 1-3 3zm0 0"
          opacity="1"
          className=""
        />
        <path
          fill={darker}
          d="M296.984 317.023h-12.96a3.62 3.62 0 0 1 3.617 3.618v17.754a3.617 3.617 0 0 1-3.618 3.617h12.961a3.62 3.62 0 0 0 3.618-3.617V320.64a3.62 3.62 0 0 0-3.618-3.618zm0 0"
          opacity="1"
          className=""
        />
      </g>
    </svg>
  );
};

export default Garage;
