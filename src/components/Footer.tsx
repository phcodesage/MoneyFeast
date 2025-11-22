import { Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-white mb-4">Money<span className="text-green-500">Feast</span></h3>
            <p className="text-gray-400 mb-4 leading-relaxed">
              Your trusted source for practical guides and insights on earning money online.
              We help you discover legitimate opportunities to build wealth and achieve financial freedom.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-green-500 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-green-500 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-green-500 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-green-500 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#guides" className="hover:text-green-500 transition-colors">Guides</a></li>
              <li><a href="#blog" className="hover:text-green-500 transition-colors">Blog</a></li>
              <li><a href="#resources" className="hover:text-green-500 transition-colors">Resources</a></li>
              <li><a href="#about" className="hover:text-green-500 transition-colors">About Us</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              <li><a href="#freelancing" className="hover:text-green-500 transition-colors">Freelancing</a></li>
              <li><a href="#side-hustles" className="hover:text-green-500 transition-colors">Side Hustles</a></li>
              <li><a href="#passive-income" className="hover:text-green-500 transition-colors">Passive Income</a></li>
              <li><a href="#investing" className="hover:text-green-500 transition-colors">Investing</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} MoneyFeast. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#privacy" className="text-gray-400 hover:text-green-500 text-sm transition-colors">Privacy Policy</a>
            <a href="#terms" className="text-gray-400 hover:text-green-500 text-sm transition-colors">Terms of Service</a>
            <a href="#contact" className="text-gray-400 hover:text-green-500 text-sm transition-colors flex items-center">
              <Mail className="h-4 w-4 mr-1" />
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
