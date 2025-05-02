import React from 'react';
import { Link } from 'react-router-dom';
import Countdown from './countdown';
const DealsSection = () => {
  const targetDate1 = '2025-09-01T00:00:00';
  const targetDate2 = '2025-10-01T11:00:00';

  return (
    <section className="deals section">
      <div className="deals__container container grid">
        <div className="deals__item">
          <div className="deals__group">
            <h3 className="deals__brand">Deal of the day</h3>
            <span className="deals__category">Limited quantities</span>
          </div>

          <h4 className="deals__title">Summer Collection New Morder Design</h4>

          <div className="deals__price flex">
            <span className="new__price">$139</span>
            <span className="old__price">$159.99</span>
          </div>

          <div className="deals__group">
            <p className="deals__countdown-text">Hurry Up! offer End In:</p>

            <Countdown targetDate={targetDate1} />
          </div>

          <div className="deals__btn">
            <Link to="/details" className="btn btn__md">Shop now!</Link>
          </div>
        </div>

        <div className="deals__item">
          <div className="deals__group">
            <h3 className="deals__brand">Women clothing</h3>
            <span className="deals__category">Limited quantities</span>
          </div>

          <h4 className="deals__title">Try something new on vocation</h4>

          <div className="deals__price flex">
            <span className="new__price">$139</span>
            <span className="old__price">$159.99</span>
          </div>

          <div className="deals__group">
            <p className="deals__countdown-text">Hurry Up! offer End In:</p>

            <Countdown targetDate={targetDate2} />
            
          </div>

          <div className="deals__btn">
            <Link to="/details" className="btn btn__md">Shop now!</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DealsSection;
