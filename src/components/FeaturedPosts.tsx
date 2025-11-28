import { Clock, ArrowRight, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase, Post } from '../lib/supabase';
import { FeaturedPostSkeleton } from './LoadingSkeleton';

export default function FeaturedPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedPosts();
  }, []);

  async function fetchFeaturedPosts() {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          category:categories(*)
        `)
        .eq('featured', true)
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <section id="featured" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">Featured Articles</h2>
            <p className="text-lg text-slate-600">Our most popular guides to help you start earning today</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeaturedPostSkeleton />
            <FeaturedPostSkeleton />
            <FeaturedPostSkeleton />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="featured" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">Featured Articles</h2>
          <p className="text-lg text-slate-600">Our most popular guides to help you start earning today</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group hover:-translate-y-2 border border-slate-100"
            >
              {/* Gradient Border Effect */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>

              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold tracking-wide uppercase border border-emerald-100">
                    {post.category?.name}
                  </span>
                  <div className="flex items-center text-slate-400 text-sm">
                    <Clock className="h-4 w-4 mr-1.5" />
                    <span>{post.read_time} min read</span>
                  </div>
                </div>

                <h3 className="text-2xl font-display font-bold text-slate-900 mb-4 leading-tight group-hover:text-emerald-600 transition-colors">
                  {post.title}
                </h3>

                <p className="text-slate-600 mb-8 leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <span className="flex items-center text-sm font-medium text-slate-500">
                    <Star className="h-4 w-4 text-gold-400 mr-2 fill-gold-400" />
                    {post.author}
                  </span>
                  <Link
                    to={`/post/${post.slug}`}
                    className="inline-flex items-center px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full font-semibold text-sm hover:bg-emerald-100 transition-colors"
                  >
                    Read More
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
