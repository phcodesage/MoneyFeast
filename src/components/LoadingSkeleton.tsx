export function PostCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 animate-pulse">
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
          <div className="h-4 w-16 bg-gray-200 rounded"></div>
        </div>
        <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded mb-1 w-full"></div>
        <div className="h-4 bg-gray-200 rounded mb-4 w-2/3"></div>
        <div className="flex items-center justify-between">
          <div className="h-4 w-20 bg-gray-200 rounded"></div>
          <div className="h-4 w-16 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export function FeaturedPostSkeleton() {
  return (
    <div className="bg-gradient-to-br from-amber-50 to-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 animate-pulse">
      <div className="p-8">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 w-28 bg-gray-200 rounded-full"></div>
          <div className="h-4 w-16 bg-gray-200 rounded"></div>
        </div>
        <div className="h-7 bg-gray-200 rounded mb-2 w-4/5"></div>
        <div className="h-7 bg-gray-200 rounded mb-3 w-3/5"></div>
        <div className="h-4 bg-gray-200 rounded mb-1 w-full"></div>
        <div className="h-4 bg-gray-200 rounded mb-1 w-full"></div>
        <div className="h-4 bg-gray-200 rounded mb-6 w-4/5"></div>
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
          <div className="h-4 w-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export function CategoryCardSkeleton() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
      <div className="w-12 h-12 bg-gray-200 rounded-lg mb-4"></div>
      <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded mb-1 w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-4/5"></div>
    </div>
  );
}

export function PostDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-green-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-10 w-24 bg-gray-200 rounded mb-8 animate-pulse"></div>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8 md:p-12 animate-pulse">
            <div className="h-8 w-32 bg-gray-200 rounded-full mb-6"></div>
            <div className="h-12 bg-gray-200 rounded mb-3 w-full"></div>
            <div className="h-12 bg-gray-200 rounded mb-6 w-4/5"></div>
            
            <div className="flex gap-6 mb-8 pb-8 border-b border-gray-200">
              <div className="h-5 w-32 bg-gray-200 rounded"></div>
              <div className="h-5 w-40 bg-gray-200 rounded"></div>
              <div className="h-5 w-24 bg-gray-200 rounded"></div>
            </div>
            
            <div className="space-y-3 mb-8">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-4/5"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
