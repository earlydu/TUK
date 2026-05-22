"use client";
import React, { useEffect } from "react";

const DitermsSelector = ({ diTerms }: { diTerms: string }) => {

  useEffect(() => {
    // Prevent duplicate script loading
    if (document.getElementById("di-script")) return;

    const script = document.createElement("script");
    script.src = "https://di.oemsecrets.com/loader/project.js";
    script.async = true;
    script.id = "di-script";

    script.setAttribute(
      "data-di-key",
      "lzi9id925qx3h1102dsdm5jaqrbyyeam7zseny811ujijtvn3o9f2ayj1zgz42bk"
    );
    script.setAttribute("data-di-project", "product");

    document.body.appendChild(script);

    return () => {
      // Optional cleanup if component unmounts
      // document.body.removeChild(script);
    };
  }, [diTerms]);

  return (
    <div>
      <div className="w-full float-right font-poppins">
        <div data-di-terms={diTerms}></div>
      </div>
    </div>
  );
};

export default DitermsSelector;