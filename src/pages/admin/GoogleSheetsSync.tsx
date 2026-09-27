import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';
import {
  FileSpreadsheet,
  Download,
  Upload,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Eye,
  ExternalLink,
  HelpCircle,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const SAMPLE_CSV_CONTENT = `name,category,price,sale_price,stock_quantity,description,image_url,status
Luxury Leather Men Watch,Watches,3500,2800,50,"Water resistant premium quartz watch for men","https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800",active
Classic Cotton Polo Shirt,Apparel,1250,950,100,"100% combed cotton breathable polo shirt","https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800",active
Running Breathable Sneakers,Shoes,2400,1950,40,"Lightweight sports running sneakers with cushion sole","https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800",active
Non-Stick Kitchen Cookware,Kitchenware,4200,3400,25,"Premium 5-piece non-stick induction cookware set","https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800",active`;

const GoogleSheetsSync = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [sheetUrl, setSheetUrl] = useState('');
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [lastSyncedCount, setLastSyncedCount] = useState<number>(0);

  const [isLoadingSettings, setIsLoadingSettings] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);

  const [previewData, setPreviewData] = useState<{
    total_rows: number;
    headers: string[];
    preview: any[];
  } | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const [syncResult, setSyncResult] = useState<{
    message: string;
    synced_count: number;
    created_count: number;
    updated_count: number;
    products: any[];
  } | null>(null);

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Load saved settings
  useEffect(() => {
    const loadSettings = async () => {
      setIsLoadingSettings(true);
      try {
        const res = await api.get<{
          success: boolean;
          sheet_url: string;
          last_synced_at?: string;
          last_synced_count?: number;
        }>('/admin/google-sheets/settings');

        if (res.sheet_url) {
          setSheetUrl(res.sheet_url);
        }
        if (res.last_synced_at) {
          setLastSyncedAt(res.last_synced_at);
        }
        if (res.last_synced_count) {
          setLastSyncedCount(res.last_synced_count);
        }
      } catch (err) {
        // Soft fail if not configured
      } finally {
        setIsLoadingSettings(false);
      }
    };
    loadSettings();
  }, []);

  // Download Sample Template
  const handleDownloadSample = () => {
    const blob = new Blob([SAMPLE_CSV_CONTENT], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'upshop_products_sample_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: 'টেমপ্লেট ডাউনলোড সফল',
      description: 'স্যাম্পল CSV ফাইলটি ডাউনলোড হয়েছে। এটি দেখে আপনার গুগল শিট সাজিয়ে নিন।',
    });
  };

  // Preview Data
  const handlePreview = async (overrideFile?: File) => {
    const fileToUse = overrideFile || uploadedFile;
    if (!sheetUrl && !fileToUse) {
      toast({
        title: 'ইনপুট প্রয়োজন',
        description: 'দয়া করে একটি গুগল শিটের লিংক দিন অথবা CSV ফাইল নির্বাচন করুন।',
        variant: 'destructive',
      });
      return;
    }

    setIsPreviewing(true);
    try {
      let res: any;
      if (fileToUse) {
        const formData = new FormData();
        formData.append('csv_file', fileToUse);
        const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
        const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
        const response = await fetch(`${apiUrl}/admin/google-sheets/preview`, {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData,
        });
        res = await response.json();
      } else {
        res = await api.post<any>('/admin/google-sheets/preview', {
          sheet_url: sheetUrl,
        });
      }

      if (res.success) {
        setPreviewData(res);
        setPreviewOpen(true);
      } else {
        toast({
          title: 'প্রিভিউ ব্যর্থ',
          description: res.message || 'ডাটা পড়তে ব্যর্থ হয়েছে।',
          variant: 'destructive',
        });
      }
    } catch (err: any) {
      toast({
        title: 'ত্রুটি',
        description: err.message || 'গুগল শিট থেকে ডাটা লোড করা যায়নি। লিংক এবং শেয়ারিং পারমিশন চেক করুন।',
        variant: 'destructive',
      });
    } finally {
      setIsPreviewing(false);
    }
  };

  // 1-Click Sync
  const handleSync = async (overrideFile?: File) => {
    const fileToUse = overrideFile || uploadedFile;
    if (!sheetUrl && !fileToUse) {
      toast({
        title: 'ইনপুট প্রয়োজন',
        description: 'দয়া করে একটি গুগল শিটের লিংক দিন অথবা CSV ফাইল নির্বাচন করুন।',
        variant: 'destructive',
      });
      return;
    }

    setIsSyncing(true);
    setSyncResult(null);

    try {
      let res: any;
      if (fileToUse) {
        const formData = new FormData();
        formData.append('csv_file', fileToUse);
        const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
        const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
        const response = await fetch(`${apiUrl}/admin/google-sheets/sync`, {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData,
        });
        res = await response.json();
      } else {
        res = await api.post<any>('/admin/google-sheets/sync', {
          sheet_url: sheetUrl,
        });
      }

      if (res.success) {
        setSyncResult(res);
        setLastSyncedAt(new Date().toISOString());
        setLastSyncedCount(res.synced_count);
        toast({
          title: 'সিঙ্ক সফল!',
          description: res.message,
        });
      } else {
        toast({
          title: 'সিঙ্ক সম্পন্ন হয়নি',
          description: res.message || 'প্রোডাক্ট ইমপোর্ট ব্যর্থ হয়েছে।',
          variant: 'destructive',
        });
      }
    } catch (err: any) {
      toast({
        title: 'সিঙ্ক ত্রুটি',
        description: err.message || 'সার্ভারে রিকোয়েস্ট ব্যর্থ হয়েছে।',
        variant: 'destructive',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Handle local CSV file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      handlePreview(file);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-5xl mx-auto pb-12">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
                <FileSpreadsheet className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold font-display tracking-tight flex items-center gap-2">
                  Google Sheets Sync
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px] font-medium">
                    1-Click Auto Sync
                  </Badge>
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  গুগল শিট বা CSV ফাইলের মাধ্যমে একসাথে শত শত প্রোডাক্ট নিমেষেই যুক্ত ও আপডেট করুন।
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadSample}
              className="text-xs gap-1.5 border-dashed"
            >
              <Download className="h-4 w-4" />
              স্যাম্পল টেমপ্লেট
            </Button>
            <Link to="/admin/products">
              <Button variant="outline" size="sm" className="text-xs gap-1.5">
                <Layers className="h-4 w-4" />
                সকল প্রোডাক্ট দেখুন
              </Button>
            </Link>
          </div>
        </div>

        {/* Sync Mode Tabs */}
        <Tabs defaultValue="sheets" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mb-6">
            <TabsTrigger value="sheets" className="gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              গুগল শিট লিংক (Live Sync)
            </TabsTrigger>
            <TabsTrigger value="csv" className="gap-2">
              <Upload className="h-4 w-4" />
              CSV ফাইল আপলোড
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Google Sheets URL Sync */}
          <TabsContent value="sheets" className="space-y-6 mt-0">
            <Card className="border-emerald-200/60 dark:border-emerald-950/40 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-emerald-500" />
                    ১-ক্লিকে গুগল শিট সিঙ্ক
                  </CardTitle>
                  {lastSyncedAt && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1.5 bg-muted/50 px-2.5 py-1 rounded-full border">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      সর্বশেষ সিঙ্ক: {new Date(lastSyncedAt).toLocaleString('bn-BD')} ({lastSyncedCount} টি)
                    </span>
                  )}
                </div>
                <CardDescription className="text-xs leading-relaxed">
                  আপনার গুগল শিটের শেয়ারিং লিংকটি নিচে দিয়ে একবার সিঙ্ক করলেই স্বয়ংক্রিয়ভাবে সব প্রোডাক্ট ডাটাবেজে স্টোর হয়ে যাবে।
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sheet_url" className="text-sm font-medium flex items-center justify-between">
                    <span>গুগল শিট লিংক (Google Sheet URL)</span>
                    <span className="text-[11px] text-muted-foreground">
                      অবশ্যই <span className="font-semibold text-foreground">"Anyone with the link can view"</span> সেট রাখুন
                    </span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="sheet_url"
                      placeholder="https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit"
                      value={sheetUrl}
                      onChange={(e) => setSheetUrl(e.target.value)}
                      className="font-mono text-xs pr-10 h-11"
                    />
                    {sheetUrl && (
                      <a
                        href={sheetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        title="গুগল শিট খুলুন"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Button
                    type="button"
                    onClick={() => handleSync()}
                    disabled={isSyncing || isPreviewing || !sheetUrl.trim()}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 font-medium px-6 h-11 shadow-sm"
                  >
                    {isSyncing ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        সিঙ্ক হচ্ছে...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4" />
                        ১-ক্লিকে এখনই সিঙ্ক করুন
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handlePreview()}
                    disabled={isSyncing || isPreviewing || !sheetUrl.trim()}
                    className="gap-2 h-11 text-xs"
                  >
                    {isPreviewing ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    ডাটা প্রিভিউ দেখুন
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 2: Direct CSV File Upload */}
          <TabsContent value="csv" className="space-y-6 mt-0">
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Upload className="h-5 w-5 text-primary" />
                  সরাসরি CSV ফাইল আপলোড
                </CardTitle>
                <CardDescription className="text-xs">
                  ইন্টারনেট থেকে সরাসরি এক্সেল বা CSV ফাইল আপলোড করে প্রোডাক্ট ইমপোর্ট করুন।
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".csv,text/csv"
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:bg-muted/40 transition-colors flex flex-col items-center justify-center gap-3"
                >
                  <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <Upload className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">
                      {uploadedFile ? uploadedFile.name : 'CSV ফাইল ড্র্যাগ করুন অথবা ক্লিক করে নির্বাচন করুন'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {uploadedFile ? `${(uploadedFile.size / 1024).toFixed(1)} KB` : 'কেবলমাত্র .csv ফরম্যাট সাপোর্ট করে'}
                    </p>
                  </div>
                </div>

                {uploadedFile && (
                  <div className="flex items-center gap-3 pt-2">
                    <Button
                      type="button"
                      onClick={() => handleSync(uploadedFile)}
                      disabled={isSyncing}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 font-medium px-6 h-10"
                    >
                      {isSyncing ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          ইমপোর্ট হচ্ছে...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4" />
                          ফাইল থেকে ইমপোর্ট করুন
                        </>
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handlePreview(uploadedFile)}
                      disabled={isPreviewing}
                      className="gap-2 h-10 text-xs"
                    >
                      <Eye className="h-4 w-4" />
                      প্রিভিউ দেখুন
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Sync Success Results Card */}
        {syncResult && (
          <Card className="border-emerald-300 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2.5 text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                <CardTitle className="text-base font-bold">
                  {syncResult.message}
                </CardTitle>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-white dark:bg-card border rounded-xl text-center">
                  <p className="text-xs text-muted-foreground">মোট প্রসেসড</p>
                  <p className="text-xl font-bold text-foreground mt-0.5">{syncResult.synced_count}</p>
                </div>
                <div className="p-3 bg-white dark:bg-card border rounded-xl text-center">
                  <p className="text-xs text-emerald-600 dark:text-emerald-400">নতুন যুক্ত</p>
                  <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{syncResult.created_count}</p>
                </div>
                <div className="p-3 bg-white dark:bg-card border rounded-xl text-center">
                  <p className="text-xs text-blue-600 dark:text-blue-400">আপডেট হয়েছে</p>
                  <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-0.5">{syncResult.updated_count}</p>
                </div>
              </div>

              {syncResult.products && syncResult.products.length > 0 && (
                <div className="border rounded-xl bg-white dark:bg-card overflow-hidden">
                  <div className="px-4 py-3 border-b bg-muted/30 flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground uppercase">
                      ইমপোর্টকৃত প্রোডাক্টের তালিকা (নমুনা)
                    </span>
                    <Link to="/admin/products" className="text-xs text-primary font-medium flex items-center gap-1 hover:underline">
                      সবগুলো দেখুন <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                  <div className="divide-y max-h-72 overflow-y-auto">
                    {syncResult.products.map((p: any) => (
                      <div key={p.id} className="p-3 flex items-center justify-between text-xs hover:bg-muted/20">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-lg bg-muted border overflow-hidden flex-shrink-0">
                            {p.images?.[0]?.image_url ? (
                              <img src={p.images[0].image_url} alt={p.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-[10px]">No Pic</div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-foreground truncate">{p.name}</p>
                            <p className="text-[11px] text-muted-foreground">{p.category?.name || 'Uncategorized'}</p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 pl-3">
                          <p className="font-bold text-primary">৳{Number(p.sale_price || p.price).toLocaleString()}</p>
                          <p className="text-[10px] text-muted-foreground">স্টক: {p.stock_quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Instructions & Column Format Guide */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              শিট তৈরির নিয়মাবলী ও কলাম ফরম্যাট
            </CardTitle>
            <CardDescription className="text-xs">
              আপনার গুগল শিটের প্রথম সারিতে (Row 1) নিচের কলামের নামগুলো সঠিকভাবে ব্যবহার করুন:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-lg border bg-muted/20">
                <span className="font-bold text-emerald-600 font-mono">name</span>
                <span className="text-[10px] ml-1 text-red-500 font-semibold">*প্রয়োজনীয়</span>
                <p className="text-muted-foreground mt-1">পণ্যের সম্পূর্ণ নাম (যেমন: Luxury Watch)</p>
              </div>

              <div className="p-3 rounded-lg border bg-muted/20">
                <span className="font-bold text-emerald-600 font-mono">price</span>
                <span className="text-[10px] ml-1 text-red-500 font-semibold">*প্রয়োজনীয়</span>
                <p className="text-muted-foreground mt-1">নিয়মিত বিক্রয় মূল্য (যেমন: 1500)</p>
              </div>

              <div className="p-3 rounded-lg border bg-muted/20">
                <span className="font-bold text-emerald-600 font-mono">sale_price</span>
                <span className="text-[10px] ml-1 text-muted-foreground">ঐচ্ছিক</span>
                <p className="text-muted-foreground mt-1">অফার/ডিসকাউন্ট মূল্য (যেমন: 1200)</p>
              </div>

              <div className="p-3 rounded-lg border bg-muted/20">
                <span className="font-bold text-emerald-600 font-mono">category</span>
                <span className="text-[10px] ml-1 text-muted-foreground">ঐচ্ছিক</span>
                <p className="text-muted-foreground mt-1">ক্যাটাগরি না থাকলে অটোমেটিক তৈরি হবে</p>
              </div>

              <div className="p-3 rounded-lg border bg-muted/20">
                <span className="font-bold text-emerald-600 font-mono">stock_quantity</span>
                <span className="text-[10px] ml-1 text-muted-foreground">ঐচ্ছিক</span>
                <p className="text-muted-foreground mt-1">বর্তমান স্টক সংখ্যা (ডিফল্ট: 100)</p>
              </div>

              <div className="p-3 rounded-lg border bg-muted/20">
                <span className="font-bold text-emerald-600 font-mono">image_url</span>
                <span className="text-[10px] ml-1 text-muted-foreground">ঐচ্ছিক</span>
                <p className="text-muted-foreground mt-1">ছবির সরাসরি ওয়েব লিংক (কমা দিয়ে একাধিক)</p>
              </div>

              <div className="p-3 rounded-lg border bg-muted/20">
                <span className="font-bold text-emerald-600 font-mono">description</span>
                <span className="text-[10px] ml-1 text-muted-foreground">ঐচ্ছিক</span>
                <p className="text-muted-foreground mt-1">পণ্য সম্পর্কে বিস্তারিত বিবরণ</p>
              </div>

              <div className="p-3 rounded-lg border bg-muted/20">
                <span className="font-bold text-emerald-600 font-mono">status</span>
                <span className="text-[10px] ml-1 text-muted-foreground">ঐচ্ছিক</span>
                <p className="text-muted-foreground mt-1">active অথবা inactive (ডিফল্ট: active)</p>
              </div>
            </div>

            <Alert className="bg-amber-500/10 border-amber-500/20 text-amber-900 dark:text-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-xs">
                <strong>টিপস:</strong> গুগল শিটে উপরের ডানপাশে <strong>Share</strong> বাটনে ক্লিক করে General Access অপশনটি <strong>"Anyone with the link can view"</strong> করে দিন। এরপর লিংকটি কপি করে উপরে পেস্ট করুন।
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              প্রোডাক্ট ডাটা প্রিভিউ
              <Badge variant="outline" className="ml-2 font-mono text-xs">
                মোট {previewData?.total_rows || 0} টি প্রোডাক্ট পাওয়া গেছে
              </Badge>
            </DialogTitle>
            <DialogDescription className="text-xs">
              নিচে আপনার শিট বা ফাইল থেকে পড়া প্রথম কয়েকটি প্রোডাক্টের নমুনা দেখানো হলো:
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-auto border rounded-xl my-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>নাম</TableHead>
                  <TableHead>ক্যাটাগরি</TableHead>
                  <TableHead>মূল্য</TableHead>
                  <TableHead>অফার মূল্য</TableHead>
                  <TableHead>স্টক</TableHead>
                  <TableHead>ছবি লিংক</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {previewData?.preview.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-mono text-xs text-muted-foreground">{idx + 1}</TableCell>
                    <TableCell className="font-semibold text-xs max-w-[200px] truncate">{row.name}</TableCell>
                    <TableCell className="text-xs">{row.category || '-'}</TableCell>
                    <TableCell className="text-xs font-mono">৳{row.price}</TableCell>
                    <TableCell className="text-xs font-mono">{row.sale_price ? `৳${row.sale_price}` : '-'}</TableCell>
                    <TableCell className="text-xs">{row.stock_quantity || 100}</TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[150px] truncate font-mono">
                      {row.image_url ? (
                        <span className="text-primary truncate block" title={row.image_url}>
                          {row.image_url}
                        </span>
                      ) : (
                        'নেই'
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t">
            <Button variant="outline" size="sm" onClick={() => setPreviewOpen(false)}>
              বন্ধ করুন
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setPreviewOpen(false);
                handleSync();
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 font-medium"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              সবগুলো প্রোডাক্ট এখনই সিঙ্ক করুন
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default GoogleSheetsSync;
