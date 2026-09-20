import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useBlockedEntities, useBlockEntity, useUnblockEntity } from '@/hooks/useCustomers';
import { toast } from '@/hooks/use-toast';
import { ShieldAlert, Trash2, Plus, Loader2, Phone, Globe } from 'lucide-react';

interface BlockedEntitiesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BlockedEntitiesModal = ({ open, onOpenChange }: BlockedEntitiesModalProps) => {
  const { data: blockedList = [], isLoading } = useBlockedEntities();
  const blockEntity = useBlockEntity();
  const unblockEntity = useUnblockEntity();

  const [type, setType] = useState<'phone' | 'ip'>('phone');
  const [value, setValue] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleAddBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) {
      toast({ title: 'মান দিন (ফোন অথবা আইপি)', variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    try {
      await blockEntity.mutateAsync({
        type,
        value: value.trim(),
        reason: reason.trim() || 'Blocked manually by admin',
      });
      toast({ title: 'সফলভাবে ব্লক লিস্টে যুক্ত হয়েছে' });
      setValue('');
      setReason('');
    } catch (err: any) {
      toast({ title: 'ব্যর্থ হয়েছে', description: err.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUnblock = async (id: string | number) => {
    try {
      await unblockEntity.mutateAsync(id);
      toast({ title: 'আনব্লক সম্পন্ন হয়েছে' });
    } catch (err: any) {
      toast({ title: 'আনব্লক ব্যর্থ হয়েছে', description: err.message, variant: 'destructive' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-6">
        <DialogHeader className="pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">
                বট ও ফেক কাস্টমার ব্লক তালিকা (Blacklist)
              </DialogTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                ব্লকলিস্টে থাকা নম্বর বা আইপি থেকে ওয়েবসাইটে ফেক বা বট অর্ডার দেওয়া বন্ধ থাকবে
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Add Block Form */}
        <form onSubmit={handleAddBlock} className="bg-muted/40 p-3.5 rounded-xl border space-y-3 mt-2">
          <div className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <Plus className="h-3.5 w-3.5 text-primary" />
            নতুন ব্লক যুক্ত করুন
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <Label className="text-[11px] text-muted-foreground">ধরন (Type)</Label>
              <Select value={type} onValueChange={(val: any) => setType(val)}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="phone">মোবাইল নম্বর (Phone)</SelectItem>
                  <SelectItem value="ip">আইপি অ্যাড্রেস (IP)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-[11px] text-muted-foreground">
                {type === 'phone' ? 'ফোন নম্বর (01XXXXXXXXX)' : 'আইপি অ্যাড্রেস'}
              </Label>
              <Input
                placeholder={type === 'phone' ? '01712345678' : '192.168.1.1'}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="h-9 text-xs"
                required
              />
            </div>
            <div>
              <Label className="text-[11px] text-muted-foreground">ব্লক করার কারণ (ঐচ্ছিক)</Label>
              <div className="flex gap-1.5">
                <Input
                  placeholder="যেমন: ফেক বট অর্ডার"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="h-9 text-xs"
                />
                <Button type="submit" size="sm" className="h-9 px-3 text-xs shrink-0" disabled={submitting}>
                  {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'ব্লক করুন'}
                </Button>
              </div>
            </div>
          </div>
        </form>

        {/* Blocked List Table */}
        <div className="flex-1 overflow-y-auto mt-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-10 text-muted-foreground text-xs">
              <Loader2 className="h-6 w-6 animate-spin mr-2" /> লোড হচ্ছে...
            </div>
          ) : blockedList.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-xs">
              <ShieldAlert className="h-8 w-8 mx-auto mb-1.5 opacity-30 text-emerald-600" />
              বর্তমানে কোনো ব্লক করা নম্বর বা আইপি নেই।
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="text-xs">ধরন</TableHead>
                    <TableHead className="text-xs">নম্বর / আইপি</TableHead>
                    <TableHead className="text-xs">কারণ (Reason)</TableHead>
                    <TableHead className="text-xs text-right">অ্যাকশন</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blockedList.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="text-xs font-medium">
                        {item.type === 'phone' ? (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1 w-fit text-[11px]">
                            <Phone className="h-3 w-3" /> ফোন
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 flex items-center gap-1 w-fit text-[11px]">
                            <Globe className="h-3 w-3" /> IP
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="font-mono font-bold text-xs">{item.value}</TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">
                        {item.reason || '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUnblock(item.id)}
                          className="h-7 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1" />
                          আনব্লক
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BlockedEntitiesModal;
