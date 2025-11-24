import React from "react";

const Modal = ({ show, message, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg text-center max-w-sm">
        <p className="text-lg font-semibold text-green-700">{message}</p>
        <button
          onClick={onClose}
          className="mt-4 bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default Modal;

