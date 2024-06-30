import React from "react";
import "./HomeSection.scss";
import restaurantInfo from "../../data/restaurantInfo.json";

const HomeSection = () => {
  return (
    <div className="home__section">
      <div className="home__container">
        <h1 className="home__title">{restaurantInfo.name}</h1>
        <p className="home__note">{restaurantInfo.note}</p>
      </div>
    </div>
  );
};

export default HomeSection;
