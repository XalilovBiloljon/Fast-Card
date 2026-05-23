import { HeroSection } from './sections/HeroSection';
import { FlashSalesSection } from './sections/FlashSalesSection';
import { BrowseByCategorySection } from './sections/BrowseByCategorySection';
import { BestSellingSection } from './sections/BestSellingSection';
import { MusicBannerSection } from './sections/MusicBannerSection';
import { ExploreProductsSection } from './sections/ExploreProductsSection';
import { NewArrivalSection } from './sections/NewArrivalSection';
import { FeaturesSection } from './sections/FeaturesSection';

export const HomePage = () => {
  return (
    <div className="w-full">
      <HeroSection />
      <FlashSalesSection />
      <BrowseByCategorySection />
      <BestSellingSection />
      <MusicBannerSection />
      <ExploreProductsSection />
      <NewArrivalSection />
      <FeaturesSection />
    </div>
  );
};
