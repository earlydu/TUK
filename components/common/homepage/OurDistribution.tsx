"use client";

import { useEffect, useState } from "react";
import { IconChevronRight } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const OurDistribution = () => {
  const [distributors, setDistributors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDistributors = async () => {
      try {
        const res = await fetch("/api/distributors");
        const data = await res.json();
        setDistributors(data);
      } catch (error) {
        console.error("Error fetching distributors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDistributors();
  }, []);

  return (
    <section className="w-full bg-white font-poppins">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 xl:px-8 py-8">
        <div className="flex items-center justify-center gap-4">
          <div className="flex-1 border-t-2 border-[#FB923C] max-w-20" />
          <p className="text-[#FB923C] uppercase tracking-widest text-sm font-semibold">
            Authorised Distributors
          </p>
          <div className="flex-1 border-t-2 border-orange-500 max-w-20" />
        </div>
        <h2 className="text-center text-3xl font-extrabold text-black mt-4">
          Our Distribution Network
        </h2>

        <p className="text-center text-gray-500 mt-2">
          TUK products are available through our network of authorised trade
          distributors
        </p>
        {loading && (
          <p className="text-center mt-6 text-gray-500 font-barlow">
            Loading distributors...
          </p>
        )}
        {!loading && distributors.length > 0 && (
          <div className="mt-8 px-10">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              plugins={[
                Autoplay({
                  delay: 3000,
                  stopOnInteraction: false,
                  stopOnMouseEnter: false,
                }),
              ]}
              className="w-full"
            >
              <CarouselContent>
                {distributors.map((item: any) => (
                  <CarouselItem
                    key={item.id}
                    className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6"
                  >
                    <div className="p-2">
                      <div
                        className="bg-[#F9FAFB] rounded-xl p-4 flex items-center justify-center hover:shadow-md transition h-24 cursor-pointer"
                        onClick={() => {
                          const url =
                            item.visitUrl || item.visiturl1 || item.website;
                          if (url) window.open(url, "_blank");
                        }}
                      >
                        <div className="relative w-full h-16">
                          <Image
                            src={item.image || item.logo || "/image/img1.png"}
                            alt={item.name || "distributor"}
                            fill
                            className="object-contain"
                          />
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </Carousel>
          </div>
        )}
        <div className="text-center mt-10">
          <Link
            href="/distributor-enquiry"
            className="text-[#1E3A8A] font-semibold inline-flex items-center gap-2 cursor-pointer"
          >
            Become an Authorised Distributor
            <IconChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default OurDistribution;
