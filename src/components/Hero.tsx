import { TrendingUp } from 'lucide-react';

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-amber-50 via-white to-green-50 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center p-2 bg-green-100 rounded-full mb-6">
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Master the Art of <span className="text-green-600">Earning Online</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
            Discover proven strategies, actionable guides, and expert insights to build multiple income streams
            and achieve financial freedom in the digital age.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#featured"
              className="px-8 py-4 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Explore Guides
            </a>
            <a
              href="#newsletter"
              className="px-8 py-4 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-50 transition-colors border-2 border-gray-200"
            >
              Subscribe for Free
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
