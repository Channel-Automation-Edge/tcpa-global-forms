import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import supabase from '../lib/supabaseClient';

const useResetDatabase = () => {
  const appContext = useContext(AppContext);

  const resetFormFields = async () => {
    if (!appContext) {
      console.error('AppContext is not available');
      return;
    }

    try {
      const { formId } = appContext; // Ensure formId is accessible

      // Check if formId exists in the database
      const { data, error } = await supabase
        .from('Forms')
        .select('id')
        .eq('id', formId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking formId:', error);
        return;
      }

      if (data) {
        // formId exists, clear specific fields
        const { error: updateError } = await supabase
          .from('Forms')
          .update({
            optIn_completion: false,
            appointment_completion: false,
            email_optIn: false,
            termsAndPrivacy_optIn: false,
            smsAndCall_optIn: false,
          })
          .eq('id', formId);

        if (updateError) {
          console.error('Error clearing form fields:', updateError);
          return;
        }

        console.log(`FormId ${formId} fields cleared.`);
      }
    } catch (err) {
      console.error('Unexpected error during reset:', err);
    }
  };

  return resetFormFields;
};

export default useResetDatabase;
