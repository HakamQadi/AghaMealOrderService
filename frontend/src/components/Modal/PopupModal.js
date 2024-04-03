import React from "react";
import { Colors } from "../../themes/Colors";

function Modal({ children, onClose }) {
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {children}
        <button style={styles.closeButton} onClick={onClose}>
          X
        </button>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  modal: {
    backgroundColor: Colors.darkGray,
    padding: "20px",
    borderRadius: "8px",
    position: "relative",
    width: "80%",
    height: "80%",
    maxWidth: "700px",
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "transparent",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
    color: Colors.yellow,
  },
};

export default Modal;
