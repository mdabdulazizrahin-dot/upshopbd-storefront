import { useState, useRef } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSiteSettings, useUpdateSiteSettings, TypographySettings, ColorSettings, HeaderSettings, FooterSettings, FooterColumn, FooterLink, GeneralSettings, SocialSettings, SectionSettings, TrackingSettings, HelplineSettings, TelegramSettings, PaymentSettings } from '@/hooks/useSiteSettings';
import { toast } from 'sonner';
import { Palette, Type, Settings, Share2, Layout, LayoutGrid, Upload, X, Code, Plus, Trash2, ArrowUp, ArrowDown, ExternalLink, Columns, Phone, MapPin, Mail, Headphones, Send, Bot, Eye, EyeOff, CheckCircle2, MessageSquare, HelpCircle, CreditCard, Wallet, Copy, Check } from 'lucide-react';
import { defaultFooterColumns } from '@/components/layout/Footer';
import api from '@/lib/api';

type SettingsValue = TypographySettings | ColorSettings | HeaderSettings | FooterSettings | GeneralSettings | SocialSettings | SectionSettings | TrackingSettings | HelplineSettings | TelegramSettings | PaymentSettings;

const SiteSettingsPage = () => {
  const { data: settings, isLoading } = useSiteSettings();
  const updateSettings = useUpdateSiteSettings();
  const [activeTab, setActiveTab] = useState('general');

  const handleSave = async (key: string, value: SettingsValue) => {
    try {
      await updateSettings.mutateAsync({ key, value });
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Site Settings</h1>
          <p className="text-muted-foreground">Manage all website settings from here</p>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 sm:grid-cols-6 md:grid-cols-11 lg:w-auto lg:inline-flex gap-1">
            <TabsTrigger value="general"><Settings className="h-4 w-4" /><span className="hidden sm:inline ml-2">General</span></TabsTrigger>
            <TabsTrigger value="payment"><CreditCard className="h-4 w-4 text-rose-500" /><span className="hidden sm:inline ml-2 font-medium text-rose-600 dark:text-rose-400">Payment</span></TabsTrigger>
            <TabsTrigger value="helpline"><Headphones className="h-4 w-4 text-emerald-500" /><span className="hidden sm:inline ml-2 font-medium text-emerald-600 dark:text-emerald-400">Helpline</span></TabsTrigger>
            <TabsTrigger value="telegram"><Send className="h-4 w-4 text-sky-500" /><span className="hidden sm:inline ml-2 font-medium text-sky-600 dark:text-sky-400">Telegram Bot</span></TabsTrigger>
            <TabsTrigger value="typography"><Type className="h-4 w-4" /><span className="hidden sm:inline ml-2">Typography</span></TabsTrigger>
            <TabsTrigger value="colors"><Palette className="h-4 w-4" /><span className="hidden sm:inline ml-2">Colors</span></TabsTrigger>
            <TabsTrigger value="sections"><LayoutGrid className="h-4 w-4" /><span className="hidden sm:inline ml-2">Sections</span></TabsTrigger>
            <TabsTrigger value="header"><Layout className="h-4 w-4" /><span className="hidden sm:inline ml-2">Header</span></TabsTrigger>
            <TabsTrigger value="footer"><Layout className="h-4 w-4" /><span className="hidden sm:inline ml-2">Footer</span></TabsTrigger>
            <TabsTrigger value="social"><Share2 className="h-4 w-4" /><span className="hidden sm:inline ml-2">Social</span></TabsTrigger>
            <TabsTrigger value="tracking"><Code className="h-4 w-4" /><span className="hidden sm:inline ml-2">Tracking</span></TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card><CardHeader><CardTitle>General Settings</CardTitle><CardDescription>Change basic website information</CardDescription></CardHeader>
              <CardContent><GeneralSettingsForm settings={settings?.general} onSave={(value) => handleSave('general', value)} /></CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="payment">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-rose-500" />
                  পেমেন্ট মেথড সেটিংস (Payment Methods Configuration)
                </CardTitle>
                <CardDescription>
                  চেকআউট পেজে ক্যাশ অন ডেলিভারি (COD), বিকাশ (bKash), নগদ (Nagad) এবং রকেট (Rocket) পেমেন্ট অপশন কনফিগার করুন
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PaymentSettingsForm settings={settings?.payment} onSave={(value) => handleSave('payment', value)} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="helpline">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Headphones className="h-5 w-5 text-emerald-500" />
                  হেল্পলাইন ও লাইভ চ্যাট সেটিংস (Floating Helpline & Chat)
                </CardTitle>
                <CardDescription>
                  ওয়েবসাইটের ফ্লোটিং বাটনে WhatsApp, Facebook Messenger এবং সরাসরি ফোন কল বাটন কনফিগার করুন
                </CardDescription>
              </CardHeader>
              <CardContent>
                <HelplineSettingsForm settings={settings?.helpline} onSave={(value) => handleSave('helpline', value)} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="telegram">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5 text-sky-500" />
                  টেলিগ্রাম বট অর্ডার নোটিফিকেশন (Telegram Bot Order Notification)
                </CardTitle>
                <CardDescription>
                  নতুন কোনো অর্ডার আসার সাথে সাথে তাৎক্ষণিক আপনার টেলিগ্রাম অ্যাকাউন্টে বা টিমের গ্রুপে বিস্তারিত মেসেজ পাওয়ার জন্য কনফিগার করুন
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TelegramSettingsForm settings={settings?.telegram} onSave={(value) => handleSave('telegram', value)} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="typography">
            <Card><CardHeader><CardTitle>Typography Settings</CardTitle></CardHeader>
              <CardContent><TypographySettingsForm settings={settings?.typography} onSave={(value) => handleSave('typography', value)} /></CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="colors">
            <Card><CardHeader><CardTitle>Color Settings</CardTitle></CardHeader>
              <CardContent><ColorSettingsForm settings={settings?.colors} onSave={(value) => handleSave('colors', value)} /></CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="sections">
            <Card><CardHeader><CardTitle>Section Settings</CardTitle></CardHeader>
              <CardContent><SectionSettingsForm settings={settings?.sections} onSave={(value) => handleSave('sections', value)} /></CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="header">
            <Card><CardHeader><CardTitle>Header Settings</CardTitle></CardHeader>
              <CardContent><HeaderSettingsForm settings={settings?.header} onSave={(value) => handleSave('header', value)} /></CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="footer">
            <Card><CardHeader><CardTitle>Footer Settings</CardTitle></CardHeader>
              <CardContent><FooterSettingsForm settings={settings?.footer} onSave={(value) => handleSave('footer', value)} /></CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="social">
            <Card><CardHeader><CardTitle>Social Media</CardTitle></CardHeader>
              <CardContent><SocialSettingsForm settings={settings?.social} onSave={(value) => handleSave('social', value)} /></CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="tracking">
            <Card><CardHeader><CardTitle>Tracking & Pixels</CardTitle></CardHeader>
              <CardContent><TrackingSettingsForm settings={settings?.tracking} onSave={(value) => handleSave('tracking', value)} /></CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

const normalizeToHex = (color: string): string => {
  if (!color) return '#2563eb';
  if (color.startsWith('#')) return color;
  return '#2563eb';
};

const uploadImage = async (file: File): Promise<string> => {
  const result = await api.uploadImage(file);
  return result.url;
};

const GeneralSettingsForm = ({ settings, onSave }: { settings?: GeneralSettings; onSave: (value: GeneralSettings) => void }) => {
  const [form, setForm] = useState<GeneralSettings>(settings || { siteName: '', tagline: '', phone: '', email: '', address: '', faviconUrl: '' });
  const [uploading, setUploading] = useState(false);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setForm({ ...form, faviconUrl: url });
      toast.success('Favicon uploaded successfully');
    } catch { toast.error('Failed to upload favicon'); }
    finally { setUploading(false); }
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2"><Label>Site Name</Label><Input value={form.siteName || ''} onChange={(e) => setForm({ ...form, siteName: e.target.value })} /></div>
        <div className="space-y-2"><Label>Tagline</Label><Input value={form.tagline || ''} onChange={(e) => setForm({ ...form, tagline: e.target.value })} /></div>
        <div className="space-y-2"><Label>Phone</Label><Input value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
        <div className="space-y-2"><Label>Email</Label><Input type="email" value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
        <div className="space-y-2 md:col-span-2"><Label>Address</Label><Textarea value={form.address || ''} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
        <div className="space-y-2 md:col-span-2">
          <Label>Site Icon (Favicon)</Label>
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 border-2 border-dashed rounded-lg flex items-center justify-center bg-muted/50 overflow-hidden">
              {form.faviconUrl ? <img src={form.faviconUrl} alt="Favicon" className="max-w-full max-h-full object-contain" /> : <span className="text-muted-foreground text-xs text-center px-1">No icon</span>}
            </div>
            <div className="flex flex-col gap-2">
              <input type="file" ref={faviconInputRef} onChange={handleFaviconUpload} accept="image/*" className="hidden" />
              <Button type="button" variant="outline" size="sm" onClick={() => faviconInputRef.current?.click()} disabled={uploading}>
                <Upload className="h-4 w-4 mr-2" />{uploading ? 'Uploading...' : 'Upload Favicon'}
              </Button>
              {form.faviconUrl && <Button type="button" variant="ghost" size="sm" onClick={() => setForm({ ...form, faviconUrl: '' })} className="text-destructive"><X className="h-4 w-4 mr-2" />Remove</Button>}
            </div>
          </div>
        </div>
        <div className="space-y-2 md:col-span-2"><Label>Or paste Favicon URL</Label><Input value={form.faviconUrl || ''} onChange={(e) => setForm({ ...form, faviconUrl: e.target.value })} placeholder="https://example.com/favicon.ico" /></div>
      </div>
      <Button type="submit">Save Changes</Button>
    </form>
  );
};

const TypographySettingsForm = ({ settings, onSave }: { settings?: TypographySettings; onSave: (value: TypographySettings) => void }) => {
  const [form, setForm] = useState<TypographySettings>(settings || { fontFamily: 'Hind Siliguri', headingSize: '2.5rem', bodySize: '1rem', lineHeight: '1.6' });
  const fontOptions = ['Hind Siliguri', 'Noto Sans Bengali', 'Kalpurush', 'SolaimanLipi', 'Poppins', 'Inter', 'Roboto'];
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2"><Label>Font Family</Label>
          <select className="w-full h-10 px-3 border rounded-md bg-background" value={form.fontFamily || 'Hind Siliguri'} onChange={(e) => setForm({ ...form, fontFamily: e.target.value })}>
            {fontOptions.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div className="space-y-2"><Label>Heading Size</Label><Input value={form.headingSize || '2.5rem'} onChange={(e) => setForm({ ...form, headingSize: e.target.value })} /></div>
        <div className="space-y-2"><Label>Body Text Size</Label><Input value={form.bodySize || '1rem'} onChange={(e) => setForm({ ...form, bodySize: e.target.value })} /></div>
        <div className="space-y-2"><Label>Line Height</Label><Input value={form.lineHeight || '1.6'} onChange={(e) => setForm({ ...form, lineHeight: e.target.value })} /></div>
      </div>
      <Button type="submit">Save Changes</Button>
    </form>
  );
};

const ColorSettingsForm = ({ settings, onSave }: { settings?: ColorSettings; onSave: (value: ColorSettings) => void }) => {
  const [form, setForm] = useState<ColorSettings>(settings || { primary: '#2563eb', secondary: '#1d4ed8', buttonColor: '#2563eb', hoverColor: '#1e40af', textColor: '#000000', backgroundColor: '#ffffff' });
  const colorFields = [
    { key: 'primary', label: 'Primary Color' }, { key: 'secondary', label: 'Secondary Color' },
    { key: 'buttonColor', label: 'Button Color' }, { key: 'hoverColor', label: 'Hover Color' },
    { key: 'textColor', label: 'Text Color' }, { key: 'backgroundColor', label: 'Background Color' },
  ];
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {colorFields.map(({ key, label }) => (
          <div key={key} className="space-y-2">
            <Label>{label}</Label>
            <div className="flex items-center gap-2">
              <input type="color" value={normalizeToHex(form[key] || '')} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="w-12 h-10 rounded cursor-pointer border" />
              <Input value={normalizeToHex(form[key] || '')} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="flex-1" />
            </div>
          </div>
        ))}
      </div>
      <Button type="submit">Save Changes</Button>
    </form>
  );
};

