"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { Star, Percent } from "lucide-react"

export default function PromotionalBanner() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible")
          }
        })
      },
      { threshold: 0.1 },
    )

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [])

  return (
    <section ref={sectionRef} className="py-10 sm:py-10 fade-in-up">
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative bg-[#DC2626] rounded-2xl overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-red-700/50 rounded-full filter blur-3xl -translate-x-1/4 -translate-y-1/4"></div>

          <div className="relative grid lg:grid-cols-2 items-center gap-8 lg:gap-16 p-8 md:p-12 lg:p-16">
            <div className="text-white">
              <div className="inline-block border border-white/30 text-white px-4 py-1.5 rounded-full text-sm">
                Limited offer
              </div>

              <h2 className="text-4xl md:text-5xl font-bold mt-4 leading-tight">
                Get <span className="text-yellow-400">50% OFF</span> on Your First Cleaning Service!
              </h2>

              <p className="mt-4 text-white/80 max-w-md">
                New customers save big! Book any cleaning service and get half off your first appointment. Professional quality, unbeatable price.
              </p>

              <div className="flex items-center gap-4 mt-8">
                <a href="/claim-offer" className="inline-flex items-center gap-2 bg-white text-red-600 font-bold px-6 py-3 rounded-lg transition hover:bg-gray-200">
                  <Percent className="w-4 h-4" />
                  Claim Offer Now
                </a>
                <a href="/services" className="border border-white/30 text-white font-medium px-6 py-3 rounded-lg transition hover:bg-white/10">
                  Learn More
                </a>
              </div>

              <div className="flex items-center gap-8 mt-12 pt-8 border-t border-white/20">
                <div>
                  <p className="text-2xl font-bold text-yellow-400">24H</p>
                  <p className="text-sm text-white/70">Valid Until</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-400">500+</p>
                  <p className="text-sm text-white/70">Already Claimed</p>
                </div>
                <div>
                  <p className="flex items-center gap-1 text-2xl font-bold text-yellow-400">
                    <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                    4.9
                  </p>
                  <p className="text-sm text-white/70">Customer Rating</p>
                </div>
              </div>
            </div>

            <div className="relative h-96 hidden lg:block">
              <div className="w-full h-full bg-white/10 rounded-lg p-2">
                {/* You can add your <Image> component here */}
                <Image
                  src="/Home/Banner.png"           // ✅ image path (inside /public folder)
                  alt="Sample image"
                  layout="fill"                // ✅ stretches to fill parent div
                  objectFit="cover"            // ✅ keeps image ratio
                  className="rounded-lg"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-28 h-28 bg-yellow-400 rounded-full flex flex-col items-center justify-center text-black shadow-lg">
                <p className="font-bold text-2xl">50%</p>
                <p className="text-sm font-semibold tracking-wider">OFF</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}