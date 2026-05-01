"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface VisionData {
  missionTitle: string;
  missionText: string;
  coreValuesTitle: string;
  coreValuesText: string;
}

const Vision = () => {
  const [vision, setVision] = useState<VisionData>({
    missionTitle: "Our Mission",
    missionText:
      "Our mission is to deliver reliable passive data and multimedia connectivity systems.",
    coreValuesTitle: "Our Core Values",
    coreValuesText:
      "Our values guide the way we deliver our mission. We are passionate about providing excellent value and service while building long-term partnerships with our customers. We value, respect, and trust one another, take pride in working together as a strong team, and remain committed to completing our work efficiently and to the highest standards.",
  });

  useEffect(() => {
    fetch("/api/pages/home")
      .then((res) => res.json())
      .then((data) => {
        if (data.vision) setVision(data.vision);
      })
      .catch(console.error);
  }, []);

  return (
    <section className="w-full bg-white font-poppins">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 xl:px-8 py-10">
        <div className="grid xl:grid-cols-2 gap-12 items-center">
          {/* LEFT CONTENT */}
          <div className="space-y-10">
            <div className="space-y-3">
              <h2 className="text-[#0300A7] font-bold text-2xl xl:text-3xl">
                {vision.missionTitle}
              </h2>
              <p className="text-black leading-6 text-sm max-w-xl">
                {vision.missionText}
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-[#0300A7] font-bold text-2xl xl:text-3xl">
                {vision.coreValuesTitle}
              </h2>
              <p className="text-black leading-6 text-sm max-w-xl">
                {vision.coreValuesText}
              </p>
            </div>
          </div>

          {/* RIGHT IMAGES */}
          <div className="relative flex justify-center xl:justify-end">
            {/* TOP IMAGE */}
            <div className="relative rounded-2xl overflow-hidden shadow-lg w-[75%] sm:w-[70%] xl:w-[72%]">
              <Image
                src="/image/vission.png"
                alt="vission image"
                width={600}
                height={400}
                className="object-cover w-full h-full"
              />
            </div>

            {/* BOTTOM IMAGE */}
            <div className="absolute -bottom-20 left-2 rounded-2xl overflow-hidden shadow-lg w-[60%] sm:w-[55%] xl:w-[60%]">
              <Image
                src="/image/mission.png"
                alt="mission image"
                width={500}
                height={320}
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Vision;
