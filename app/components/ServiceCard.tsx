import Image from "next/image"
import Button from "./Button"

interface Service {
  id: number
  title: string
  price: number
  image: string
  description: string
}

interface ServiceCardProps {
  service: Service
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="w-72 flex-shrink-0 bg-white border border-neutral-200 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="aspect-video relative">
        <Image
          src={service.image || "/placeholder.svg"}
          alt={service.title}
          fill
          className="object-cover rounded-t-xl"
        />
      </div>
      <div className="p-4">
        <h3 className="text-h3 text-neutral-900 mb-2">{service.title}</h3>
        <p className="text-neutral-600 mb-3">{service.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">${service.price}</span>
          <Button variant="tertiary" size="sm">
            Book Now
          </Button>
        </div>
      </div>
    </div>
  )
}
