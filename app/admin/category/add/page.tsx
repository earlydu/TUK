"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function AddCategoryPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // AUTO SLUG GENERATE
  const handleNameChange = (value: string) => {
    setForm({
      ...form,
      name: value,
      slug: value.toLowerCase().replace(/\s+/g, "-"),
    });
  };

  // 🖼️ IMAGE UPLOAD

  const handleUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    // 🔥 Show loading toast
    const toastId = toast.loading("Uploading image...");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.url) {
        setForm((prev) => ({ ...prev, image: data.url }));

        // ✅ Success toast
        toast.success("Image uploaded successfully ✅", {
          id: toastId,
        });
      } else {
        toast.error("Upload failed ❌", {
          id: toastId,
        });
      }
    } catch (err) {
      console.error(err);

      // ❌ Error toast
      toast.error("Something went wrong during upload", {
        id: toastId,
      });
    }

    setUploading(false);
  };

  // ✅ SUBMIT
  const handleSubmit = async () => {
    if (!form.name || !form.slug) {
      toast.error("Name & Slug required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Category added successfully 🎉");

        // small delay for better UX
        setTimeout(() => {
          router.push("/admin/category");
        }, 800);
      } else {
        toast.error(data.error || "Failed to add category");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-xl mx-auto font-barlow">
      <h1 className="text-2xl font-bold mb-6">Add Category</h1>

      <div className="space-y-4 bg-white p-6 rounded-xl shadow">
        {/* NAME */}
        <div>
          <label>Name</label>
          <Input
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
          />
        </div>

        {/* SLUG */}
        <div>
          <label>Slug</label>
          <Input
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
          />
        </div>

        {/* IMAGE */}
        <div>
          <label>Category Image</label>

          {form.image && (
            <img
              src={form.image}
              className="w-24 h-24 rounded object-cover mb-2"
            />
          )}

          <Input type="file" onChange={handleUpload} />

          {uploading && <p className="text-sm">Uploading...</p>}
        </div>

        {/* DESCRIPTION */}
        {/* <div>
          <label>Description</label>
          <Textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div> */}

        {/* BUTTON */}
        <Button
          onClick={handleSubmit}
          className="w-full cursor-pointer"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Category"}
        </Button>
      </div>
    </div>
  );
}
