import React, { useEffect } from 'react';

const Toast = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 800); // Auto-close 

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-3 left-1/2 transform -translate-x-1/2 p-2 bg-sidebar-background text-white text-sm rounded-xl shadow-md">
        <div className="flex items-center justify-between">
        <span>{message}</span>
        <button onClick={onClose} className="ml-2 text-white">
            &times; {/* Close icon */}
        </button>
        </div>
    </div>
  );
};

export default Toast;