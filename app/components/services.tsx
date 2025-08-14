"use client"

const services = [
  { name: "House Cleaning", color: "bg-zinc-900" },
  { name: "Deep Cleaning", color: "bg-indigo-900" },
  { name: "Kitchen Cleaning", color: "bg-emerald-900" },
  { name: "Bathroom Cleaning", color: "bg-purple-800" },
  { name: "Carpet Cleaning", color: "bg-amber-800" },
  { name: "Window Cleaning", color: "bg-sky-900" },
  { name: "Office Cleaning", color: "bg-zinc-900" },
  { name: "Move-in Cleaning", color: "bg-indigo-900" },
  { name: "Post-Construction", color: "bg-emerald-900" },
  { name: "Upholstery Cleaning", color: "bg-purple-800" },
  { name: "Floor Polishing", color: "bg-amber-800" },
  { name: "Appliance Cleaning", color: "bg-sky-900" },
]

export default function ServiceSelectionGrid() {
  return (
    <div className="bg-black py-24 px-4 min-h-screen">
      <div className="text-center mb-16">
        <div className="inline-block bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold mb-4">
          Complete Cleaning Solutions
        </div>
        <h1 className="text-6xl font-bold text-white">At Your Doorstep</h1>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-6 mt-16 max-w-[1440px] mx-auto">
        {services.map((service, index) => (
          <div
            key={index}
            className={`aspect-square ${service.color} rounded-3xl p-6 flex flex-col justify-center items-center cursor-pointer transition-transform duration-300 ease-out hover:scale-105 focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-primary focus:outline-none`}
            tabIndex={0}
            role="button"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                // Handle service selection
              }
            }}
          >
            <div className="bg-white w-1/3 aspect-square rounded-xl shadow-inner flex items-center justify-center">
              <div className="w-8 h-8 bg-neutral-300 rounded"></div>
            </div>
            <p className="mt-5 text-white text-base font-semibold text-center">{service.name}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
