"use client"

import { useEffect, useRef, useState } from "react"

const ShieldCheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="h-6 w-6 flex-shrink-0 text-red-600"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M10 1a.75.75 0 01.75.75v1.637a.75.75 0 01-1.5 0V1.75A.75.75 0 0110 1zM5.303 3.85a.75.75 0 010 1.06l-1.125 1.125a.75.75 0 01-1.06-1.06l1.125-1.125a.75.75 0 011.06 0zM14.697 3.85a.75.75 0 011.06 0l1.125 1.125a.75.75 0 01-1.06 1.06l-1.125-1.125a.75.75 0 010-1.06zM10 4.25a5.75 5.75 0 100 11.5 5.75 5.75 0 000-11.5zM3.055 11.61a.75.75 0 011.06 0l1.125 1.125a.75.75 0 01-1.06 1.06l-1.125-1.125a.75.75 0 010-1.06zM10 18a.75.75 0 01.75-.75h.01a.75.75 0 010 1.5H10a.75.75 0 01-.75-.75zM14.828 12.672a.75.75 0 011.06 0l1.125 1.125a.75.75 0 01-1.06 1.06l-1.125-1.125a.75.75 0 010-1.06z"
      clipRule="evenodd"
    />
  </svg>
)

const sections = [
  {
    id: "background",
    title: "1. Background and Key Information",
    content: [
      "This Policy applies to individuals who access or use the Services or otherwise avail the Professional Services. For the avoidance of doubt, references to “you” across this Policy are to an end user that uses the Platform.",
      "By using the Platform, you consent to the collection, storage, usage, and disclosure of your personal data, as described in and collected by us in accordance with this Policy.",
      "We regularly review and update our Privacy Policy, and we request you to regularly review this Policy. It is important that the personal data we hold about you is accurate and current. Please let us know if your personal data changes during your relationship with us.",
      "The Platform may include links to third-party websites, plug-ins, services, and applications (“Third-Party Services”). Clicking on those links or enabling those connections may allow third parties to collect or share data about you. We neither control nor endorse these Third-Party Services and are not responsible for their privacy statements.",
    ],
  },
  {
    id: "data-collection",
    title: "2. Personal Data That We Collect",
    content: [
      "Contact Data: such as your mailing or home address, location, email addresses, and mobile numbers.",
      "Identity and Profile Data: such as your name, username or similar identifiers, photographs, and gender.",
      "Marketing and Communications Data: such as your address, email address, information posted in service requests, offers, wants, feedback, comments, pictures and discussions in our blog and chat boxes, responses to user surveys and polls, your preferences in receiving marketing communications from us and our third parties, and your communication preferences. We also collect your chat and call records when you communicate with service professionals through the Platform.",
      "Technical Data: which includes your IP address, browser type, internet service provider, details of operating system, access time, page views, device ID, device type, frequency of visiting our website and use of the Platform, website and mobile application activity, clicks, date and time stamps, location data, and other technology on the devices that you use to access the Platform.",
      "Transaction Data: such as details of the Services or Professional Services you have availed, a limited portion of your credit or debit card details for tracking transactions that are provided to us by payment processors, and UPI IDs for processing payments.",
      "Usage Data: which includes information about how you use the Services and Professional Services, your activity on the Platform, booking history, user taps and clicks, user interests, time spent on the Platform, details about user journey on the mobile application, and page views.",
      "Aggregated Data: We also collect, use, and share aggregated data such as statistical or demographic data for any purpose. Aggregated data could be derived from your personal data but is not considered personal data under law as it does not directly or indirectly reveal your identity.",
      "If you fail to provide necessary personal data when requested, we may not be able to perform the contract and may have to cancel or limit your access to the Services.",
    ],
  },
  {
    id: "how-we-collect",
    title: "3. How Do We Collect Personal Data?",
    content: [
      "Direct Interactions: You provide us your personal data when you create an account, use our Services, enter promotions or surveys, request marketing, or give us feedback.",
      "Automated Technologies: Each time you visit the Platform, we automatically collect Technical Data using cookies, server logs, and other similar technologies.",
      "Third Parties: We receive personal data about you from various third parties, including analytics providers (like Facebook), advertising networks, service professionals, and our affiliate entities.",
    ],
  },
  {
    id: "how-we-use",
    title: "4. How Do We Use Your Personal Data?",
    content: [
      "To register you as a user and create your account.",
      "To provide, personalize, and improve the Services and Professional Services.",
      "To improve customer service and respond to your requests.",
      "To process payments and track transactions.",
      "To send periodic notifications, updates, and marketing communications.",
      "To comply with legal obligations and enforce our Terms.",
      "To administer and protect our business, including troubleshooting, data analysis, and system testing.",
      "To respond to court orders or establish our legal rights.",
    ],
  },
  {
    id: "cookies",
    title: "5. Cookies",
    content: [
      "Cookies are small files transferred to your device’s hard drive that enable our systems to recognise your browser and remember certain information.",
      "We use cookies to understand your preferences, track advertisements, and compile aggregate data about site traffic to offer a seamless user experience.",
      "We may use third-party service providers to assist us in better understanding our site visitors. These providers are not permitted to use the information collected on our behalf except to help us conduct and improve our business.",
      "You may encounter cookies from third parties on certain pages of the Platform, which we do not control.",
    ],
  },
  {
    id: "disclosures",
    title: "6. Disclosures of Your Personal Data",
    content: [
      "Service professionals to enable them to provide you with Professional Services.",
      "Internal third parties, which are other companies within the Metroclap group.",
      "External third parties such as our associate partners, payment processors, marketing assistants, and analytic service providers.",
      "Regulators and other bodies, as required by law or regulation.",
      "We require all third parties to respect the security of your personal data and to treat it in accordance with the law.",
    ],
  },
  {
    id: "your-rights",
    title: "7. Your Rights in Relation to Your Personal Data",
    content: [
      "Access and Updating: You warrant that all personal data you provide is accurate. You can request a copy of your personal data by sending an email to privacy@metroclap.in.",
      "Opting-out of Marketing: You can opt-out of marketing communications by using the unsubscribe instructions provided in such emails. It may take up to 10 business days to process your request.",
    ],
  },
  {
    id: "deletion",
    title: "8. Deletion of Account and Personal Data",
    content: [
      "You may delete your account and personal data by sending an email to privacy@metroclap.in. We may take up to 7 working days to process your request.",
      "Once your account is deleted, you will lose access to all Services. Data with respect to transactions will be retained in accordance with applicable law.",
    ],
  },
  {
    id: "transfers",
    title: "9. Transfers of Your Personal Data",
    content: [
      "Your information and personal data may be transferred to and stored in countries other than the country you are based in. This may happen if our servers or service providers are located abroad.",
      "By submitting your personal data, you agree to this transfer, storage, and processing.",
    ],
  },
  {
    id: "data-security",
    title: "10. Data Security",
    content: [
      "We implement appropriate security measures including encryption, password protection, and physical security measures to protect your personal data.",
      "You are responsible for keeping your password confidential. We will not be responsible for any unauthorized use of your information or compromised passwords.",
    ],
  },
  {
    id: "data-retention",
    title: "11. Data Retention",
    content: [
      "Your personal data will be stored for as long as necessary to fulfil our purposes and for a reasonable period after your account's termination to comply with legal obligations.",
      "We may aggregate your personal data for research or statistical purposes and use this information indefinitely without further notice to you.",
    ],
  },
  {
    id: "business-transitions",
    title: "12. Business Transitions",
    content: [
      "In the event of a business transition, such as a merger, acquisition, or sale of assets, your personal data might be among the assets transferred.",
    ],
  },
  {
    id: "user-content",
    title: "13. User Generated Content",
    content: [
      "Content you post on our Platform (comments, feedback, pictures) may become public. We cannot prevent such information from being used in a manner that is contrary to this Policy.",
      "You are solely responsible for any information you publish on our Platform that violates applicable laws.",
    ],
  },
  {
    id: "updates",
    title: "14. Updates to This Policy",
    content: [
      "We may occasionally update this Policy. We will upload the revised policy on the Platform or notify you via other means, such as email.",
      "We encourage you to periodically review this Policy for the latest information on our privacy practices.",
    ],
  },
  {
    id: "grievance",
    title: "15. Grievance Officer",
    content: [
      "If you have any questions about this Policy or how we handle your personal data, you may contact our grievance officer.",
      "Name: Mr Bapu Tule",
      "E-mail: privacy@metroclap.in",
    ],
  },
]

