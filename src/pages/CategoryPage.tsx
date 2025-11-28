import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, ArrowRight, AlertCircle } from 'lucide-react';
import { supabase, Post, Category } from '../lib/supabase';
import SEO from '../components/SEO';
import { PostCardSkeleton } from '../components/LoadingSkeleton';

export default function CategoryPage() {
    const { slug } = useParams<{ slug: string }>();
    const [category, setCategory] = useState<Category | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (slug) {
            fetchCategoryAndPosts(slug);
        }
    }, [slug]);

    async function fetchCategoryAndPosts(categorySlug: string) {
        setLoading(true);
        try {
            // 1. Fetch Category Info
            const { data: categoryData, error: categoryError } = await supabase
                .from('categories')
                .select('*')
                .eq('slug', categorySlug)
                .single();

            if (categoryError) throw categoryError;
            setCategory(categoryData);

            // 2. Fetch Posts for this Category
            if (categoryData) {
                const { data: postsData, error: postsError } = await supabase
                    .from('posts')
                    .select(`
            *,
            category:categories(*)
          `)
                    .eq('category_id', categoryData.id)
                    .eq('published', true)
                    .order('created_at', { ascending: false });

                if (postsError) throw postsError;
                setPosts(postsData || []);
            }
        } catch (error) {
            console.error('Error fetching category data:', error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-green-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="h-10 w-64 bg-gray-200 rounded-full mx-auto mb-4 animate-pulse"></div>
                        <div className="h-6 w-96 bg-gray-200 rounded-full mx-auto animate-pulse"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(6)].map((_, i) => (
                            <PostCardSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (!category) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-green-50 py-20 text-center">
                <div className="max-w-md mx-auto px-4">
                    <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Category Not Found</h2>
                    <p className="text-gray-600 mb-8">We couldn't find the category you're looking for.</p>
                    <Link
                        to="/"
                        className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <>
            <SEO
                title={`${category.name} - Money Feast`}
                description={`Read our latest articles and guides about ${category.name}.`}
            />
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-green-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-800 rounded-full text-sm font-bold tracking-wide uppercase mb-4">
                            Category
                        </span>
                        <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4">
                            {category.name}
                        </h1>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            {category.description}
                        </p>
                    </div>

                    {/* Posts Grid */}
                    {posts.length > 0 ? (
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
                                        <div className="flex items-center text-slate-400 text-sm mb-4">
                                            <Clock className="h-4 w-4 mr-1.5" />
                                            <span>{post.read_time} min read</span>
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
                                                Read
                                                <ArrowRight className="ml-1.5 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-100">
                            <p className="text-xl text-slate-500">No articles found in this category yet.</p>
                            <Link
                                to="/"
                                className="inline-block mt-6 px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
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
