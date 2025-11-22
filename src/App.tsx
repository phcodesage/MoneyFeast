import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import Search from './pages/Search';
import NotFound from './pages/NotFound';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import PostEditor from './pages/admin/PostEditor';
import { usePageTracking } from './hooks/usePageTracking';

function AppContent() {
  usePageTracking();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-green-50">
          <Header />
          <Home />
          <Footer />
        </div>
      } />
      <Route path="/post/:slug" element={
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-green-50">
          <Header />
          <PostDetail />
          <Footer />
        </div>
      } />
      <Route path="/search" element={
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-green-50">
          <Header />
          <Search />
          <Footer />
        </div>
      } />

      {/* Admin Routes */}
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin/dashboard" element={<Dashboard />} />
      <Route path="/admin/posts/:id" element={<PostEditor />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
