import React, { useState, useEffect } from "react";
import "./Menu.scss";
import Button from "../../components/Button/Button";
import {
  IconTake,
  IconDelivery,
  IconBooking,
  IconMenu,
} from "../../components/IconSvg";
import LanguageSwitcher from "../../components/LanguageSwitcher/languageSwitcher"
import ModalMenu from "../../components/ModalMenu/ModalMenu";
import { useTranslation } from "react-i18next";

const Menu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation()

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const updateMedia = () => {
    setIsMobile(window.innerWidth <= 600);
  };

  useEffect(() => {
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  });

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="menu__container">
      <div className="nav__container_logo">
        <img
          className="nav__logo"
          src="https://grillinn.fr/FRONTOFFICE/views/2019/img/logo.png"
          alt="Logo"
        />
      </div>
      <div>
        <ul className={isMobile ? "nav__items_bottom" : "nav__items"}>
          <li>
            <Button
              text={t('takeaway')} 
              icon={<IconTake />}
              className="nav__emporter"
            />
          </li>
          <li>
            <Button text={t('delivery')} icon={<IconDelivery />} />
          </li>
          <li>
            <Button text={t('reservation')} icon={<IconBooking />} />
          </li>
          <li>
            <Button text={t('menu')} icon={<IconMenu />} />
          </li>
        </ul>
      </div>
      <div className={isMobile ? "icon__menu__mobile" : "icon__menu"}>
        <img
          src="assets/icon/earth-icon.png"
          alt="Menu Burger"
          className="burger__icon"
          onClick={toggleModal}
        />
      </div>
      <div
        className={isMobile ? "icon__langue__mobile" : "icon__menu"}
        onClick={handleClick}
      >
        <img
          src="assets/icon/earth-icon.png"
          alt="Change Language"
          className="langue__icon"
        />
      </div>
      <div className="container__rs">
        <div className="container__icons">
          <ul className="rs__items">
            <li onClick={handleClick}>
              <img
                src="assets/icon/earth-icon.png"
                alt="Change Language"
                className="rs__icon"
              />
            </li>
            <li>
              <img
                src="assets/icon/Facebook.svg"
                alt="Facebook"
                className="rs__icon"
              />
            </li>
            <li>
              <img
                src="assets/icon/Instagram.svg"
                alt="Instagram"
                className="rs__icon"
              />
            </li>
          </ul>
        </div>
      </div>
      <LanguageSwitcher anchorEl={anchorEl} handleClose={handleClose} />
      <ModalMenu isOpen={isModalOpen} onClose={toggleModal} />
    </div>
  );
};

export default Menu;
