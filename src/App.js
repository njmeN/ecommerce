import {Routes, Route} from 'react-router-dom';
import Footer from "./components/common/footer";
import Header from "./components/common/header";
import NewsletterSection from "./components/common/newsletter";
import Home from "./components/home/home";
import Shop from './components/shop/shop';
import Cart from './components/cart/cart';
import LoginRegister from './components/login/LoginRegister.jsx';
import { ProductProvider } from './components/contexts/productContext';
import { CartProvider } from './components/contexts/cartContext';
import { UserProvider } from './components/contexts/userContext';
import { WishlistProvider } from './components/contexts/wishlistContext';
import Wishlist from './components/wishlist/wishlist';
import Accounts from './components/accounts/accounts';
import { Details } from './components/details/details';
import ScrollToTop from './ScrollToTop';

function App() {
  return (
    <div className="App">
      <UserProvider>
      <WishlistProvider>   
      <ProductProvider>   
        <CartProvider>
          <ScrollToTop/>
        <Header/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path='/cart' element={<Cart/>} />
        <Route path='/wishlist' element={<Wishlist/>} />
        <Route path='/accounts' element={<Accounts/>} />
        <Route path='/login' element={<LoginRegister/>} />
        <Route path="/product/:id" element={<Details/>} /> 
      </Routes>
      <NewsletterSection/>
      <Footer/>
      </CartProvider>
      </ProductProvider>  
      
      </WishlistProvider></UserProvider> 
       
      
      
    </div>
  );
}

export default App;
