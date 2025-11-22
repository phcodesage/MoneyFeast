import { Mail, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { analytics } from '../lib/analytics';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email, active: true }]);

      if (error) {
        if (error.code === '23505') {
          setMessage('This email is already subscribed!');
          setStatus('error');
        } else {
          throw error;
        }
      } else {
        setStatus('success');
        setMessage('Successfully subscribed! Check your inbox for updates.');
        analytics.newsletterSubscribe(email);
        setEmail('');
      }
    } catch (error) {
      console.error('Error subscribing:', error);
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <section id="newsletter" className="py-16 bg-gradient-to-br from-green-600 to-green-700">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
            <Mail className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Get Weekly Money-Making Tips
          </h2>
          <p className="text-lg text-green-100 mb-8">
            Join 10,000+ subscribers receiving actionable strategies to boost their income every week.
            No spam, unsubscribe anytime.
          </p>

          {status === 'success' ? (
            <div className="bg-white rounded-2xl p-8 max-w-md mx-auto">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <p className="text-gray-900 font-semibold text-lg">{message}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  disabled={status === 'loading'}
                  className="flex-1 px-6 py-4 rounded-full border-2 border-white/30 bg-white/10 text-white placeholder-green-200 focus:outline-none focus:border-white focus:bg-white/20 transition-colors disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="px-8 py-4 bg-white text-green-700 rounded-full font-bold hover:bg-green-50 transition-colors disabled:opacity-50 whitespace-nowrap"
                >
                  {status === 'loading' ? 'Subscribing...' : 'Subscribe Free'}
                </button>
              </div>
              {status === 'error' && (
                <p className="mt-4 text-red-100 bg-red-500/20 rounded-lg px-4 py-2">
                  {message}
                </p>
              )}
            </form>
          )}

          <p className="mt-6 text-sm text-green-100">
            We respect your privacy. Your information is safe with us.
          </p>
        </div>
      </div>
    </section>
  );
}
