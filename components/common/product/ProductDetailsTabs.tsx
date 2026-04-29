"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface ProductDetailsTabsProps {
  product?: {
    description?: string;
    Material?: string;
    Specification?: string;
    Packaging?: string;
    Additional?: string;
    content: any;
    specifications?: Array<{ key: string; value: string }>;
  };
}

export default function ProductDetailsTabs({
  product,
}: ProductDetailsTabsProps) {
  const description = product?.content?.description;
  const Material = product?.content?.Material;
  const Specification = product?.content?.Specification;
  const Packaging = product?.content?.Packaging;
  const Additional = product?.content?.Additional;
  const specifications = product?.specifications || [];

  const renderHtml = (html?: string) => {
    if (!html) return { __html: "<p>No information available.</p>" };

    const trimmed = html.trim();

    // If the string already contains HTML tags, render as-is.
    if (/<[a-z][\s\S]*>/i.test(trimmed)) {
      return { __html: trimmed };
    }

    // Split by bullet points
    const bulletRegex = /•\s*/;
    const bullets = trimmed
      .split(bulletRegex)
      .map((item) => item.trim())
      .filter(Boolean);

    // If we found multiple bullet items, render as list
    if (bullets.length > 1) {
      return {
        __html: `<ul style="list-style-type: disc; padding-left: 1.5rem; margin-top: 0; margin-bottom: 0;">${bullets
          .map(
            (item) =>
              `<li style="margin-bottom: 0.75rem; line-height: 1.6;">${item.replace(/\n/g, "<br />")}</li>`,
          )
          .join("")}</ul>`,
      };
    }

    // Otherwise, convert to paragraphs with line break preservation
    const paragraphs = trimmed
      .split(/\n{2,}/)
      .map(
        (block) =>
          `<p style="margin-bottom: 1rem; line-height: 1.6;">${block.trim().replace(/\n/g, "<br />")}</p>`,
      )
      .join("");

    return { __html: paragraphs };
  };

  return (
    <div className="w-full mt-10 flex flex-col gap-8">
      {/* Tabs */}

      <Tabs defaultValue="description" className="w-full font-poppins">
        <TabsList className="lg:flex grid grid-cols-5   flex-wrap lg:gap-3 bg-transparent justify-center mb-1 ">
          <TabsTrigger
            value="description"
            className="
      px-4 py-2 rounded-full border cursor-pointer
       text-[10px] font-semibold
      transition-all
 group-data-[variant=default]/tabs-list:data-active:bg-[#0300A7] group-data-[variant=default]/tabs-list:data-active:text-white group-data-[variant=default]/tabs-list:data-active:border-[#0300A7]
    "
          >
            Description
          </TabsTrigger>

          <TabsTrigger
            value="Material"
            className="  group-data-[variant=default]/tabs-list:data-active:bg-[#0300A7] group-data-[variant=default]/tabs-list:data-active:text-white group-data-[variant=default]/tabs-list:data-active:border-[#0300A7] rounded-full cursor-pointer text-[10px] font-semibold"
          >
            Material
          </TabsTrigger>

          <TabsTrigger
            value="Specification"
            className="  group-data-[variant=default]/tabs-list:data-active:bg-[#0300A7] group-data-[variant=default]/tabs-list:data-active:text-white group-data-[variant=default]/tabs-list:data-active:border-[#0300A7] rounded-full cursor-pointer text-[10px] font-semibold"
          >
            Specification
          </TabsTrigger>

          <TabsTrigger
            value="Packaging"
            className="  group-data-[variant=default]/tabs-list:data-active:bg-[#0300A7] group-data-[variant=default]/tabs-list:data-active:text-white group-data-[variant=default]/tabs-list:data-active:border-[#0300A7] rounded-full cursor-pointer text-[10px] font-semibold"
          >
            Packaging
          </TabsTrigger>

          <TabsTrigger
            value="Additional"
            className="  group-data-[variant=default]/tabs-list:data-active:bg-[#0300A7] group-data-[variant=default]/tabs-list:data-active:text-white group-data-[variant=default]/tabs-list:data-active:border-[#0300A7] rounded-full cursor-pointer text-[10px] font-semibold"
          >
            Additional
          </TabsTrigger>
        </TabsList>

        {/* Description Tab */}

        <TabsContent value="description">
          <div className="border rounded-xl p-6 bg-white">
            <h3 className="font-semibold mb-4">Product Description</h3>

            <div
              className="text-muted-foreground space-y-4 break-words"
              dangerouslySetInnerHTML={renderHtml(description)}
            />
          </div>
        </TabsContent>

        {/* Usage */}

        <TabsContent value="Material">
          <div className="border rounded-xl p-6 bg-white">
            <h3 className="font-semibold mb-4">Material</h3>
            <div
              className="text-muted-foreground space-y-4 break-words"
              dangerouslySetInnerHTML={renderHtml(Material)}
            />
          </div>
        </TabsContent>

        {/* Benefits */}

        <TabsContent value="Specification">
          <div className="border rounded-xl p-6 bg-white">
            <h3 className="font-semibold mb-4">Specification</h3>
            <div
              className="text-muted-foreground space-y-4 break-words"
              dangerouslySetInnerHTML={renderHtml(Specification)}
            />
          </div>
        </TabsContent>

        {/* Connectivity */}

        <TabsContent value="Packaging">
          <div className="border rounded-xl p-6 bg-white">
            <h3 className="font-semibold mb-4">Packaging</h3>
            <div
              className="text-muted-foreground space-y-4 break-words"
              dangerouslySetInnerHTML={renderHtml(Packaging)}
            />
          </div>
        </TabsContent>

        {/* Safety */}

        <TabsContent value="Additional">
          <div className="border rounded-xl p-6 bg-white">
            <h3 className="font-semibold mb-4">Additional</h3>
            <div
              className="text-muted-foreground space-y-4 break-words"
              dangerouslySetInnerHTML={renderHtml(Additional)}
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Technical Specification */}

      {/* <div className="flex flex-col gap-4 font-inter">
        <h3 className="font-semibold text-lg">Technical Specification</h3>

        <div className="border rounded-xl overflow-hidden bg-white">
          {specifications.length > 0 ? (
            specifications.map((spec, idx) => (
              <div
                key={idx}
                className={`grid grid-cols-2 p-4 ${idx !== specifications.length - 1 ? "border-b" : ""}`}
              >
                <span className="text-muted-foreground">{spec.key}</span>
                <span>{spec.value}</span>
              </div>
            ))
          ):<></>
        }
        </div>
      </div> */}
    </div>
  );
}
