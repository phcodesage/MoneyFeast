import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  publishedTime?: string;
  keywords?: string[];
}

export default function SEO({
  title = 'MoneyFeast - Master the Art of Earning Online',
  description = 'Discover proven strategies, actionable guides, and expert insights to build multiple income streams and achieve financial freedom in the digital age.',
  image = '/og-image.png',
  url = window.location.href,
  type = 'website',
  author,
  publishedTime,
  keywords = ['online earning', 'passive income', 'side hustle', 'freelancing', 'financial freedom'],
}: SEOProps) {
  const fullTitle = title.includes('MoneyFeast') ? title : `${title} | MoneyFeast`;
  const fullImageUrl = image.startsWith('http') ? image : `${window.location.origin}${image}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      {author && <meta name="author" content={author} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:site_name" content="MoneyFeast" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {author && <meta property="article:author" content={author} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />

      {/* Additional SEO */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
}
