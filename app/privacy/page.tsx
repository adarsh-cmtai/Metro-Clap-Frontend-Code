"use client"

import { useEffect, useRef } from "react"

const sections = [
  {
    title: "Information We Collect",
    content: [
      "Personal Information: When you create an account, book services, or contact us, we collect information such as your name, email address, phone number, and address.",
      "Payment Information: We collect payment details necessary to process transactions, though we use secure third-party payment processors.",
      "Service Information: Details about the services you book, preferences, and special instructions.",
      "Usage Information: How you interact with our website and mobile app, including pages visited and features used.",
      "Device Information: Information about the device you use to access our services, including IP address, browser type, and operating system.",
    ],
  },
  {
    title: "How We Use Your Information",
    content: [
      "Provide and improve our cleaning services",
      "Process payments and manage your account",
      "Communicate with you about bookings, updates, and promotions",
      "Match you with appropriate service providers",
      "Ensure safety and security of our platform",
      "Comply with legal obligations and resolve disputes",
      "Analyze usage patterns to improve our services",
    ],
  },
  {
    title: "Information Sharing",
    content: [
      "Service Providers: We share necessary information with cleaning professionals to fulfill your service requests.",
      "Payment Processors: Payment information is shared with secure third-party payment processors.",
      "Legal Requirements: We may disclose information when required by law or to protect our rights and safety.",
      "Business Transfers: In case of merger, acquisition, or sale, your information may be transferred to the new entity.",
      "We do not sell your personal information to third parties for marketing purposes.",
    ],
  },
  {
    title: "Data Security",
    content: [
      "We implement industry-standard security measures to protect your information",
      "All data transmission is encrypted using SSL/TLS protocols",
      "Access to personal information is restricted to authorized personnel only",
      "Regular security audits and updates are performed",
      "We use secure cloud storage with backup and recovery systems",
      "However, no method of transmission over the internet is 100% secure",
    ],
  },
  {
    title: "Your Rights and Choices",
    content: [
      "Access: You can request access to your personal information",
      "Correction: You can update or correct your information through your account",
      "Deletion: You can request deletion of your account and personal information",
      "Opt-out: You can unsubscribe from marketing communications at any time",
      "Data Portability: You can request a copy of your data in a portable format",
      "To exercise these rights, contact us at privacy@metroclap.com",
    ],
  },
  {
    title: "Cookies and Tracking",
    content: [
      "We use cookies and similar technologies to enhance your experience",
      "Essential cookies are necessary for the website to function properly",
      "Analytics cookies help us understand how you use our services",
      "Marketing cookies may be used to show you relevant advertisements",
      "You can control cookie preferences through your browser settings",
      "Some features may not work properly if you disable certain cookies",
    ],
  },
  {
    title: "Children's Privacy",
    content: [
      "Our services are not intended for children under 13 years of age",
      "We do not knowingly collect personal information from children under 13",
      "If we become aware of such collection, we will delete the information immediately",
      "Parents or guardians can contact us if they believe we have collected their child's information",
    ],
  },
  {
    title: "International Users",
    content: [
      "Our services are primarily offered in the United States",
      "If you access our services from outside the US, your information may be transferred to and processed in the US",
      "By using our services, you consent to such transfer and processing",
      "We comply with applicable international data protection laws",
    ],
  },
  {
    title: "Changes to This Policy",
    content: [
      "We may update this Privacy Policy from time to time",
      "We will notify you of significant changes via email or through our platform",
      "The updated policy will be posted on our website with the effective date",
      "Your continued use of our services constitutes acceptance of the updated policy",
    ],
  },
]

export default function PrivacyPage() {
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
            <h1 className="text-5xl sm:text-6xl font-bold text-neutral-900 mb-6">Privacy Policy</h1>
            <p className="text-xl text-neutral-700">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
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
                At MetroClap, we are committed to protecting your privacy and ensuring the security of your personal
                information. This Privacy Policy explains how we collect, use, share, and protect information about you
                when you use our cleaning services platform.
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
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">Contact Us</h3>
                <p className="text-neutral-700 mb-4">
                  If you have any questions about this Privacy Policy or our privacy practices, please contact us:
                </p>
                <div className="space-y-2 text-neutral-700">
                  <p>Email: privacy@metroclap.com</p>
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
