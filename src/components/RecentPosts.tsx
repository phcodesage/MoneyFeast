import { Clock, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase, Post } from '../lib/supabase';
import { PostCardSkeleton } from './LoadingSkeleton';

export default function RecentPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentPosts();
  }, []);

  async function fetchRecentPosts() {
    try {
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select(`
          *,
          category:categories(*)
        `)
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(6);

      if (postsError) throw postsError;

      // Fetch profiles for authors
      if (postsData) {
        const authorIds = [...new Set(postsData.map(p => p.author_id).filter(Boolean))];
        if (authorIds.length > 0) {
          const { data: profilesData } = await supabase
            .from('profiles')
            .select('id, avatar_url');

          if (profilesData) {
            const profileMap = Object.fromEntries(profilesData.map(p => [p.id, p.avatar_url]));
            const postsWithAvatars = postsData.map(post => ({
              ...post,
              author_avatar: post.author_id && profileMap[post.author_id] ? profileMap[post.author_id] : post.author_avatar
            }));
            setPosts(postsWithAvatars);
            return;
          }
        }
        setPosts(postsData);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <section id="blog" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">Latest Guides</h2>
            <p className="text-lg text-slate-600">Fresh insights and strategies updated regularly</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="blog" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">Latest Guides</h2>
          <p className="text-lg text-slate-600">Fresh insights and strategies updated regularly</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 group hover:-translate-y-1 flex flex-col h-full"
            >
              {post.image_url && (
                <Link to={`/post/${post.slug}`} className="block overflow-hidden h-48 relative">
                  <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors z-10" />
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                </Link>
              )}
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-gold-100 text-gold-800 rounded-full text-xs font-semibold tracking-wide uppercase">
                    {post.category?.name}
                  </span>
                  <div className="flex items-center text-slate-400 text-sm">
                    <Clock className="h-4 w-4 mr-1.5" />
                    <span>{post.read_time} min read</span>
                  </div>
                </div>

                <Link to={`/post/${post.slug}`} className="block group-hover:text-emerald-600 transition-colors">
                  <h3 className="text-xl font-display font-bold text-slate-900 mb-3 leading-tight">
                    {post.title}
                  </h3>
                </Link>

                <p className="text-slate-600 mb-6 leading-relaxed text-sm line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-slate-50 mt-auto">
                  <div className="flex items-center">
                    {post.author_avatar ? (
                      <img
                        src={post.author_avatar}
                        alt={post.author}
                        className="h-8 w-8 rounded-full object-cover mr-2.5 border border-slate-100"
                      />
                    ) : null}
                    <span className="text-sm font-medium text-slate-500">{post.author}</span>
                  </div>
                  <Link
                    to={`/post/${post.slug}`}
                    className="inline-flex items-center text-emerald-600 font-semibold text-sm hover:text-emerald-700 transition-colors"
                  >
                    Read Article
                    <ArrowRight className="ml-1.5 h-4 w-4 group-hover:translate-x-1 transition-transform" />
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
