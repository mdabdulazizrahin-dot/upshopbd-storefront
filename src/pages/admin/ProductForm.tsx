import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useCategories } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, Trash2, Upload, X } from 'lucide-react';

interface ProductFormData {
  name: string;
  description: string;
  product_type: 'simple' | 'variable';
  price: number;
  sale_price: number | null;
  stock_quantity: number;
  category_id: string;
  status: 'active' | 'inactive';
  seo_title: string;
  seo_description: string;
  seo_slug: string;
}

interface Variation {
  id?: string;
  attributes: Record<string, string>;
  price: number;
  sale_price: number | null;
  stock_quantity: number;
  image_url: string;
}

const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

const generateSEO = (name: string, description: string) => {
  const seoTitle = name.length > 60 ? name.substring(0, 57) + '...' : name;
  const seoDescription = description.length > 160
    ? description.substring(0, 157) + '...'
    : description;
  return { seoTitle, seoDescription };
};

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: categories } = useCategories();
  const isEditing = !!id;

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    product_type: 'simple',
    price: 0,
    sale_price: null,
    stock_quantity: 0,
    category_id: '',
    status: 'active',
    seo_title: '',
    seo_description: '',
    seo_slug: '',
  });

  const [variations, setVariations] = useState<Variation[]>([]);
  const [images, setImages] = useState<{ url: string; isMain: boolean }[]>([]);
  const [uploading, setUploading] = useState(false);

  const { data: existingProduct, isLoading } = useQuery({
    queryKey: ['admin-product', id],
    queryFn: async () => {
      return await api.get<any>(`/products/${id}`);
    },
    enabled: isEditing,
  });

  useEffect(() => {
    if (existingProduct) {
      setFormData({
        name: existingProduct.name,
        description: existingProduct.description || '',
        product_type: existingProduct.product_type,
        price: Number(existingProduct.price),
        sale_price: existingProduct.sale_price ? Number(existingProduct.sale_price) : null,
        stock_quantity: existingProduct.stock_quantity,
        category_id: existingProduct.category_id || '',
        status: existingProduct.status,
        seo_title: existingProduct.seo_title || '',
        seo_description: existingProduct.seo_description || '',
        seo_slug: existingProduct.seo_slug,
      });

      if (existingProduct.images) {
        setImages(existingProduct.images.map((img: any) => ({
          url: img.image_url,
          isMain: img.is_main,
        })));
      }

      if (existingProduct.variations) {
        setVariations(existingProduct.variations.map((v: any) => ({
          id: v.id,
          attributes: v.attributes,
          price: Number(v.price),
          sale_price: v.sale_price ? Number(v.sale_price) : null,
          stock_quantity: v.stock_quantity,
          image_url: v.image_url || '',
        })));
      }
    }
  }, [existingProduct]);

  const handleNameChange = (name: string) => {
    const { seoTitle } = generateSEO(name, formData.description);
    setFormData(prev => ({
      ...prev,
      name,
      seo_slug: generateSlug(name),
      seo_title: seoTitle,
    }));
  };

  const handleDescriptionChange = (description: string) => {
    const { seoDescription } = generateSEO(formData.name, description);
    setFormData(prev => ({
      ...prev,
      description,
      seo_description: seoDescription,
    }));
  };

  const handleImageUpload = async (files: FileList) => {
    setUploading(true);

    for (const file of Array.from(files)) {
      try {
        const result = await api.uploadImage(file);
        setImages(prev => [...prev, {
          url: result.url,
          isMain: prev.length === 0,
        }]);
      } catch (error: any) {
        toast({
          title: 'Upload Error',
          description: error.message,
          variant: 'destructive',
        });
      }
    }

    setUploading(false);
  };

  const setMainImage = (index: number) => {
    setImages(prev => prev.map((img, i) => ({
      ...img,
      isMain: i === index,
    })));
  };

  const removeImage = (index: number) => {
    setImages(prev => {
      const newImages = prev.filter((_, i) => i !== index);
      if (newImages.length > 0 && !newImages.some(img => img.isMain)) {
        newImages[0].isMain = true;
      }
      return newImages;
    });
  };

  const addVariation = () => {
    setVariations(prev => [...prev, {
      attributes: { size: '', color: '' },
      price: formData.price,
      sale_price: null,
      stock_quantity: 0,
      image_url: '',
    }]);
  };

  const updateVariation = (index: number, updates: Partial<Variation>) => {
    setVariations(prev => prev.map((v, i) =>
      i === index ? { ...v, ...updates } : v
    ));
  };

  const removeVariation = (index: number) => {
    setVariations(prev => prev.filter((_, i) => i !== index));
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const productData = {
        name: formData.name,
        description: formData.description,
        product_type: formData.product_type,
        price: formData.price,
        sale_price: formData.sale_price,
        stock_quantity: formData.product_type === 'simple' ? formData.stock_quantity : 0,
        category_id: formData.category_id || null,
        status: formData.status,
        seo_title: formData.seo_title,
        seo_description: formData.seo_description,
        seo_slug: formData.seo_slug,
        images: images.map((img, index) => ({
          image_url: img.url,
          is_main: img.isMain,
          sort_order: index,
        })),
        variations: formData.product_type === 'variable' ? variations.map(v => ({
          attributes: v.attributes,
          price: v.price,
          sale_price: v.sale_price,
          stock_quantity: v.stock_quantity,
          image_url: v.image_url || null,
        })) : [],
      };

      if (isEditing) {
        return await api.put(`/products/${id}`, productData);
      } else {
        return await api.post('/products', productData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: isEditing ? 'Product Updated' : 'Product Created',
        description: `The product has been ${isEditing ? 'updated' : 'created'} successfully.`,
      });
      navigate('/admin/products');
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  if (isEditing && isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/products')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-display font-bold">
              {isEditing ? 'Edit Product' : 'Add New Product'}
            </h1>
            <p className="text-muted-foreground">
              {isEditing ? 'Update product details' : 'Create a new product'}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Enter product name"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleDescriptionChange(e.target.value)}
                    placeholder="Enter product description"
                    className="mt-1.5"
                    rows={4}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Product Type</Label>
                    <Select
                      value={formData.product_type}
                      onValueChange={(value: 'simple' | 'variable') =>
                        setFormData(prev => ({ ...prev, product_type: value }))
                      }
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="simple">Simple Product</SelectItem>
                        <SelectItem value="variable">Variable Product</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Category</Label>
                    <Select
                      value={formData.category_id}
                      onValueChange={(value) =>
                        setFormData(prev => ({ ...prev, category_id: value }))
                      }
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories?.map((cat) => (
                          <SelectItem key={cat.id} value={String(cat.id)}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {formData.product_type === 'simple' && (
              <Card>
                <CardHeader>
                  <CardTitle>Pricing & Stock</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="price">Regular Price (৳) *</Label>
                      <Input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="sale_price">Sale Price (৳)</Label>
                      <Input
                        id="sale_price"
                        type="number"
                        value={formData.sale_price || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          sale_price: e.target.value ? Number(e.target.value) : null
                        }))}
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="stock">Stock Quantity *</Label>
                      <Input
                        id="stock"
                        type="number"
                        value={formData.stock_quantity}
                        onChange={(e) => setFormData(prev => ({ ...prev, stock_quantity: Number(e.target.value) }))}
                        className="mt-1.5"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {formData.product_type === 'variable' && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Product Variations</CardTitle>
                  <Button onClick={addVariation} size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Variation
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {variations.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">
                      No variations added. Click "Add Variation" to create one.
                    </p>
                  ) : (
                    variations.map((variation, index) => (
                      <div key={index} className="p-4 border rounded-lg space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Variation #{index + 1}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeVariation(index)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-3">
                          <div>
                            <Label>Size</Label>
                            <Input
                              value={variation.attributes.size || ''}
                              onChange={(e) => updateVariation(index, {
                                attributes: { ...variation.attributes, size: e.target.value }
                              })}
                              placeholder="M,L,XL"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label>Color</Label>
                            <Input
                              value={variation.attributes.color || ''}
                              onChange={(e) => updateVariation(index, {
                                attributes: { ...variation.attributes, color: e.target.value }
                              })}
                              placeholder="Red,Blue,Black"
                              className="mt-1"
                            />
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-3 gap-3">
                          <div>
                            <Label>Price (৳)</Label>
                            <Input
                              type="number"
                              value={variation.price}
                              onChange={(e) => updateVariation(index, { price: Number(e.target.value) })}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label>Sale Price</Label>
                            <Input
                              type="number"
                              value={variation.sale_price || ''}
                              onChange={(e) => updateVariation(index, {
                                sale_price: e.target.value ? Number(e.target.value) : null
                              })}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label>Stock</Label>
                            <Input
                              type="number"
                              value={variation.stock_quantity}
                              onChange={(e) => updateVariation(index, { stock_quantity: Number(e.target.value) })}
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {images.map((img, index) => (
                    <div key={index} className="relative group aspect-square">
                      <img
                        src={img.url}
                        alt={`Product ${index + 1}`}
                        className={`w-full h-full object-cover rounded-lg border-2 ${
                          img.isMain ? 'border-primary' : 'border-transparent'
                        }`}
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setMainImage(index)}
                          disabled={img.isMain}
                        >
                          Main
                        </Button>
                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      {img.isMain && (
                        <span className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded">
                          Main
                        </span>
                      )}
                    </div>
                  ))}

                  <label className="aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                    {uploading ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
                    ) : (
                      <>
                        <Upload className="h-6 w-6 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground mt-1">Upload</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                      disabled={uploading}
                    />
                  </label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="seo_slug">URL Slug</Label>
                  <Input
                    id="seo_slug"
                    value={formData.seo_slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, seo_slug: e.target.value }))}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="seo_title">SEO Title</Label>
                  <Input
                    id="seo_title"
                    value={formData.seo_title}
                    onChange={(e) => setFormData(prev => ({ ...prev, seo_title: e.target.value }))}
                    className="mt-1.5"
                    maxLength={60}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.seo_title.length}/60 characters
                  </p>
                </div>
                <div>
                  <Label htmlFor="seo_description">SEO Description</Label>
                  <Textarea
                    id="seo_description"
                    value={formData.seo_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, seo_description: e.target.value }))}
                    className="mt-1.5"
                    rows={2}
                    maxLength={160}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.seo_description.length}/160 characters
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Label htmlFor="status">Active</Label>
                  <Switch
                    id="status"
                    checked={formData.status === 'active'}
                    onCheckedChange={(checked) =>
                      setFormData(prev => ({ ...prev, status: checked ? 'active' : 'inactive' }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Button
              className="w-full"
              size="lg"
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending || !formData.name || !formData.seo_slug}
            >
              {saveMutation.isPending ? 'Saving...' : (isEditing ? 'Update Product' : 'Create Product')}
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ProductForm;
