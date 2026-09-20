import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, Upload, Sparkles, X, ArrowRight, RefreshCw, ShoppingBag, Search } from 'lucide-react';
import api from '@/lib/api';

interface VisualMatch {
  product: {
    id: string;
    name: string;
    seo_slug: string;
    price: number;
    sale_price?: number | null;
    images?: Array<{ image_url: string; is_main?: boolean }>;
    category?: { name: string; name_bn?: string };
  };
  match_percentage: number;
}

interface VisualSearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const VisualSearchModal: React.FC<VisualSearchModalProps> = ({ open, onOpenChange }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<VisualMatch[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const resetState = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsSearching(false);
    setResults([]);
    setHasSearched(false);
  };

  const handleClose = (newOpen: boolean) => {
    if (!newOpen) resetState();
    onOpenChange(newOpen);
  };

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    executeSearch(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const executeSearch = async (file: File) => {
    setIsSearching(true);
    setHasSearched(true);
    setResults([]);

    try {
      const formData = new FormData();
      formData.append('image', file);

      // Using raw axios/fetch or api helper
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:8000/api/search-by-image', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      const data = await response.json();
      if (data.success && Array.isArray(data.results)) {
        setResults(data.results);
      }
    } catch (error) {
      console.error('Visual search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleProductClick = (slug: string) => {
    handleClose(false);
    navigate(`/product/${slug}`);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[88vh] flex flex-col p-6 overflow-hidden rounded-2xl">
        <DialogHeader className="pb-3 border-b">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 text-primary rounded-lg">
              <Camera className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                ইমেজ দিয়ে প্রোডাক্ট সার্চ
                <Badge variant="secondary" className="text-xs bg-primary/15 text-primary border-0 font-medium">
                  AI Visual Search
                </Badge>
              </DialogTitle>
              <DialogDescription className="text-xs">
                যেকোনো পণ্যের ছবি আপলোড বা ড্রপ করুন, হুবহু বা কাছাকাছি পণ্য খুঁজে দেওয়া হবে।
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-3 space-y-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            accept="image/*"
            className="hidden"
          />

          {!previewUrl ? (
            /* Upload Drop Area */
            <div
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                dragActive
                  ? 'border-primary bg-primary/5 scale-[0.99]'
                  : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30'
              }`}
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Upload className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-sm">
                  ছবি ড্র্যাগ করে আনুন অথবা <span className="text-primary underline underline-offset-2">ক্লিক করে নির্বাচন করুন</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG, WebP ফরম্যাট সাপোর্ট করে (মোবাইলে সরাসরি ক্যামেরা থেকে তুলতে পারবেন)
                </p>
              </div>
              <Button type="button" variant="outline" size="sm" className="mt-2 text-xs">
                <Camera className="h-3.5 w-3.5 mr-1.5" />
                ছবি নির্বাচন করুন
              </Button>
            </div>
          ) : (
            /* Query Image Header & Scanning State */
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-xl border border-border/60">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden border bg-background flex-shrink-0">
                  <img src={previewUrl} alt="Query" className="w-full h-full object-cover" />
                  {isSearching && (
                    <div className="absolute inset-0 bg-primary/20 animate-pulse flex items-center justify-center">
                      <div className="w-full h-[2px] bg-primary absolute top-0 animate-[bounce_1.5s_infinite]" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-foreground truncate">
                      {selectedFile?.name || 'Uploaded Image'}
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => { resetState(); fileInputRef.current?.click(); }}
                      className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      অন্য ছবি
                    </Button>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {isSearching ? 'ছবি বিশ্লেষণ ও ক্যাটালগে মিল খোঁজা হচ্ছে...' : 'স্ক্যান সম্পন্ন'}
                  </p>
                </div>
              </div>

              {/* Scanning Animation */}
              {isSearching && (
                <div className="py-8 text-center space-y-3">
                  <div className="relative mx-auto w-12 h-12">
                    <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    <Sparkles className="h-5 w-5 text-primary absolute inset-0 m-auto animate-pulse" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground animate-pulse">
                    ছবি বিশ্লেষণ ও মিল খুঁজে দেখা হচ্ছে...
                  </p>
                </div>
              )}

              {/* Results List */}
              {!isSearching && hasSearched && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      মিলে যাওয়া পণ্যসমূহ ({results.length})
                    </h4>
                  </div>

                  {results.length === 0 ? (
                    <div className="text-center py-8 border rounded-xl bg-muted/20">
                      <Search className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                      <p className="text-sm font-medium">কোনো পণ্য মেলেনি</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        অন্য কোনো পরিষ্কার বা উজ্জ্বল ছবি দিয়ে পুনরায় চেষ্টা করুন।
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {results.map(({ product, match_percentage }) => {
                        const img = product.images?.find(i => i.is_main)?.image_url || product.images?.[0]?.image_url || '/placeholder.svg';
                        return (
                          <div
                            key={product.id}
                            onClick={() => handleProductClick(product.seo_slug)}
                            className="group cursor-pointer border rounded-xl overflow-hidden bg-card hover:shadow-md transition-all hover:border-primary/50 flex flex-col"
                          >
                            <div className="relative aspect-square bg-muted/30 overflow-hidden">
                              <img
                                src={img}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute top-2 left-2">
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-xs ${
                                  match_percentage >= 85
                                    ? 'bg-emerald-600 text-white'
                                    : match_percentage >= 70
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-amber-600 text-white'
                                }`}>
                                  {match_percentage}% Match
                                </span>
                              </div>
                            </div>
                            <div className="p-2.5 flex-1 flex flex-col justify-between space-y-1">
                              <div>
                                <h5 className="font-medium text-xs line-clamp-2 group-hover:text-primary transition-colors">
                                  {product.name}
                                </h5>
                                {product.category && (
                                  <p className="text-[10px] text-muted-foreground truncate">
                                    {product.category.name_bn || product.category.name}
                                  </p>
                                )}
                              </div>
                              <div className="pt-1 flex items-center justify-between">
                                <span className="font-bold text-xs text-primary">
                                  ৳{Number(product.sale_price || product.price).toLocaleString()}
                                </span>
                                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VisualSearchModal;
