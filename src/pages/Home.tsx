import Hero from '../components/Hero';
import FeaturedPosts from '../components/FeaturedPosts';
import Categories from '../components/Categories';
import RecentPosts from '../components/RecentPosts';
import Newsletter from '../components/Newsletter';
import SEO from '../components/SEO';

export default function Home() {
  return (
    <>
      <SEO />
      <Hero />
      <FeaturedPosts />
      <Categories />
      <RecentPosts />
      <Newsletter />
    </>
  );
}
