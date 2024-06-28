import React from "react";
import "./Button.scss";

const Button = (props) => {
  const { text, onClick, className, href, icon } = props;

  return (
    <a className={`button ${className}`} onClick={onClick} href={href}>
      <span className="button__icon">{icon}</span>
      <span className="button__text">{text}</span>
    </a>
  );
};

export default Button;
