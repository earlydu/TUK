"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import {
  IconShieldCheck,
  IconMapPin,
  IconLeaf,
  IconHeadset,
  IconLink,
  IconBulb,
  IconPackage,
  IconDownload,
  IconRecycle,
} from "@tabler/icons-react";
import Image from "next/image";
import OurDistribution from "@/components/common/homepage/OurDistribution";
import { Loader2 } from "lucide-react";

interface AboutPageData {
  id: string;
  title: string;
  slug: string;
  hero: {
    title: string;
    subtitle: string;
    badges: Array<{ icon: string; text: string }>;
  };
  heritage: {
    subtitle: string;
    title: string;
    content: string[];
    image: string;
    experience: string;
    experienceText: string;
  };
  mission: {
    title: string;
    description: string;
    bigImage: string;
    smallImage: string;
  };
  iso: {
    title: string;
    certNumber: string;
    description: string;
  };
  coreValues: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  weee: {
    title: string;
    description: string;
    cards: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
  };
}

const getIconComponent = (iconName: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    IconShieldCheck: <IconShieldCheck />,
    IconBulb: <IconBulb />,
    IconLink: <IconLink />,
    IconLeaf: <IconLeaf />,
    IconHeadset: <IconHeadset />,
    IconPackage: <IconPackage />,
    IconRecycle: <IconRecycle />,
  };
  return iconMap[iconName];
};

