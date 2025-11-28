import { Search, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled
          ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-emerald-100/50'
          : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <span className="text-2xl font-display font-bold text-emerald-950 group-hover:text-emerald-700 transition-colors">
                Money<span className="text-emerald-500">Feast</span>
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="/#featured" className="text-slate-600 hover:text-emerald-600 font-medium transition-colors">Guides</a>
            <a href="/#blog" className="text-slate-600 hover:text-emerald-600 font-medium transition-colors">Blog</a>
            <Link
              to="/search"
              className={`font-medium transition-colors ${isActive('/search') ? 'text-emerald-600' : 'text-slate-600 hover:text-emerald-600'
                }`}
            >
              Search
            </Link>
            <a href="/#newsletter" className="text-slate-600 hover:text-emerald-600 font-medium transition-colors">Newsletter</a>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative group">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2.5 border border-emerald-100 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 w-64 bg-white/50 backdrop-blur-sm transition-all group-hover:bg-white group-hover:shadow-sm"
                aria-label="Search articles"
              />
              <button type="submit" className="absolute left-3 top-3" aria-label="Submit search">
                <Search className="h-5 w-5 text-emerald-400 group-hover:text-emerald-600 transition-colors" />
              </button>
            </form>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-emerald-900 hover:bg-emerald-50 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-emerald-100 shadow-lg animate-fade-in">
            <div className="px-4 py-6 space-y-4">
              <nav className="flex flex-col space-y-4">
                <a href="/#featured" onClick={closeMenu} className="text-lg font-medium text-slate-700 hover:text-emerald-600">Guides</a>
                <a href="/#blog" onClick={closeMenu} className="text-lg font-medium text-slate-700 hover:text-emerald-600">Blog</a>
                <Link to="/search" onClick={closeMenu} className="text-lg font-medium text-slate-700 hover:text-emerald-600">Search</Link>
                <a href="/#newsletter" onClick={closeMenu} className="text-lg font-medium text-slate-700 hover:text-emerald-600">Newsletter</a>
              </nav>
              <form onSubmit={handleSearch} className="relative pt-4">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-emerald-50/30"
                  aria-label="Search articles"
                />
                <button type="submit" className="absolute left-3 top-7" aria-label="Submit search">
                  <Search className="h-5 w-5 text-emerald-500" />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
