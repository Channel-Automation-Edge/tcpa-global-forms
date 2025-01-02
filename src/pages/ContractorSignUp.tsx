import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Dialog, DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DialogClose,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import posthog from 'posthog-js';
import { AppContext } from '@/context/AppContext';
import ContractorForm from '@/components/forms/Contractor/ContractorForm';

const ContractorSignUp = () => {
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const appContext = useContext(AppContext);

  if (!appContext) {
    return null;
  }

  useEffect(() => {
    const handlePopState = () => {
      if (!isModalOpen) {
        setIsModalOpen(true);
        document.getElementById("modal")?.click();
      }
    };

    window.history.pushState(null, '', window.location.pathname + window.location.search);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [location.pathname, location.search, isModalOpen]);

  const handleLeave = () => {
    posthog.capture('page_exit test in requesttt',);
    const params = window.location.search;
    window.location.href = '/' + params;
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
    <ContractorForm />
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <button id='modal' className='hidden'></button>
        </DialogTrigger>
        <DialogTitle></DialogTitle>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <h4 className='text-md font-semibold'>Wait!</h4>
            <DialogDescription>
              Are you sure you want to leave this page? Don't worry, your changes will be saved.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button className='bg-gray-200 hover:bg-gray-300 text-gray-800' onClick={handleCloseModal}>Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button className='bg-xorange hover:bg-xorangeDark' onClick={handleLeave}>Leave Page</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContractorSignUp;



