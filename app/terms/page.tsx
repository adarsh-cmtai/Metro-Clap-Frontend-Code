"use client"

import { useEffect, useRef } from "react"

const sections = [
  {
    title: "Acceptance of Terms",
    content: [
      "By accessing and using MetroClap's services, you accept and agree to be bound by these Terms and Conditions.",
      "If you do not agree to these terms, please do not use our services.",
      "We reserve the right to modify these terms at any time, and your continued use constitutes acceptance of any changes.",
      "These terms apply to all users of our platform, including customers and service providers.",
    ],
  },
  {
    title: "Description of Services",
    content: [
      "MetroClap is a platform that connects customers with professional cleaning service providers.",
      "We facilitate bookings, payments, and communications between customers and service providers.",
      "We do not directly provide cleaning services but act as an intermediary platform.",
      "Service quality and performance are the responsibility of the individual service providers.",
      "We strive to vet our service providers but cannot guarantee the quality of all services.",
    ],
  },
  {
    title: "User Accounts",
    content: [
      "You must create an account to use our services and provide accurate, current information.",
      "You are responsible for maintaining the confidentiality of your account credentials.",
      "You must notify us immediately of any unauthorized use of your account.",
      "You may not share your account with others or create multiple accounts.",
      "We reserve the right to suspend or terminate accounts that violate these terms.",
    ],
  },
  {
    title: "Booking and Payment Terms",
    content: [
      "All bookings are subject to availability and confirmation by service providers.",
      "Prices are clearly displayed and include all applicable fees unless otherwise stated.",
      "Payment is processed securely through our third-party payment processors.",
      "You authorize us to charge your payment method for all services booked through our platform.",
      "Refunds are subject to our cancellation and refund policy outlined below.",
    ],
  },
  {
    title: "Cancellation and Refund Policy",
    content: [
      "Cancellations made 24+ hours before scheduled service: Full refund",
      "Cancellations made 12-24 hours before: 50% refund",
      "Cancellations made less than 12 hours before: No refund",
      "Emergency cancellations may be considered on a case-by-case basis.",
      "Service providers may also cancel bookings due to unforeseen circumstances.",
      "Refunds are processed within 5-7 business days to the original payment method.",
    ],
  },
  {
    title: "User Responsibilities",
    content: [
      "Provide accurate information when booking services and creating your account.",
      "Ensure safe access to your property for service providers.",
      "Secure or remove valuable items before service providers arrive.",
      "Treat service providers with respect and professionalism.",
      "Report any issues or concerns promptly through our platform.",
      "Comply with all applicable laws and regulations when using our services.",
    ],
  },
  {
    title: "Service Provider Terms",
    content: [
      "Service providers must be properly licensed, insured, and qualified to provide services.",
      "Providers must maintain professional standards and deliver services as described.",
      "Providers are independent contractors, not employees of MetroClap.",
      "Providers must comply with all applicable laws and safety regulations.",
      "We reserve the right to remove providers who violate our standards or receive poor reviews.",
    ],
  },
  {
    title: "Limitation of Liability",
    content: [
      "MetroClap's liability is limited to the amount paid for the specific service in question.",
      "We are not liable for indirect, incidental, or consequential damages.",
      "We do not guarantee the availability, quality, or timeliness of services.",
      "Service providers are primarily responsible for any damages or issues during service delivery.",
      "Our platform is provided 'as is' without warranties of any kind.",
    ],
  },
  {
    title: "Intellectual Property",
    content: [
      "All content on our platform, including text, graphics, logos, and software, is our property.",
      "You may not reproduce, distribute, or create derivative works without our permission.",
      "User-generated content (reviews, photos) remains your property but you grant us usage rights.",
      "We respect intellectual property rights and will respond to valid infringement claims.",
    ],
  },
  {
    title: "Privacy and Data Protection",
    content: [
      "Your privacy is important to us and is governed by our Privacy Policy.",
      "We collect and use information as described in our Privacy Policy.",
      "You consent to the collection and use of your information as outlined.",
      "We implement security measures to protect your personal information.",
    ],
  },
  {
    title: "Dispute Resolution",
    content: [
      "We encourage users to contact us first to resolve any disputes or concerns.",
      "Disputes that cannot be resolved informally may be subject to binding arbitration.",
      "Arbitration will be conducted according to the rules of the American Arbitration Association.",
      "You waive the right to participate in class action lawsuits against MetroClap.",
      "These terms are governed by the laws of the State of New York.",
    ],
  },
  {
    title: "Termination",
    content: [
      "Either party may terminate the agreement at any time with or without cause.",
      "We may suspend or terminate your account for violations of these terms.",
      "Upon termination, your right to use our services ceases immediately.",
      "Provisions regarding liability, intellectual property, and dispute resolution survive termination.",
    ],
  },
]

export default function TermsPage() {
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
      { threshold: 0.1 },
    )

    const refs = [heroRef, contentRef]
    refs.forEach((ref) => {
      if (ref.current) observer.observe(ref.current)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <main>
      {/* Hero Section */}
      <section ref={heroRef} className="py-20 sm:py-28 fade-in-up">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-5xl sm:text-6xl font-bold text-neutral-900 mb-6">Terms & Conditions</h1>
            <p className="text-xl text-neutral-700">
              Please read these terms carefully before using our services. They govern your use of the MetroClap
              platform.
            </p>
            <p className="text-sm text-neutral-600 mt-4">Last updated: March 1, 2024</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section ref={contentRef} className="py-20 sm:py-28 bg-neutral-50 fade-in-up">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg p-8 lg:p-12">
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-neutral-700 mb-8">
                These Terms and Conditions ("Terms") govern your use of the MetroClap platform and services. By using
                our services, you agree to comply with and be bound by these terms. Please read them carefully.
              </p>

              <div className="space-y-12">
                {sections.map((section, index) => (
                  <div key={index}>
                    <h2 className="text-2xl font-bold text-neutral-900 mb-4">{section.title}</h2>
                    <ul className="space-y-3">
                      {section.content.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-neutral-700 leading-relaxed">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="mt-12 p-6 bg-neutral-100 rounded-lg">
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">Questions About These Terms?</h3>
                <p className="text-neutral-700 mb-4">
                  If you have any questions about these Terms and Conditions, please contact us:
                </p>
                <div className="space-y-2 text-neutral-700">
                  <p>Email: legal@metroclap.com</p>
                  <p>Phone: +1 (555) 123-4567</p>
                  <p>Address: 123 Business Ave, New York, NY 10001</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
