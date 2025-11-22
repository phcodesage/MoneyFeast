import { Search, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gray-900">Money<span className="text-green-600">Feast</span></span>
            </a>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="#guides" className="text-gray-700 hover:text-green-600 transition-colors font-medium">Guides</a>
            <a href="#blog" className="text-gray-700 hover:text-green-600 transition-colors font-medium">Blog</a>
            <a href="#resources" className="text-gray-700 hover:text-green-600 transition-colors font-medium">Resources</a>
            <a href="#about" className="text-gray-700 hover:text-green-600 transition-colors font-medium">About</a>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-64 bg-white"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <a href="#guides" className="text-gray-700 hover:text-green-600 transition-colors font-medium">Guides</a>
              <a href="#blog" className="text-gray-700 hover:text-green-600 transition-colors font-medium">Blog</a>
              <a href="#resources" className="text-gray-700 hover:text-green-600 transition-colors font-medium">Resources</a>
              <a href="#about" className="text-gray-700 hover:text-green-600 transition-colors font-medium">About</a>
              <div className="relative pt-2">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-full bg-white"
                />
                <Search className="absolute left-3 top-4.5 h-5 w-5 text-gray-400" />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
