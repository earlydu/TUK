"use client";

import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import {
  IconMapPin,
  IconPhone,
  IconMail,
  IconSend,
  IconMapPinFilled,
  IconPhoneFilled,
  IconMailFilled,
  IconFileDescriptionFilled,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import Link from "next/link";
import {
  validateEmail,
  validatePhone,
  validateRequired,
} from "@/src/lib/validation";

interface ContactPageData {
  hero: { title: string; subtitle: string };
  contactInfo: {
    heading: string;
    address: { label: string; value: string };
    phone: { label: string; value: string };
    email: { label: string; value: string };
  };
}

const Page = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [pageData, setPageData] = useState<ContactPageData | null>(null);
  const [isLoadingPage, setIsLoadingPage] = useState(true);

  useEffect(() => {
    fetch("/api/pages/contact")
      .then((res) => res.json())
      .then((data) => setPageData(data))
      .catch(console.error)
      .finally(() => setIsLoadingPage(false));
  }, []);

  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    inquiry: "",
    message: "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    // ✅ Only numbers for phone
    if (name === "phone") {
      const numericValue = value.replace(/\D/g, "");
      setForm({ ...form, phone: numericValue });
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill required fields");
      return;
    }
    if (!validateRequired(form.name)) {
      toast.error("Full Name is required");
      return;
    }

    if (!validateRequired(form.company)) {
      toast.error("Company is required");
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

    if (!validateRequired(form.inquiry)) {
      toast.error("Please select inquiry type");
      return;
    }

    if (!validateRequired(form.message)) {
      toast.error("Message is required");
      return;
    }

    if (!isChecked) {
      toast.error("Please accept terms");
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Message sent successfully 🎉");

        setForm({
          name: "",
          company: "",
          email: "",
          phone: "",
          inquiry: "",
          message: "",
        });
        setIsChecked(false);
      } else {
        toast.error(data.error);
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };
  if (isLoadingPage) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <>
      <Header />
      <section className="w-full bg-gray-100 font-poppins">
        {/* HEADER */}
        <div
          className="w-full h-72 text-white items-center py-16"
          style={{
            background: "linear-gradient(to right, #141D3D, #364FA3)",
          }}
        >
          <div className="max-w-7xl mx-auto px-6 text-center space-y-4">
            <h1 className="text-3xl md:text-4xl xl:text-5xl font-semibold font-poppins">
              {pageData?.hero.title ?? "Contact Us"}
            </h1>
            <p className="mt-4 text-sm md:text-base text-white/80 max-w-2xl mx-auto font-poppins">
              {pageData?.hero.subtitle ??
                "Get in touch with our expert team for voice and data cabling solutions, technical support, or bespoke requirements."}
            </p>
          </div>
        </div>

        {/* CONTACT SECTION */}
        <div className="max-w-5xl mx-auto px-6 py-16 grid xl:grid-cols-12 gap-12">
          {/* LEFT SIDE */}
          <div className="space-y-8 xl:col-span-6">
            <h2 className="text-xl font-semibold">
              {pageData?.contactInfo.heading ?? "Get In Touch"}
            </h2>

            {/* ADDRESS */}
            <div className="flex gap-4">
              <div className="p-2 h-10 rounded-md bg-[#2596BE1A]">
                <IconMapPinFilled className="text-[#2596BE]" />
              </div>
              <div className="text-sm text-gray-700">
                <p className="font-semibold">
                  {pageData?.contactInfo.address.label ?? "Our Address"}
                </p>
                <p>{pageData?.contactInfo.address.value}</p>
              </div>
            </div>

            {/* PHONE */}
            <a
              href={`tel:${pageData?.contactInfo.phone.value?.replace(/[^+\d]/g, "") ?? ""}`}
              className="flex gap-4 group cursor-pointer"
            >
              <div className="p-2 rounded-md bg-[#2596BE1A] group-hover:bg-[#2596BE33] transition-colors">
                <IconPhoneFilled className="text-[#2596BE]" />
              </div>
              <div className="text-sm text-gray-700">
                <p className="font-semibold">
                  {pageData?.contactInfo.phone.label ?? "Phone"}
                </p>
                <p className="group-hover:text-[#2596BE] transition-colors">
                  {pageData?.contactInfo.phone.value}
                </p>
              </div>
            </a>

            {/* EMAIL */}
            <a
              href={`mailto:${pageData?.contactInfo.email.value ?? ""}`}
              className="flex gap-4 group cursor-pointer"
            >
              <div className="p-2 rounded-md bg-[#2596BE1A] group-hover:bg-[#2596BE33] transition-colors">
                <IconMailFilled className="text-[#2596BE]" />
              </div>
              <div className="text-sm text-gray-700">
                <p className="font-semibold">
                  {pageData?.contactInfo.email.label ?? "Email"}
                </p>
                <p className="group-hover:text-[#2596BE] transition-colors">
                  {pageData?.contactInfo.email.value}
                </p>
              </div>
            </a>

            {/* MAP */}
            <div className="w-full h-64 rounded-xl overflow-hidden shadow">
              {/* <iframe
                src="https://www.google.com/maps?q=51.43319,-0.19002&hl=en&z=16&output=embed"
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              /> */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4974.7514827094865!2d-0.19203590213012767!3d51.43289309910211!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48760f5506cbea1d%3A0xa48c722c56314a5b!2sTUK%20Ltd!5e0!3m2!1sen!2sin!4v1777454916627!5m2!1sen!2sin"
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            {/* ✅ UPDATED QUOTE CARD */}
            <div className="bg-gray-100 rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                Need a fast quote?
              </h3>

              <p className="text-sm text-gray-600 mb-6">
                Click below to jump to our quick quote request form.
              </p>

              <Link href="/request-quote">
                <Button className="bg-[#0300A7] cursor-pointer py-6 rounded-full   hover:bg-blue-900 w-full flex items-center justify-center gap-2">
                  <IconFileDescriptionFilled size={18} />
                  REQUEST A QUOTE
                </Button>
              </Link>
            </div>
          </div>

          {/* RIGHT SIDE FORM */}
          <div className="bg-white p-8 rounded-xl shadow space-y-6 xl:col-span-6 h-fit">
            <h2 className="text-xl font-semibold">Send us a message</h2>

            {/* Name + Company */}
            <div className="grid md:grid-cols-2 gap-6">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full Name*"
                className="border rounded-lg px-4 py-3 text-sm w-full"
              />

              <input
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="Company*"
                className="border rounded-lg px-4 py-3 text-sm w-full"
              />
            </div>

            {/* Email + Phone */}
            <div className="grid md:grid-cols-2 gap-6">
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email Address*"
                className="border rounded-lg px-4 py-3 text-sm w-full"
              />

              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone Number*"
                maxLength={13}
                inputMode="numeric"
                className="border rounded-lg px-4 py-3 text-sm w-full"
              />
            </div>

            {/* Inquiry */}
            <select
              name="inquiry"
              value={form.inquiry}
              onChange={handleChange}
              className="border rounded-lg px-4 py-3 text-sm w-full"
            >
              <option value="">Select Inquiry</option>
              <option value="product">Product enquiry</option>
              <option value="service">Service inquiry</option>
              <option value="general">General inquiry</option>
            </select>

            {/* Message */}
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Message*"
              className="border rounded-lg px-4 py-3 text-sm w-full h-32"
            />

            {/* Checkbox */}
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                className="mt-1"
              />

              <span className="text-sm">
                I agree to the{" "}
                <span className="text-blue-600 underline">
                  <Link href="/terms-conditions">Terms & Conditions</Link>
                </span>{" "}
                and{" "}
                <span className="text-blue-600 underline">
                  <Link href="/privacy-policy">Privacy Policy</Link>
                </span>
                .
              </span>
            </label>

            {/* Submit */}
            <Button
              onClick={handleSubmit}
              className="bg-[#0300A7] cursor-pointer py-6 rounded-full hover:bg-blue-900 w-full flex items-center justify-center gap-2"
            >
              <IconSend size={18} />
              SEND MESSAGE
            </Button>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Page;
