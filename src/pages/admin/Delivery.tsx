import AdminLayout from '@/components/admin/AdminLayout';
import { useDeliverySettings, useUpdateDeliverySetting } from '@/hooks/useOrders';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { Truck } from 'lucide-react';

const Delivery = () => {
  const { data: settings, isLoading } = useDeliverySettings();
  const updateSetting = useUpdateDeliverySetting();
  const [insideDhaka, setInsideDhaka] = useState(0);
  const [outsideDhaka, setOutsideDhaka] = useState(0);

  useEffect(() => {
    if (settings) {
      const inside = settings.find(s => s.delivery_type === 'inside_dhaka');
      const outside = settings.find(s => s.delivery_type === 'outside_dhaka');
      if (inside) setInsideDhaka(Number(inside.charge));
      if (outside) setOutsideDhaka(Number(outside.charge));
    }
  }, [settings]);

  const handleSave = async (type: 'inside_dhaka' | 'outside_dhaka') => {
    const setting = settings?.find(s => s.delivery_type === type);
    if (!setting) return;

    try {
      await updateSetting.mutateAsync({
        id: setting.id,
        charge: type === 'inside_dhaka' ? insideDhaka : outsideDhaka,
      });
      toast({ title: 'Saved', description: 'Delivery charge updated successfully.' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update.', variant: 'destructive' });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold">Delivery Settings</h1>
          <p className="text-muted-foreground">Manage delivery charges</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                Inside Dhaka
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Delivery Charge (৳)</Label>
                <Input
                  type="number"
                  value={insideDhaka}
                  onChange={(e) => setInsideDhaka(Number(e.target.value))}
                  className="mt-1.5"
                />
              </div>
              <Button onClick={() => handleSave('inside_dhaka')} disabled={updateSetting.isPending}>
                Save Changes
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-orange-500" />
                Outside Dhaka
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Delivery Charge (৳)</Label>
                <Input
                  type="number"
                  value={outsideDhaka}
                  onChange={(e) => setOutsideDhaka(Number(e.target.value))}
                  className="mt-1.5"
                />
              </div>
              <Button onClick={() => handleSave('outside_dhaka')} disabled={updateSetting.isPending}>
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Delivery;
