import React from "react";

interface SnackbarProps {
  message: string;
  isOpen: boolean;
  onClose: () => void;
}

const Snackbar: React.FC<SnackbarProps> = ({ message, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded shadow-lg">
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-4 text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default Snackbar;
