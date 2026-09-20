import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useCourierNotes, useAddCourierNote } from '@/hooks/useCourierNotes';
import CourierTimeline from './CourierTimeline';
import { toast } from '@/hooks/use-toast';
import { Send, Plus, MessageSquare } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface CourierNotesModalProps {
  orderId: string;
  orderNumber: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isAdmin?: boolean;
}

const CourierNotesModal = ({
  orderId,
  orderNumber,
  open,
  onOpenChange,
  isAdmin = true
}: CourierNotesModalProps) => {
  const { data: notes = [], isLoading } = useCourierNotes(orderId);
  const addNote = useAddCourierNote();
  const [newNote, setNewNote] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const isMobile = useIsMobile();

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    try {
      await addNote.mutateAsync({
        order_id: orderId,
        source: 'admin',
        message: newNote.trim(),
      });
      setNewNote('');
      setIsAdding(false);
      toast({ title: 'Success', description: 'Note added successfully.' });
    } catch {
      toast({ title: 'Error', description: 'Failed to add note.', variant: 'destructive' });
    }
  };

  const content = (
    <div className="flex flex-col h-full max-h-[70vh]">
      {isAdmin && (
        <div className="border-b border-border pb-4 mb-4">
          {isAdding ? (
            <div className="space-y-3">
              <Textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Courier note লিখুন..."
                rows={3}
                autoFocus
              />
              <div className="flex gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={() => { setIsAdding(false); setNewNote(''); }}>
                  বাতিল
                </Button>
                <Button size="sm" onClick={handleAddNote} disabled={!newNote.trim() || addNote.isPending}>
                  <Send className="h-4 w-4 mr-1" />
                  {addNote.isPending ? 'যোগ হচ্ছে...' : 'যোগ করুন'}
                </Button>
              </div>
            </div>
          ) : (
            <Button variant="outline" className="w-full" onClick={() => setIsAdding(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Courier Note যোগ করুন
            </Button>
          )}
        </div>
      )}
      <div className="flex-1 overflow-y-auto pr-2">
        <CourierTimeline notes={notes} isLoading={isLoading} />
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl">
          <SheetHeader className="text-left mb-4">
            <SheetTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Courier Note - {orderNumber}
            </SheetTitle>
          </SheetHeader>
          {content}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Courier Note - {orderNumber}
          </DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
};

export default CourierNotesModal;
