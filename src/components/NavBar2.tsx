"use client";
import { useContext, useEffect, useState } from 'react'; 
import { AppContext } from '@/context/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';
import useClearFormState from '@/hooks/useClearFormState.tsx';

const NavBar2 = () => {
  const appContext = useContext(AppContext);
  const location = useLocation();
  const navigate = useNavigate();
  const clearFormState = useClearFormState();

  if (!appContext) {
    return null; 
  }

  const { contractor, setForm, form } = appContext;
  const [slug, setSlug] = useState('');

  useEffect(() => {
    if (appContext && appContext.contractor) {
      setSlug(appContext.contractor.slug);
    }
  }, [appContext, appContext.contractor]);

  const logoSrc = appContext.contractor.content.logo || '/images/logo.png';

  // Function to append current URL parameters
  const navigateWithParams = (path: string) => {
    const currentParams = new URLSearchParams(location.search);
    navigate(`${path}?${currentParams.toString()}`);
  };

  // Function to generate a random string
  const generateRandomString = (length: number): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  const handleButtonClick = () => {
    let formId = form.formId;

    // If formId is not set, create a new formId
    if (!formId) {
      clearFormState();

      const dateTime = new Date().toISOString().replace(/[-:.T]/g, '').slice(0, 14); // YYYYMMDDHHMMSS format
      const randomString = generateRandomString(6);

      formId = `${contractor.id}-${dateTime}-${randomString}`;
      console.log('Generated formId:', formId);
    } else {
      console.log('Using existing form ID:', formId);
    }

    // Update the form and user object in context
    setForm((prevForm) => ({
      ...prevForm,
      formId: formId,
    }));
    navigateWithParams(`/request-quotes/${slug}`);
  };

  // Create the new URL with preserved query parameters
  const currentParams = new URLSearchParams(location.search);
  const newUrl = `/${slug}?${currentParams.toString()}`;

  return (
    <div className="sticky top-0 bg-white z-50 shadow-md">
      <header className="">
        <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="md:flex md:items-center md:gap-12 ">
              <a className="block text-accent" href={newUrl}>
                <span className="sr-only">Home</span>
                <img src={logoSrc} alt="Logo" className="h-full max-h-16 max-w-48 sm:max-w-72" />
              </a>
            </div>
            <div className='flex items-center justify-end gap-2 sm:gap-4'>
              <div className="flex items-center gap-4">
                <div className="flex sm:gap-4">
                  <a
                    className="rounded-md bg-transparent pl-4 py-2.5 text-sm font-medium text-gray-800 hover:text-accentColor inline-flex items-center"
                    href="tel:+18594075999"
                  >
                    <svg id="fi_5585856" height="512" viewBox="0 0 512 512" width="512" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" className="w-6 h-6 mr-2 text-accentColor">
                      <path d="m256 0c141.385 0 256 114.615 256 256s-114.615 256-256 256-256-114.615-256-256 114.615-256 256-256zm150.3 374.436a19.622 19.622 0 0 0 0-27.678l-50.111-50.1a19.63 19.63 0 0 0 -27.69 0l-13.617 13.623a29.8 29.8 0 0 1 -35.245 5.279 200.184 200.184 0 0 1 -83.193-83.183 29.82 29.82 0 0 1 5.27-35.257l13.643-13.62a19.631 19.631 0 0 0 0-27.685l-50.111-50.095a19.629 19.629 0 0 0 -27.691 0c-2.071 2.065-4.691 4.56-7.493 7.2-7.007 6.623-15.749 14.866-19.283 20.048-18.613 27.239-9.687 63.681 1.036 89.459 14.165 33.977 40.271 71 73.536 104.242 33.235 33.238 70.246 59.347 104.242 73.512 25.772 10.738 62.2 19.642 89.438 1.033 5.179-3.537 13.434-12.258 20.044-19.274 2.651-2.797 5.148-5.44 7.225-7.504z" fill="currentColor" fillRule="evenodd"></path>
                    </svg>
                    Call Us
                  </a>
                </div>
                

                {/* <div className="block md:hidden">
                <button className="rounded bg-gray-100 p-2 text-gray-600 transition hover:text-gray-600/75">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                </div> */}
              </div>
              <div className="hidden sm:block sm:gap-4">
                <button className="rounded-lg bg-accentColor px-4 py-3 text-sm font-medium text-white hover:bg-accentDark inline-flex items-center" onClick={handleButtonClick}>Get a Free Quote
                </button>
              </div>
            </div>

          </div>
        </div>
      </header>
    </div>
  );
}

export default NavBar2;
