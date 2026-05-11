"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  validateEmail,
  validatePhone,
  validateRequired,
} from "@/src/lib/validation";

type WishlistProduct = {
  name: string;
  quantity: number;
};

type EnquiryModalProps = {
  products?: WishlistProduct[];
  buttonLabel?: string;
  dialogTitle?: string;
  buttonClassName?: string;
};

export default function EnquiryModal({
  products = [],
  buttonLabel = "Enquiries",
  dialogTitle = "Enquiries",
  buttonClassName = "rounded-full cursor-pointer bg-[#0300A7] hover:bg-[#1E3A8A] text-xs px-6 h-8",
}: EnquiryModalProps) {
  const isCompanyMandatory = true;

  const productSummary = products
    .map((item) => `${item.name} × ${item.quantity}`)
    .join(", ");

  // Robot checkbox ke liye state
  const [isRobotChecked, setIsRobotChecked] = useState(false);

  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    product: products.length ? productSummary : "",
    spend: "",
    message: "",
  });

  useEffect(() => {
    if (products.length) {
      setForm((prev) => ({ ...prev, product: productSummary }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const numericValue = value.replace(/\D/g, "");
      setForm({ ...form, phone: numericValue });
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    // ✅ Required validations
    if (!validateRequired(form.name)) {
      toast.error("Full Name is required");
      return;
    }

    if (isCompanyMandatory && !validateRequired(form.company)) {
      toast.error("Company Name is required");
      return;
    }

    if (!validateRequired(form.email)) {
      toast.error("Email is required");
      return;
    }

    if (!validateEmail(form.email)) {
      toast.error("Invalid email address");
      return;
    }

    if (!validateRequired(form.phone)) {
      toast.error("Phone number is required");
      return;
    }

    if (!validatePhone(form.phone)) {
      toast.error("Enter a valid phone number");
      return;
    }

    if (!validateRequired(form.message)) {
      toast.error("Message is required");
      return;
    }

    // ✅ Robot Validation Check
    if (!isRobotChecked) {
      toast.error("Please confirm you are not a robot");
      return;
    }

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...form, wishlistProducts: products }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Enquiry sent successfully 🚀");

        // Reset Form and Checkbox
        setForm({
          name: "",
          company: "",
          email: "",
          phone: "",
          product: products.length ? productSummary : "",
          spend: "",
          message: "",
        });
        setIsRobotChecked(false);
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button className={buttonClassName}>{buttonLabel}</Button>
      </DialogTrigger>

      <DialogContent className="max-w-md rounded-xl p-6 font-poppins">
        <DialogTitle className="text-lg font-semibold font-poppins">
          {dialogTitle}
        </DialogTitle>
        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Full Name*</label>
              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter Full Name"
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                Company Name{isCompanyMandatory ? "*" : ""}
              </label>
              <Input
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="Enter Company Name"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Email*</label>
              <Input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter Email Address"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Phone*</label>
              <Input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter Phone no."
                maxLength={13}
                inputMode="numeric"
              />
            </div>
          </div>

          <Input
            name="product"
            value={form.product}
            onChange={handleChange}
            placeholder={
              products.length
                ? "Wishlist products auto-populated"
                : "Product of Interest"
            }
          />

          {products.length > 0 ? (
            <div className="border rounded-md p-3 bg-gray-50 text-sm text-gray-700">
              <p className="font-medium mb-2">Wishlist Products:</p>
              <ul className="list-decimal list-inside space-y-1">
                {products.map((item, index) => (
                  <li key={index}>{`${item.name} × ${item.quantity}`}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <Textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Other Comments / Info"
          />

          <div className="border rounded-md p-3 flex items-center gap-2 text-sm bg-gray-50/50">
            <input
              type="checkbox"
              id="robot-check"
              className="w-4 h-4 cursor-pointer"
              checked={isRobotChecked}
              onChange={(e) => setIsRobotChecked(e.target.checked)}
            />
            <label htmlFor="robot-check" className="cursor-pointer select-none">
              I&apos;m not a robot*
            </label>
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full cursor-pointer bg-[#1E3A8A] rounded-full"
          >
            SEND
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
