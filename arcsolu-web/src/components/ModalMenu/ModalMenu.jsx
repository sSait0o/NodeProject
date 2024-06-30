import React from "react";
import "./ModalMenu.scss";
// import Button from "../../components/Button/Button";
// import {
//   IconTake,
//   IconDelivery,
//   IconBooking,
//   IconMenu,
// } from "../../components/IconSvg";

const ModalMenu = ({ isOpen, onClose }) => {
  return (
    <div className={`modal__overlay ${isOpen ? "show" : ""}`} onClick={onClose}>
      <div
        className={`modal__box ${isOpen ? "slide-in-left" : "slide-out-left"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal__header">
          <button className="modal__close" onClick={onClose}>
            X
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalMenu;
