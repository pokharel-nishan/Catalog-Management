import HomeComponent from "../../components/pageComponents/home/BookCategories";
import HeroSection from "../../components/pageComponents/home/HeroSection";
import UserLayout from "../../layouts/UserLayout";

const HomePage = () => {
  return (
    <UserLayout>
      <HeroSection />
      <HomeComponent />
    </UserLayout>
  );
};

export default HomePage;
