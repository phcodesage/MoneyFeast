import { Facebook, Twitter, Linkedin, Link } from 'lucide-react';
import { useState } from 'react';

interface SocialShareProps {
  title: string;
  url: string;
}

export default function SocialShare({ title, url }: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const fullUrl = `${window.location.origin}${url}`;

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(fullUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <a
        href={shareLinks.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="p-3 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors group"
        aria-label="Share on Facebook"
      >
        <Facebook className="h-5 w-5 text-blue-600" />
      </a>
      <a
        href={shareLinks.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className="p-3 bg-sky-100 hover:bg-sky-200 rounded-lg transition-colors group"
        aria-label="Share on Twitter"
      >
        <Twitter className="h-5 w-5 text-sky-600" />
      </a>
      <a
        href={shareLinks.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="p-3 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors group"
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="h-5 w-5 text-blue-700" />
      </a>
      <button
        onClick={copyToClipboard}
        className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors relative"
        aria-label="Copy link"
      >
        <Link className="h-5 w-5 text-gray-700" />
        {copied && (
          <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded">
            Copied!
          </span>
        )}
      </button>
    </div>
  );
}
