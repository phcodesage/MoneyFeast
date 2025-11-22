import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import FeaturedPosts from './components/FeaturedPosts';
import Categories from './components/Categories';
import RecentPosts from './components/RecentPosts';
import Newsletter from './components/Newsletter';
import BlogPost from './components/BlogPost';

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'post'>('home');
  const [currentSlug, setCurrentSlug] = useState<string>('');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#post/')) {
        const slug = hash.replace('#post/', '');
        setCurrentSlug(slug);
        setCurrentView('post');
      } else {
        setCurrentView('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleBackToHome = () => {
    window.location.hash = '';
    setCurrentView('home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-green-50">
      <Header />

      {currentView === 'home' ? (
        <>
          <Hero />
          <FeaturedPosts />
          <Categories />
          <RecentPosts />
          <Newsletter />
        </>
      ) : (
        <BlogPost slug={currentSlug} onBack={handleBackToHome} />
      )}

      <Footer />
    </div>
  );
}

export default App;
