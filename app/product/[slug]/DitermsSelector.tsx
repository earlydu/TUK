"use client";
import React, { useEffect } from "react";

const DitermsSelector = ({ diTerms }: { diTerms: string }) => {
  useEffect(() => {
    if (!diTerms) return;

    // Load CSS once
    if (!document.getElementById("di-style")) {
      const link = document.createElement("link");
      link.id = "di-style";
      link.rel = "stylesheet";
      link.href =
        "https://di.oemsecrets.com/css/distributor-inventory_0.0.4.min.css";
      document.head.appendChild(link);
    }

    // Debounce so React StrictMode's cleanup+remount doesn't double-fire.
    // On a real navigation the cleanup cancels the previous timer, and the
    // new mount's timer fires once — giving us exactly one fresh script.
    let cancelled = false;

    const timer = setTimeout(() => {
      if (cancelled) return;

      // Remove any stale script so OEM Secrets re-scans the div
      const existing = document.getElementById("di-script");
      if (existing) existing.remove();

      const script = document.createElement("script");
      script.id = "di-script";
      script.src = "https://di.oemsecrets.com/loader/project.js";
      script.async = true;
      script.setAttribute(
        "data-di-key",
        "lzi9id925qx3h1102dsdm5jaqrbyyeam7zseny811ujijtvn3o9f2ayj1zgz42bk"
      );
      script.setAttribute("data-di-project", "product");
      document.body.appendChild(script);
    }, 50);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [diTerms]);

  return (
    <div className="w-full font-poppins">
      <div data-di-terms={diTerms}></div>
    </div>
  );
};

export default DitermsSelector;