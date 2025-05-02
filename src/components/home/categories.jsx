import React, { useState } from 'react';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'; 
import 'swiper/css/navigation'; 
import 'swiper/css/pagination';
import { Link } from 'react-router-dom';

import Tshirt from "../../images/category-1.jpg";
import Bags from "../../images/category-2.jpg";
import Sandal from "../../images/category-3.jpg";
import Scarf from "../../images/category-4.jpg";
import Shoes from "../../images/category-5.jpg";
import Pillowcase from "../../images/category-6.jpg";
import Jumpsuit from "../../images/category-7.jpg";
import Hats from "../../images/category-8.jpg";

const PopularCategories = () => {
  const categoryData = [
    { to: '/shop?category=T-shirt', imgSrc: Tshirt, title: 'Tshirt' },
    { to: '/shop?category=Bags', imgSrc: Bags, title: 'Bags' },
    { to: '/shop?category=Sandal', imgSrc: Sandal, title: 'Sandal' },
    { to: '/shop?category=Scarf', imgSrc: Scarf, title: 'Scarf' },
    { to: '/shop?category=Shoes', imgSrc: Shoes, title: 'Shoes' },
    { to: '/shop?category=Pillowcase', imgSrc: Pillowcase, title: 'Pillowcase' },
    { to: '/shop?category=Jumpsuit', imgSrc: Jumpsuit, title: 'Jumpsuit' },
    { to: '/shop?category=Hats', imgSrc: Hats, title: 'Hats' },
  ];
  

  const navigation = {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  };

  const breakpoints = {
    350: {
      slidesPerView: 2,
      spaceBetween: 24,
    },
    768: {
      slidesPerView: 3,
      spaceBetween: 24,
    },
    992: {
      slidesPerView: 4,
      spaceBetween: 24,
    },
    1200: {
      slidesPerView: 5,
      spaceBetween: 24,
    },
    1400: {
      slidesPerView: 6,
      spaceBetween: 24,
    },
  };

  const pagination = {
    el: '.swiper-pagination',
  };
  
  return (
    <section className="categories container section">
      <h3 className="section__title">
        <span>Popular</span> categories
      </h3>
      <div className="categories__container swiper">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={24}
          loop={true}
          navigation={navigation}
          pagination={pagination}
          breakpoints={breakpoints}
        >
          {categoryData.map((category) => (
            <SwiperSlide key={category.title} className="category__item swiper-slide">
              <Link to={category.to} className="category__item-link">
                <img src={category.imgSrc} alt={category.title} className="category__img" />
                <h3 className="category__title">{category.title}</h3>
              </Link>
            </SwiperSlide>
          ))}
          <div className="swiper-button-next">
            <i className="fi fi-rs-angle-right"></i>
          </div>
          <div className="swiper-button-prev">
            <i className="fi fi-rs-angle-left"></i>
          </div>
        </Swiper>
      </div>
    </section>
  );
};

export default PopularCategories;
