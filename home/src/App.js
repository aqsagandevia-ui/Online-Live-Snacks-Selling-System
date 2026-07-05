import axios from 'axios';
import ProductForm from './components1/ProductFrom';
import ProductTable from './components1/ProductTable';
import React,{useState,useEffect} from 'react';
import './styles/App.css';
import Navbar from './Components/Navbar';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import Home from './Components/Home';
import Product from './Components/Product';
import Cart from './Components/Cart';
import LoginSignup from './Components/LoginSignup';
import Contactus from './Components/Contactus';
import Aboutus from './Components/Aboutus';
import Footer from './Components/Footer';
import Chips from './Components/Chips';
import Namkeen from './Components/Namkeen';
import AdminPage from './Components/adminpage';
import Chakli from './Components/Chakli';
import Corn from './Components/Corn';

const App = () => {
  const [cart,setCart] = useState([])
  const [showCart,setShowCart] = useState(false)
  const addToCart = (data) =>{
    setCart([...cart,{...data,quantity:1}])
    alert("Product added");
  }

  const handleShow=(value)=>{
    setShowCart(value)
  }

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
      fetchProducts();
  }, []);

  const fetchProducts = async () => {
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data);
  };

  const handleAddOrUpdateProduct = async (product) => {
      if (selectedProduct) {
          await axios.put(`http://localhost:5000/api/products/${selectedProduct._id}`, product);
      } else {
          await axios.post('http://localhost:5000/api/products', product);
      }
      setSelectedProduct(null);
      fetchProducts();
  };

  const handleDeleteProduct = async (id) => {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      fetchProducts();
  };

  const handleEditProduct = (product) => {
      setSelectedProduct(product);
  };


  return (
  <Router>
    <div>
      <Navbar count={cart.length}/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/product' element={<Product addToCart={addToCart}/>}  />
        <Route path='/cart' element={<Cart cart={cart}/>} />
        <Route path='/Aboutus' element={<Aboutus/>}/>
        <Route path='/Contactus' element={<Contactus/>}/>
        <Route path='/login' element={<LoginSignup/>}/>  
        <Route path='/Chip' element={<Chips addToCart={addToCart}/>}/>
        <Route path='/Namkeen' element={<Namkeen addToCart={addToCart}/>}/>
        <Route path='/Corn' element={<Corn addToCart={addToCart}/>}/> 
        <Route path='/Chakli' element={<Chakli addToCart={addToCart}/> }/>
        <Route path='/adminpage' element={<AdminPage/>}/>  
        <Route path='/ProductForm' element={<ProductForm selectedProduct={selectedProduct} onSubmit={handleAddOrUpdateProduct} />}/>
            <Route path='/ProductTable' element={<ProductTable products={products} onEdit={handleEditProduct} onDelete={handleDeleteProduct} />}/>
      </Routes>
      <Footer/>
    </div>
  </Router>
  );
}

export default App;
