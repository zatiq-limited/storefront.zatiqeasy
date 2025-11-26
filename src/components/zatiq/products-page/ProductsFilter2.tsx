import React, { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SortOption {
  value: string;
  label: string;
}

interface ProductsFilter2Props {
  settings?: {
    showSearch?: boolean;
    showSort?: boolean;
    sortOptions?: SortOption[];
  };
  currentSort?: string;
  currentSearch?: string;
  productCount?: number;
  onSortChange?: (sort: string) => void;
  onSearchChange?: (search: string) => void;
  onFilterToggle?: () => void;
}

const ProductsFilter2: React.FC<ProductsFilter2Props> = ({
  settings = {},
  currentSort = "featured",
  currentSearch = "",
  productCount = 0,
  onSortChange,
  onSearchChange,
  onFilterToggle,
}) => {
  const [searchValue, setSearchValue] = useState(currentSearch);
  const {
    showSearch = true,
    showSort = true,
    sortOptions = [],
  } = settings;

  const handleSortChange = (value: string) => {
    if (onSortChange) {
      onSortChange(value);
    } else {
      const url = new URL(window.location.href);
      url.searchParams.set("sort", value);
      window.location.href = url.toString();
    }
  };

  const handleSearch = () => {
    if (onSearchChange) {
      onSearchChange(searchValue);
    } else {
      const url = new URL(window.location.href);
      if (searchValue) {
        url.searchParams.set("search", searchValue);
      } else {
        url.searchParams.delete("search");
      }
      url.searchParams.delete("page");
      window.location.href = url.toString();
    }
  };

  return (
    <section className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="max-w-[1440px] mx-auto px-4 2xl:px-0 py-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Left Side - Product Count */}
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{productCount}</span> products
            </p>
          </div>

          {/* Right Side - Search & Sort */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            {/* Search */}
            {showSearch && (
              <div className="flex-1 lg:flex-none lg:w-64">
                <div className="relative flex gap-2">
                  <Input
                    type="search"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="Search products..."
                    className="pr-10"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleSearch}
                    className="absolute right-0 top-0 h-full hover:bg-transparent"
                  >
                    <Search className="h-4 w-4" />
                    <span className="sr-only">Search</span>
                  </Button>
                </div>
              </div>
            )}

            {/* Sort */}
            {showSort && (
              <Select value={currentSort} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductsFilter2;
