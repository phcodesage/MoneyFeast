import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search as SearchIcon, Clock, ArrowRight, X } from 'lucide-react';
import { supabase, Post } from '../lib/supabase';
import SEO from '../components/SEO';
import Pagination from '../components/Pagination';
import { analytics } from '../lib/analytics';

const POSTS_PER_PAGE = 9;

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      performSearch(q);
    }
  }, [searchParams]);

  const performSearch = async (searchQuery: string, page: number = 1) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      setTotalCount(0);
      return;
    }

    setLoading(true);
    setHasSearched(true);
    setCurrentPage(page);

    try {
      const from = (page - 1) * POSTS_PER_PAGE;
      const to = from + POSTS_PER_PAGE - 1;

      // Get total count
      const { count } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('published', true)
        .or(`title.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);

      setTotalCount(count || 0);

      // Get paginated results
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          category:categories(*)
        `)
        .eq('published', true)
        .or(`title.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;
      setResults(data || []);

      // Track search
      if (page === 1) {
        analytics.search(searchQuery, data?.length || 0);
      }

      // Scroll to top on page change
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error searching posts:', error);
      setResults([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
    }
  };

  const handleClear = () => {
    setQuery('');
    setSearchParams({});
    setResults([]);
    setHasSearched(false);
  };

  return (
    <>
      <SEO
        title={query ? `Search Results for "${query}"` : 'Search Articles'}
        description="Search through our collection of guides and articles on earning money online."
      />
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-green-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Search Articles
            </h1>
            <p className="text-lg text-gray-600">
              Find guides and insights to boost your income
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mb-12">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for articles, topics, strategies..."
                className="w-full pl-14 pr-24 py-4 text-lg border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white shadow-sm"
                aria-label="Search articles"
              />
              <SearchIcon className="absolute left-5 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
              {query && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-24 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Clear search"
                >
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              )}
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>

          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              <p className="mt-4 text-gray-600">Searching articles...</p>
            </div>
          )}

          {!loading && hasSearched && (
            <div className="mb-6">
              <p className="text-gray-700 font-medium">
                Found {results.length} {results.length === 1 ? 'result' : 'results'}
                {query && ` for "${query}"`}
              </p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <>
              <div className="space-y-6">
                {results.map((post) => (
                  <article
                    key={post.id}
                    className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 group"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          {post.category?.name}
                        </span>
                        <div className="flex items-center text-gray-500 text-sm">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{post.read_time} min read</span>
                        </div>
                      </div>

                      <Link to={`/post/${post.slug}`}>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight group-hover:text-green-600 transition-colors">
                          {post.title}
                        </h3>
                      </Link>

                      <p className="text-gray-600 mb-4 leading-relaxed line-clamp-2">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">{post.author}</span>
                        <Link
                          to={`/post/${post.slug}`}
                          className="inline-flex items-center text-green-600 font-semibold text-sm hover:text-green-700 transition-colors"
                        >
                          Read Article
                          <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(totalCount / POSTS_PER_PAGE)}
                onPageChange={(page) => performSearch(query, page)}
              />
            </>
          )}

          {!loading && hasSearched && results.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <SearchIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No results found
              </h3>
              <p className="text-gray-600 mb-6">
                Try different keywords or browse our categories
              </p>
              <Link
                to="/"
                className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Browse All Articles
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
