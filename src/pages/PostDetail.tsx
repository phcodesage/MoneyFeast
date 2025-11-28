import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, User, Calendar, ArrowLeft } from 'lucide-react';
import { supabase, Post } from '../lib/supabase';
import SocialShare from '../components/SocialShare';
import SEO from '../components/SEO';
import { PostDetailSkeleton } from '../components/LoadingSkeleton';
import { analytics } from '../lib/analytics';

export default function PostDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchPost(slug);
    }
  }, [slug]);

  async function fetchPost(postSlug: string) {
    try {
      // Fetch post
      const { data: postData, error: postError } = await supabase
        .from('posts')
        .select(`
          *,
          category:categories(*)
        `)
        .eq('slug', postSlug)
        .eq('published', true)
        .single();

      if (postError) throw postError;

      // If post has an author_id, fetch their profile
      let finalPost = postData;
      if (postData && postData.author_id) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('id', postData.author_id)
          .single();

        if (profileData?.avatar_url) {
          finalPost = { ...postData, author_avatar: profileData.avatar_url };
        }
      }

      setPost(finalPost);

      // Track post read
      if (finalPost) {
        analytics.postRead(finalPost.slug, finalPost.title);
      }
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <PostDetailSkeleton />;
  }

  if (!post) {
    return (
      <>
        <SEO title="Article Not Found" />
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-green-50 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Article not found</h1>
              <p className="text-gray-600 mb-6">
                The article you're looking for doesn't exist or has been removed.
              </p>
              <Link
                to="/"
                className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  const postUrl = `/post/${post.slug}`;
  const fullUrl = `${window.location.origin}${postUrl}`;

  return (
    <>
      <SEO
        title={post.title}
        description={post.excerpt}
        type="article"
        author={post.author}
        publishedTime={post.created_at}
        url={fullUrl}
        keywords={[post.category?.name || '', 'online earning', 'money making']}
      />
      <article className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-green-50 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center text-gray-600 hover:text-green-600 font-medium mb-8 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Link>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8 md:p-12">
              <div className="mb-6">
                <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                  {post.category?.name}
                </span>
              </div>

              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8 pb-8 border-b border-gray-200">
                <div className="flex items-center">
                  {post.author_avatar ? (
                    <img
                      src={post.author_avatar}
                      alt={post.author}
                      className="h-10 w-10 rounded-full object-cover mr-3 border-2 border-white shadow-sm"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center mr-3 text-emerald-600">
                      <User className="h-5 w-5" />
                    </div>
                  )}
                  <span className="font-medium text-gray-900">{post.author}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span>{new Date(post.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>{post.read_time} min read</span>
                </div>
              </div>

              {post.image_url && (
                <div className="mb-10 rounded-xl overflow-hidden shadow-lg">
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full h-[400px] object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              )}

              <div className="prose prose-lg max-w-none mb-8">
                <p className="text-xl text-gray-700 leading-relaxed mb-6">
                  {post.excerpt}
                </p>

                <div className="text-gray-800 leading-relaxed space-y-4">
                  {post.content.split('\n\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>

              <div className="bg-green-50 rounded-xl p-6 mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Ready to take action?</h3>
                <p className="text-gray-700 mb-4">
                  Start implementing these strategies today and see real results in your income.
                </p>
                <Link
                  to="/#newsletter"
                  className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Get More Tips via Email
                </Link>
              </div>

              <div className="border-t border-gray-200 pt-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Share this article</h4>
                <SocialShare title={post.title} url={postUrl} />
              </div>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
