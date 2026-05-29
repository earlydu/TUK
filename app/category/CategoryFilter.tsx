"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface CategoryFilterProps {
  onCategoryChange: (category: string) => void;
  onCategoriesLoad: (categories: any[]) => void;
}

export function CategoryFilter({
  onCategoryChange,
  onCategoriesLoad,
}: CategoryFilterProps) {
  const searchParams = useSearchParams();
  // New: read slug-based param; also support old ?categoryId=uuid for backward compat
  const categorySlug = searchParams.get("category");
  const categoryId = searchParams.get("categoryId");

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch("/api/category");
      const data = await res.json();

      if (onCategoriesLoad) {
        onCategoriesLoad(data);
      }

      if (categorySlug) {
        // Match by slug (new format)
        const found = data.find(
          (c: any) =>
            c.slug === categorySlug ||
            encodeURIComponent(c.name) === categorySlug
        );
        if (found) {
          onCategoryChange(found.name);
        } else {
          onCategoryChange("All Categories");
        }
      } else if (categoryId) {
        // Backward compat: match by ID (old format)
        if (categoryId === "all") {
          onCategoryChange("All Categories");
        } else {
          const found = data.find(
            (c: any) => String(c.id) === String(categoryId)
          );
          if (found) {
            onCategoryChange(found.name);
          }
        }
      } else {
        onCategoryChange("All Categories");
      }
    };

    fetchCategories();
  }, [categorySlug, categoryId, onCategoryChange, onCategoriesLoad]);

  return null;
}
