import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Network response was not ok');
      const result = await response.json();
      setProducts(result.data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please ensure the backend and MongoDB are running.');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item._id === product._id);
      if (existingItem) {
        return prevCart.map(item => 
          item._id === product._id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (productId, amount) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item._id === productId) {
          const newQty = item.quantity + amount;
          return { ...item, quantity: Math.max(0, newQty) };
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    setIsCheckingOut(true);
    
    const checkoutPayload = {
      items: cart.map(item => ({
        productId: item._id,
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount: cartTotal
    };

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checkoutPayload)
      });

      if (!response.ok) throw new Error('Checkout failed');
      
      showToast();
      setCart([]);
      setIsCartOpen(false);

    } catch (err) {
      console.error('Error during checkout:', err);
      alert('Checkout failed. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const showToast = () => {
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 3000);
  };

  const scrollToProducts = () => {
    document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <>
      <nav className="navbar">
        <div className="nav-content">
          <h1 className="logo">NexGen<span className="highlight">Tech</span></h1>
          <div className="cart-icon" onClick={() => setIsCartOpen(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
          </div>
        </div>
      </nav>

      {/* Cart Sidebar */}
      <div className={`cart-overlay ${isCartOpen ? 'open' : ''}`} onClick={() => setIsCartOpen(false)}></div>
      <div className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2>Your Cart</h2>
          <button className="close-cart" onClick={() => setIsCartOpen(false)}>&times;</button>
        </div>
        
        <div className="cart-items">
          {cart.length === 0 ? (
            <p className="empty-cart">Your cart is empty.</p>
          ) : (
            cart.map(item => (
              <div key={item._id} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-item-img" />
                <div className="cart-item-info">
                  <h4>{item.name}</h4>
                  <p className="cart-item-price">${item.price.toFixed(2)}</p>
                  <div className="cart-item-controls">
                    <button onClick={() => updateQuantity(item._id, -1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, 1)}>+</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total:</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <button 
              className="checkout-button" 
              onClick={handleCheckout}
              disabled={isCheckingOut}
            >
              {isCheckingOut ? 'Processing...' : 'Checkout'}
            </button>
          </div>
        )}
      </div>

      <header className="hero">
        <div className="hero-content">
          <h2>Elevate Your Lifestyle</h2>
          <p>Discover the latest premium tech gadgets curated just for you.</p>
          <button className="cta-button" onClick={scrollToProducts}>Shop Now</button>
        </div>
      </header>

      <main className="container" id="products-section">
        <div className="section-header">
          <h3>Featured Products</h3>
          <div className="underline"></div>
        </div>
        
        {loading && <div className="loader"></div>}
        
        {error && <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{error}</p>}

        {!loading && !error && (
          <div className="grid">
            {products.map(product => (
              <div className="card" key={product._id}>
                <div className="card-img-container">
                  <img src={product.image} alt={product.name} className="card-img" loading="lazy" />
                </div>
                <div className="card-content">
                  <h4 className="card-title">{product.name}</h4>
                  <p className="card-desc">{product.description}</p>
                  <div className="card-footer">
                    <span className="price">${product.price.toFixed(2)}</span>
                    <button 
                      className="buy-button" 
                      onClick={() => addToCart(product)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer>
        <p>&copy; 2026 NexGen Tech. Cloud Computing Lab Practical (MERN).</p>
      </footer>

      <div className={`toast ${toastVisible ? 'show' : 'hidden'}`}>
        <div className="toast-content">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          <span>Checkout Successful!</span>
        </div>
      </div>
    </>
  );
}

export default App;
