"use client";

import Image from "next/image";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  IconExternalLink,
  IconMapPin,
  IconShieldCheck,
  IconChevronDown,
} from "@tabler/icons-react";
import { useState, useEffect } from "react";

// const distributors = [
//   {
//     name: "CPC Farnell",
//     desc: "Voice & Data Cabling Solutions",
//     logo: "/image/distributor.png",
//   },
//   {
//     name: "Anixter",
//     desc: "Voice & Data Cabling Solutions",
//     logo: "/image/distributor.png",
//   },
//   {
//     name: "Euronetwork",
//     desc: "Voice & Data Cabling Solutions",
//     logo: "/image/distributor.png",
//   },
//   {
//     name: "InfraTEL",
//     desc: "Voice & Data Cabling Solutions",
//     logo: "/image/distributor.png",
//   },
//   {
//     name: "CPC Farnell",
//     desc: "Voice & Data Cabling Solutions",
//     logo: "/image/distributor.png",
//   },
//   {
//     name: "Anixter",
//     desc: "Voice & Data Cabling Solutions",
//     logo: "/image/distributor.png",
//   },
//   {
//     name: "Euronetwork",
//     desc: "Voice & Data Cabling Solutions",
//     logo: "/image/distributor.png",
//   },
//   {
//     name: "InfraTEL",
//     desc: "Voice & Data Cabling Solutions",
//     logo: "/image/distributor.png",
//   }
// ]

type Distributor = {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  visitUrl: string;
};

const page = () => {
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDistributors = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/distributors");
        const data = await res.json();
        setDistributors(data);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch distributors:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDistributors();
  }, []);
  return (
    <>
      <Header />

      {/* Hero Section */}
      <section
        className="text-white"
        style={{
          background: "linear-gradient(to right, #141D3D, #364FA3)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl md:text-4xl xl:text-5xl font-semibold font-poppins">
            Authorised Distributors
          </h1>

          <p className="mt-4 text-sm md:text-base text-white/80 max-w-2xl mx-auto font-poppins">
            TUK Ltd products are available worldwide through our trusted network
            of specialized partners. Find a distributor in your region below.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mt-6 font-inter">
            <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm">
              <IconShieldCheck size={18} />
              ISO 9001:2015 Certified
            </div>

            <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm">
              <IconMapPin size={18} />
              Based in London, UK
            </div>
          </div>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-4 py-6 "></div>
      {/* Cards */}
      <section className=" pb-16">
        <div className="max-w-7xl mx-auto px-4">
          {loading && (
            <p className="text-center py-10 text-gray-600 font-barlow">
              Loading distributors...
            </p>
          )}

          {error && <p className="text-center py-10 text-red-600">{error}</p>}

          {!loading && !error && distributors.length === 0 && (
            <p className="text-center py-10 text-gray-600">
              No distributors found
            </p>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {distributors.map((item, index) => (
                <Card
                  key={index}
                  className="relative bg-white border rounded-xl hover:shadow-md transition"
                >
                  <CardContent className="flex flex-col items-center text-center gap-4 py-10 px-6 relative ">
                    {/* Logo */}
                    <div className="flex items-center h-20 justify-center font-poppins">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={140}
                        height={80}
                        className="object-contain"
                      />
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-gray-900 font-poppins">
                      {item.name}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-500 font-poppins">
                      {item.description}
                    </p>

                    {/* Button */}
                    <Button
                      onClick={() => window.open(item.visitUrl, "_blank")}
                      variant="secondary"
                      className="-mb-4 w-full cursor-pointer font-poppins flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200"
                    >
                      {item.name.trim().toLowerCase() ===
                      "become an authorised tuk distributor"
                        ? "Apply Now"
                        : "Visit Store"}

                      <IconExternalLink size={16} />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
};

export default page;
