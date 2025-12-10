import ArticleGrid from "./_components/articleComponents/ArticleGrid";
import BestArticle from "./_components/articleComponents/BestArticle";
import TrendingList from "./_components/articleComponents/TrendingList";
import VerticalList from "./_components/articleComponents/VerticalList";
import HeaderButton from "./_components/buttons/HeaderButton";
import TagSlider from "./_components/main/TagSlider";
import MusicHorizontalList from "./_components/musicComponents/MusicHorizontalList";
import Quotes from "./_components/other/Quotes";
import HorizontalList from "./_components/podcastComponents/HorizontalList";
import TopCreatorsList from "./_components/userComponents/TopCreatorsList";

export default function Home() {
  return (
    <div className="flex flex-col items-center my-4">
      <div className="w-full max-w-[1200px] px-2">
        <div className="pb-12">
          <TagSlider />
        </div>
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-1">
            <HeaderButton>TODAY PICK</HeaderButton>
            <div>
              <VerticalList />
            </div>
          </div>
          <div className="col-span-2">
            <BestArticle />
          </div>
          <div className="col-span-1">
            <p className="text-center mb-6">
              <span className="border-t-2 font-bold text-sm border-red-600 pt-1">
                TRENDING
              </span>
            </p>
            <div>
              <TrendingList />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-16">
          <div className="col-span-2">
            <p className="text-center mb-6">
              <span className="border-t-2 font-bold text-sm border-red-600 pt-1">
                PODCASTS
              </span>
            </p>
            <div>
              <HorizontalList />
            </div>
          </div>
          <div className="col-span-1">
            <p className="text-center mb-6">
              <span className="border-t-2 font-bold text-sm border-red-600 pt-1">
                🏆 TOP CREATORS
              </span>
            </p>
            <div>
              <TopCreatorsList />
            </div>
          </div>
        </div>
        <div className="mt-16">
          <p className="text-center mb-6">
            <span className="border-t-2 font-bold text-sm border-red-600 pt-1">
              More
            </span>
          </p>
          <div>
            <ArticleGrid />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-16">
          <div className="col-span-full">
            <p className="text-center mb-6">
              <span className="border-t-2 font-bold text-sm border-red-600 pt-1">
                MUSIC
              </span>
            </p>
            <div>
              <MusicHorizontalList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
