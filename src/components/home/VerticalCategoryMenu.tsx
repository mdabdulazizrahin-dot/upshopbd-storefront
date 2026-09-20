import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Category } from '@/hooks/useProducts';

interface VerticalCategoryMenuProps {
  categories: Category[];
  activeCategory?: string;
  onCategoryClick?: (categorySlug: string) => void;
}

const VerticalCategoryMenu = ({ 
  categories, 
  activeCategory,
  onCategoryClick 
}: VerticalCategoryMenuProps) => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  // Separate parent and child categories
  const parentCategories = categories.filter(c => !c.parent_id);
  const getSubCategories = (parentId: string) => 
    categories.filter(c => c.parent_id === parentId);

  return (
    <div className="bg-card rounded-lg border border-border overflow-visible relative">
      {/* Header */}
      <div className="bg-primary text-primary-foreground px-4 py-3 font-semibold">
        সকল ক্যাটাগরি
      </div>
      
      {/* Category List */}
      <nav>
        {parentCategories.map((category) => {
          const isActive = activeCategory === category.slug;
          const subCategories = getSubCategories(category.id);
          const hasSubCategories = subCategories.length > 0;
          const isHovered = hoveredCategory === category.id;

          return (
            <div
              key={category.id}
              className="relative"
              onMouseEnter={() => setHoveredCategory(category.id)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <Link
                to={`/shop?category=${category.slug}`}
                onClick={() => onCategoryClick?.(category.slug)}
                className={`flex items-center justify-between px-4 py-2.5 text-sm transition-colors hover:bg-accent hover:text-primary ${
                  isActive ? 'bg-accent text-primary font-medium' : 'text-foreground'
                }`}
              >
                <span>{category.name_bn || category.name}</span>
                <ChevronRight className={`h-4 w-4 transition-opacity ${hasSubCategories ? 'opacity-100' : 'opacity-30'}`} />
              </Link>

              {/* Sub-category Dropdown */}
              {hasSubCategories && isHovered && (
                <div 
                  className="absolute left-full top-0 ml-0 bg-card border border-border rounded-lg shadow-lg min-w-[200px] z-50 py-2"
                  onMouseEnter={() => setHoveredCategory(category.id)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  {subCategories.map((subCat) => (
                    <Link
                      key={subCat.id}
                      to={`/shop?category=${subCat.slug}`}
                      onClick={() => onCategoryClick?.(subCat.slug)}
                      className={`flex items-center px-4 py-2.5 text-sm transition-colors hover:bg-accent hover:text-primary ${
                        activeCategory === subCat.slug ? 'bg-accent text-primary font-medium' : 'text-foreground'
                      }`}
                    >
                      <span>{subCat.name_bn || subCat.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default VerticalCategoryMenu;