"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function EditCategoryPage() {
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const params = useParams();
  const router = useRouter();

  // ✅ Fetch existing data
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/category/${params.id}`);
      const data = await res.json();

      setForm({
        name: data.name || "",
        slug: data.slug || "",
        description: data.description || "",
        image: data.image || "",
      });

      setPreview(data.image); // 👈 show existing image
    };

    if (params.id) fetchData();
  }, [params.id]);

  // ✅ Upload Image
  const uploadImage = async () => {
    if (!file) return form.image;

    const data = new FormData();
    data.append("file", file);

    const toastId = toast.loading("Uploading image...");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });

      const result = await res.json();

      if (result.url) {
        toast.success("Image uploaded successfully ✅", {
          id: toastId,
        });
        return result.url;
      } else {
        toast.error("Upload failed ❌", { id: toastId });
        return form.image;
      }
    } catch (err) {
      console.error(err);
      toast.error("Upload error ❌", { id: toastId });
      return form.image;
    }
  };

  // ✅ Update Category
  const handleUpdate = async () => {
    const toastId = toast.loading("Updating category...");

    try {
      const imageUrl = await uploadImage();

      const res = await fetch(`/api/category/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          image: imageUrl,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Category updated successfully 🎉", {
          id: toastId,
        });

        setTimeout(() => {
          router.push("/admin/category");
        }, 800);
      } else {
        toast.error(data.error || "Update failed ❌", {
          id: toastId,
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong ❌", {
        id: toastId,
      });
    }
  };

  return (
    <div className="p-6 max-w-xl font-barlow ">
      <h1 className="ml-4 text-2xl font-semibold">Edit Category</h1>
      <Card className="ml-10 mt-4">
        <CardContent className="p-6 space-y-5">
          {/* NAME */}
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          {/* SLUG */}
          <div className="space-y-2">
            <Label>Slug</Label>
            <Input
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
            />
          </div>

          {/* IMAGE PREVIEW */}
          <div className="space-y-2">
            <Label>Category Image</Label>

            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-28 h-28 rounded-lg object-cover border"
              />
            )}

            {/* FILE INPUT */}
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const selectedFile = e.target.files?.[0];
                setFile(selectedFile || null);

                if (selectedFile) {
                  const previewUrl = URL.createObjectURL(selectedFile);
                  setPreview(previewUrl);
                }
              }}
            />
          </div>

          {/* DESCRIPTION */}
          {/* <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
            />
          </div> */}

          {/* BUTTON */}
          <Button onClick={handleUpdate} className="w-full cursor-pointer">
            Update Category
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
