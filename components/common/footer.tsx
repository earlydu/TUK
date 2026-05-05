"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";

import {
  IconBrandLinkedin,
  IconBrandTwitter,
  IconShieldCheck,
  IconCheck,
  IconCertificate,
  IconMapPin,
  IconBrandFacebookFilled,
  IconBrandFacebook,
} from "@tabler/icons-react";

const Footer = () => {
  return (
    <footer className="bg-[#16233a] text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-10 xl:px-16 py-12">
        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-4">
          {/* company info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-white rounded-full p-2">
                <Link href="/">
                  <Image
                    src="/footerlogo.png"
                    alt="logo"
                    width={20}
                    height={20}
                    className="cursor-pointer"
                  />
                </Link>
              </div>

              <div>
                <Link href="/">
                  <p className="font-semibold text-lg font-barlow">TUK Ltd</p>
                </Link>
                <p className="text-orange-400 text-sm font-inter">
                  Since 1984 · Wimbledon, London
                </p>
              </div>
            </div>

            <p className="text-[#9CA3AF] text-sm leading-relaxed font-inter">
              Britain's leading B2B manufacturer and supplier of voice and data
              copper cabling suppliers. ISO 9001 certified. Trade only.
            </p>

            <div className="flex gap-3 pt-2">
              <Link
                href="https://www.linkedin.com/company/tuk-ltd/?originalSubdomain=uk"
                target="_blank"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className=" hover:bg-[#2e4472] rounded-md cursor-pointer"
                >
                  <div className="bg-[#2e4ea1] text-[#D1D5DB]  p-2 rounded-sm flex items-center justify-center">
                    <IconBrandLinkedin size={16} className="" />
                  </div>
                </Button>
              </Link>
              <Link href="https://www.facebook.com/tukltd/" target="_blank">
                <Button
                  variant="ghost"
                  size="icon"
                  className=" hover:bg-[#2e4472] rounded-md cursor-pointer"
                >
                  <div className="bg-[#2e4ea1] text-[#D1D5DB]  p-2 rounded-sm flex items-center justify-center">
                    <IconBrandFacebook size={16} className="" />
                  </div>
                </Button>
              </Link>
            </div>
          </div>

          {/* product categories */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg font-barlow">
              Product Categories
            </h3>

            <div className="flex flex-col space-y-2 text-[#9CA3AF] text-sm font-inter">
              <Link href="/category?categoryId=41b19390-5260-43e8-8d0c-08312ee4e041">
                SPEEDY RJ45
              </Link>
              <Link href="/category?categoryId=36b80b17-d588-4b6a-9770-5ec64edd9f36">
                19" Rack Accessories
              </Link>
              <Link href="/category?categoryId=278f8140-ff14-462a-b3e1-15c50badd951">
                CONNECT + Range
              </Link>
              <Link href="/category?categoryId=0d908864-f7de-4e86-8aa3-3f012e528785">
                Multimedia Connectors
              </Link>
              <Link href="/category?categoryId=5abc4a47-5cc5-439f-8df4-d02a193f142f">
                miniMEDIA
              </Link>
              <Link href="/category?categoryId=3bb2c7a9-3f3e-4b9d-be7f-428caafab3d3">
                Plugs for Data and Voices
              </Link>
              <Link href="/category?categoryId=796cce52-c1ab-4af6-b6f1-2e8c974f522a">
                PCB Mount
              </Link>
              <Link href="/category?categoryId=73f5dda5-9a70-42c9-b07f-e42bebc57de6">
                Tools
              </Link>
              <Link href="/category?categoryId=44aa2caf-8e5c-476f-96fa-3c14926f81c4">
                Structured Cabling
              </Link>
              <Link href="/category?categoryId=049a6145-980d-4a0a-bd77-47610070e046">
                UK Voice Connectivity
              </Link>
            </div>
          </div>

          {/* company */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg font-barlow">Company</h3>

            <div className="flex flex-col space-y-2 text-[#9CA3AF] text-sm font-inter">
              <Link href="/about">About TUK</Link>
              <Link href="/distributor-enquiry">Become a Distributor</Link>
              <Link href="/distributor">TUK Distributor</Link>
              <Link href="/contact-us">Contact Us</Link>
            </div>
          </div>

          {/* quality */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg font-barlow">
              Quality & Compliance
            </h3>

            <div className="space-y-3 text-[#D1D5DB] font-inter">
              <div className="flex items-center gap-3 bg-[#23345a] px-4 py-3 rounded-lg">
                <IconShieldCheck size={18} className="text-[#FB923C]" />
                <p className="text-sm">ISO 9001:2015 Certified</p>
              </div>

              <div className="flex items-center gap-3 bg-[#23345a] px-4 py-3 rounded-lg">
                <IconCheck size={18} className="text-[#FB923C]" />
                <p className="text-sm">UKCA & CE Marked</p>
              </div>

              <div className="flex items-center gap-3 bg-[#23345a] px-4 py-3 rounded-lg">
                <IconCertificate size={18} className="text-[#FB923C]" />
                <p className="text-sm">RoHS Compliant</p>
              </div>
            </div>
          </div>
        </div>

        {/* bottom bar */}

        <div className=" w-full border-t  border-[#1E3A8A] font-inter mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <p>
            © 2026 TUK Ltd. All rights reserved. Registered in England & Wales.
            B2B Trade
          </p>

          <div className="flex lg:w-96 w-full justify-between font-inter lg:justify-end  lg:items-center  lg:gap-6">
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms-conditions">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
