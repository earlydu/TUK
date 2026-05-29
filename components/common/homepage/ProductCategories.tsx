"use client"

import { useEffect, useState } from "react"
import { IconArrowRight } from "@tabler/icons-react"
import Image from "next/image"
import Link from "next/link"

const ProductCategories = () => {
  const [categories, setCategories] = useState<any[]>([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/category")
        const data = await res.json()
        setCategories(data)
      } catch (error) {
        console.error("Error fetching categories:", error)
      }
    }

    fetchCategories()
  }, [])

  return (
    <section className="w-full bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 xl:px-8 py-16">

        {/* Heading */}
        <div className="flex items-start justify-between flex-wrap gap-6 mb-12">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold text-gray-900 font-poppins">
              Product Categories
            </h2>

            <p className="text-gray-600 font-poppins">
              Browse our comprehensive range of high-performance cabling hardware.
            </p>
          </div>

          <Link
            href="/category"
            className="text-[#007AFF] font-bold flex items-center gap-1 font-poppins"
          >
            View all categories
            <IconArrowRight size={18} />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-6">

          {categories.map((item: any) => (
            <Link
              // Logic: URL me categoryId bhej raha hai jo aapke category page filters ko mil jayega
              href={`/category/${item.slug || encodeURIComponent(item.name)}`}
              key={item.id}
              className="relative overflow-hidden rounded-xl group cursor-pointer bg-white"
            >

              <Image
                src={item.image || "/image/product.jpg"} // fallback
                alt={item.name}
                width={500}
                height={500}
                className="w-44 h-44 object-cover group-hover:scale-105 transition"
              />

              {/* overlay */}
              <div className="absolute inset-0 bg-black/40"></div>

              {/* text */}
              <div className="absolute bottom-4 left-4 text-white font-semibold font-poppins">
                {item.name}
              </div>

            </Link>
          ))}

        </div>
      </div>
    </section>
  )
}

export default ProductCategories