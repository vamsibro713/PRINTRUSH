import React, { useState } from "react";
import "./App.css";

const PRICING = {
  xerox: {
    bw: 2.0,
    color: 10.0,
  },
  binding: {
    soft: 30,
    spiral: 40,
  },
};

function App() {
  // --- AUTH STATE ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // 'login' or 'signup'
  const [authData, setAuthData] = useState({ email: "", password: "" });

  // --- APP STATE ---
  const [currentView, setCurrentView] = useState("services"); 
  const [activeTab, setActiveTab] = useState("xerox");
  const [cart, setCart] = useState([]);
  
  const [userProfile, setUserProfile] = useState({
    name: "Guest User",
    email: "",
    phone: "",
    address: "",
    isSaved: false
  });
  
  const [isEditingProfile, setIsEditingProfile] = useState(true);

  const [formData, setFormData] = useState({
    file: null,
    pages: 1,
    copies: 1,
    printType: "bw",
    bindingType: "spiral",
  });

  // --- AUTH HANDLERS ---
  const handleAuthChange = (e) => {
    setAuthData({ ...authData, [e.target.name]: e.target.value });
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (!authData.email || !authData.password) {
      alert("Please fill in all fields");
      return;
    }
    // Mock Authentication Logic
    setIsLoggedIn(true);
    
    // Pre-fill profile with auth email
    setUserProfile(prev => ({ ...prev, email: authData.email, name: authData.email.split('@')[0] }));
    
    // Reset view
    setCurrentView("services");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCart([]);
    setAuthData({ email: "", password: "" });
  };

  // --- APP HANDLERS ---
  const calculatePrice = () => {
    let price = 0;
    if (activeTab === "xerox") {
      const rate =
        formData.printType === "bw" ? PRICING.xerox.bw : PRICING.xerox.color;
      price = rate * formData.pages * formData.copies;
    } else if (activeTab === "binding") {
      const rate =
        formData.bindingType === "soft"
          ? PRICING.binding.soft
          : PRICING.binding.spiral;
      price = rate * formData.copies;
    }
    return price;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setUserProfile({ ...userProfile, [name]: value });
  };

  const saveProfile = (e) => {
    e.preventDefault();
    setUserProfile({ ...userProfile, isSaved: true });
    setIsEditingProfile(false);
    alert("Profile saved successfully!");
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const addToCart = (e) => {
    e.preventDefault();
    const item = {
      id: Date.now(),
      type: activeTab,
      details: { ...formData },
      price: calculatePrice(),
    };
    setCart([...cart, item]);
    alert("Item added to cart!");
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const getTotalCartPrice = () => {
    return cart.reduce((total, item) => total + item.price, 0);
  };

  const handlePlaceOrder = () => {
    if (!userProfile.isSaved || !userProfile.phone) {
      alert("Please complete your profile (specifically phone number) before placing an order.");
      setCurrentView("profile");
      setIsEditingProfile(true);
      return;
    }
    alert(`Order placed successfully for ${userProfile.name}! We will contact you at ${userProfile.phone}.`);
    setCart([]); 
  };

  // --- RENDER LOGIN SCREEN ---
  if (!isLoggedIn) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>🖨️ PRINTRUSH</h1>
            <p>{authMode === "login" ? "Welcome Back!" : "Create an Account"}</p>
          </div>
          <form onSubmit={handleAuthSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                name="email" 
                value={authData.email} 
                onChange={handleAuthChange} 
                placeholder="Enter your email"
                required 
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                name="password" 
                value={authData.password} 
                onChange={handleAuthChange} 
                placeholder="Enter password"
                required 
              />
            </div>
            <button type="submit" className="auth-btn">
              {authMode === "login" ? "Login" : "Sign Up"}
            </button>
          </form>
          <div className="auth-toggle">
            {authMode === "login" ? (
              <span>New here? <button onClick={() => setAuthMode("signup")}>Create account</button></span>
            ) : (
              <span>Already have an account? <button onClick={() => setAuthMode("login")}>Login</button></span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER MAIN APP ---
  return (
    <div className="app-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">🖨️ PRINTRUSH</div>
        <div className="nav-links">
          <button 
            className={currentView === "services" ? "nav-btn active" : "nav-btn"} 
            onClick={() => setCurrentView("services")}>
            Services
          </button>
          <button 
            className={currentView === "profile" ? "nav-btn active" : "nav-btn"} 
            onClick={() => setCurrentView("profile")}>
            Profile {userProfile.isSaved ? "✅" : "⚠️"}
          </button>
          <button 
            className={currentView === "cart" ? "nav-btn active" : "nav-btn"} 
            onClick={() => setCurrentView("cart")}>
            Cart ({cart.length})
          </button>
          <button className="nav-btn logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="main-content-wrapper">
        
        {/* --- VIEW: SERVICES --- */}
        {currentView === "services" && (
          <div className="service-card full-width">
            <div className="tabs">
              <button
                className={activeTab === "xerox" ? "active" : ""}
                onClick={() => setActiveTab("xerox")}
              >
                Xerox / Print
              </button>
              <button
                className={activeTab === "binding" ? "active" : ""}
                onClick={() => setActiveTab("binding")}
              >
                Binding Services
              </button>
            </div>

            <form onSubmit={addToCart} className="order-form">
              <h3>Configure Your Order</h3>
              <div className="form-group">
                <label>Upload Document (PDF/Docx)</label>
                <input type="file" onChange={handleFileChange} required />
              </div>

              {activeTab === "xerox" && (
                <>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Print Type</label>
                      <select name="printType" value={formData.printType} onChange={handleInputChange}>
                        <option value="bw">Black & White (₹{PRICING.xerox.bw})</option>
                        <option value="color">Color (₹{PRICING.xerox.color})</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {activeTab === "binding" && (
                <div className="form-group">
                  <label>Binding Type</label>
                  <select name="bindingType" value={formData.bindingType} onChange={handleInputChange}>
                    <option value="spiral">Spiral Binding (₹{PRICING.binding.spiral})</option>
                    <option value="soft">Soft Binding (₹{PRICING.binding.soft})</option>
                  </select>
                </div>
              )}

              <div className="form-group">
                <label>Copies</label>
                <input type="number" name="copies" min="1" value={formData.copies} onChange={handleInputChange}/>
              </div>

              <div className="price-display">
                <span>Total: ₹{calculatePrice()}</span>
                <button type="submit" className="add-btn">Add to Cart</button>
              </div>
            </form>
          </div>
        )}

        {/* --- VIEW: PROFILE --- */}
        {currentView === "profile" && (
          <div className="profile-card">
            <div className="profile-header">
              <h2>My Profile</h2>
              {!isEditingProfile && (
                <button className="edit-btn" onClick={() => setIsEditingProfile(true)}>
                  Edit Details
                </button>
              )}
            </div>

            {isEditingProfile ? (
              <form onSubmit={saveProfile} className="profile-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" name="name" value={userProfile.name} onChange={handleProfileChange} required />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" name="email" value={userProfile.email} onChange={handleProfileChange} required disabled />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="tel" name="phone" value={userProfile.phone} onChange={handleProfileChange} required placeholder="For order updates" />
                </div>
                <button type="submit" className="save-btn">Save Profile</button>
              </form>
            ) : (
              <div className="profile-details">
                <div className="detail-row">
                  <strong>Name:</strong> <span>{userProfile.name}</span>
                </div>
                <div className="detail-row">
                  <strong>Email:</strong> <span>{userProfile.email}</span>
                </div>
                <div className="detail-row">
                  <strong>Phone:</strong> <span>{userProfile.phone}</span>
                </div>
                <div className="detail-row">
                  <strong>Address:</strong> <span>{userProfile.address}</span>
                </div>
                <div className="profile-status">
                  ✅ Profile is set up for orders.
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- VIEW: CART --- */}
        {currentView === "cart" && (
          <div className="cart-card full-width">
            <h3>Checkout</h3>
            {cart.length === 0 ? (
              <p className="empty-cart">Your cart is empty.</p>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((item) => (
                    <div key={item.id} className="cart-item">
                      <div>
                        <strong>{item.type === "xerox" ? "Xerox" : "Binding"}</strong>
                        <p className="cart-desc">
                          {item.type === "xerox"
                            ? `${item.details.printType.toUpperCase()} | ${item.details.pages} pgs`
                            : `${item.details.bindingType.toUpperCase()}`}
                          {" "} x {item.details.copies} copies
                        </p>
                      </div>
                      <div className="item-actions">
                        <span>₹{item.price}</span>
                        <button className="delete-btn" onClick={() => removeFromCart(item.id)}>×</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="checkout-summary">
                  <div className="shipping-info">
                     <h4>Shipping To:</h4>
                     {userProfile.isSaved ? (
                       <p>{userProfile.name}, {userProfile.address}</p>
                     ) : (
                       <p className="warning-text">⚠️ No address found. Please update profile.</p>
                     )}
                  </div>
                  <div className="cart-total">
                    <span>Total Amount:</span>
                    <span>₹{getTotalCartPrice()}</span>
                  </div>
                  <button className="checkout-btn" onClick={handlePlaceOrder}>
                    Confirm Order
                  </button>
                </div>
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default App;