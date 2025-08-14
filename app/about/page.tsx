"use client"

import { useEffect, useRef } from "react"
import { Users, Shield, Target, Heart } from "lucide-react"
import Image from "next/image"

const stats = [
  { number: "10,000+", label: "Happy Customers" },
  { number: "500+", label: "Professional Cleaners" },
  { number: "50+", label: "Cities Covered" },
  { number: "99%", label: "Satisfaction Rate" },
]

const values = [
  {
    icon: Target,
    title: "Excellence",
    description: "We strive for perfection in every cleaning service we provide",
  },
  {
    icon: Heart,
    title: "Care",
    description: "We treat every home and office with the utmost care and respect",
  },
  {
    icon: Shield,
    title: "Trust",
    description: "Building lasting relationships through reliability and transparency",
  },
  {
    icon: Users,
    title: "Community",
    description: "Supporting local communities and creating employment opportunities",
  },
]

const team = [
  {
    name: "Sarah Johnson",
    role: "CEO & Founder",
    image: "/placeholder.svg?height=300&width=300",
    bio: "With 15 years in the cleaning industry, Sarah founded MetroClap to revolutionize home services.",
  },
  {
    name: "Michael Chen",
    role: "Head of Operations",
    image: "/placeholder.svg?height=300&width=300",
    bio: "Michael ensures our operations run smoothly across all cities and maintains quality standards.",
  },
  {
    name: "Emily Davis",
    role: "Customer Success Manager",
    image: "/placeholder.svg?height=300&width=300",
    bio: "Emily leads our customer success team, ensuring every customer has an exceptional experience.",
  },
]

export default function AboutPage() {
  const heroRef = useRef<HTMLElement>(null)
  const storyRef = useRef<HTMLElement>(null)
  const valuesRef = useRef<HTMLElement>(null)
  const teamRef = useRef<HTMLElement>(null)

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

    const refs = [heroRef, storyRef, valuesRef, teamRef]
    refs.forEach((ref) => {
      if (ref.current) observer.observe(ref.current)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <main>
      {/* Hero Section */}
      <section ref={heroRef} className="py-20 sm:py-28 fade-in-up">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl font-bold text-neutral-900 mb-6">
              About <span className="text-primary">MetroClap</span>
            </h1>
            <p className="text-xl text-neutral-700 max-w-3xl mx-auto mb-12">
              We're on a mission to make professional cleaning services accessible, reliable, and affordable for
              everyone. Since 2020, we've been transforming homes and offices across the country.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-neutral-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section ref={storyRef} className="py-20 sm:py-28 bg-neutral-50 fade-in-up">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-neutral-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-neutral-700">
                <p>
                  MetroClap was born from a simple observation: finding reliable, professional cleaning services
                  shouldn't be a hassle. Our founder, Sarah Johnson, experienced firsthand the frustration of
                  inconsistent service quality and unreliable providers.
                </p>
                <p>
                  In 2020, she decided to create a platform that would connect customers with vetted, professional
                  cleaners while ensuring fair wages and working conditions for service providers. What started as a
                  local initiative has now grown into a nationwide network.
                </p>
                <p>
                  Today, MetroClap serves thousands of customers across 50+ cities, maintaining our commitment to
                  quality, reliability, and community support. We're not just a cleaning service – we're building a
                  better future for home services.
                </p>
              </div>
            </div>
            <div className="relative h-96">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Our story"
                fill
                className="object-cover rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section ref={valuesRef} className="py-20 sm:py-28 fade-in-up">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">Our Values</h2>
            <p className="text-xl text-neutral-700 max-w-2xl mx-auto">
              These core values guide everything we do and shape our relationships with customers, partners, and
              communities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">{value.title}</h3>
                <p className="text-neutral-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section ref={teamRef} className="py-20 sm:py-28 bg-neutral-50 fade-in-up">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-neutral-700 max-w-2xl mx-auto">
              The passionate people behind MetroClap who work tirelessly to deliver exceptional service.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-md text-center">
                <div className="w-32 h-32 relative mx-auto mb-4">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    fill
                    className="object-cover rounded-full"
                  />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-1">{member.name}</h3>
                <p className="text-primary font-medium mb-3">{member.role}</p>
                <p className="text-neutral-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