const HeaderSettingsForm = ({ settings, onSave }: { settings?: HeaderSettings; onSave: (value: HeaderSettings) => void }) => {
  const [form, setForm] = useState<HeaderSettings>(settings || { logoUrl: '', backgroundColor: '#ffffff', navBackgroundColor: '#2563eb', isSticky: true, userIcon: 'User', cartIcon: 'ShoppingCart', searchIcon: 'Search', menuIcon: 'Menu' });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setForm({ ...form, logoUrl: url });
      toast.success('Logo uploaded successfully');
    } catch { toast.error('Failed to upload logo'); }
    finally { setUploading(false); }
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 md:col-span-2">
          <Label>Site Logo</Label>
          <div className="flex items-start gap-4">
            <div className="w-32 h-20 border-2 border-dashed rounded-lg flex items-center justify-center bg-muted/50 overflow-hidden">
              {form.logoUrl ? <img src={form.logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" /> : <span className="text-muted-foreground text-xs text-center px-2">No logo</span>}
            </div>
            <div className="flex flex-col gap-2">
              <input type="file" ref={fileInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />
              <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                <Upload className="h-4 w-4 mr-2" />{uploading ? 'Uploading...' : 'Upload Logo'}
              </Button>
              {form.logoUrl && <Button type="button" variant="ghost" size="sm" onClick={() => setForm({ ...form, logoUrl: '' })} className="text-destructive"><X className="h-4 w-4 mr-2" />Remove</Button>}
            </div>
          </div>
        </div>
        <div className="space-y-2 md:col-span-2"><Label>Or paste Logo URL</Label><Input value={form.logoUrl || ''} onChange={(e) => setForm({ ...form, logoUrl: e.target.value })} placeholder="https://example.com/logo.png" /></div>
        <div className="space-y-2"><Label>Header Background Color</Label>
          <div className="flex gap-2"><input type="color" value={normalizeToHex(form.backgroundColor || '')} onChange={(e) => setForm({ ...form, backgroundColor: e.target.value })} className="w-12 h-10 rounded cursor-pointer border" /><Input value={normalizeToHex(form.backgroundColor || '')} onChange={(e) => setForm({ ...form, backgroundColor: e.target.value })} /></div>
        </div>
        <div className="space-y-2"><Label>Navigation Bar Color</Label>
          <div className="flex gap-2"><input type="color" value={normalizeToHex(form.navBackgroundColor || '')} onChange={(e) => setForm({ ...form, navBackgroundColor: e.target.value })} className="w-12 h-10 rounded cursor-pointer border" /><Input value={normalizeToHex(form.navBackgroundColor || '')} onChange={(e) => setForm({ ...form, navBackgroundColor: e.target.value })} /></div>
        </div>
        <div className="flex items-center space-x-2"><Switch id="isSticky" checked={form.isSticky || false} onCheckedChange={(checked) => setForm({ ...form, isSticky: checked })} /><Label htmlFor="isSticky">Sticky Header</Label></div>
        <div className="space-y-2"><Label>User Icon</Label>
          <Select value={form.userIcon || 'User'} onValueChange={(v) => setForm({ ...form, userIcon: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="User">User</SelectItem><SelectItem value="UserCircle">User Circle</SelectItem><SelectItem value="UserRound">User Round</SelectItem><SelectItem value="CircleUser">Circle User</SelectItem></SelectContent></Select>
        </div>
        <div className="space-y-2"><Label>Cart Icon</Label>
          <Select value={form.cartIcon || 'ShoppingCart'} onValueChange={(v) => setForm({ ...form, cartIcon: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="ShoppingCart">Shopping Cart</SelectItem><SelectItem value="ShoppingBag">Shopping Bag</SelectItem><SelectItem value="ShoppingBasket">Shopping Basket</SelectItem><SelectItem value="Package">Package</SelectItem></SelectContent></Select>
        </div>
        <div className="space-y-2"><Label>Search Icon</Label>
          <Select value={form.searchIcon || 'Search'} onValueChange={(v) => setForm({ ...form, searchIcon: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Search">Search</SelectItem><SelectItem value="SearchCode">Search Code</SelectItem><SelectItem value="ScanSearch">Scan Search</SelectItem></SelectContent></Select>
        </div>
        <div className="space-y-2"><Label>Menu Icon (Mobile)</Label>
          <Select value={form.menuIcon || 'Menu'} onValueChange={(v) => setForm({ ...form, menuIcon: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Menu">Menu</SelectItem><SelectItem value="AlignJustify">Align Justify</SelectItem><SelectItem value="LayoutGrid">Layout Grid</SelectItem><SelectItem value="MoreHorizontal">More Horizontal</SelectItem></SelectContent></Select>
        </div>
      </div>
      <Button type="submit">Save Changes</Button>
    </form>
  );
};

const quickLinkPresets = [
  { title: 'আমাদের সম্পর্কে', url: '/about' },
  { title: 'যোগাযোগের ঠিকানা', url: '/contact' },
  { title: 'টার্মস এন্ড কন্ডিশন', url: '/terms-conditions' },
  { title: 'গোপনীয়তা নীতি', url: '/privacy-policy' },
  { title: 'অর্ডার & রিটার্ন পলিসি', url: '/return-policy' },
  { title: 'সাধারণ জিজ্ঞাসা (FAQ)', url: '/faq' },
  { title: 'অর্ডার ট্র্যাক করুন', url: '/track-order' },
  { title: 'সেলস ক্যাম্পেইন', url: '/shop' },
  { title: 'সকল প্রোডাক্ট', url: '/shop' },
  { title: 'ফেভারিট প্রোডাক্ট (Wishlist)', url: '/wishlist' },
  { title: 'লগইন', url: '/login' },
  { title: 'রেজিস্ট্রেশন', url: '/login' },
  { title: 'আমার অর্ডার', url: '/profile' },
];

const FooterSettingsForm = ({ settings, onSave }: { settings?: FooterSettings; onSave: (value: FooterSettings) => void }) => {
  const [form, setForm] = useState<FooterSettings>(() => {
    const initialColumns: FooterColumn[] = (settings?.columns && settings.columns.length > 0)
      ? settings.columns
      : defaultFooterColumns;

    return {
      backgroundColor: settings?.backgroundColor || '#70C332',
      textColor: settings?.textColor || '#ffffff',
      copyrightText: settings?.copyrightText || '',
      aboutTitle: settings?.aboutTitle || '',
      aboutDescription: settings?.aboutDescription || '',
      customPhone: settings?.customPhone || '',
      customAddress: settings?.customAddress || '',
      customEmail: settings?.customEmail || '',
      showPhone: settings?.showPhone !== undefined ? settings.showPhone : true,
      showAddress: settings?.showAddress !== undefined ? settings.showAddress : true,
      showEmail: settings?.showEmail !== undefined ? settings.showEmail : false,
      columns: initialColumns,
      ...settings,
    };
  });

  const updateColumnTitle = (colIndex: number, title: string) => {
    const updated = [...(form.columns || [])];
    updated[colIndex] = { ...updated[colIndex], title };
    setForm({ ...form, columns: updated });
  };

  const addColumn = () => {
    const newCol: FooterColumn = {
      id: `col-${Date.now()}`,
      title: `নতুন কলাম ${(form.columns?.length || 0) + 1}`,
      links: [
        { id: `link-${Date.now()}-1`, title: 'নতুন লিংক', url: '/' },
      ],
    };
    setForm({ ...form, columns: [...(form.columns || []), newCol] });
  };

  const removeColumn = (colIndex: number) => {
    const updated = (form.columns || []).filter((_, idx) => idx !== colIndex);
    setForm({ ...form, columns: updated });
  };

  const addLinkToColumn = (colIndex: number) => {
    const updated = [...(form.columns || [])];
    const currentLinks = updated[colIndex].links || [];
    updated[colIndex] = {
      ...updated[colIndex],
      links: [
        ...currentLinks,
        { id: `link-${Date.now()}`, title: '', url: '' },
      ],
    };
    setForm({ ...form, columns: updated });
  };

  const updateLink = (colIndex: number, linkIndex: number, field: 'title' | 'url', value: string) => {
    const updated = [...(form.columns || [])];
    const links = [...(updated[colIndex].links || [])];
    links[linkIndex] = { ...links[linkIndex], [field]: value };
    updated[colIndex] = { ...updated[colIndex], links };
    setForm({ ...form, columns: updated });
  };

  const removeLink = (colIndex: number, linkIndex: number) => {
    const updated = [...(form.columns || [])];
    const links = (updated[colIndex].links || []).filter((_, idx) => idx !== linkIndex);
    updated[colIndex] = { ...updated[colIndex], links };
    setForm({ ...form, columns: updated });
  };

  const moveLink = (colIndex: number, linkIndex: number, direction: 'up' | 'down') => {
    const updated = [...(form.columns || [])];
    const links = [...(updated[colIndex].links || [])];
    const targetIndex = direction === 'up' ? linkIndex - 1 : linkIndex + 1;
    if (targetIndex < 0 || targetIndex >= links.length) return;
    const temp = links[linkIndex];
    links[linkIndex] = links[targetIndex];
    links[targetIndex] = temp;
    updated[colIndex] = { ...updated[colIndex], links };
    setForm({ ...form, columns: updated });
  };

  const applyPresetToLink = (colIndex: number, linkIndex: number, presetUrl: string) => {
    const preset = quickLinkPresets.find(p => p.url === presetUrl);
    if (!preset) return;
    const updated = [...(form.columns || [])];
    const links = [...(updated[colIndex].links || [])];
    links[linkIndex] = { ...links[linkIndex], title: preset.title, url: preset.url };
    updated[colIndex] = { ...updated[colIndex], links };
    setForm({ ...form, columns: updated });
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-6">
      {/* 1. Footer Colors */}
      <div className="border rounded-lg p-5 bg-card space-y-4">
        <h3 className="font-semibold text-base flex items-center gap-2">
          <Palette className="h-4 w-4 text-primary" />
          ফুটার রঙ ও স্টাইল (Footer Colors)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Footer Background Color</Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={normalizeToHex(form.backgroundColor || '#70C332')}
                onChange={(e) => setForm({ ...form, backgroundColor: e.target.value })}
                className="w-12 h-10 rounded cursor-pointer border"
              />
              <Input
                value={normalizeToHex(form.backgroundColor || '#70C332')}
                onChange={(e) => setForm({ ...form, backgroundColor: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Footer Text Color</Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={normalizeToHex(form.textColor || '#ffffff')}
                onChange={(e) => setForm({ ...form, textColor: e.target.value })}
                className="w-12 h-10 rounded cursor-pointer border"
              />
              <Input
                value={normalizeToHex(form.textColor || '#ffffff')}
                onChange={(e) => setForm({ ...form, textColor: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Column 1: Store Information / About */}
      <div className="border rounded-lg p-5 bg-card space-y-4">
        <h3 className="font-semibold text-base flex items-center gap-2">
          <Phone className="h-4 w-4 text-primary" />
          কোম্পানি পরিচিতি ও যোগাযোগ (Column 1 - Brand & Contact)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>ব্র্যান্ড / হেডিং নাম (Brand Title)</Label>
            <Input
              value={form.aboutTitle || ''}
              onChange={(e) => setForm({ ...form, aboutTitle: e.target.value })}
              placeholder="যেমনঃ UpShop BD (ফাঁকা রাখলে সাইট নাম দেখাবে)"
            />
          </div>
          <div className="space-y-2">
            <Label>সংক্ষিপ্ত বিবরণ (About Description - Optional)</Label>
            <Input
              value={form.aboutDescription || ''}
              onChange={(e) => setForm({ ...form, aboutDescription: e.target.value })}
              placeholder="যেমনঃ পছন্দের সেরা পণ্য দ্রুত ডেলিভারিতে"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-muted-foreground" /> ফোন নম্বর (Phone)
              </Label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{form.showPhone ? 'সক্রিয়' : 'লুকানো'}</span>
                <Switch
                  checked={form.showPhone !== false}
                  onCheckedChange={(checked) => setForm({ ...form, showPhone: checked })}
                />
              </div>
            </div>
            <Input
              value={form.customPhone || ''}
              onChange={(e) => setForm({ ...form, customPhone: e.target.value })}
              placeholder="কাস্টম ফোন (ফাঁকা রাখলে General Settings এর ফোন দেখাবে)"
              disabled={form.showPhone === false}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" /> ঠিকানা (Address)
              </Label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{form.showAddress ? 'সক্রিয়' : 'লুকানো'}</span>
                <Switch
                  checked={form.showAddress !== false}
                  onCheckedChange={(checked) => setForm({ ...form, showAddress: checked })}
                />
              </div>
            </div>
            <Input
              value={form.customAddress || ''}
              onChange={(e) => setForm({ ...form, customAddress: e.target.value })}
              placeholder="কাস্টম ঠিকানা (ফাঁকা রাখলে General Settings এর ঠিকানা দেখাবে)"
              disabled={form.showAddress === false}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-muted-foreground" /> ইমেইল (Email - Optional)
              </Label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{form.showEmail ? 'সক্রিয়' : 'লুকানো'}</span>
                <Switch
                  checked={form.showEmail === true}
                  onCheckedChange={(checked) => setForm({ ...form, showEmail: checked })}
                />
              </div>
            </div>
            <Input
              value={form.customEmail || ''}
              onChange={(e) => setForm({ ...form, customEmail: e.target.value })}
              placeholder="যেমনঃ support@upshopbd.com"
              disabled={form.showEmail !== true}
            />
          </div>
        </div>
      </div>

      {/* 3. Quick Link Columns (Dynamic & Full Customization) */}
      <div className="border rounded-lg p-5 bg-card space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b">
          <div>
            <h3 className="font-semibold text-base flex items-center gap-2">
              <Columns className="h-4 w-4 text-primary" />
              ফুটার কুইক লিংক কলামসমূহ (Footer Quick Link Columns)
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              যেকোনো কলাম ও লিংক কাস্টমাইজ করুন, নতুন লিংক যোগ করুন অথবা ডিলিট করুন।
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addColumn}
            className="flex items-center gap-1.5 self-start sm:self-auto border-primary/40 text-primary hover:bg-primary/10"
          >
            <Plus className="h-4 w-4" />
            নতুন কলাম যোগ করুন (Add Column)
          </Button>
        </div>

        {/* List of Columns */}
        <div className="space-y-5">
          {(form.columns || []).map((col, colIdx) => (
            <div
              key={col.id || colIdx}
              className="border border-border/80 rounded-lg p-4 bg-muted/20 space-y-4 shadow-xs"
            >
              {/* Column Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
                <div className="flex-1 max-w-sm flex items-center gap-2">
                  <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded">
                    কলাম {colIdx + 2}
                  </span>
                  <Input
                    value={col.title}
                    onChange={(e) => updateColumnTitle(colIdx, e.target.value)}
                    placeholder="কলামের শিরোনাম (যেমনঃ কোম্পানি)"
                    className="font-medium bg-background"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    ({col.links?.length || 0} টি লিংক)
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeColumn(colIdx)}
                    className="text-destructive hover:bg-destructive/10 h-8 px-2"
                    title="কলামটি মুছে ফেলুন"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    মুছুন
                  </Button>
                </div>
              </div>

              {/* Column Links */}
              <div className="space-y-2.5">
                {(col.links || []).length === 0 ? (
                  <div className="text-center py-4 text-xs text-muted-foreground border border-dashed rounded-md">
                    এই কলামে কোনো লিংক নেই। নিচের বোতামে ক্লিক করে লিংক যোগ করুন।
                  </div>
                ) : (
                  col.links.map((link, linkIdx) => (
                    <div
                      key={link.id || linkIdx}
                      className="flex flex-col md:flex-row items-stretch md:items-center gap-2 p-2.5 rounded-md bg-background border border-border/70 text-sm"
                    >
                      {/* Link Title */}
                      <div className="flex-1 min-w-[150px]">
                        <Input
                          value={link.title}
                          onChange={(e) => updateLink(colIdx, linkIdx, 'title', e.target.value)}
                          placeholder="লিংক নাম (যেমনঃ আমাদের সম্পর্কে)"
                          className="h-8 text-xs"
                        />
                      </div>

                      {/* Link URL */}
                      <div className="flex-1 min-w-[160px]">
                        <Input
                          value={link.url}
                          onChange={(e) => updateLink(colIdx, linkIdx, 'url', e.target.value)}
                          placeholder="URL (যেমনঃ /about অথবা https://...)"
                          className="h-8 text-xs"
                        />
                      </div>

                      {/* Preset Selector */}
                      <div className="w-full md:w-44">
                        <Select
                          onValueChange={(val) => applyPresetToLink(colIdx, linkIdx, val)}
                        >
                          <SelectTrigger className="h-8 text-xs bg-muted/30">
                            <SelectValue placeholder="প্রিসেট বাছুন..." />
                          </SelectTrigger>
                          <SelectContent className="max-h-64">
                            {quickLinkPresets.map((preset) => (
                              <SelectItem key={preset.url + preset.title} value={preset.url} className="text-xs">
                                {preset.title} ({preset.url})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Move Up / Down & Delete */}
                      <div className="flex items-center gap-1 justify-end">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-foreground"
                          disabled={linkIdx === 0}
                          onClick={() => moveLink(colIdx, linkIdx, 'up')}
                          title="উপরে নিন"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-foreground"
                          disabled={linkIdx === (col.links.length - 1)}
                          onClick={() => moveLink(colIdx, linkIdx, 'down')}
                          title="নিচে নিন"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:bg-destructive/10"
                          onClick={() => removeLink(colIdx, linkIdx)}
                          title="লিংক মুছুন"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Add Link Button */}
              <div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addLinkToColumn(colIdx)}
                  className="h-8 text-xs flex items-center gap-1 hover:bg-primary/5"
                >
                  <Plus className="h-3.5 w-3.5" />
                  নতুন লিংক যোগ করুন (Add Link)
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Copyright Text */}
      <div className="border rounded-lg p-5 bg-card space-y-3">
        <Label className="font-semibold text-base">কপিরাইট টেক্সট (Copyright Text)</Label>
        <Input
          value={form.copyrightText || ''}
          onChange={(e) => setForm({ ...form, copyrightText: e.target.value })}
          placeholder="যেমনঃ Copyright © 2026 All Rights by UpShop BD."
        />
        <p className="text-xs text-muted-foreground">
          ফাঁকা রাখলে স্বয়ংক্রিয়ভাবে চলতি বছর এবং সাইটের নাম দিয়ে কপিরাইট টেক্সট তৈরি হবে।
        </p>
      </div>

      {/* Save Button */}
      <div className="pt-2">
        <Button type="submit" size="lg" className="w-full sm:w-auto px-8 font-semibold">
          Save Changes
        </Button>
      </div>
    </form>
  );
};

const SocialSettingsForm = ({ settings, onSave }: { settings?: SocialSettings; onSave: (value: SocialSettings) => void }) => {
  const [form, setForm] = useState<SocialSettings>(settings || { facebook: '', instagram: '', twitter: '', youtube: '', linkedin: '' });
  const fields = [
    { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/yourpage' },
    { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/yourpage' },
    { key: 'twitter', label: 'Twitter/X', placeholder: 'https://twitter.com/yourpage' },
    { key: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/yourchannel' },
    { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/company/yourpage' },
  ];
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map(({ key, label, placeholder }) => (
          <div key={key} className="space-y-2"><Label>{label}</Label><Input value={form[key] || ''} onChange={(e) => setForm({ ...form, [key]: e.target.value })} placeholder={placeholder} /></div>
        ))}
      </div>
      <Button type="submit">Save Changes</Button>
    </form>
  );
};

const SectionSettingsForm = ({ settings, onSave }: { settings?: SectionSettings; onSave: (value: SectionSettings) => void }) => {
  const [form, setForm] = useState<SectionSettings>(settings || { categorySectionBgColor: '#2563eb', productGridColumns: 6, mobileProductGridColumns: 2 });
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2"><Label>Category Section Background Color</Label>
          <div className="flex gap-2"><input type="color" value={normalizeToHex(form.categorySectionBgColor || '')} onChange={(e) => setForm({ ...form, categorySectionBgColor: e.target.value })} className="w-12 h-10 rounded cursor-pointer border" /><Input value={normalizeToHex(form.categorySectionBgColor || '')} onChange={(e) => setForm({ ...form, categorySectionBgColor: e.target.value })} /></div>
        </div>
        <div className="space-y-2"><Label>Desktop Grid Columns</Label>
          <Select value={String(form.productGridColumns || 6)} onValueChange={(v) => setForm({ ...form, productGridColumns: parseInt(v) })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{[3,4,5,6,7,8,9,10].map(n => <SelectItem key={n} value={String(n)}>{n} Columns</SelectItem>)}</SelectContent></Select>
        </div>
        <div className="space-y-2"><Label>Mobile Grid Columns</Label>
          <Select value={String(form.mobileProductGridColumns || 2)} onValueChange={(v) => setForm({ ...form, mobileProductGridColumns: parseInt(v) })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{[1,2,3,4].map(n => <SelectItem key={n} value={String(n)}>{n} Column{n>1?'s':''}</SelectItem>)}</SelectContent></Select>
        </div>
      </div>
      <Button type="submit">Save Changes</Button>
    </form>
  );
};

const TrackingSettingsForm = ({ settings, onSave }: { settings?: TrackingSettings; onSave: (value: TrackingSettings) => void }) => {
  const [form, setForm] = useState<TrackingSettings>(settings || { facebookPixelId: '', googleAnalyticsId: '', googleTagManagerId: '', tikTokPixelId: '', customHeadScripts: '', customBodyScripts: '' });
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2"><Label>Facebook Pixel ID</Label><Input value={form.facebookPixelId || ''} onChange={(e) => setForm({ ...form, facebookPixelId: e.target.value })} placeholder="123456789012345" /></div>
        <div className="space-y-2"><Label>Google Analytics ID</Label><Input value={form.googleAnalyticsId || ''} onChange={(e) => setForm({ ...form, googleAnalyticsId: e.target.value })} placeholder="G-XXXXXXXXXX" /></div>
        <div className="space-y-2"><Label>Google Tag Manager ID</Label><Input value={form.googleTagManagerId || ''} onChange={(e) => setForm({ ...form, googleTagManagerId: e.target.value })} placeholder="GTM-XXXXXXX" /></div>
        <div className="space-y-2"><Label>TikTok Pixel ID</Label><Input value={form.tikTokPixelId || ''} onChange={(e) => setForm({ ...form, tikTokPixelId: e.target.value })} placeholder="CXXXXXXXXXXXXXXXXX" /></div>
      </div>
      <div className="space-y-4">
        <div className="space-y-2"><Label>Custom Head Scripts</Label><Textarea value={form.customHeadScripts || ''} onChange={(e) => setForm({ ...form, customHeadScripts: e.target.value })} placeholder="<script>...</script>" rows={5} className="font-mono text-sm" /></div>
        <div className="space-y-2"><Label>Custom Body Scripts</Label><Textarea value={form.customBodyScripts || ''} onChange={(e) => setForm({ ...form, customBodyScripts: e.target.value })} placeholder="<noscript>...</noscript>" rows={5} className="font-mono text-sm" /></div>
      </div>
      <Button type="submit">Save Changes</Button>
    </form>
  );
};

const HelplineSettingsForm = ({ settings, onSave }: { settings?: HelplineSettings; onSave: (value: HelplineSettings) => void }) => {
  const [form, setForm] = useState<HelplineSettings>(settings || {
    enabled: true,
    whatsapp_number: '',
    whatsapp_message: 'আসসালামু আলাইকুম, আমি UpShop BD থেকে কেনাকাটা করতে সাহায্য চাই।',
    messenger_username: '',
    phone_number: '',
    position: 'bottom-right',
    show_on_mobile: true,
    show_on_desktop: true,
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-6">
      <div className="flex items-center justify-between p-4 rounded-xl border bg-muted/20">
        <div>
          <Label className="font-semibold text-base">হেল্পলাইন উইজেট চালু রাখুন</Label>
          <p className="text-xs text-muted-foreground mt-0.5">
            স্ক্রিনের কোণায় কাস্টমারদের জন্য ফ্লোটিং বাটন (WhatsApp / Messenger / Call) প্রদর্শিত হবে।
          </p>
        </div>
        <Switch
          checked={form.enabled !== false}
          onCheckedChange={(val) => setForm({ ...form, enabled: val })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            WhatsApp নম্বর
          </Label>
          <Input
            value={form.whatsapp_number || ''}
            onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })}
            placeholder="01712345678 বা 8801712345678"
          />
          <p className="text-[11px] text-muted-foreground">
            দেশের কোডসহ বা ছাড়া লিখুন (যেমন: 017xxxxxxxx বা 88017xxxxxxxx)
          </p>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            Facebook Page / Messenger ইউজারনেম বা লিংক
          </Label>
          <Input
            value={form.messenger_username || ''}
            onChange={(e) => setForm({ ...form, messenger_username: e.target.value })}
            placeholder="upshopbd বা https://m.me/upshopbd"
          />
          <p className="text-[11px] text-muted-foreground">
            আপনার ফেসবুক পেইজের ইউজারনেম লিখুন (যেমন: upshopbd)
          </p>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-1.5 font-medium">
            <Phone className="h-3.5 w-3.5 text-primary" />
            সরাসরি হেল্পলাইন কল নম্বর (ঐচ্ছিক)
          </Label>
          <Input
            value={form.phone_number || ''}
            onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
            placeholder="01712345678"
          />
          <p className="text-[11px] text-muted-foreground">
            কাস্টমার ক্লিক করলে সরাসরি আপনার নম্বরে কল ডায়াল হবে
          </p>
        </div>

        <div className="space-y-2">
          <Label>স্ক্রিনে বাটনের পজিশন</Label>
          <Select
            value={form.position || 'bottom-right'}
            onValueChange={(v: 'bottom-right' | 'bottom-left') => setForm({ ...form, position: v })}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="bottom-right">ডান পাশে নিচে (Bottom Right - প্রস্তাবিত)</SelectItem>
              <SelectItem value="bottom-left">বাম পাশে নিচে (Bottom Left)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>WhatsApp ডিফল্ট শুভেচ্ছা বার্তা</Label>
        <Textarea
          value={form.whatsapp_message || ''}
          onChange={(e) => setForm({ ...form, whatsapp_message: e.target.value })}
          placeholder="আসসালামু আলাইকুম, আমি UpShop BD থেকে কেনাকাটা করতে সাহায্য চাই।"
          rows={2}
        />
        <p className="text-[11px] text-muted-foreground">
          কাস্টমার WhatsApp বাটনে ক্লিক করলে এই মেসেজটি চ্যাটবক্সে স্বয়ংক্রিয়ভাবে তৈরি থাকবে।
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl border bg-muted/10">
        <div className="flex items-center justify-between">
          <div>
            <Label className="font-medium text-sm">মোবাইলে দেখান</Label>
            <p className="text-[11px] text-muted-foreground">মোবাইল ভিজিটরদের হেল্পলাইন উইজেট দেখান</p>
          </div>
          <Switch
            checked={form.show_on_mobile !== false}
            onCheckedChange={(val) => setForm({ ...form, show_on_mobile: val })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className="font-medium text-sm">ডেস্কটপে দেখান</Label>
            <p className="text-[11px] text-muted-foreground">কম্পিউটার/ল্যাপটপ ভিজিটরদের হেল্পলাইন উইজেট দেখান</p>
          </div>
          <Switch
            checked={form.show_on_desktop !== false}
            onCheckedChange={(val) => setForm({ ...form, show_on_desktop: val })}
          />
        </div>
      </div>

      <Button type="submit">Save Changes</Button>
    </form>
  );
};

// Telegram Bot Settings Form
const TelegramSettingsForm = ({
  settings,
  onSave,
}: {
  settings?: TelegramSettings;
  onSave: (value: TelegramSettings) => void;
}) => {
  const [form, setForm] = useState<TelegramSettings>({
    isEnabled: settings?.isEnabled || false,
    botToken: settings?.botToken || '',
    chatId: settings?.chatId || '',
  });
  const [showToken, setShowToken] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const handleTest = async () => {
    if (!form.botToken?.trim() || !form.chatId?.trim()) {
      toast.error('দয়া করে প্রথমে Bot Token এবং Chat ID ইনপুট বক্সে লিখুন।');
      return;
    }
    setIsTesting(true);
    try {
      const res: any = await api.post('/site-settings/test-telegram', {
        bot_token: form.botToken.trim(),
        chat_id: form.chatId.trim(),
      });
      toast.success(res?.message || 'সফলভাবে টেলিগ্রাম টেস্ট নোটিফিকেশন পাঠানো হয়েছে! টেলিগ্রাম চেক করুন।');
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'টেলিগ্রাম টেস্ট মেসেজ পাঠানো যায়নি';
      toast.error(msg);
    } finally {
      setIsTesting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Top Status Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border bg-card shadow-xs gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border border-sky-200/50">
            <Send className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Label className="font-semibold text-base">টেলিগ্রাম অর্ডার নোটিফিকেশন</Label>
              {form.isEnabled ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
                  <CheckCircle2 className="h-3 w-3 mr-1" /> সক্রিয় (Active)
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                  নিষ্ক্রিয় (Disabled)
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              চালু থাকলে যেকোনো নতুন অর্ডার আসার সাথে সাথে তাৎক্ষণিক টেলিগ্রামে বিস্তারিত নোটিফিকেশন পাঠানো হবে
            </p>
          </div>
        </div>
        <Switch
          checked={form.isEnabled || false}
          onCheckedChange={(val) => setForm({ ...form, isEnabled: val })}
        />
      </div>

      {/* Configuration Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Bot Token */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="font-medium text-sm flex items-center gap-1.5">
              <Bot className="h-4 w-4 text-sky-500" />
              টেলিগ্রাম বট টোকেন (Bot Token) <span className="text-destructive">*</span>
            </Label>
          </div>
          <div className="relative">
            <Input
              type={showToken ? 'text' : 'password'}
              value={form.botToken || ''}
              onChange={(e) => setForm({ ...form, botToken: e.target.value })}
              placeholder="যেমন: 7123456789:AAHkYqX12345abcdef..."
              className="pr-10 font-mono text-sm"
            />
            <button
              type="button"
              onClick={() => setShowToken(!showToken)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
            >
              {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Telegram-এর <code className="text-sky-600 dark:text-sky-400 font-semibold">@BotFather</code> থেকে পাওয়া বটের গোপন API টোকেন
          </p>
        </div>

        {/* Chat ID */}
        <div className="space-y-2">
          <Label className="font-medium text-sm flex items-center gap-1.5">
            <MessageSquare className="h-4 w-4 text-sky-500" />
            টেলিগ্রাম চ্যাট আইডি বা গ্রুপ আইডি (Chat ID) <span className="text-destructive">*</span>
          </Label>
          <Input
            type="text"
            value={form.chatId || ''}
            onChange={(e) => setForm({ ...form, chatId: e.target.value })}
            placeholder="ব্যক্তিগত: 123456789 বা গ্রুপ: -100123456789"
            className="font-mono text-sm"
          />
          <p className="text-[11px] text-muted-foreground">
            আপনার ব্যক্তিগত আইডি অথবা অ্যাডমিন গ্রুপের আইডি (<code className="text-sky-600 dark:text-sky-400 font-semibold">@userinfobot</code> দিয়ে বের করতে পারেন)
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <Button type="submit" className="px-6">
          সেভ করুন (Save Settings)
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleTest}
          disabled={isTesting}
          className="border-sky-300 hover:bg-sky-50 hover:text-sky-700 dark:border-sky-800 dark:hover:bg-sky-950/40 text-sky-600 dark:text-sky-400"
        >
          {isTesting ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-sky-500 border-t-transparent" />
              টেস্ট পাঠানো হচ্ছে...
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <Send className="h-4 w-4" />
              টেস্ট মেসেজ পাঠান (Send Test Notification)
            </span>
          )}
        </Button>
      </div>

      {/* Step by Step Guide Card */}
      <div className="rounded-xl border border-sky-100 dark:border-sky-950 bg-sky-50/50 dark:bg-sky-950/20 p-5 space-y-4">
        <div className="flex items-center gap-2 text-sky-700 dark:text-sky-300 font-semibold text-sm">
          <HelpCircle className="h-5 w-5 flex-shrink-0" />
          কীভাবে ১ মিনিটে টেলিগ্রাম বট সেটআপ করবেন? (সহজ গাইড)
        </div>
        <ol className="list-decimal list-inside space-y-2 text-xs text-muted-foreground leading-relaxed">
          <li>
            আপনার ফোনে বা কম্পিউটারে <strong>Telegram</strong> অ্যাপ খুলুন এবং সার্চ বারে <code className="bg-sky-100 dark:bg-sky-900/60 px-1.5 py-0.5 rounded text-sky-800 dark:text-sky-200 font-mono font-bold">@BotFather</code> লিখে চ্যাটে প্রবেশ করে <strong>Start</strong> চাপুন।
          </li>
          <li>
            মেসেজে লিখুন <strong>/newbot</strong> এবং সেন্ড করুন। এরপর আপনার বটের একটি নাম দিন (যেমন: <i>UpShop BD Notifier</i>)।
          </li>
          <li>
            এবার বটের একটি অনন্য ইউজারনেম দিন যার শেষে <code>bot</code> থাকতে হবে (যেমন: <i>upshopbd_order_bot</i>)।
          </li>
          <li>
            BotFather সাথে সাথে আপনাকে একটি <strong>HTTP API Token</strong> দেবে (যেমন: <code>7123456789:AAHkYqX...</code>)। সেটি কপি করে উপরের <strong>Bot Token</strong> বক্সে পেস্ট করুন।
          </li>
          <li>
            তৈরি করা বটের লিংকে ক্লিক করে বটে প্রবেশ করুন এবং অবশ্যই একবার <strong>Start</strong> বাটনে চাপ দিন (বট চালু করার জন্য এটি বাধ্যতামূলক)।
          </li>
          <li>
            নিজের <strong>Chat ID</strong> বের করতে টেলিগ্রামে <code className="bg-sky-100 dark:bg-sky-900/60 px-1.5 py-0.5 rounded text-sky-800 dark:text-sky-200 font-mono font-bold">@userinfobot</code> সার্চ করে Start চাপুন। বটটি আপনাকে আপনার <strong>Id</strong> নম্বর দেবে (যেমন: <code>123456789</code>)। সেটি কপি করে উপরের <strong>Chat ID</strong> বক্সে বসান।
          </li>
          <li>
            (ঐচ্ছিক: গ্রুপে নোটিফিকেশন পেতে চাইলে একটি টেলিগ্রাম গ্রুপ খুলে আপনার বটটিকে অ্যাডমিন হিসেবে অ্যাড করুন এবং গ্রুপের আইডি দিন)।
          </li>
          <li>
            সবশেষে <strong>"টেস্ট মেসেজ পাঠান"</strong> বাটনে ক্লিক করে চেক করুন এবং <strong>"Save Settings"</strong> বাটনে ক্লিক করুন!
          </li>
        </ol>
      </div>
    </form>
  );
};

// Payment Methods Settings Form (COD, bKash, Nagad, Rocket)
const PaymentSettingsForm = ({
  settings,
  onSave,
}: {
  settings?: PaymentSettings;
  onSave: (value: PaymentSettings) => void;
}) => {
  const [form, setForm] = useState<PaymentSettings>({
    cod: {
      enabled: settings?.cod?.enabled !== false,
      title: settings?.cod?.title || 'ক্যাশ অন ডেলিভারি (Cash on Delivery)',
      instructions: settings?.cod?.instructions || 'পণ্য হাতে পেয়ে মূল্য পরিশোধ করুন।',
    },
    bkash: {
      enabled: settings?.bkash?.enabled || false,
      number: settings?.bkash?.number || '',
      accountType: settings?.bkash?.accountType || 'personal',
      instructions: settings?.bkash?.instructions || 'আমাদের বিকাশ নম্বরে Send Money করুন এবং নিচের বক্সে আপনার বিকাশ নম্বর ও Transaction ID (TrxID) লিখুন।',
    },
    nagad: {
      enabled: settings?.nagad?.enabled || false,
      number: settings?.nagad?.number || '',
      accountType: settings?.nagad?.accountType || 'personal',
      instructions: settings?.nagad?.instructions || 'আমাদের নগদ নম্বরে Send Money করুন এবং নিচের বক্সে আপনার নগদ নম্বর ও Transaction ID (TrxID) লিখুন।',
    },
    rocket: {
      enabled: settings?.rocket?.enabled || false,
      number: settings?.rocket?.number || '',
      accountType: settings?.rocket?.accountType || 'personal',
      instructions: settings?.rocket?.instructions || 'আমাদের রকেট নম্বরে Send Money করুন এবং নিচের বক্সে আপনার রকেট নম্বর ও Transaction ID (TrxID) লিখুন।',
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. Cash On Delivery */}
      <div className="rounded-xl border p-5 bg-card shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base">ক্যাশ অন ডেলিভারি (Cash on Delivery)</h3>
              <p className="text-xs text-muted-foreground">কাস্টমার পার্সেল রিসিভ করার পর টাকা দেবে</p>
            </div>
          </div>
          <Switch
            checked={form.cod?.enabled !== false}
            onCheckedChange={(val) => setForm({ ...form, cod: { ...form.cod, enabled: val } })}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">মেথড টাইটেল</Label>
            <Input
              value={form.cod?.title || ''}
              onChange={(e) => setForm({ ...form, cod: { ...form.cod, title: e.target.value, enabled: form.cod?.enabled !== false } })}
              placeholder="ক্যাশ অন ডেলিভারি"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">নির্দেশনা বার্তা</Label>
            <Input
              value={form.cod?.instructions || ''}
              onChange={(e) => setForm({ ...form, cod: { ...form.cod, instructions: e.target.value, enabled: form.cod?.enabled !== false } })}
              placeholder="পণ্য হাতে পেয়ে মূল্য পরিশোধ করুন।"
            />
          </div>
        </div>
      </div>

      {/* 2. bKash (বিকাশ) */}
      <div className="rounded-xl border border-pink-200 dark:border-pink-900/50 p-5 bg-pink-50/20 dark:bg-pink-950/10 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-pink-100 dark:border-pink-900/40">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#d12053] text-white flex items-center justify-center font-bold text-lg shadow-xs">
              ব
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-base text-[#d12053]">বিকাশ (bKash Manual / Send Money)</h3>
                {form.bkash?.enabled && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-100 text-[#d12053] font-bold">
                    সক্রিয়
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">কাস্টমার আপনার বিকাশ নম্বরে টাকা পাঠিয়ে TrxID সাবমিট করবে</p>
            </div>
          </div>
          <Switch
            checked={form.bkash?.enabled || false}
            onCheckedChange={(val) => setForm({ ...form, bkash: { ...form.bkash, enabled: val } })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">দোকানের বিকাশ নম্বর <span className="text-destructive">*</span></Label>
            <Input
              value={form.bkash?.number || ''}
              onChange={(e) => setForm({ ...form, bkash: { ...form.bkash, number: e.target.value, enabled: form.bkash?.enabled ?? true } })}
              placeholder="01XXXXXXXXX"
              className="font-mono text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">অ্যাকাউন্ট টাইপ</Label>
            <Select
              value={form.bkash?.accountType || 'personal'}
              onValueChange={(val: any) => setForm({ ...form, bkash: { ...form.bkash, accountType: val, enabled: form.bkash?.enabled ?? true } })}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="personal">Personal (ব্যক্তিগত - Send Money)</SelectItem>
                <SelectItem value="merchant">Merchant (মার্চেন্ট - Payment)</SelectItem>
                <SelectItem value="agent">Agent (এজেন্ট - Cash In)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-medium">কাস্টমারের জন্য নির্দেশনা</Label>
          <Textarea
            value={form.bkash?.instructions || ''}
            onChange={(e) => setForm({ ...form, bkash: { ...form.bkash, instructions: e.target.value, enabled: form.bkash?.enabled ?? true } })}
            placeholder="আমাদের বিকাশ নম্বরে Send Money করুন এবং নিচের বক্সে আপনার বিকাশ নম্বর ও Transaction ID (TrxID) লিখুন।"
            rows={2}
          />
        </div>
      </div>

      {/* 3. Nagad (নগদ) */}
      <div className="rounded-xl border border-orange-200 dark:border-orange-900/50 p-5 bg-orange-50/20 dark:bg-orange-950/10 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-orange-100 dark:border-orange-900/40">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#f7941d] text-white flex items-center justify-center font-bold text-lg shadow-xs">
              ন
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-base text-[#ea580c]">নগদ (Nagad Manual / Send Money)</h3>
                {form.nagad?.enabled && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-100 text-[#ea580c] font-bold">
                    সক্রিয়
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">কাস্টমার আপনার নগদ নম্বরে টাকা পাঠিয়ে TrxID সাবমিট করবে</p>
            </div>
          </div>
          <Switch
            checked={form.nagad?.enabled || false}
            onCheckedChange={(val) => setForm({ ...form, nagad: { ...form.nagad, enabled: val } })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">দোকানের নগদ নম্বর <span className="text-destructive">*</span></Label>
            <Input
              value={form.nagad?.number || ''}
              onChange={(e) => setForm({ ...form, nagad: { ...form.nagad, number: e.target.value, enabled: form.nagad?.enabled ?? true } })}
              placeholder="01XXXXXXXXX"
              className="font-mono text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">অ্যাকাউন্ট টাইপ</Label>
            <Select
              value={form.nagad?.accountType || 'personal'}
              onValueChange={(val: any) => setForm({ ...form, nagad: { ...form.nagad, accountType: val, enabled: form.nagad?.enabled ?? true } })}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="personal">Personal (ব্যক্তিগত - Send Money)</SelectItem>
                <SelectItem value="merchant">Merchant (মার্চেন্ট - Payment)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-medium">কাস্টমারের জন্য নির্দেশনা</Label>
          <Textarea
            value={form.nagad?.instructions || ''}
            onChange={(e) => setForm({ ...form, nagad: { ...form.nagad, instructions: e.target.value, enabled: form.nagad?.enabled ?? true } })}
            placeholder="আমাদের নগদ নম্বরে Send Money করুন এবং নিচের বক্সে আপনার নগদ নম্বর ও Transaction ID (TrxID) লিখুন।"
            rows={2}
          />
        </div>
      </div>

      {/* 4. Rocket (রকেট) */}
      <div className="rounded-xl border border-purple-200 dark:border-purple-900/50 p-5 bg-purple-50/20 dark:bg-purple-950/10 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-purple-100 dark:border-purple-900/40">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#8c3494] text-white flex items-center justify-center font-bold text-lg shadow-xs">
              র
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-base text-[#8c3494]">রকেট (Rocket Manual / Send Money)</h3>
                {form.rocket?.enabled && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-[#8c3494] font-bold">
                    সক্রিয়
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">কাস্টমার আপনার রকেট নম্বরে টাকা পাঠিয়ে TrxID সাবমিট করবে</p>
            </div>
          </div>
          <Switch
            checked={form.rocket?.enabled || false}
            onCheckedChange={(val) => setForm({ ...form, rocket: { ...form.rocket, enabled: val } })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">দোকানের রকেট নম্বর (১২ ডিজিট) <span className="text-destructive">*</span></Label>
            <Input
              value={form.rocket?.number || ''}
              onChange={(e) => setForm({ ...form, rocket: { ...form.rocket, number: e.target.value, enabled: form.rocket?.enabled ?? true } })}
              placeholder="01XXXXXXXXX-X"
              className="font-mono text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">অ্যাকাউন্ট টাইপ</Label>
            <Select
              value={form.rocket?.accountType || 'personal'}
              onValueChange={(val: any) => setForm({ ...form, rocket: { ...form.rocket, accountType: val, enabled: form.rocket?.enabled ?? true } })}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="personal">Personal (ব্যক্তিগত - Send Money)</SelectItem>
                <SelectItem value="merchant">Merchant (মার্চেন্ট - Payment)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-medium">কাস্টমারের জন্য নির্দেশনা</Label>
          <Textarea
            value={form.rocket?.instructions || ''}
            onChange={(e) => setForm({ ...form, rocket: { ...form.rocket, instructions: e.target.value, enabled: form.rocket?.enabled ?? true } })}
            placeholder="আমাদের রকেট নম্বরে Send Money করুন এবং নিচের বক্সে আপনার রকেট নম্বর ও Transaction ID (TrxID) লিখুন।"
            rows={2}
          />
        </div>
      </div>

      <Button type="submit" className="px-7">
        পেমেন্ট সেটিংস সেভ করুন (Save Payment Settings)
      </Button>
    </form>
  );
};

export default SiteSettingsPage;
