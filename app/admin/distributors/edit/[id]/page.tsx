"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function EditDistributor() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
    visitUrl: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/distributors");
      const data = await res.json();
      const item = data.find((d: any) => d.id === id);

      if (item) {
        setForm({
          name: item.name || "",
          slug: item.slug || "",
          description: item.description || "",
          image: item.image || "",
          visitUrl: item.visitUrl || "",
        });
        setPreview(item.image || "");
      }
    };

    fetchData();
  }, [id]);

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "distributors");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Upload failed");

      setForm((prev) => ({
        ...prev,
        image: data.url,
      }));

      setPreview(data.url);

      toast.success("Image uploaded successfully ");
    } catch (err) {
      toast.error("Upload failed ");
    } finally {
      setUploading(false);
    }
  };
  const handleSubmit = async () => {
    if (!form.name || !form.slug) {
      toast.error("Name and slug are required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`/api/distributors/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to save");

      toast.success("Distributor added successfully 🎉");

      // redirect after short delay (better UX)
      setTimeout(() => {
        router.push("/admin/distributors");
        router.refresh();
      }, 800);
    } catch (err) {
      toast.error("Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-4 max-w-md ml-4 font-barlow">
      <h2 className="text-xl font-semibold">Edit Distributor</h2>

      <div className="ml-10 space-y-4">
        <div>
          <label className="block text-lg font-medium mb-2">Name</label>
          <Input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-lg font-medium mb-2">Slug</label>
          <Input
            placeholder="Slug"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-lg font-medium mb-2">Description</label>
          <Input
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-lg font-medium mb-2">Logo Image</label>
          <input
            type="file"
            onChange={(e) => {
              const selected = e.target.files?.[0];
              if (selected) {
                setFile(selected);
                setPreview(URL.createObjectURL(selected));
              }
            }}
          />
        </div>

        {/* Preview */}
        {(preview || form.image) && (
          <img
            src={preview || form.image}
            alt="preview"
            className="w-24 h-24 object-cover rounded"
          />
        )}

        <Button
          type="button"
          onClick={handleUpload}
          disabled={uploading}
          className="cursor-pointer"
        >
          {uploading ? "Uploading..." : "Upload Logo"}
        </Button>

        <div>
          <label className="block text-lg font-medium mb-2">Visit URL</label>
          <Input
            placeholder="Visit URL"
            value={form.visitUrl}
            onChange={(e) => setForm({ ...form, visitUrl: e.target.value })}
          />
        </div>

        {/* Save Button */}

        <Button
          className="cursor-pointer"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Distributor"}
        </Button>
      </div>
    </div>
  );
}
