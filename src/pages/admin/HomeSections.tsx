import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useHomeSections, useUpdateHomeSection } from '@/hooks/useSiteSettings';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';
import { GripVertical, Eye, EyeOff, Settings2, ArrowUp, ArrowDown, ArrowUpToLine, ArrowDownToLine } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const HomeSectionsPage = () => {
  const { data: sections, isLoading } = useHomeSections();
  const updateSection = useUpdateHomeSection();
  const [editingSection, setEditingSection] = useState<any>(null);
  const [localSections, setLocalSections] = useState<any[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  useEffect(() => {
    if (sections) {
      setLocalSections([...sections].sort((a, b) => a.sort_order - b.sort_order));
    }
  }, [sections]);

  const saveOrder = async (newList: any[]) => {
    const updated = newList.map((item, idx) => ({ ...item, sort_order: idx + 1 }));
    setLocalSections(updated);
    try {
      await updateSection.mutateAsync({
        reorder: updated.map(s => ({ id: s.id, sort_order: s.sort_order }))
      });
      toast.success('Section order updated');
    } catch (error) {
      toast.error('Failed to update section order');
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', `${index}`);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newList = [...localSections];
    const [moved] = newList.splice(draggedIndex, 1);
    newList.splice(dropIndex, 0, moved);

    setDraggedIndex(null);
    setDragOverIndex(null);
    await saveOrder(newList);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleMove = async (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= localSections.length) return;
    const newList = [...localSections];
    const [moved] = newList.splice(fromIndex, 1);
    newList.splice(toIndex, 0, moved);
    await saveOrder(newList);
  };

  const handleVisibilityToggle = async (id: string | number, isVisible: boolean) => {
    try {
      await updateSection.mutateAsync({ id, updates: { is_visible: !isVisible } });
      setLocalSections(prev =>
        prev.map(s => (s.id === id ? { ...s, is_visible: !isVisible } : s))
      );
      toast.success('Section updated');
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  const handleSettingsUpdate = async (id: string | number, settings: any) => {
    try {
      await updateSection.mutateAsync({ id, updates: { settings } });
      setLocalSections(prev =>
        prev.map(s => (s.id === id ? { ...s, settings } : s))
      );
      toast.success('Settings updated');
      setEditingSection(null);
    } catch (error) {
      toast.error('Failed to update');
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

  const sectionLabels: Record<string, string> = {
    hero: 'Hero Banner Slider',
    hero_banner: 'Hero Banner Slider',
    features: 'Features Section',
    categories: 'Top Categories',
    featured_products: 'Featured Products',
    banner: 'Promotional Banner',
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Home Page Sections</h1>
          <p className="text-muted-foreground">
            Drag & drop sections to change order or use the arrow buttons
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Section Management</CardTitle>
            <CardDescription>
              Drag items up/down by clicking and dragging anywhere on the card, or use the move buttons
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {localSections.map((section, index) => {
                const isDragging = draggedIndex === index;
                const isDragOver = dragOverIndex === index && draggedIndex !== index;

                return (
                  <div
                    key={section.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 cursor-grab active:cursor-grabbing select-none ${
                      isDragging
                        ? 'opacity-40 border-dashed border-2 border-primary bg-primary/5 shadow-inner scale-[0.98]'
                        : isDragOver
                        ? 'border-2 border-primary bg-primary/10 shadow-md ring-2 ring-primary/30'
                        : 'bg-card hover:bg-muted/40 shadow-sm border-border'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-1 rounded hover:bg-muted/80 text-muted-foreground hover:text-primary transition-colors">
                        <GripVertical className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground text-base">
                            {sectionLabels[section.section_key] || section.title}
                          </h3>
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-muted text-muted-foreground">
                            Order: {index + 1}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Key: <code className="text-xs bg-muted px-1 py-0.5 rounded">{section.section_key}</code>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                      {/* Order Controls */}
                      <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border/50">
                        {/* Move to Top */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                          title="Move to Top"
                          onClick={() => handleMove(index, 0)}
                          disabled={index === 0}
                        >
                          <ArrowUpToLine className="h-4 w-4" />
                        </Button>

                        {/* Move Up */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                          title="Move Up"
                          onClick={() => handleMove(index, index - 1)}
                          disabled={index === 0}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>

                        {/* Move Down */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                          title="Move Down"
                          onClick={() => handleMove(index, index + 1)}
                          disabled={index === localSections.length - 1}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>

                        {/* Move to Bottom */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                          title="Move to Bottom"
                          onClick={() => handleMove(index, localSections.length - 1)}
                          disabled={index === localSections.length - 1}
                        >
                          <ArrowDownToLine className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Settings dialog */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-9 px-3 gap-1.5"
                            onClick={() => setEditingSection(section)}
                          >
                            <Settings2 className="h-4 w-4" />
                            <span className="hidden sm:inline">Settings</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Section Settings</DialogTitle>
                            <DialogDescription>
                              Change settings for {sectionLabels[section.section_key] || section.title}
                            </DialogDescription>
                          </DialogHeader>
                          <SectionSettingsForm
                            section={section}
                            onSave={(settings) => handleSettingsUpdate(section.id, settings)}
                          />
                        </DialogContent>
                      </Dialog>

                      {/* Visibility toggle */}
                      <div className="flex items-center gap-2 pl-2 border-l border-border/80">
                        {section.is_visible ? (
                          <Eye className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        )}
                        <Switch
                          checked={!!section.is_visible}
                          onCheckedChange={() => handleVisibilityToggle(section.id, !!section.is_visible)}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

const SectionSettingsForm = ({ section, onSave }: { section: any; onSave: (settings: any) => void }) => {
  const [settings, setSettings] = useState(section.settings || {});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(settings);
  };

  if (section.section_key === 'featured_products') {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Section Title</Label>
          <Input
            id="title"
            value={settings.title || 'Featured Products'}
            onChange={(e) => setSettings({ ...settings, title: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="limit">Product Count</Label>
          <Input
            id="limit"
            type="number"
            value={settings.limit || 12}
            onChange={(e) => setSettings({ ...settings, limit: parseInt(e.target.value) })}
          />
        </div>
        <Button type="submit">Save Changes</Button>
      </form>
    );
  }

  if (section.section_key === 'categories') {
    const queryClient = useQueryClient();
    const { data: categoriesList, isLoading: categoriesLoading } = useQuery({
      queryKey: ['admin-categories'],
      queryFn: () => api.get<any[]>('/categories'),
    });

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Section Title</Label>
          <Input
            id="title"
            value={settings.title || 'Top Categories'}
            onChange={(e) => setSettings({ ...settings, title: e.target.value })}
          />
        </div>
        
        {/* Categories Selection List */}
        <div className="space-y-2 pt-2 border-t">
          <div className="flex items-center justify-between">
            <Label className="font-semibold text-sm">Top Categories Selection</Label>
            <span className="text-xs text-primary font-semibold">
              {categoriesList?.filter((c: any) => c.is_top).length || 0} active in Top
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            যেসব ক্যাটাগরি হোমপেজে Top Categories এ দেখাতে চান, সেগুলোর সুইচ অন রাখুন:
          </p>

          <div className="max-h-60 overflow-y-auto space-y-2 p-2 border rounded-xl bg-muted/20">
            {categoriesLoading ? (
              <div className="py-6 text-center text-xs text-muted-foreground">Loading categories...</div>
            ) : categoriesList && categoriesList.length > 0 ? (
              categoriesList.map((cat: any) => (
                <div 
                  key={cat.id} 
                  className="flex items-center justify-between p-2 rounded-lg bg-background border border-border/60 hover:border-primary/50 transition-colors shadow-sm"
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    {cat.image_url ? (
                      <img src={cat.image_url} alt={cat.name} className="w-8 h-8 rounded-md object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {cat.name.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">{cat.name}</p>
                      {cat.name_bn && <p className="text-[11px] text-muted-foreground truncate">{cat.name_bn}</p>}
                    </div>
                  </div>
                  <Switch
                    checked={!!cat.is_top}
                    onCheckedChange={async (checked) => {
                      try {
                        await api.put(`/categories/${cat.id}`, { is_top: checked });
                        queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
                        queryClient.invalidateQueries({ queryKey: ['categories'] });
                        toast.success(`"${cat.name}" ${checked ? 'added to' : 'removed from'} Top Categories`);
                      } catch (err: any) {
                        toast.error('Failed to update category');
                      }
                    }}
                  />
                </div>
              ))
            ) : (
              <div className="py-4 text-center text-xs text-muted-foreground">No categories found</div>
            )}
          </div>
        </div>
        
        <Button type="submit" className="w-full">Save Changes</Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Section Title</Label>
        <Input
          id="title"
          value={settings.title || section.title}
          onChange={(e) => setSettings({ ...settings, title: e.target.value })}
        />
      </div>
      <Button type="submit">Save Changes</Button>
    </form>
  );
};

export default HomeSectionsPage;