import React from "react";
import { Colors } from "../../themes/Colors";
import { Style } from "./style";

function Modal({ children, onClose }) {
  return (
    <div style={Style.overlay}>
      <div style={Style.modal}>
        {children}
        <button style={Style.closeButton} onClick={onClose}>
          X
        </button>
      </div>
    </div>
  );
}

export default Modal;
