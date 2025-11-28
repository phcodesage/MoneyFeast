import { TrendingUp, ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200/30 rounded-full blur-3xl mix-blend-multiply animate-fade-in"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-gold-200/30 rounded-full blur-3xl mix-blend-multiply animate-fade-in" style={{ animationDelay: '0.2s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="animate-slide-down inline-flex items-center justify-center px-4 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full mb-8 shadow-sm">
            <TrendingUp className="h-4 w-4 text-emerald-600 mr-2" />
            <span className="text-sm font-medium text-emerald-800">Your path to financial freedom starts here</span>
          </div>

          <h1 className="animate-slide-up text-5xl md:text-7xl font-display font-bold text-slate-900 mb-8 leading-[1.1] tracking-tight">
            Master the Art of <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400">
              Earning Online
            </span>
          </h1>

          <p className="animate-slide-up text-xl md:text-2xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto" style={{ animationDelay: '0.1s' }}>
            Discover proven strategies, actionable guides, and expert insights to build multiple income streams in the digital age.
          </p>

          <div className="animate-slide-up flex flex-col sm:flex-row gap-4 justify-center" style={{ animationDelay: '0.2s' }}>
            <a
              href="#featured"
              className="group px-8 py-4 bg-emerald-600 text-white rounded-full font-semibold hover:bg-emerald-700 transition-all shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-1 flex items-center justify-center"
            >
              Explore Guides
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#newsletter"
              className="px-8 py-4 bg-white text-slate-700 rounded-full font-semibold hover:bg-slate-50 transition-all border border-slate-200 hover:border-emerald-200 hover:shadow-md flex items-center justify-center"
            >
              Subscribe for Free
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
