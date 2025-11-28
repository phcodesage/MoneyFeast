import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, EyeOff, LogOut, FileText, Database } from 'lucide-react';
import { supabase, Post } from '../../lib/supabase';
import { seedDatabase } from '../../lib/seed';
import { useAuth } from '../../contexts/AuthContext';
import SEO from '../../components/SEO';

export default function Dashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/admin/login');
      return;
    }
    fetchPosts();
  }, [user, navigate]);

  async function fetchPosts() {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          category:categories(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  }

  async function togglePublished(post: Post) {
    try {
      const { error } = await supabase
        .from('posts')
        .update({ published: !post.published })
        .eq('id', post.id);

      if (error) throw error;
      fetchPosts();
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to update post');
    }
  }

  async function deletePost(id: string) {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    }
  }

  async function handleSeed() {
    if (!confirm('This will add sample categories and posts. Continue?')) return;

    setLoading(true);
    const result = await seedDatabase(user?.id);
    setLoading(false);

    if (result.success) {
      alert(result.message);
      fetchPosts();
    } else {
      alert('Error: ' + result.message);
    }
  }

  async function handleSignOut() {
    await signOut();
    navigate('/admin/login');
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <>
      <SEO title="Admin Dashboard" />
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h1 className="text-xl font-display font-bold text-slate-900">Admin Dashboard</h1>
                  <p className="text-xs text-slate-500">Welcome back, {user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  to="/"
                  className="text-slate-600 hover:text-emerald-600 transition-colors font-medium text-sm"
                >
                  View Site
                </Link>
                <button
                  onClick={handleSeed}
                  className="text-slate-600 hover:text-emerald-600 transition-colors font-medium text-sm flex items-center gap-2"
                  title="Add sample content"
                >
                  <Database className="h-4 w-4" />
                  Seed Content
                </button>
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Total Posts</p>
                  <p className="text-3xl font-display font-bold text-slate-900 mt-1">{posts.length}</p>
                </div>
                <div className="h-12 w-12 bg-emerald-50 rounded-full flex items-center justify-center">
                  <FileText className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Published</p>
                  <p className="text-3xl font-display font-bold text-slate-900 mt-1">
                    {posts.filter(p => p.published).length}
                  </p>
                </div>
                <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center">
                  <Eye className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Drafts</p>
                  <p className="text-3xl font-display font-bold text-slate-900 mt-1">
                    {posts.filter(p => !p.published).length}
                  </p>
                </div>
                <div className="h-12 w-12 bg-slate-50 rounded-full flex items-center justify-center">
                  <EyeOff className="h-6 w-6 text-slate-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900">All Posts</h2>
            <Link
              to="/admin/posts/new"
              className="inline-flex items-center px-5 py-2.5 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-all shadow-sm hover:shadow-emerald-500/30"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create New Post
            </Link>
          </div>

          {/* Posts Table */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {posts.map((post) => (
                    <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-slate-900">{post.title}</div>
                            <div className="text-xs text-slate-500 mt-0.5">{post.author}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
                          {post.category?.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => togglePublished(post)}
                          className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full transition-colors ${post.published
                            ? 'bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100'
                            : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                            }`}
                        >
                          {post.published ? (
                            <>
                              <Eye className="h-3 w-3 mr-1.5" />
                              Published
                            </>
                          ) : (
                            <>
                              <EyeOff className="h-3 w-3 mr-1.5" />
                              Draft
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {new Date(post.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-3">
                          <Link
                            to={`/admin/posts/${post.id}`}
                            className="text-slate-400 hover:text-emerald-600 transition-colors"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => deletePost(post.id)}
                            className="text-slate-400 hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {posts.length === 0 && (
            <div className="text-center py-16 bg-white rounded-xl border border-slate-200 mt-6">
              <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">No posts yet</h3>
              <p className="text-slate-500 mb-6 max-w-sm mx-auto">Get started by creating your first blog post. It will appear here once created.</p>
              <Link
                to="/admin/posts/new"
                className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create New Post
              </Link>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
