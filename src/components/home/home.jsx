import PopularCategories from "./categories";
import DealsSection from "./dealsSection";
import Hero from "./hero";
import Products from "./products";

const Home = () => {
    return (  
        <>
        <Hero/>
        <PopularCategories/>
        <DealsSection />
        <Products />
        </>
    );
}
 
export default Home;