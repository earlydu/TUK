"use client";

import React, { useState } from "react";
import {
  IconMapPin,
  IconPhone,
  IconMail,
  IconSend,
  IconMapPinFilled,
  IconPhoneFilled,
  IconMailFilled,
  IconFileDescriptionFilled,
  IconArrowRight,
  IconCheck,
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

const Page = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [focusedField, setFocusedField] = useState("");

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
      toast.error("Enter valid 10 digit phone number");
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
  return (
    <>
      <Header />
      <section className="w-full font-poppins bg-gradient-to-br from-slate-50 via-white to-slate-50">
        {/* HERO HEADER */}
        <div
          className="w-full text-white py-20 md:py-24 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #364FA3 100%)",
          }}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-400 rounded-full blur-3xl"></div>
          </div>
          <div className="max-w-7xl mx-auto px-6 text-center space-y-6 relative z-10">
            <div className="inline-block">
              <span className="text-sm font-semibold text-blue-200 bg-blue-900/40 px-4 py-2 rounded-full backdrop-blur">
                ✨ Partnership Opportunities
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Become a Distributor
            </h1>
            <p className="text-base md:text-lg font-light opacity-90 max-w-2xl mx-auto">
              Join our network and grow your business with premium voice and
              data cabling solutions. Our expert team is here to support your
              success.
            </p>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
          <div className="grid xl:grid-cols-5 gap-10 md:gap-16">
            {/* LEFT SIDE - CONTACT INFO & MAP */}
            <div className="xl:col-span-2 space-y-8">
              {/* Contact Info Cards */}
              <div className="space-y-5">
                <h2 className="text-2xl font-bold text-gray-900">
                  Get In Touch
                </h2>
                <p className="text-gray-600 text-sm">
                  Reach out to our distribution team to discuss partnership
                  opportunities.
                </p>
              </div>

              {/* ADDRESS CARD */}
              <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 p-3 h-fit rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 group-hover:from-blue-100 group-hover:to-cyan-100 transition-colors">
                    <IconMapPinFilled className="text-blue-600 w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-gray-900 text-sm">
                      Our Address
                    </p>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Unit 4, Wimbledon Stadium <br />
                      Business Centre, Riverside Road,
                      <br />
                      London SW17 0BA
                    </p>
                  </div>
                </div>
              </div>

              {/* PHONE CARD */}
              <a
                href="tel:+442089466688"
                className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 block"
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0 p-3 h-fit rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 group-hover:from-blue-100 group-hover:to-cyan-100 transition-colors">
                    <IconPhoneFilled className="text-blue-600 w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-gray-900 text-sm">Phone</p>
                    <p className="text-gray-600 text-sm group-hover:text-blue-600 transition-colors font-medium">
                      +44 (0) 20 8946 6688
                    </p>
                  </div>
                </div>
              </a>

              {/* EMAIL CARD */}
              <a
                href="mailto:sales@tuk.co.uk"
                className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 block"
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0 p-3 h-fit rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 group-hover:from-blue-100 group-hover:to-cyan-100 transition-colors">
                    <IconMailFilled className="text-blue-600 w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-gray-900 text-sm">Email</p>
                    <p className="text-gray-600 text-sm group-hover:text-blue-600 transition-colors font-medium">
                      sales@tuk.co.uk
                    </p>
                  </div>
                </div>
              </a>

              {/* MAP */}
              <div className="w-full h-72 rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                <iframe
                  src="https://www.google.com/maps?q=51.43319,-0.19002&hl=en&z=16&output=embed"
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              {/* QUOTE CARD */}
              <Link href="/request-quote">
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 shadow-lg cursor-pointer hover:shadow-2xl transition-all duration-300 group text-white overflow-hidden relative">
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-2xl"></div>
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-lg">Need a Fast Quote?</h3>
                      <IconArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </div>
                    <p className="text-blue-100 text-sm mb-5">
                      Get an instant quote for your bulk orders or custom
                      requirements.
                    </p>
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <span>REQUEST A QUOTE</span>
                      <IconFileDescriptionFilled size={16} />
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* RIGHT SIDE FORM */}
            <div className="xl:col-span-3">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-10">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Send us a Message
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Fill out the form below and our team will get back to you
                    within 24 hours.
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Name + Company */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("name")}
                        onBlur={() => setFocusedField("")}
                        placeholder="John Doe"
                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all text-sm focus:outline-none ${
                          focusedField === "name"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 bg-gray-50 hover:border-gray-300"
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Company <span className="text-red-500">*</span>
                      </label>
                      <input
                        name="company"
                        value={form.company}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("company")}
                        onBlur={() => setFocusedField("")}
                        placeholder="Your Company"
                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all text-sm focus:outline-none ${
                          focusedField === "company"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 bg-gray-50 hover:border-gray-300"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Email + Phone */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("email")}
                        onBlur={() => setFocusedField("")}
                        placeholder="john@company.com"
                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all text-sm focus:outline-none ${
                          focusedField === "email"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 bg-gray-50 hover:border-gray-300"
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("phone")}
                        onBlur={() => setFocusedField("")}
                        placeholder="1234567890"
                        maxLength={10}
                        inputMode="numeric"
                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all text-sm focus:outline-none ${
                          focusedField === "phone"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 bg-gray-50 hover:border-gray-300"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Inquiry */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Inquiry Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="inquiry"
                      value={form.inquiry}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("inquiry")}
                      onBlur={() => setFocusedField("")}
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-all text-sm focus:outline-none appearance-none bg-no-repeat ${
                        focusedField === "inquiry"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 bg-gray-50 hover:border-gray-300"
                      }`}
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                        backgroundPosition: "right 1rem center",
                        backgroundSize: "1.5em 1.5em",
                        paddingRight: "2.5rem",
                      }}
                    >
                      <option value="">Select Inquiry Type</option>
                      <option value="product">Product Inquiry</option>
                      <option value="service">Service Support</option>
                      <option value="general">General Question</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("message")}
                      onBlur={() => setFocusedField("")}
                      placeholder="Tell us more about your interest..."
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-all text-sm focus:outline-none resize-none h-32 ${
                        focusedField === "message"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 bg-gray-50 hover:border-gray-300"
                      }`}
                    />
                  </div>

                  {/* Checkbox */}
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="flex-shrink-0 mt-1">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => setIsChecked(e.target.checked)}
                        className="w-5 h-5 rounded-lg border-2 border-gray-300 cursor-pointer accent-blue-600"
                      />
                    </div>
                    <span className="text-sm text-gray-700">
                      I agree to the{" "}
                      <Link
                        href="/terms-conditions"
                        className="text-blue-600 font-semibold hover:underline"
                      >
                        Terms & Conditions
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy-policy"
                        className="text-blue-600 font-semibold hover:underline"
                      >
                        Privacy Policy
                      </Link>
                    </span>
                  </label>

                  {/* Submit Button */}
                  <button
                    onClick={handleSubmit}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl mt-8 group"
                  >
                    <IconSend
                      size={18}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                    SEND MESSAGE
                  </button>

                  <p className="text-xs text-gray-500 text-center mt-4">
                    We'll respond within 24 business hours
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Page;
