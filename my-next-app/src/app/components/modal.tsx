import React from "react";

const Modal = ({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-1/2">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600"
        >
          X
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
