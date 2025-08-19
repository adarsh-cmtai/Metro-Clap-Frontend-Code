"use client"

import { useEffect, useRef } from "react"
import { RotateCcw, CircleDot, Mail } from "lucide-react"

const sections = [
  {
    title: "1. Eligibility for Refunds",
    content: [
      "The service was not delivered due to cancellation by Metroclap.",
      "The professional did not arrive for the scheduled booking.",
      "The service delivered was incomplete or unsatisfactory, and a valid complaint was raised within 24 hours of completion.",
      "Duplicate payment or incorrect charges were made due to technical error.",
    ],
  },
  {
    title: "2. Non-Refundable Situations",
    content: [
      "Change of mind after the service has already started or been completed.",
      "Incorrect booking details provided by the customer.",
      "Issues reported beyond the 24-hour complaint window.",
      "Services availed through third-party offers, discounts, or promotions (unless otherwise specified).",
    ],
  },
  {
    title: "3. Refund Process",
    content: [
      "All refund requests must be raised through our Customer Support Team at support@metroclap.com or via the in-app help section.",
      "Once your request is reviewed and approved, the refund will be processed within 7-10 business days to your original mode of payment.",
      "In some cases, customers may be offered service credits as an alternative to refunds.",
    ],
  },
  {
    title: "4. Cancellations",
    content: [
      "If a booking is canceled by the customer at least 24 hours before the scheduled time, a full refund will be provided.",
      "Cancellations made within 24 hours of the appointment may incur a cancellation fee.",
    ],
  },
]

export default function RefundPolicyPage() {
  const heroRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible")
          }
        })
      },
      { threshold: 0.1 }
    )

    const refs = [heroRef, contentRef]
    refs.forEach((ref) => {
      if (ref.current) observer.observe(ref.current)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <main className="bg-gray-50">
      <section ref={heroRef} className="py-12 sm:py-12 fade-in-up">
        <div className="container mx-auto max-w-4xl px-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <RotateCcw className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-black sm:text-5xl">
            Refund Policy
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            At Metroclap, customer satisfaction is our top priority. Our refund policy ensures fairness and transparency if you are not fully satisfied with your booking.
          </p>
        </div>
      </section>

      <section ref={contentRef} className="pb-24 sm:pb-32 fade-in-up">
        <div className="container mx-auto max-w-4xl px-6">
          <div className="rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-900/5 sm:p-12">
            <article className="prose prose-lg max-w-none">
              <div className="space-y-12">
                {sections.map((section, index) => (
                  <div key={index}>
                    <h2 className="!mb-6 !text-2xl !font-bold !tracking-tight text-black">
                      {section.title}
                    </h2>
                    <ul className="!mt-0 !list-none !space-y-4 !p-0">
                      {section.content.map((item, itemIndex) => (
                        <li
                          key={itemIndex}
                          className="!p-0 flex items-start gap-x-3"
                        >
                          <CircleDot
                            className="h-6 w-6 flex-shrink-0 text-red-500 mt-1"
                            aria-hidden="true"
                          />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="mt-16 rounded-lg border border-red-200 bg-red-50 p-6">
                <h3 className="flex items-center gap-x-2 text-xl font-semibold text-black">
                  <Mail className="h-6 w-6 text-red-600" aria-hidden="true" />
                  Contact Us
                </h3>
                <p className="mt-3 text-gray-700">
                  For any questions regarding our refund policy, please reach out to our support team at:
                </p>
                <a
                  href="mailto:support@metroclap.com"
                  className="mt-2 inline-block font-semibold text-red-600 hover:text-red-700 transition-colors"
                >
                  support@metroclap.com
                </a>
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>
  )
}