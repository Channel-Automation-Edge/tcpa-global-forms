import { useState, useEffect } from 'react';

function useFormPersistence<T>(formKeys: string[], initialData: T) {
  const [formData, setFormData] = useState<T>(() => {
    const savedData = localStorage.getItem(formKeys[0]); // Assume the first key is the primary one for initialization
    return savedData ? JSON.parse(savedData) : initialData;
  });

  useEffect(() => {
    formKeys.forEach(key => {
      localStorage.setItem(key, JSON.stringify(formData));
    });
  }, [formData, formKeys]);

  const resetFormData = () => {
    setFormData(initialData);
    formKeys.forEach(key => localStorage.removeItem(key));
  };

  return [formData, setFormData, resetFormData] as const;
}

export default useFormPersistence;
