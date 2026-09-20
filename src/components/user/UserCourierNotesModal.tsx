import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useCourierNotes } from '@/hooks/useCourierNotes';
import UserCourierTimeline from './UserCourierTimeline';
import { Truck } from 'lucide-react';

interface UserCourierNotesModalProps {
  orderId: string;
  orderNumber: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UserCourierNotesModal = ({ 
  orderId, 
  orderNumber, 
  open, 
  onOpenChange, 
}: UserCourierNotesModalProps) => {
  const { data: notes = [], isLoading } = useCourierNotes(orderId);

  const Content = () => (
    <div className="flex flex-col max-h-[60vh] overflow-y-auto pr-2">
      <UserCourierTimeline notes={notes} isLoading={isLoading} />
    </div>
  );

  // Use Sheet for mobile, Dialog for desktop
  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="h-[75vh] rounded-t-2xl">
          <SheetHeader className="text-left mb-4">
            <SheetTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              কুরিয়ার টাইমলাইন - {orderNumber}
            </SheetTitle>
          </SheetHeader>
          <Content />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            কুরিয়ার টাইমলাইন - {orderNumber}
          </DialogTitle>
        </DialogHeader>
        <Content />
      </DialogContent>
    </Dialog>
  );
};

export default UserCourierNotesModal;