export default function PrivacyPage() {
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || "")
  const sectionRefs = useRef<Map<string, HTMLElement | null>>(new Map())

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.2) {
            setActiveSection(entry.target.id)
          }
        })
      },
      {
        rootMargin: "-20% 0px -50% 0px",
        threshold: 0.2,
      }
    )

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => {
      sectionRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref)
      })
    }
  }, [])

  return (
    <>
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
      `}</style>
      <main className="bg-gray-100 text-gray-800">
        <header className="bg-gray-900 py-20 sm:py-24">
          <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Privacy Policy
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Your privacy is our priority. This policy outlines our practices in relation to your personal data.
            </p>
            <p className="mt-4 text-sm text-gray-400">Last Updated: 1st August 2025</p>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16 sm:py-20">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12">
            <aside className="hidden lg:col-span-3 lg:block">
              <nav className="sticky top-24">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">
                  On this page
                </h3>
                <ul className="space-y-1 border-l border-gray-200">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className={`-ml-px block border-l-2 py-2 pl-4 pr-3 text-sm transition-colors ${
                          activeSection === section.id
                            ? "border-red-600 font-semibold text-red-600"
                            : "border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900"
                        }`}
                      >
                        {section.title.substring(section.title.indexOf(" ") + 1)}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>

            <div className="lg:col-span-9">
              <div className="rounded-2xl bg-white p-8 shadow-lg ring-1 ring-gray-900/5 sm:p-12">
                <article className="prose prose-lg max-w-none prose-slate">
                  <p>
                    Metroclap Technologies India Pvt Ltd and its affiliates (collectively, “metroclap”, “we” or “us”) are engaged in the business of providing web-based solutions to facilitate connections between customers that seek specific services and service professionals that offer these services.
                  </p>
                  <p>
                    This Policy outlines our practices in relation to the collection, storage, usage, processing, and disclosure of personal data that you have consented to share with us when you access, use, or otherwise interact with our Platform.
                  </p>

                  <div className="mt-16 space-y-16">
                    {sections.map((section) => (
                      <section
                        key={section.id}
                        id={section.id}
                        ref={(el) => {
                          sectionRefs.current.set(section.id, el)
                        }}
                        className="scroll-mt-24"
                      >
                        <h2 className="!mb-8 !text-2xl !font-bold !tracking-tight text-gray-900 sm:!text-3xl">
                          {section.title}
                        </h2>
                        <ul className="!mt-0 !list-none !space-y-6 !p-0">
                          {section.content.map((item, itemIndex) => (
                            <li key={itemIndex} className="!p-0 flex items-start gap-x-4">
                              <ShieldCheckIcon />
                              <span className="text-gray-700 leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </section>
                    ))}
                  </div>
                </article>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
