import dynamic from 'next/dynamic';
import BestArticle from "./_components/articleComponents/BestArticle";
import VerticalList from "./_components/articleComponents/VerticalList";
import HeaderButton from "./_components/buttons/HeaderButton";
import TagSlider from "./_components/main/TagSlider";

// Lazy load below-the-fold components for better performance
const ArticleGrid = dynamic(() => import("./_components/articleComponents/ArticleGrid"), {
  loading: () => <div className="animate-pulse h-96 bg-muted rounded-lg" />
});

const TrendingList = dynamic(() => import("./_components/articleComponents/TrendingList"), {
  loading: () => <div className="animate-pulse h-64 bg-muted rounded-lg" />
});

const HorizontalList = dynamic(() => import("./_components/podcastComponents/HorizontalList"), {
  loading: () => <div className="animate-pulse h-48 bg-muted rounded-lg" />
});

const MusicHorizontalList = dynamic(() => import("./_components/musicComponents/MusicHorizontalList"), {
  loading: () => <div className="animate-pulse h-48 bg-muted rounded-lg" />
});

const TopCreatorsList = dynamic(() => import("./_components/userComponents/TopCreatorsList"), {
  loading: () => <div className="animate-pulse h-64 bg-muted rounded-lg" />
});

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-background text-foreground transition-colors duration-300">
      {/* Ambient Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full mix-blend-screen opacity-50 animate-pulse" />
        <div className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full mix-blend-screen opacity-40" />
        <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-purple-500/10 blur-[120px] rounded-full mix-blend-screen opacity-40" />
      </div>

      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Top Navigation / Tags */}
        <div className="mb-12">
          <TagSlider />
        </div>

        {/* Hero Grid Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8 mb-16">
          {/* Left Column: Today's Pick */}
          <div className="col-span-1 lg:col-span-1 flex flex-col gap-6">
            <div className="p-1">
               <HeaderButton>TODAY PICK</HeaderButton>
            </div>
            <div className="bg-card/30 backdrop-blur-md border border-white/5 rounded-3xl p-5 shadow-xl hover:bg-card/40 transition-all duration-300">
              <VerticalList />
            </div>
          </div>

          {/* Center Column: Best Article (Hero) */}
          <div className="col-span-1 lg:col-span-2">
            <div className="h-full bg-card/30 backdrop-blur-md border border-white/5 rounded-3xl p-1 shadow-2xl hover:shadow-primary/10 transition-all duration-500 overflow-hidden group">
               <BestArticle />
            </div>
          </div>

          {/* Right Column: Trending */}
          <div className="col-span-1 lg:col-span-1">
             <div className="flex items-center justify-between mb-6 px-2">
                <span className="text-sm font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 uppercase border-b-2 border-red-500/50 pb-1">
                  Trending
                </span>
             </div>
             <div className="bg-card/30 backdrop-blur-md border border-white/5 rounded-3xl p-5 shadow-xl">
              <TrendingList />
             </div>
          </div>
        </div>

        {/* Podcasts & Top Creators Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
          {/* Podcasts (Larger share) */}
          <div className="lg:col-span-8 space-y-6">
             <div className="flex items-center space-x-4 mb-2">
                <span className="text-2xl font-bold text-foreground">Podcasts</span>
                <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
             </div>
            <div className="bg-gradient-to-br from-card/40 to-card/10 backdrop-blur-sm border border-white/5 rounded-3xl p-6 lg:p-8 shadow-lg">
              <HorizontalList />
            </div>
          </div>

          {/* Top Creators */}
          <div className="lg:col-span-4 space-y-6">
             <div className="flex items-center justify-between mb-2">
                 <span className="flex items-center gap-2 text-lg font-bold text-foreground">
                    <span>🏆</span> Top Creators
                 </span>
             </div>
            <div className="bg-card/30 backdrop-blur-md border border-white/5 rounded-3xl p-6 shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 blur-[50px] rounded-full pointer-events-none" />
              <TopCreatorsList />
            </div>
          </div>
        </div>

        {/* More Articles */}
        <div className="mb-20">
           <div className="flex items-center justify-center mb-10">
              <span className="px-6 py-2 bg-secondary/50 backdrop-blur-md rounded-full text-sm font-medium tracking-wide uppercase border border-white/10 text-muted-foreground">
                Discover More
              </span>
           </div>
          <ArticleGrid />
        </div>

        {/* Music Section */}
        <div className="relative mb-8">
           <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-3xl blur-3xl -z-10" />
           <div className="flex items-center space-x-4 mb-8 px-2">
              <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
                Music
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent" />
           </div>
           
           <div className="bg-card/20 backdrop-blur-xl border border-white/5 rounded-3xl p-6 lg:p-8">
              <MusicHorizontalList />
           </div>
        </div>
      </main>
    </div>
  );
}
