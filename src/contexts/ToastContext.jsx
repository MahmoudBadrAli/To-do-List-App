import { useState, createContext, useContext } from "react";
import Toast from "../components/Toast";

const ToastContext = createContext({});

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    message: "",
    show: false,
  });

  function showHideToast(message) {
    setToast({ message: message, show: true });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 2000);
  }

  return (
    <ToastContext.Provider value={{ showHideToast }}>
      <Toast isVisible={toast.show} message={toast.message} />
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  return useContext(ToastContext);
};
