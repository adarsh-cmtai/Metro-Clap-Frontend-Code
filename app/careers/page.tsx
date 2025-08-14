"use client"

import { useEffect, useRef } from "react"
import { MapPin, Clock, DollarSign, Users, TrendingUp, Heart, Award } from "lucide-react"
import Button from "../components/Button"
import Image from "next/image"

const benefits = [
  {
    icon: DollarSign,
    title: "Competitive Salary",
    description: "Above-market compensation with performance bonuses",
  },
  {
    icon: Heart,
    title: "Health & Wellness",
    description: "Comprehensive health insurance and wellness programs",
  },
  {
    icon: TrendingUp,
    title: "Career Growth",
    description: "Clear advancement paths and professional development",
  },
  {
    icon: Clock,
    title: "Work-Life Balance",
    description: "Flexible schedules and remote work options",
  },
  {
    icon: Users,
    title: "Great Team",
    description: "Collaborative culture with supportive colleagues",
  },
  {
    icon: Award,
    title: "Recognition",
    description: "Regular recognition and rewards for great work",
  },
]

const openPositions = [
  {
    id: 1,
    title: "Senior Software Engineer",
    department: "Engineering",
    location: "New York, NY",
    type: "Full-time",
    salary: "$120,000 - $150,000",
    description: "Join our engineering team to build scalable solutions for our growing platform.",
  },
  {
    id: 2,
    title: "Customer Success Manager",
    department: "Customer Success",
    location: "Los Angeles, CA",
    type: "Full-time",
    salary: "$70,000 - $90,000",
    description: "Help our customers achieve success and drive retention through exceptional service.",
  },
  {
    id: 3,
    title: "Marketing Specialist",
    department: "Marketing",
    location: "Chicago, IL",
    type: "Full-time",
    salary: "$55,000 - $70,000",
    description: "Drive growth through creative marketing campaigns and digital strategies.",
  },
  {
    id: 4,
    title: "Operations Coordinator",
    department: "Operations",
    location: "Houston, TX",
    type: "Full-time",
    salary: "$45,000 - $60,000",
    description: "Ensure smooth operations and coordinate between different teams and partners.",
  },
  {
    id: 5,
    title: "UX/UI Designer",
    department: "Design",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$80,000 - $100,000",
    description: "Create beautiful and intuitive user experiences for our platform.",
  },
  {
    id: 6,
    title: "Business Development Representative",
    department: "Sales",
    location: "Remote",
    type: "Full-time",
    salary: "$50,000 - $65,000",
    description: "Identify and develop new business opportunities to expand our market reach.",
  },
]

export default function CareersPage() {
  const heroRef = useRef<HTMLElement>(null)
  const benefitsRef = useRef<HTMLElement>(null)
  const positionsRef = useRef<HTMLElement>(null)

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

    const refs = [heroRef, benefitsRef, positionsRef]
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
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h1 className="text-5xl sm:text-6xl font-bold text-neutral-900 mb-6">
                Join Our <span className="text-primary">Amazing Team</span>
              </h1>
              <p className="text-xl text-neutral-700 mb-8">
                Be part of a company that's revolutionizing the cleaning industry. We're looking for passionate
                individuals who want to make a difference and grow their careers with us.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg">View Open Positions</Button>
                <Button variant="secondary" size="lg">
                  Learn About Culture
                </Button>
              </div>
            </div>
            <div className="relative h-96">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Team collaboration"
                fill
                className="object-cover rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section ref={benefitsRef} className="py-20 sm:py-28 bg-neutral-50 fade-in-up">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">Why Work With Us?</h2>
            <p className="text-xl text-neutral-700 max-w-2xl mx-auto">
              We believe in taking care of our team members so they can take care of our customers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">{benefit.title}</h3>
                <p className="text-neutral-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section ref={positionsRef} className="py-20 sm:py-28 fade-in-up">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">Open Positions</h2>
            <p className="text-xl text-neutral-700 max-w-2xl mx-auto">
              Find your next opportunity and help us build the future of home services.
            </p>
          </div>

          <div className="space-y-6">
            {openPositions.map((position) => (
              <div
                key={position.id}
                className="bg-white border border-neutral-200 rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold text-neutral-900">{position.title}</h3>
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium w-fit">
                        {position.department}
                      </span>
                    </div>
                    <p className="text-neutral-600 mb-4">{position.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-neutral-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {position.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {position.type}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {position.salary}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="secondary">Learn More</Button>
                    <Button>Apply Now</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-neutral-600 mb-4">
              Don't see a position that fits? We're always looking for great talent.
            </p>
            <Button variant="secondary">Send Us Your Resume</Button>
          </div>
        </div>
      </section>
    </main>
  )
}
