import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../contexts/userContext";
import { Link } from "react-router-dom";
import axios from "axios";
import { ProductContext } from "../contexts/productContext";

const Accounts = () => {
  const { user, logOut, setUser } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const { products, loading, productError, setProducts} = useContext(ProductContext);
  const [activeTab, setActiveTab] = useState("#dashboard");
  const isAdmin = user?.role === "admin"; 
  const [orderStatus, setOrderStatus] = useState({}); // Track status updates
  
  // State for Update Profile
  const [updatedName, setUpdatedName] = useState(user?.name);
  const [changedAddress, setChangedAddress] = useState(user?.address)
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingAddress, setIsChangingAddress] = useState(false);
  const [profileError, setProfileError] = useState(null)

  const [changingAddressError, setChangingAddressError] =useState(null)

  // **New Product Form State**
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [availability, setAvailability] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [sku, setSku] = useState("");
  const [images, setImages] = useState([]);
  const [addProductError, setAddProductError] = useState(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  // State for Change Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [changingPassError, setChangingPassError] = useState (null)
 const [filteredUsers, setFilteredUsers] = useState([]);
  

  const [users, setUsers] = useState([]);

 

  useEffect(() => {
    axios.get("http://localhost:3000/users")
      .then(response => {
        setUsers(response.data); // Store users in state
      })
      .catch(error => {
        console.error("Failed to fetch users", error);
      });
  }, []);

  useEffect(() => {
  if (user) {
    setFilteredUsers(users.filter((u) => u.id !== user.id));
  } else {
    setFilteredUsers([]);
  }
}, [users, user]);

  const handleTabClick = (target) => setActiveTab(target);
  const handleLogout = () => logOut();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:3000/orders');
        setOrders(response.data); // Assuming orders are directly in the response body
       
      } catch (err) {
        setError('Failed to fetch orders');
        
      }
    };

    fetchOrders();
  }, []); 

  // Handle status change
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      
      await axios.patch(`http://localhost:3000/orders/${orderId}`, { status: newStatus });
  
     
      const updatedUserOrders = user.orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      );
  
    
      setUser((prevUser) => ({
        ...prevUser,
        orders: updatedUserOrders,
      }));
  
      await axios.patch(`http://localhost:3000/users/${user.id}`, { orders: updatedUserOrders });
  
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };
  

  // **Update Profile**

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);

    try {
      await axios.patch(`http://localhost:3000/users/${user.id}`, { name: updatedName });

      setUser((prevUser) => ({ ...prevUser, name: updatedName }));
    } catch (error) {
      setProfileError("changing profile failed")
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangingAddress = async (e) => {
    e.preventDefault();
    setIsChangingAddress(true);

    try {
      await axios.patch(`http://localhost:3000/users/${user.id}`, { address: changedAddress });

      setUser((prevUser) => ({ ...prevUser, address: changedAddress }));
      
    } catch (error) {
      setChangingAddressError("updating address failed")
    } finally {
      setIsChangingAddress(false);
    }
  };

  //**edit-products */

  const handleAvailabilityChange = async (productId, newAvailability) => {
    try {
      await axios.patch(`http://localhost:3000/products/${productId}`, {
        availability: Number(newAvailability),
      });
    } catch (error) {
      console.error("Failed to update product availability", error);
    }
  };

   // **Handle Image Upload**
   const handleImageUpload = (e) => {
    const files = e.target.files;
    if (files.length !== 2) {
      alert("Please upload exactly two images.");
      return;
    }
    const imagePaths = Array.from(files).map((file) => URL.createObjectURL(file));
    setImages(imagePaths);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setAddProductError(null);
    setIsAddingProduct(true);

    // Ensure fields are filled
    if (!title || !price || !availability || !description || !category || !sku || images.length !== 2) {
      setAddProductError("All fields are required, including two images.");
      setIsAddingProduct(false);
      return;
    }

    // Create product object
    const newProduct = {
      id: (products.length + 1).toString(), // Assign next ID
      title,
      description,
      price: parseFloat(price),
      category,
      images,
      availability: parseInt(availability),
      sku,
      rating: Math.floor(Math.random() * 5) + 1, // Random number between 1 and 5
      reviews: []
    };

    try {
      await axios.post("http://localhost:3000/products", newProduct);
      alert("Product added successfully!");
      setProducts((prevProducts) => [...prevProducts, newProduct]);
      // Reset form
      setTitle("");
      setPrice("");
      setAvailability("");
      setDescription("");
      setCategory("");
      setSku("");
      setImages([]);
    } catch (error) {
      setAddProductError("Failed to add product.");
    } finally {
      setIsAddingProduct(false);
    }
  };
  
  // Remove Product from API
  const removeFromProducts = async (productId) => {
    try {
      await axios.delete(`http://localhost:3000/products/${productId}`);
      setProducts((prevProducts) => prevProducts.filter(product => product.id !== productId));
    } catch (error) {
      console.error("Failed to delete product", error);
    }

  };

  // Handle password change
  const handleUsersPasswordChange = async (userId, newPassword) => {
    try {
      await axios.patch(`http://localhost:3000/users/${userId}`, {
        password: newPassword,
      });
      // Optionally update the local state to reflect the password change immediately
      setUsers(users.map(u => (u.id === userId ? { ...u, password: newPassword } : u)));
    } catch (error) {
      console.error('Failed to update password', error);
    }
  };

  // Handle role change
  const handleRoleChange = async (userId, newRole) => {
    if (user.id === userId) {
      alert('You cannot change your own role.');
      return;
    }

    try {
      await axios.patch(`http://localhost:3000/users/${userId}`, {
        role: newRole,
      });
      setUsers(users.map(u => (u.id === userId ? { ...u, role: newRole } : u)));
    } catch (error) {
      console.error('Failed to change role', error);
    }
  };

  // Handle removing a user/admin
  const removeFromUsers = async (userId) => {
    if (user.id === userId) {
      alert('You cannot remove yourself.');
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/users/${userId}`);
      setUsers(users.filter(u => u.id !== userId)); // Remove the user from the list
    } catch (error) {
      console.error('Failed to remove user', error);
    }
  };
  

  // **Change Password**
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (currentPassword !== user.password) {
      setError("Current password is incorrect.");
      return;
    }
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      await axios.patch(`http://localhost:3000/users/${user.id}`, { password: newPassword });

      alert("Password updated successfully. Please log in again.");
      logOut();
    } catch (error) {
      setChangingPassError("changing password failed")
    } finally {
      setIsUpdatingPassword(false);
    }
  };
  

  
  

  return (
    <section>
      <section className="breadcrumb">
        <ul className="breadcrumb__list flex container">
          <li><Link to="/" className="breadcrumb__link">Home</Link></li>
          <li><span className="breadcrumb__link">{">"}</span></li>
          <li><span className="breadcrumb__link">Accounts</span></li>
        </ul>
      </section>

      {user ? (
        <section className="accounts section__lg">
          <div className="accounts__container container grid">
            <div className="account__tabs">
              <p className={`account__tab ${activeTab === "#dashboard" ? "active-tab" : ""}`} onClick={() => handleTabClick("#dashboard")}>
                <i className="fi fi-rs-settings-sliders"></i> Dashboard
              </p>

              <p
            className={`account__tab ${activeTab === "#orders" ? "active-tab" : ""}`}
            data-target="#orders"
            onClick={() => handleTabClick("#orders")}
          >
            <i className="fi fi-rs-shopping-bag"></i> Orders
          </p>

          {isAdmin&&  <p
            className={`account__tab ${activeTab === "#all-orders" ? "active-tab" : ""}`}
            data-target="#all-orders"
            onClick={() => handleTabClick("#all-orders")}
          >
            <i className="fi fi-rs-shopping-bag"></i> all-Orders
          </p>}

          {isAdmin &&<p
            className={`account__tab ${activeTab === "#edit-products" ? "active-tab" : ""}`}
            data-target="#edit-products"
            onClick={() => handleTabClick("#edit-products")}
          >
            <i className="fi fi-rs-shopping-bag"></i> Edit products
          </p>}

          {isAdmin &&<p
            className={`account__tab ${activeTab === "#users-list" ? "active-tab" : ""}`}
            data-target="#users-list"
            onClick={() => handleTabClick("#users-list")}
          >
            <i className="fi fi-rs-shopping-bag"></i> users and admins list
          </p>}

              <p className={`account__tab ${activeTab === "#update-profile" ? "active-tab" : ""}`} onClick={() => handleTabClick("#update-profile")}>
                <i className="fi fi-rs-user"></i> Update Profile
              </p>

              <p
            className={`account__tab ${activeTab === "#address" ? "active-tab" : ""}`}
            data-target="#address"
            onClick={() => handleTabClick("#address")}
          >
            <i className="fi fi-rs-user"></i> Shipping adress
          </p>

              <p className={`account__tab ${activeTab === "#change-password" ? "active-tab" : ""}`} onClick={() => handleTabClick("#change-password")}>
                <i className="fi fi-rs-user"></i> Change Password
              </p>
              <p className="account__tab" onClick={handleLogout}>
                <i className="fi fi-rs-exit"></i> Logout
              </p>
            </div>

            <div className="tabs__content">
              {/* Dashboard */}
              <div className={`tab__content ${activeTab === "#dashboard" ? "active-tab" : ""}`} id="dashboard">
                <h3 className="tab__header">Welcome, {user ? user.name : "Guest"}!</h3>
                <div class="tab__body">
                <p class="tab__description">From your account dashboard. you can easily check & view your recent orders, manage 
                  your shipping and billing addresses and edit your password and accout details.
                </p>
              </div>
              </div>

              {/* Update Profile */}
              <div className={`tab__content ${activeTab === "#update-profile" ? "active-tab" : ""}`} id="update-profile">
                <h3 className="tab__header">Update Profile</h3>
                <div class="tab__body">
                {profileError && <p className="error">{profileError}</p>}
                   <form className="form grid" onSubmit={handleProfileUpdate}>
                  <input 
                    type="text" 
                    className="form__input" 
                    placeholder="Username" 
                    value={updatedName} 
                    onChange={(e) => setUpdatedName(e.target.value)} 
                  />
                  <button className="btn btn__md" type="submit" disabled={isUpdatingProfile}>
                    {isUpdatingProfile ? "Saving..." : "Save"}
                  </button>
                </form></div>
               
              </div>
            {/*your orders*/}
              <div className={`tab__content ${activeTab === "#orders" ? "active-tab" : ""}`} id="orders">
            <h3 className="tab__header">Your Orders</h3>
            <div className="tab__body">
              <table className="placed__order-table">
                <tr>
                  <th>Orders</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Products</th>
                </tr>
                {/* Dynamically render orders if available */}
                {user.orders && user.orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.date}</td>
                    <td>{order.status}</td>
                    <td>{order.totalAmount}</td>
                    <td>
                    {order.products.map((product) => (
                       
                       <Link to={`/product/${product.productId}`}>{product.productId},</Link>
                   
                     ))}
                     </td>
                  </tr>
                ))}
              </table>
            </div>
          </div>

           {/*all orders*/}
           <div className={`tab__content ${activeTab === "#all-orders" ? "active-tab" : ""}`} id="all-orders">
            <h3 className="tab__header">Your Orders</h3>
            <div className="tab__body">
              <table className="placed__order-table">
                <tr>
                  <th>Orders</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Products</th>
                </tr>
                {/* Dynamically render orders if available */}
                {orders && orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.date}</td>
                    <td> <select
                    value={orderStatus[order.id] || order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select></td>
                    <td>{order.totalAmount}</td>
                    <td>
                    {order.products.map((product) => (
                       
                       <Link to={`/product/${product.productId}`}>{product.productId},</Link>
                   
                     ))}
                     </td>
                  </tr>
                ))}
              </table>
            </div>
          </div>

            {/*edit-products*/}
            {isAdmin && <div className={`tab__content ${activeTab === "#edit-products" ? "active-tab" : ""}`} id="edit-products">
            <h3 className="tab__header">edit-products</h3>
            <div className="tab__body"><div className="table__container">
            {productError && <p className="error">{productError}</p>}
          <table className="placed__order-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Available</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <img src={product.images[0]} alt={product.title} className="table__img" />
                  </td>
                  <td>
                    <Link to={`/product/${product.id}`} className="table__title">{product.title}</Link>
                  </td>
                  <td>
                    <span className="table__price">${product.price}</span>
                  </td>
                  <td>
                    <input
                      type="number"
                      value={product.availability}
                      className="quantity"
                      onChange={(e) => handleAvailabilityChange(product.id, e.target.value)}
                    />
                  </td>
                  <td>
                    <i
                      className="fi fi-rs-trash table__trash"
                      onClick={() => removeFromProducts(product.id)}
                    ></i>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div></div>
            
        <h3 className="tab__header">Add new product</h3>
         <div className="tab__body"> 
         {addProductError && <p className="error">{addProductError}</p>}
                  <form className="form grid" onSubmit={handleAddProduct}>
                    <input 
                      type="text" 
                      className="form__input" 
                      placeholder="Product Title" 
                      value={title} 
                      onChange={(e) => setTitle(e.target.value)} 
                    />
                    <input 
                      type="number" 
                      className="form__input" 
                      placeholder="Price" 
                      value={price} 
                      onChange={(e) => setPrice(e.target.value)} 
                    />
                    <input 
                      type="number" 
                      className="form__input" 
                      placeholder="Availability" 
                      value={availability} 
                      onChange={(e) => setAvailability(e.target.value)} 
                    />
                    <input 
                      type="text" 
                      className="form__input" 
                      placeholder="Description" 
                      value={description} 
                      onChange={(e) => setDescription(e.target.value)} 
                    />
                    <input 
                      type="text" 
                      className="form__input" 
                      placeholder="Category" 
                      value={category} 
                      onChange={(e) => setCategory(e.target.value)} 
                    />
                    <input 
                      type="text" 
                      className="form__input" 
                      placeholder="SKU" 
                      value={sku} 
                      onChange={(e) => setSku(e.target.value)} 
                    />
                    <h3 className="table__title">Images:</h3>

                    <div className="image-upload">
                    <input 
                      type="file" 
                       
                      multiple 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                    />

                    {/* Show preview of uploaded images */}
                  {images.length > 0 && (
                    <div className="image-preview">
                      {images.map((img, index) => (
                        <img key={index} src={img} alt={`Preview ${index + 1}`} className="preview-img" />
                      ))}
                    </div>
                  )}
                    </div>
                    
                    <button className="btn btn__md" type="submit" disabled={isAddingProduct}>
                      {isAddingProduct ? "Adding..." : "Add Product"}
                    </button>
                  </form>

                  
          </div>
            </div>}

            {/*users and admins list*/}

             {isAdmin && <div className={`tab__content ${activeTab === "#users-list" ? "active-tab" : ""}`} id="users-list">
             <h3 className="tab__header">Users and Admins list</h3>    
             <table className="placed__order-table">
                <tr>
                  <th>Emails</th>
                  <th>Passwords</th>
                  <th>role</th>
                  <th>remove</th>
                  
                </tr>
                
                {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <span className="table__price">{user.email}</span>
                  </td>

                  <td>
                    <input
                      type="text"
                      value={user.password}
                      className="form__input"
                      onChange={(e) => handleUsersPasswordChange(user.id, e.target.value)}
                    />
                  </td>

                  <td>
                    <input
                      type="text"
                      value={user.role}
                      className="form__input"
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    />
                  </td>

                  <td>
                    <i
                      className="fi fi-rs-trash table__trash"
                      onClick={() => removeFromUsers(user.id)}
                    ></i>
                  </td>
                </tr>
              ))}
              
              </table>
              </div>}


              {/* Change Password */}
              <div className={`tab__content ${activeTab === "#change-password" ? "active-tab" : ""}`} id="change-password">
                <h3 className="tab__header">Change Password</h3>
                <div class="tab__body">
                {changingPassError && <p className="error">{changingPassError}</p>}
                  <form className="form grid" onSubmit={handleChangePassword}>
                  <input 
                    type="password" 
                    className="form__input" 
                    placeholder="Current Password" 
                    value={currentPassword} 
                    onChange={(e) => setCurrentPassword(e.target.value)} 
                  />
                  <input 
                    type="password" 
                    className="form__input" 
                    placeholder="New Password" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                  />
                  <input 
                    type="password" 
                    className="form__input" 
                    placeholder="Confirm Password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                  />
                  {error && <p className="error-message">{error}</p>}
                  <button className="btn btn__md" type="submit" disabled={isUpdatingPassword}>
                    {isUpdatingPassword ? "Saving..." : "Save"}
                  </button>
                </form></div>
                
              </div>

              <div className={`tab__content ${activeTab === "#address" ? "active-tab" : ""}`} id="address">
            <h3 className="tab__header">Shipping Address</h3>
            <div className="tab__body">
            {changingAddressError && <p className="error">{changingAddressError}</p>}
            <form className="form grid" onSubmit={handleChangingAddress}>
                  <input 
                    type="text" 
                    className="form__input" 
                    placeholder="Username" 
                    value={changedAddress} 
                    onChange={(e) => setChangedAddress(e.target.value)} 
                  />
                  <button className="btn btn__md" type="submit" disabled={isUpdatingProfile}>
                    {isChangingAddress ? "Saving..." : "Save"}
                  </button>
                </form>
          </div>
            </div>
          </div></div>
        </section>
      ) : (
        <div className="noUser">There is no user</div>
      )}
    </section>
  );
};

export default Accounts;
