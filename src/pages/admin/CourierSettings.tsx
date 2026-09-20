import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  useCourierSettings, 
  useUpdateCourierSetting, 
  useSetDefaultCourier,
  CourierSetting 
} from '@/hooks/useCourierSettings';
import { Truck, Save, Star, Eye, EyeOff, Loader2 } from 'lucide-react';

const CourierSettingsPage = () => {
  const { data: couriers, isLoading } = useCourierSettings();
  const updateSetting = useUpdateCourierSetting();
  const setDefault = useSetDefaultCourier();
  const { toast } = useToast();

  const [editingCourier, setEditingCourier] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, Partial<CourierSetting>>>({});
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (couriers) {
      const initialData: Record<string, Partial<CourierSetting>> = {};
      couriers.forEach(c => {
        initialData[c.id] = {
          api_key: c.api_key || '',
          api_secret: c.api_secret || '',
          access_token: c.access_token || '',
          default_weight: c.default_weight,
          is_enabled: c.is_enabled,
        };
      });
      setFormData(initialData);
    }
  }, [couriers]);

  const handleSave = async (courier: CourierSetting) => {
    try {
      await updateSetting.mutateAsync({
        id: courier.id,
        data: formData[courier.id],
      });
      toast({
        title: 'সফল!',
        description: `${courier.display_name} সেটিংস সেভ হয়েছে`,
      });
      setEditingCourier(null);
    } catch (error: any) {
      toast({
        title: 'ত্রুটি',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleSetDefault = async (courierId: string) => {
    try {
      await setDefault.mutateAsync(courierId);
      toast({
        title: 'সফল!',
        description: 'ডিফল্ট কুরিয়ার সেট হয়েছে',
      });
    } catch (error: any) {
      toast({
        title: 'ত্রুটি',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleToggleEnabled = async (courier: CourierSetting) => {
    const newValue = !formData[courier.id]?.is_enabled;
    setFormData(prev => ({
      ...prev,
      [courier.id]: { ...prev[courier.id], is_enabled: newValue },
    }));
    
    try {
      await updateSetting.mutateAsync({
        id: courier.id,
        data: { is_enabled: newValue },
      });
      toast({
        title: newValue ? 'সক্রিয়' : 'নিষ্ক্রিয়',
        description: `${courier.display_name} ${newValue ? 'সক্রিয়' : 'নিষ্ক্রিয়'} করা হয়েছে`,
      });
    } catch (error: any) {
      // Revert on error
      setFormData(prev => ({
        ...prev,
        [courier.id]: { ...prev[courier.id], is_enabled: !newValue },
      }));
      toast({
        title: 'ত্রুটি',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const getCourierInstructions = (courierName: string) => {
    switch (courierName) {
      case 'steadfast':
        return {
          apiKey: 'API Key (portal.steadfast.com.bd থেকে)',
          apiSecret: 'Secret Key',
          accessToken: null,
        };
      case 'pathao':
        return {
          apiKey: 'Client ID',
          apiSecret: 'Store ID',
          accessToken: 'Access Token (API থেকে generate করুন)',
        };
      case 'redx':
        return {
          apiKey: 'API Access Token',
          apiSecret: null,
          accessToken: null,
        };
      default:
        return { apiKey: 'API Key', apiSecret: 'Secret Key', accessToken: 'Access Token' };
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">কুরিয়ার সেটিংস</h1>
          <p className="text-muted-foreground">
            আপনার কুরিয়ার API credentials এবং সেটিংস কনফিগার করুন
          </p>
        </div>

        <div className="grid gap-6">
          {couriers?.map((courier) => {
            const instructions = getCourierInstructions(courier.courier_name);
            const isEditing = editingCourier === courier.id;
            const data = formData[courier.id] || {};

            return (
              <Card key={courier.id} className={courier.is_default ? 'border-primary' : ''}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Truck className="h-6 w-6 text-primary" />
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {courier.display_name}
                          {courier.is_default && (
                            <Badge variant="default" className="ml-2">
                              <Star className="h-3 w-3 mr-1" />
                              ডিফল্ট
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription>
                          {courier.courier_name === 'steadfast' && 'portal.steadfast.com.bd'}
                          {courier.courier_name === 'pathao' && 'merchant.pathao.com'}
                          {courier.courier_name === 'redx' && 'redx.com.bd'}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`enabled-${courier.id}`} className="text-sm">
                          {data.is_enabled ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                        </Label>
                        <Switch
                          id={`enabled-${courier.id}`}
                          checked={data.is_enabled || false}
                          onCheckedChange={() => handleToggleEnabled(courier)}
                        />
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    {instructions.apiKey && (
                      <div className="space-y-2">
                        <Label>{instructions.apiKey}</Label>
                        <div className="relative">
                          <Input
                            type={showSecrets[`${courier.id}-key`] ? 'text' : 'password'}
                            value={data.api_key || ''}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              [courier.id]: { ...prev[courier.id], api_key: e.target.value },
                            }))}
                            placeholder="Enter API key"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                            onClick={() => setShowSecrets(prev => ({
                              ...prev,
                              [`${courier.id}-key`]: !prev[`${courier.id}-key`],
                            }))}
                          >
                            {showSecrets[`${courier.id}-key`] ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    )}

                    {instructions.apiSecret && (
                      <div className="space-y-2">
                        <Label>{instructions.apiSecret}</Label>
                        <div className="relative">
                          <Input
                            type={showSecrets[`${courier.id}-secret`] ? 'text' : 'password'}
                            value={data.api_secret || ''}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              [courier.id]: { ...prev[courier.id], api_secret: e.target.value },
                            }))}
                            placeholder="Enter secret key"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                            onClick={() => setShowSecrets(prev => ({
                              ...prev,
                              [`${courier.id}-secret`]: !prev[`${courier.id}-secret`],
                            }))}
                          >
                            {showSecrets[`${courier.id}-secret`] ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    )}

                    {instructions.accessToken && (
                      <div className="space-y-2 md:col-span-2">
                        <Label>{instructions.accessToken}</Label>
                        <div className="relative">
                          <Input
                            type={showSecrets[`${courier.id}-token`] ? 'text' : 'password'}
                            value={data.access_token || ''}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              [courier.id]: { ...prev[courier.id], access_token: e.target.value },
                            }))}
                            placeholder="Enter access token"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                            onClick={() => setShowSecrets(prev => ({
                              ...prev,
                              [`${courier.id}-token`]: !prev[`${courier.id}-token`],
                            }))}
                          >
                            {showSecrets[`${courier.id}-token`] ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label>ডিফল্ট ওজন (কেজি)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={data.default_weight || 0.5}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          [courier.id]: { ...prev[courier.id], default_weight: parseFloat(e.target.value) },
                        }))}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t">
                    <Button
                      onClick={() => handleSave(courier)}
                      disabled={updateSetting.isPending}
                    >
                      {updateSetting.isPending ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      সেভ করুন
                    </Button>
                    
                    {!courier.is_default && (
                      <Button
                        variant="outline"
                        onClick={() => handleSetDefault(courier.id)}
                        disabled={setDefault.isPending}
                      >
                        <Star className="h-4 w-4 mr-2" />
                        ডিফল্ট করুন
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>ব্যবহার নির্দেশিকা</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div>
              <h4 className="font-medium text-foreground mb-1">Steadfast</h4>
              <p>portal.steadfast.com.bd থেকে API Key এবং Secret Key সংগ্রহ করুন। API &gt; API Credentials থেকে পাবেন।</p>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-1">Pathao</h4>
              <p>merchant.pathao.com থেকে Client ID এবং Store ID নিন। API থেকে Access Token generate করুন।</p>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-1">RedX</h4>
              <p>redx.com.bd merchant panel থেকে API Access Token সংগ্রহ করুন।</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default CourierSettingsPage;
