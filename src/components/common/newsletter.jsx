import React, { useState } from 'react';
import emailIcon from "../../images/icon-email.svg";
import axios from "axios";

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter an email.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/newsletter", {
        email,
      });

      if (response.status === 201) {
        setSuccess("Thank you for subscribing!");
        setEmail(""); 
        setError("");
      }
    } catch (err) {
      setError("Failed to subscribe. Try again.");
    }
  };

  return (
    <section className="newsletter section home__newsletter">
      <div className="newsletter__container container grid">
        <h3 className="newsletter__title flex">
          <img src={emailIcon} alt="" className="newsletter__icon" />
          Sign up to Newsletter
        </h3>

        <p className="newsletter__description">...and receive $25 coupon for first shopping.</p>

        <form onSubmit={handleSubmit} className="newsletter__form">
          <input
            type="email"
            placeholder="Enter your Email"
            className="newsletter__input"
            value={email}
            onChange={handleEmailChange}
          />
          <button type="submit" className="newsletter__btn">Subscribe</button>
          {error && <p className="error">{error}</p>}
         {success && <p className="success">{success}</p>}
        </form>
      </div>
    </section>
  );
};

export default NewsletterSection;
