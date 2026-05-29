"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useState } from "react";

const FilterSide = ({ category, setCategory, sort, setSort }: any) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/category");
        const data = await res.json();
        setCategories([{ id: "all", name: "All Categories" }, ...data]);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <p className="p-4 text-sm">Loading categories...</p>;
  }

  return (
    <div className="lg:block bg-white rounded-xl border p-6 space-y-8 font-poppins">
      <div className="space-y-5">
        <h3 className="text-sm font-semibold tracking-widest text-gray-500 font-poppins">
          CATEGORIES
        </h3>

        <RadioGroup
          value={category}
          onValueChange={(value) => {
            // Update React state instantly — products re-filter with no navigation
            setCategory(value);

            // Silently update the URL bar only (no page reload/remount)
            if (value === "All Categories") {
              window.history.pushState(null, "", "/category");
            } else {
              const selected = categories.find((c) => c.name === value);
              if (selected) {
                const slug = selected.slug || encodeURIComponent(selected.name);
                window.history.pushState(null, "", `/category/${slug}`);
              }
            }
          }}
        >
          {categories.map((cat: any) => (
            <div key={cat.id} className="flex items-center gap-3 font-poppins">
              <RadioGroupItem value={cat.name} id={cat.name} />
              <label htmlFor={cat.name} className="text-black cursor-pointer">
                {cat.name}
              </label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
};

export default FilterSide;
