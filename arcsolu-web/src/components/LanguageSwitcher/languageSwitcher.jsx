import { React, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import "./LanguageSwitcher.scss";

const LanguageSwitcher = ({ anchorEl, handleClose }) => {
  const { t, i18n } = useTranslation();
  // eslint-disable-next-line no-unused-vars
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const image = {
    en: "assets/flag/united-states.png",
    fr: "assets/flag/france.png",
    es: "assets/flag/spain.png",
    de: "assets/flag/germany.png",
    zh: "assets/flag/china.png",
    ko: "assets/flag/south-korea.png",
    ja: "assets/flag/japan.png",
    it: "assets/flag/italy.png",
    pt: "assets/flag/portugal.png",
  };

  const language = {
    en: "English",
    fr: "Français",
    es: "Español",
    de: "Deutsch",
    zh: "中文",
    ko: "한국어",
    ja: "日本語",
    it: "Italiano",
    pt: "Português",
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setCurrentLanguage(lang);
    handleClose();
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleClose}
      anchorOrigin={{
        vertical: isMobile ? "bottom" : "top",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: isMobile ? "top" : "bottom",
        horizontal: "center",
      }}
    >
      {Object.keys(image).map((lang) => (
        <MenuItem key={lang} onClick={() => changeLanguage(lang)}>
          <span className="language__item">
            <img src={image[lang]} alt={language[lang]} />
            <span>{t(language[lang])}</span>
          </span>
        </MenuItem>
      ))}
    </Menu>
  );
};

export default LanguageSwitcher;