const page = () => {
  const [data, setData] = useState<AboutPageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAboutPage = async () => {
      try {
        const response = await fetch("/api/pages/about");
        if (response.ok) {
          const result = await response.json();
          setData(result);
        }
      } catch (error) {
        console.error("Failed to fetch about page:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAboutPage();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Failed to load about page</p>
      </div>
    );
  }

  return (
    <>
      <Header />

      {/* HERO SECTION */}
      <section
        className=" relative w-full text-white"
        style={{
          background: "linear-gradient(to right, #141D3D, #364FA3)",
        }}
      >
        <Image
          alt="Hero Background"
          src="/graph1.jpeg"
          className="absolute top-0 left-0 w-full h-full z-10 opacity-20 "
          width={1920}
          height={100}

        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 xl:px-10 py-12 sm:py-16 xl:py-20 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-semibold font-poppins">
            {data.hero.title}
          </h1>

          <p className="mt-4 text-sm sm:text-base md:text-lg text-blue-100 max-w-3xl mx-auto font-poppins">
            {data.hero.subtitle}
          </p>

          <div className="flex flex-wrap justify-center font-inter gap-4 mt-6">
            {data.hero.badges.map((badge, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm"
              >
                {badge.icon === "IconShieldCheck" && (
                  <IconShieldCheck className="w-5 h-5" />
                )}
                {badge.icon === "IconMapPin" && (
                  <IconMapPin className="w-5 h-5" />
                )}
                {badge.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HERITAGE SECTION */}
      <section className="w-full bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 xl:px-10 py-12 sm:py-16 xl:py-20">
          <div className="grid md:grid-cols-2 gap-10 items-center font-poppins">
            {/* LEFT TEXT */}
            <div>
              <p className="text-sm font-semibold text-[#0300A7] tracking-widest uppercase">
                {data.heritage.subtitle}
              </p>

              <h2 className="mt-3 text-2xl sm:text-3xl xl:text-4xl font-semibold text-gray-900">
                {data.heritage.title}
              </h2>

              {data.heritage.content.map((paragraph, index) => (
                <p
                  key={index}
                  className="mt-4 text-gray-600 text-sm sm:text-base leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* RIGHT IMAGE */}
            <div className="relative">
              <Image
                src={data.heritage.image}
                alt="network"
                width={600}
                height={400}
                className="rounded-xl shadow-lg w-full h-auto object-cover"
              />

              {/* EXPERIENCE CARD */}
              <div className="absolute bottom-4 right-4 bg-[#0300A7] text-white px-6 py-4 rounded-lg shadow-lg">
                <p className="text-xl font-semibold">
                  {data.heritage.experience}
                </p>
                <p className="text-xs uppercase tracking-wide">
                  {data.heritage.experienceText}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ISO INFO SECTION */}
      <section className="w-full bg-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 xl:px-10 py-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* LEFT */}
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center border-2 border-[#0300A7] rounded-full p-4">
                <IconShieldCheck className="text-[#364FA3]" size={28} />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 font-poppins">
                  {data.iso.title}
                </h3>

                <p className="text-sm text-gray-500 font-poppins">
                  {data.iso.certNumber}
                </p>
              </div>
            </div>

            {/* RIGHT */}
            <p className="text-sm text-gray-600 leading-relaxed font-poppins">
              {data.iso.description}
            </p>
          </div>
        </div>
      </section>

      {/* MISSION SECTION */}
      <section className="w-full bg-white py-12">
        <div className="mx-auto w-full max-w-6xl px-4 grid gap-10 md:grid-cols-2 items-center">
          {/* LEFT CONTENT */}
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A8A] font-poppins">
              {data.mission.title}
            </h2>

            <p className="text-gray-600 leading-relaxed font-poppins">
              {data.mission.description}
            </p>
          </div>

          {/* RIGHT IMAGES */}
          <div className="relative flex justify-center md:justify-end">
            {/* BIG IMAGE */}
            <div
              className="overflow-hidden rounded-2xl shadow-lg 
            w-3/5 sm:w-1/2 md:w-full md:max-w-xs 
            ml-14 sm:ml-20 md:ml-0"
            >
              <Image
                src={data.mission.bigImage}
                alt="mission"
                width={600}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>

            {/* SMALL IMAGE */}
            <div className="overflow-hidden rounded-2xl shadow-lg absolute top-1/2 -translate-y-1/2 left-4 md:left-6 w-1/2 sm:w-2/5 md:w-1/2">
              <Image
                src={data.mission.smallImage}
                alt="mission"
                width={500}
                height={300}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="w-full bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 xl:px-10 py-12 sm:py-16">
          {/* Heading */}
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 font-inter">
              Our Core Values
            </h2>

            <div className="w-16 h-1 bg-[#0300A7] mx-auto mt-3 rounded"></div>
          </div>

          {/* Cards */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6 font-inter">
            {data.coreValues.map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm text-center"
              >
                <div className="text-[#0300A7]">
                  {getIconComponent(value.icon)}
                </div>
                <h3 className="mt-4 font-semibold text-gray-900">
                  {value.title}
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WEEE COMPLIANCE */}
      <section
        className=" relative w-full text-white"
        style={{
          background: "linear-gradient(to right, #141D3D, #364FA3)",
        }}
      >
        <Image
          alt="Hero Background"
          src="/graph1.jpeg"
          className="absolute top-0 left-0 w-full h-full z-10 opacity-20 "
          width={1920}
          height={100}

        />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 xl:px-10 py-12 sm:py-16">
          <div className="grid md:grid-cols-3 gap-8 items-start">
            {/* LEFT CONTENT */}
            <div>
              <div className="flex items-center gap-3">
                <IconRecycle className="text-cyan-400" size={30} />
                <h2 className="text-xl sm:text-2xl font-semibold font-inter">
                  {data.weee.title}
                </h2>
              </div>

              <p className="mt-4 text-sm text-white leading-relaxed font-inter">
                {data.weee.description}
              </p>
            </div>

            {/* CARDS */}
            {data.weee.cards.map((card, index) => (
              <div key={index} className="bg-[#1B4C7D] rounded-xl p-6">
                <div className="flex items-center gap-2 text-white">
                  {card.icon === "IconLeaf" && <IconLeaf size={22} />}
                  {card.icon === "IconPackage" && <IconPackage size={22} />}
                  <h3 className="font-semibold font-inter">{card.title}</h3>
                </div>

                <p className="text-sm text-white mt-3 leading-relaxed font-inter">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARTNERS SECTION - KEEP UNCHANGED */}
      <OurDistribution />
      <Footer />
    </>
  );
};

export default page;
