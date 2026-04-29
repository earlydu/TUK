"use client";

import { Button } from "@base-ui/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { validateEmail, validatePhone } from "@/src/lib/validation";

interface ProductGuideData {
  heading: string;
  subheading: string;
  buttonText: string;
}

const ProductGuide = () => {
  const [guideData, setGuideData] = useState<ProductGuideData>({
    heading: "Get the 2025 Product Guide",
    subheading:
      "Detailed specifications, installation diagrams, and the full SPEEDY RJ45 range. Direct to your inbox.",
    buttonText: "Send PDF Guide",
  });

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    pincode: "",
    company: "",
  });

  useEffect(() => {
    fetch("/api/pages/home")
      .then((res) => res.json())
      .then((data) => {
        if (data.productGuide) setGuideData(data.productGuide);
      })
      .catch(console.error);
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const numericValue = value.replace(/\D/g, "");
      setForm({ ...form, phone: numericValue });
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!validateEmail(form.email)) {
      toast.error("Invalid email address");
      return;
    }

    if (!validatePhone(form.phone)) {
      toast.error("Invalid phone number (Enter valid 10 digit number)");
      return;
    }

    try {
      toast.success("Downloading PDF...");

      const link = document.createElement("a");
      link.href = "/Product Guide March 2025 - TUK Ltd.pdf";
      link.download = "Product-Guide.pdf";
      link.click();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <section
      id="product-guide"
      className="relative w-full max-w-6xl mx-auto text-white px-4"
    >
      <div
        className="flex flex-col md:flex-row w-full border-2 bg-[#141D3D]
    rounded-xl gap-8 md:gap-4 justify-center items-center md:items-start lg:p-0 p-4 md:p-6"
      >
        {/* Image */}
        <div className="flex justify-center">
          <Image
            src="/image/guide2025.png"
            alt="Product Guide"
            width={300}
            height={600}
            className="object-cover w-75 md:w-150 lg:mt-4 lg:ml-4 md:mt-8"
            priority
          />
        </div>

        {/* Content */}
        <div className="w-full md:w-1/2 md:px-6 px-2 ">
          <h2 className="text-xl md:text-2xl font-bold mb-4 mt-4 md:mt-10 font-poppins">
            {guideData.heading}
          </h2>

          <p className="text-sm md:text-md mb-6 font-poppins">
            {guideData.subheading}
          </p>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[#6B7280] font-inter"
          >
            <input
              name="firstName"
              placeholder="Enter First Name*"
              onChange={handleChange}
              className="bg-white/5 rounded-md p-2 w-full"
              required
            />
            <input
              name="lastName"
              placeholder="Enter Last Name*"
              onChange={handleChange}
              className="bg-white/5 rounded-md p-2 w-full"
              required
            />
            <input
              name="email"
              placeholder="Work email address*"
              onChange={handleChange}
              className="bg-white/5 rounded-md p-2 w-full"
              required
            />
            <input
              name="phone"
              placeholder="Enter Phone no.*"
              value={form.phone}
              onChange={handleChange}
              maxLength={13}
              inputMode="numeric"
              className="bg-white/5 rounded-md p-2 w-full"
            />
            <input
              name="city"
              placeholder="Enter City"
              onChange={handleChange}
              className="bg-white/5 rounded-md p-2 w-full"
              required
            />
            <input
              name="pincode"
              placeholder="Enter Postcode"
              onChange={handleChange}
              className="bg-white/5 rounded-md p-2 w-full"
              required
            />
            <input
              name="company"
              placeholder="Enter Your Company"
              onChange={handleChange}
              className="bg-white/5 rounded-md p-2 w-full md:col-span-2"
              required
            />

            <Button
              type="submit"
              className="bg-[#0300A7] text-white rounded-md px-4 py-2 w-full md:col-span-2"
            >
              {guideData.buttonText}
            </Button>
          </form>

          <p className="text-xs md:text-sm text-gray-500 mt-1 py-2 mb-1 font-inter">
            By clicking you agree to our privacy policy and receiving B2B
            updates.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProductGuide;
