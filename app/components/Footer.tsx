import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-black text-neutral-400 pt-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          <div>
            <Link href="/" className="mb-4 inline-block">
              <Image src="/Logo.jpg" alt="Metroclap Logo" width={150} height={35} />
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              Premium cleaning services that transform your space. Professional, reliable, and eco-friendly solutions for your home and office.
            </p>
            <h4 className="font-semibold text-white mt-8 mb-3">FOLLOW US</h4>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook" className="text-neutral-400 hover:text-white transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" aria-label="Twitter" className="text-neutral-400 hover:text-white transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" aria-label="Instagram" className="text-neutral-400 hover:text-white transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" aria-label="YouTube" className="text-neutral-400 hover:text-white transition-colors">
                <Youtube className="w-6 h-6" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider">Company</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/home" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About us</Link></li>
              <li><Link href="/blogs" className="hover:text-white transition-colors">Blogs</Link></li>
              <li><Link href="/careers" className="hover:text-white transition-colors">careers</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">contact</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of service</Link></li>
              <li><Link href="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider">Services</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/services" className="hover:text-white transition-colors">Residential Cleaning Service</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Corporate Cleaning Services</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Industrial Cleaning Services</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Sofa Cleaning Services</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider">Reach Us</h3>
            <ul className="space-y-3 text-sm">
              <li>Phone:</li>
              <li>Email:</li>
              <li>Address:</li>
            </ul>
          </div>
          
        </div>

        <div className="border-t border-neutral-800 mt-16 py-6 text-center text-sm">
          <p>© 2025 MetroClap. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
