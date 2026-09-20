import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Category } from '@/hooks/useProducts';

interface HeaderCategoryDropdownProps {
  parentCategories: Category[];
  allCategories: Category[];
  onHoverChange?: (isHovered: boolean) => void;
}

const HeaderCategoryDropdown = ({ parentCategories, allCategories, onHoverChange }: HeaderCategoryDropdownProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const getSubCategories = (parentId: string) =>
    allCategories.filter((c) => c.parent_id === parentId);

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHoverChange?.(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onHoverChange?.(false);
  };

  return (
    <div 
      className="relative h-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Button
        variant="ghost"
        className="gap-2 h-full px-4 text-white hover:bg-white/10 hover:text-white rounded-none"
      >
        <Menu className="h-4 w-4" />
        প্রোডাক্ট ক্যাটাগরি
      </Button>
    </div>
  );
};

// Separate component for the category menu that appears in hero section
export const CategoryMenuPanel = ({ 
  parentCategories, 
  allCategories,
  isVisible 
}: { 
  parentCategories: Category[]; 
  allCategories: Category[];
  isVisible: boolean;
}) => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const getSubCategories = (parentId: string) =>
    allCategories.filter((c) => c.parent_id === parentId);

  if (!isVisible) return null;

  return (
    <div className="bg-white border border-gray-200 shadow-lg w-64 flex-shrink-0">
      <nav>
        {parentCategories.map((category) => {
          const subCategories = getSubCategories(category.id);
          const hasSubCategories = subCategories.length > 0;
          const isHovered = hoveredCategory === category.id;

          return (
            <div
              key={category.id}
              className="relative border-b border-gray-100 last:border-b-0"
              onMouseEnter={() => setHoveredCategory(category.id)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <Link
                to={`/shop?category=${category.slug}`}
                className="flex items-center justify-between px-4 py-3 text-sm transition-colors hover:text-red-600 text-gray-800"
              >
                <span>{category.name_bn || category.name}</span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Link>

              {/* Sub-category Flyout */}
              {hasSubCategories && isHovered && (
                <div
                  className="absolute left-full top-0 bg-white border border-gray-200 shadow-lg min-w-[200px] z-50"
                  onMouseEnter={() => setHoveredCategory(category.id)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  {subCategories.map((subCat) => (
                    <Link
                      key={subCat.id}
                      to={`/shop?category=${subCat.slug}`}
                      className="flex items-center px-4 py-3 text-sm transition-colors hover:text-red-600 text-gray-800 border-b border-gray-100 last:border-b-0"
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

export default HeaderCategoryDropdown;
