"use client"

import { useEffect, useRef } from "react"
import { Users, Shield, Award, Briefcase, Zap, Star } from "lucide-react"
import Image from "next/image"

const stats = [
  { icon: Star, number: "10000+", label: "Active Service Professionals" },
  { icon: Users, number: "1 Million+", label: "Consumers" },
  { icon: Briefcase, number: "09", label: "Cities" },
  { icon: Award, number: "1", label: "Country" },
]

export default function AboutPage() {
  const heroRef = useRef<HTMLElement>(null)
  const howItWorksRef = useRef<HTMLElement>(null)
  const missionRef = useRef<HTMLElement>(null)
  const partnersRef = useRef<HTMLElement>(null)
  const leadershipRef = useRef<HTMLElement>(null)

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

    const refs = [heroRef, howItWorksRef, missionRef, partnersRef, leadershipRef]
    refs.forEach((ref) => {
      if (ref.current) observer.observe(ref.current)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <main className="bg-white">
      <section ref={heroRef} className="relative bg-gray-50 pt-32 pb-20 fade-in-up">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-black sm:text-6xl">
            Welcome to <span className="text-red-600">Metroclap</span>
          </h1>
          <p className="mt-6 text-lg max-w-3xl mx-auto leading-8 text-gray-600">
            Metroclap is India's largest home services company. We are an all-in-one platform that helps users hire premium service professionals, from Home cleaner to sofa cleaners, carpenters and technicians.
          </p>
        </div>
        <div className="container mx-auto px-6 mt-16">
          <div className="relative rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-900/5">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <stat.icon className="mx-auto h-8 w-8 text-red-600 mb-2" strokeWidth={1.5} />
                  <div className="text-3xl font-bold text-black">{stat.number}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section ref={missionRef} className="py-24 sm:py-32 fade-in-up">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-red-600">OUR MISSION</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-black sm:text-4xl">
              Empowering Millions
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              To empower millions of service professionals by delivering services at-home in a way that has never been experienced before.
            </p>
          </div>
        </div>
      </section>

      <section ref={howItWorksRef} className="bg-gray-50 py-24 sm:py-32 fade-in-up">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative h-80 lg:h-full min-h-[300px] rounded-2xl overflow-hidden">
              <Image
                src="/Home/Hero1.jpg"
                alt="Professional cleaner at work"
                fill
                className="object-cover"
                loading="lazy"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">How We Do It</h2>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Metroclap provides a platform that allows skilled and experienced professionals to connect with users looking for specific services.
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
                <div className="relative pl-9">
                  <dt className="inline font-semibold text-black">
                    <Zap className="absolute left-1 top-1 h-5 w-5 text-red-600" aria-hidden="true" />
                    Intensive Training.
                  </dt>
                  <dd className="inline"> All professionals undergo intensive training modules before being allowed to list their services on the platform.</dd>
                </div>
                <div className="relative pl-9">
                  <dt className="inline font-semibold text-black">
                    <Shield className="absolute left-1 top-1 h-5 w-5 text-red-600" aria-hidden="true" />
                    Smart Match-Making.
                  </dt>
                  <dd className="inline"> Our algorithm identifies professionals who are closest to the users’ requirements and available at the requested time and date.</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section ref={partnersRef} className="py-24 sm:py-32 fade-in-up">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-2xl text-center">
             <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">Our Partners & Commitment</h2>
             <p className="mt-6 text-lg leading-8 text-gray-600">
               Metroclap today is home to more than 2000+ trained professionals. We empower these micro-entrepreneurs with comprehensive support to ensure they deliver on our promise of quality services.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col">
                <dt className="text-base font-semibold leading-7 text-black">Financing & Insurance</dt>
                <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">We provide our partners with financing, insurance, and product or consumables support to help them build their business.</p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-base font-semibold leading-7 text-black">Training & Certification</dt>
                <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">We have set up over 5 training centers across India with expert trainers who ensure consistent, high-quality service delivery.</p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-base font-semibold leading-7 text-black">NSDC Partnership</dt>
                <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">We have signed an MoU with the National Skill Development Corporation to mobilize, train, and certify service professionals across India.</p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section ref={leadershipRef} className="bg-gray-50 py-24 sm:py-32 fade-in-up">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">Our Leadership</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              At the heart of Metroclap is a leadership team that values innovation, integrity, and customer-first thinking. Guided by a vision to redefine the home service industry, our leaders inspire teams to constantly raise the bar, embrace new technologies, and stay committed to excellence. They believe true leadership means not just guiding, but also empowering — ensuring both our customers and professionals grow with us.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
