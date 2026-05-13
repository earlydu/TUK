
"use client";

import React, { useState } from "react";
import {
  IconSend,
  IconCheck,
  IconArrowRight,
  IconBuildingStore,
  IconBriefcase,
  IconWorld,
  IconUsers,
} from "@tabler/icons-react";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import Link from "next/link";
import { toast } from "sonner";
import {
  validateEmail,
  validatePhone,
  validateRequired,
} from "@/src/lib/validation";
import Image from "next/image";

const Page = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [focusedField, setFocusedField] = useState("");

  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    country: "",
    businessType: "",
    experience: "",
    productCategory: "",
    purchaseVolume: "",
    message: "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const numericValue = value.replace(/\D/g, "");
      setForm({ ...form, phone: numericValue });
      return;
    }
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    if (!validateRequired(form.name))
      return toast.error("Full Name is required");
    if (!validateRequired(form.company))
      return toast.error("Company Name is required");
    if (!validateRequired(form.email)) return toast.error("Email is required");
    if (!validateEmail(form.email)) return toast.error("Invalid email address");
    if (!validateRequired(form.phone))
      return toast.error("Phone number is required");
    if (!validatePhone(form.phone))
      return toast.error("Enter a valid phone number");
    if (!validateRequired(form.country))
      return toast.error("Country is required");
    if (!validateRequired(form.businessType))
      return toast.error("Please select business type");
    if (!validateRequired(form.message))
      return toast.error("Business details are required");
    if (!isChecked) return toast.error("Please accept terms");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Distributor enquiry submitted successfully 🎉");
        setForm({
          name: "",
          company: "",
          email: "",
          phone: "",
          country: "",
          businessType: "",
          experience: "",
          productCategory: "",
          purchaseVolume: "",
          message: "",
        });
        setIsChecked(false);
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const inputClass = (field: string) =>
    `w-full px-4 py-3 rounded-xl border-2 transition-all text-sm focus:outline-none ${focusedField === field
      ? "border-blue-500 bg-blue-50"
      : "border-gray-200 bg-gray-50 hover:border-gray-300"
    }`;

  return (
    <>
      <Header />
      <section className="w-full font-poppins bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div
          className="w-full text-white py-24 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #0f172a 0%, #1e3a8a 45%, #364FA3 100%)",
          }}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-400 rounded-full blur-3xl"></div>
          </div>
          <div className="max-w-6xl mx-auto px-6 text-center z-10">
            <Image
              alt="Hero Background"
              src="/graph1.jpeg"
              className="absolute top-0 left-0 w-full h-full z-10 opacity-20 "
              width={1920}
              height={100}

            />
            <h1 className="text-4xl md:text-5xl font-semibold mb-6">
              Become an Authorised Distribution Partner
            </h1>
            <p className="max-w-3xl mx-auto text-white/80 text-sm md:text-base leading-7">
              Expand your business with premium structured cabling, networking,
              telecom and connectivity solutions trusted across international
              markets. Submit your partnership enquiry to access dealer pricing,
              territory support and technical sales assistance.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-16 md:py-20 grid xl:grid-cols-5 gap-10">
          <div className="xl:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Why Partner With Us?
              </h2>
              <p className="text-sm text-gray-600 leading-6">
                We help distributors scale faster with strong margins,
                fast-moving inventory, and dedicated business support.
              </p>
            </div>

            <div className="space-y-4">
              {(
                [
                  [IconBuildingStore, "Strong Margins & Reliable Supply"],

                  [IconBriefcase, "Sales, Marketing & Technical Support"],
                ] as Array<[React.ComponentType<any>, string]>
              ).map(([Icon, text], i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4"
                >
                  <div className="p-3 rounded-xl bg-blue-50">
                    <Icon className="text-blue-600 w-5 h-5" />
                  </div>
                  <p className="font-semibold text-sm text-gray-800">{text}</p>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 text-white shadow-xl">
              <h3 className="font-bold text-lg mb-5">Partnership Process</h3>
              <div className="space-y-4 text-sm text-blue-100">
                <div className="flex gap-3">
                  <IconCheck size={18} /> Submit Distributor Enquiry
                </div>
                <div className="flex gap-3">
                  <IconCheck size={18} /> Business Qualification Review
                </div>
                <div className="flex gap-3">
                  <IconCheck size={18} /> Pricing & Territory Discussion
                </div>
                <div className="flex gap-3">
                  <IconCheck size={18} /> Distributor Onboarding
                </div>
              </div>
            </div>

            <Link href="/request-quote">
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all cursor-pointer group">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">
                      Need Immediate Pricing?
                    </h4>
                    <p className="text-sm text-gray-600">
                      Request a fast bulk order quotation.
                    </p>
                  </div>
                  <IconArrowRight className="text-blue-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>

          <div className="xl:col-span-3">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-10">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Distributor Partnership Enquiry
                </h2>
                <p className="text-gray-600 text-sm">
                  Qualified business applications are reviewed by our
                  partnership team within 1 business day.
                </p>
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField("")}
                    placeholder="Full Name *"
                    className={inputClass("name")}
                  />
                  <input
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("company")}
                    onBlur={() => setFocusedField("")}
                    placeholder="Company Name *"
                    className={inputClass("company")}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField("")}
                    placeholder="Business Email *"
                    className={inputClass("email")}
                  />
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("phone")}
                    onBlur={() => setFocusedField("")}
                    placeholder="Phone Number *"
                    className={inputClass("phone")}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <input
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("country")}
                    onBlur={() => setFocusedField("")}
                    placeholder="Country / Region *"
                    className={inputClass("country")}
                  />
                  <select
                    name="businessType"
                    value={form.businessType}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("businessType")}
                    onBlur={() => setFocusedField("")}
                    className={inputClass("businessType")}
                  >
                    <option value="">Select Business Type *</option>
                    <option value="Distributor">Distributor</option>
                    <option value="Reseller">Reseller</option>
                    <option value="System Integrator">System Integrator</option>
                    <option value="Electrical Contractor">
                      Electrical Contractor
                    </option>
                    <option value="Retailer">Retailer</option>
                  </select>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <input
                    name="experience"
                    value={form.experience}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("experience")}
                    onBlur={() => setFocusedField("")}
                    placeholder="Years in Business"
                    className={inputClass("experience")}
                  />
                  <input
                    name="productCategory"
                    value={form.productCategory}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("productCategory")}
                    onBlur={() => setFocusedField("")}
                    placeholder="Current Product Categories"
                    className={inputClass("productCategory")}
                  />
                </div>

                <input
                  name="purchaseVolume"
                  value={form.purchaseVolume}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("purchaseVolume")}
                  onBlur={() => setFocusedField("")}
                  placeholder="Estimated Monthly Purchase Potential"
                  className={inputClass("purchaseVolume")}
                />

                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("message")}
                  onBlur={() => setFocusedField("")}
                  placeholder="Tell us about your business reach, customer base, and why you want to partner with us *"
                  className={`${inputClass("message")} h-36 resize-none`}
                />

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => setIsChecked(e.target.checked)}
                    className="w-5 h-5 mt-1 accent-blue-600"
                  />
                  <span className="text-sm text-gray-700">
                    I agree to the{" "}
                    <Link
                      href="/terms-conditions"
                      className="text-blue-600 font-semibold"
                    >
                      Terms & Conditions
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy-policy"
                      className="text-blue-600 font-semibold"
                    >
                      Privacy Policy
                    </Link>
                  </span>
                </label>

                <button
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <IconSend size={18} /> APPLY FOR DISTRIBUTORSHIP
                </button>
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
