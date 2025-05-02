import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../contexts/userContext";
import { CartContext } from "../contexts/cartContext";



class Validator {
  static isEmpty(value) {
    return !value.trim();
  }

  static isValidEmail(email) {
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return emailRegex.test(email);
  }

  static isPasswordMatch(password, confirmPassword) {
    return password === confirmPassword;
  }

  static isPasswordStrong(password) {
    return password.length >= 8;
  }
}

const LoginRegister = () => {
  const { setCart, clearCart } = useContext(CartContext)

  const { users, logOut, setUser } = useContext(UserContext)
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loErrors, setLoErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [logTouched, setLogTouched] = useState({});

  const validate = (name, value) => {
    let newErrors = { ...errors };

    if (Validator.isEmpty(value)) {
      newErrors[name] = "This field cannot be empty";
    } else {
      delete newErrors[name];
    }

    if (name === "email" && !Validator.isValidEmail(value)) {
      newErrors.email = "Invalid email format";
    }

    if (name === "password" && !Validator.isPasswordStrong(value)) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    if ((name === "password" || name === "confirmPassword") && formData.confirmPassword) {
      if (!Validator.isPasswordMatch(formData.password, formData.confirmPassword)) {
        newErrors.confirmPassword = "Passwords do not match";
      } else {
        delete newErrors.confirmPassword;
      }
    }

    setErrors(newErrors);
  };

  const loginValidate = (name, value) => {
    let newErrors = { ...loErrors };

    if (Validator.isEmpty(value)) {
      newErrors[name] = "This field cannot be empty";
    } else {
      delete newErrors[name];
    }

    if (name === "email" && !Validator.isValidEmail(value)) {
      newErrors.email = "Invalid email format";
    }


    setLoErrors(newErrors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (touched[name]) {
      validate(name, value);
    }
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginFormData({ ...loginFormData, [name]: value });
    if (logTouched[name]) {
      loginValidate(name, value);
    }
  };

  const handleSignOut = () => {
    // Clear user data and cart from localStorage
    logOut()
    clearCart(); // Clear cart from context and localStorage
    localStorage.removeItem("user");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`${users}?email=${loginFormData.email}`);
      const user = response.data.find(u => u.password === loginFormData.password);

      if (user) {
        // Ensure the previous user data is cleared
        const loggedUser = localStorage.getItem('user');
        if (loggedUser) {
          handleSignOut(); // Only sign out if there's an existing user
        }
        // Get cart from localStorage
        let localCart = [];
        try {
          localCart = JSON.parse(localStorage.getItem('cart')) || [];
        } catch (error) {
          console.error('Error parsing localStorage cart:', error);
        }

        // Get cart from API and ensure it's parsed correctly
        let userCart = [];
        try {
          userCart = typeof user.cart === "string" ? JSON.parse(user.cart) : user.cart || [];
        } catch (error) {
          console.error('Error parsing user cart:', error);
          userCart = [];
        }

        // Merge carts and update quantities if necessary
        const mergedCart = [...userCart];

        localCart.forEach((localItem) => {
          const existingItem = mergedCart.find((item) => item.id === localItem.id);
          if (existingItem) {
            existingItem.quantity += localItem.quantity; // Increase quantity if duplicate
          } else {
            mergedCart.push(localItem);
          }
        });

        // Update user's cart in API
        await axios.patch(`${users}/${user.id}`, {
          cart: mergedCart, // Ensure API receives an array, not a string
        });

        // Update localStorage and context
        const updatedUser = { ...user, cart: mergedCart };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setCart(mergedCart);

        // Clear localStorage cart after merging
        localStorage.removeItem('cart');

        navigate("/shop");
      } else {
        setLoErrors({ general: "Invalid email or password" });
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };





  const handleRegister = async (e) => {
    e.preventDefault();



    // Validate each field before submission

    Object.keys(formData).forEach(key => validate(key, formData[key]));



    // Check if there are errors
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return; // Stop the function if there are validation errors
    }

    try {
      // Check if the user already exists
      const response = await axios.get(`${users}?email=${formData.email}`);
      if (response.data.length > 0) {
        setErrors({ email: "User already exists" });
        return;
      }

      const newUser = {
        name: formData.username,
        email: formData.email,
        password: formData.password,
        role:"user",
        address: "",
        cart: "[]",
        orders:[], // Initialize empty cart
        favorites: "",
      };

      // Create new user
      const createdUser = await axios.post(users, newUser);

      if (JSON.parse(localStorage.getItem('user'))) {
        handleSignOut()
      }

      const localCart = JSON.parse(localStorage.getItem('cart')) || [];

      await axios.patch(`${users}/${createdUser.data.id}`, {
        cart: JSON.stringify(localCart),
      });


      // Clear localStorage cart
      localStorage.removeItem('cart');

      // Save user info to localStorage
      const updatedUser = { ...createdUser.data, cart: JSON.stringify(localCart) };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // Set cart state in context
      setCart(localCart);


      console.log(localStorage)

      console.log("User Registered: ", formData);
      navigate("/shop"); // Redirect to shopping page after successful registration
    } catch (error) {
      console.error("Registration error: ", error);
    }
  };


  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    validate(name, value);
  };

  const handleLoginBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...logTouched, [name]: true });
    loginValidate(name, value);
  };



  return (
    <section className="login-register section__lg">
      <div className="login-register__container container grid">
        {/* Login Section */}
        <div className="login">
          <h3 className="section__title">Login</h3>
          {loErrors.general && <p className="error">{loErrors.general}</p>}
          <form className="form grid" onSubmit={handleLogin}>
            <input
              type="text"
              name="email"
              placeholder="Your Email"
              className="form__input"
              onChange={handleLoginChange}
              onBlur={handleLoginBlur}
            />
            {loErrors.email && <p className="error">{loErrors.email}</p>}

            <input
              type="password"
              name="password"
              placeholder="Your Password"
              className="form__input"
              onChange={handleLoginChange}
              onBlur={handleLoginBlur}
            />
            {loErrors.password && <p className="error">{loErrors.password}</p>}

            <div className="form__btn">
              <button className="btn">Login</button>
            </div>
          </form>
        </div>

        {/* Register Section */}
        <div className="register">
          <h3 className="section__title">Create an account</h3>
          <form className="form grid" onSubmit={handleRegister}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="form__input"
              value={formData.username}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.username && <p className="error">{errors.username}</p>}
            <input
              type="text"
              name="email"
              placeholder="Your Email"
              className="form__input"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.email && <p className="error">{errors.email}</p>}
            <input
              type="password"
              name="password"
              placeholder="Your Password"
              className="form__input"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.password && <p className="error">{errors.password}</p>}
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className="form__input"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
            <div className="form__btn">
              <button className="btn" type="submit">Submit & Register</button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LoginRegister;

