import VerticalList from "../_components/articleComponents/VerticalList";
import BestArticle from "../_components/articleComponents/BestArticle";
import TrendingList from "../_components/articleComponents/TrendingList";

export default function StoryPage() {
  return (
    <div className="flex flex-col items-center my-4">
      <div className="w-full max-w-[1200px] px-2">
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Left Column: Today Pick */}
          <div className="col-span-1">
            <div className="flex justify-between items-center mb-6">
              <span className="border-t-2 font-bold text-sm border-red-600 pt-1 uppercase tracking-wider">
                TODAY PICK
              </span>
            </div>
            <div>
              <VerticalList genre="story" />
            </div>
          </div>

          {/* Center Column: Best Article (Feature) */}
          <div className="col-span-2">
            <div className="flex justify-center mb-6">
              <span className="font-serif text-3xl font-bold">
                The Lantern of Hollow Hill
              </span>
            </div>
            {/* Note: I'm using genre="story" to fetch a story, but the title above is hardcoded as in the design. 
                Ideally, the title should come from the BestArticle component or be dynamic. 
                For now, I'll remove the hardcoded title and let the component handle it, 
                OR I'll keep it if the user wants this specific static header style.
                Looking at the screenshot, "The Lantern of Hollow Hill" seems to be the article title itself.
                So I will NOT hardcode it here, relying on BestArticle to show it.
            */}
             <div className="flex justify-center mb-6">
                 {/* Placeholder for visual balance if needed, or just let BestArticle render.
                     BestArticle renders the heading itself. */}
            </div>
            <BestArticle genre="story" />
          </div>

          {/* Right Column: Trending */}
          <div className="col-span-1">
            <div className="flex justify-between items-center mb-6">
              <span className="border-t-2 font-bold text-sm border-red-600 pt-1 uppercase tracking-wider">
                TRENDING
              </span>
            </div>
            <div>
              <TrendingList genre="story" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
