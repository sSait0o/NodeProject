import React from "react";
import "./HomeSection.scss";
import restaurantInfo from "../../data/restaurantInfo.json";

const HomeSection = () => {
  return (
    <div className="home__section">
      <img
        className="background-image"
        src="assets/img/image.avif"
        alt=""
      />
      <div className="home__container">
        <h1 className="home__title">{restaurantInfo.name}</h1>
      </div>
    </div>
  );
};

export default HomeSection;