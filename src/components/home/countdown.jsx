import React, { useState, useEffect } from 'react';

const Countdown = ({ targetDate }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  return (
    <div className="countdown">
      <div className="countdown__amount">
        <p className="countdown__period">{String(timeLeft.days).padStart(2, '0')}</p>
        <span className="unit">Days</span>
      </div>
      <div className="countdown__amount">
        <p className="countdown__period">{String(timeLeft.hours).padStart(2, '0')}</p>
        <span className="unit">Hours</span>
      </div>
      <div className="countdown__amount">
        <p className="countdown__period">{String(timeLeft.minutes).padStart(2, '0')}</p>
        <span className="unit">Mins</span>
      </div>
      <div className="countdown__amount">
        <p className="countdown__period">{String(timeLeft.seconds).padStart(2, '0')}</p>
        <span className="unit">Sec</span>
      </div>
    </div>
  );
};

export default Countdown;
