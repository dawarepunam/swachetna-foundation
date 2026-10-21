import FeaturedCategories from "../components/home/FeaturedCategories/FeaturedCategories";
import FeaturedProducts from "../components/home/FeaturedProducts/FeaturedProducts";
import Hero from "../components/home/Hero/Hero";
import ImpactSection from "../components/home/ImpactSection/ImpactSection";
import MissionSection from "../components/home/MissionSection/MissionSection";
import NewsletterSection from "../components/home/NewsletterSection/NewsletterSection";
import TestimonialsSection from "../components/home/TestimonialsSection/TestimonialsSection";
import ShoppingBenefits from "../components/home/ShoppingBenefits/ShoppingBenefits";
import CommunityWork from "../components/home/CommunityWork/CommunityWork";

export default function HomePage() {
  return <main><Hero/><FeaturedCategories/><FeaturedProducts/><MissionSection/><CommunityWork/><ImpactSection/><ShoppingBenefits/><NewsletterSection/></main>;
}
