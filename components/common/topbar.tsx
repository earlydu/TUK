"use client";

import React from "react";
import { IconPhone, IconMail, IconMapPin } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

const Topbar = () => {
  return (
    <div className="w-full py-3 text-center items-center bg-[#0b1d39] text-white font-inter ">
      <div className="max-w-7xl mx-auto px-4 md:px-6 xl:px-8 py-2 flex items-center justify-between flex-wrap">
        {/* Left */}
        <div className="flex flex-col md:flex-row md:items-center items-center gap-0.5 md:gap-3 text-xs">
          {/* Phone Link */}
          <a 
            href="tel:+442089466688" 
            className="flex items-center gap-1 font-inter hover:text-[#FB923C] transition-colors"
          >
            <IconPhone className="w-3.5 h-3.5 text-[#FB923C]" />
            <span className="font-inter font-normal">+44 (0)20 8946 6688</span>
          </a>

          {/* Email Link */}
          <a 
            href="mailto:sales@tuk.co.uk" 
            className="flex items-center gap-1 hover:text-[#FB923C] transition-colors"
          >
            <IconMail className="w-3.5 h-3.5 text-[#FB923C]" />
            <span className="font-inter">sales@tuk.co.uk</span>
          </a>

          <div className="flex items-center gap-1">
            <IconMapPin className="w-3.5 h-3.5 text-[#FB923C]" />
            <span className="font-inter">Wimbledon, London, UK</span>
          </div>
        </div>

        {/* Right - Commented as per your original code */}
        {/* <div className="flex items-center gap-2 mt-1 md:mt-0">
          <span className="hidden md:block text-[#FB923C] text-xs">
            B2B Trade Only — Authorised Distributors Welcome
          </span>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white text-[10px] px-2 py-2 h-auto">
            Free Product Guide
          </Button>
        </div> */}
      </div>
    </div>
  );
};

export default Topbar;