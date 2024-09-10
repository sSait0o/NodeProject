import React from "react";

import Menu from "../../layout/Menu/Menu.jsx";
import HomeSection from "../HomeSection/HomeSection.jsx";

import "./LandingPage.scss";

const LandingPage = () => {
  return (
    <div className="main__container">
      <div className="menu">
        <Menu />
      </div>
      <div className="home-section">
        <HomeSection />
      </div>
    </div>
  );
};

export default LandingPage;
