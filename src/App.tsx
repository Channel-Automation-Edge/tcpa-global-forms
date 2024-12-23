import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home';
import RequestQuote from './pages/RequestQuote';
import ThankYou from './pages/ThankYou';
import "preline/preline";
import { IStaticMethods } from "preline/preline";
import { useContext, useEffect } from 'react';
import ConfirmDetails from './pages/ConfirmDetails';
import CookiePolicy from './pages/CookiePolicy';
import PrivacyPolicy from './pages/PrivacyPolicy';
import "vanilla-cookieconsent/dist/cookieconsent.css";
import * as CookieConsent from "vanilla-cookieconsent";
import supabase from '@/lib/supabaseClient';
import { AppContext } from '@/context/AppContext';


declare global {
  interface Window {
    HSStaticMethods: IStaticMethods;
  }
}


function App() {
  const location = useLocation();
  const appContext = useContext(AppContext);
  
  if (!appContext) {
    return null;
  }

  const { setCookiesAccepted, setCookieConsentId } = appContext;

  useEffect(() => {
    window.HSStaticMethods.autoInit();
  }, [location.pathname]);

  // Function to send a webhook with error details
  const sendErrorWebhook = async (message: string, error: any) => {
    try {
      const response = await fetch('https://hkdk.events/09d0txnpbpzmvq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: {
            message,
            details: error.message || error,
          },
          form: appContext.formId,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        console.error('Failed to send error webhook');
      } else {
        console.log('Error webhook sent successfully');
      }
    } catch (webhookError) {
      console.error('Error sending webhook:', webhookError);
    }
  };

  

  useEffect(() => {
    const logConsent = async () => {

      // Retrieve all the fields
      const cookie = CookieConsent.getCookie();
      const preferences = CookieConsent.getUserPreferences();
      const acceptedCookies: string[] = preferences.acceptedCategories;
      const consentId: string = cookie.consentId;
      const storedFormId = localStorage.getItem('formID');

      localStorage.setItem('acceptedCookies', JSON.stringify(acceptedCookies));
      localStorage.setItem('consentId', JSON.stringify(consentId));
      setCookiesAccepted(acceptedCookies);
      setCookieConsentId(consentId);
      

      // console.log('form id:', formId);
      // console.log('stored form id:', storedFormId);
      // console.log('accepted cookies:', acceptedCookies);
      // console.log('consent id:', consentId);


      try {
        // Check if appContext.formId exists in the database
        const { data, error } = await supabase
          .from('Forms')
          .select('id')
          .eq('id', storedFormId)
          .single();
  
        if (error && error.code !== 'PGRST116') {
          await sendErrorWebhook('Error checking formId', error);
          return;
        }
  
        if (data) {
          // appContext.formId exists, update the updated_at column
          const { error: updateError } = await supabase
          .from('Forms')
          .update({ accepted_cookies:acceptedCookies, cookie_consent_id: consentId, cookie_updated_at: new Date().toISOString() })
          .eq('id', storedFormId);

          if (updateError) {
            await sendErrorWebhook('Error updating formId', updateError);
            return;
          }
          console.log('Form updated successfully');
        }
      } catch (err) {
        await sendErrorWebhook('Unexpected error', err);
        return;
      }
  }
    CookieConsent.run({
      onFirstConsent: () => {
        logConsent();
    },

    onChange: () => {
        logConsent();
    },
      revision: 1,
      categories: {
          // necessary: {
          //     enabled: true,  // this category is enabled by default
          //     readOnly: true  // this category cannot be disabled
          // },
          analytics: { enabled: true,  // this category is enabled by default 
            }
      },
  
      language: {
          default: 'en',
          translations: {
              en: {
                  consentModal: {
                      title: 'We use cookies',
                      description: 'Like many websites, we use cookies to improve your browsing experience. For more detailed information, please see our <a href="privacy-policy">Privacy Policy</a> and <a href="cookie-policy">Cookie Policy</a>.',
                      acceptAllBtn: 'Accept all',
                      acceptNecessaryBtn: 'Reject all',
                      showPreferencesBtn: 'Manage Individual preferences'
                  },
                  preferencesModal: {
                      title: 'Manage cookie preferences',
                      acceptAllBtn: 'Accept all',
                      acceptNecessaryBtn: 'Reject all',
                      savePreferencesBtn: 'Accept current selection',
                      closeIconLabel: 'Close modal',
                      sections: [
                          {
                              description: 'Like many websites, we use cookies to improve your browsing experience. Cookies are small text files stored on your device that help us remember your preferences, analyze website traffic, and tailor content to your interests. You can manage your cookie preferences below. For more detailed information, please see our <a href="privacy-policy">Privacy Policy</a> and <a href="cookie-policy">Cookie Policy</a>.'
                          },
                          // {
                          //     title: 'Strictly Necessary cookies',
                          //     description: 'These cookies are essential for the proper functioning of the website and cannot be disabled.',
  
                          //     //this field will generate a toggle linked to the 'necessary' category
                          //     linkedCategory: 'necessary'
                          // },
                          {
                              title: 'Performance and Analytics',
                              description: 'These cookies collect information about how you use our website. All of the data is anonymized and cannot be used to identify you.',
                              linkedCategory: 'analytics'
                          },
                          {
                              title: 'More information',
                              description: 'For any queries in relation to my policy on cookies and your choices, please <a href="#contact-page">contact us</a>'
                          }
                      ]
                  }
              }
          }
      }
  });  
}, []);


  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/request-quotes' element={<RequestQuote />} />
        <Route path='/thank-you' element={<ThankYou />} />
        <Route path='/confirm-details' element={<ConfirmDetails />} />
        <Route path='/cookie-policy' element={<CookiePolicy />} />
        <Route path='/privacy-policy' element={<PrivacyPolicy />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;

