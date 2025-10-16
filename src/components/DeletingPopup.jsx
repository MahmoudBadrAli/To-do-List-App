import { useState, useEffect } from "react";

export default function DeletingPopup({ isVisible, onClose, onConfirm }) {
  const [isOpened, setIsOpened] = useState(false);

  useEffect(() => {
    let timer;
    if (isVisible) {
      timer = setTimeout(() => setIsOpened(true), 10);
    } else {
      setIsOpened(false);
    }
    return () => clearTimeout(timer);
  }, [isVisible]);

  function handleClose() {
    setIsOpened(false);
    setTimeout(() => onClose(), 250);
  }

  function onDeleteConfirm() {
    setIsOpened(false);
    setTimeout(() => onClose(), 250);
    onConfirm();
  }

  return (
    <>
      {isVisible && (
        <div
          className={`overlay ${isOpened ? "opened" : ""}`}
          onClick={handleClose}
        >
          <div
            className={`popup ${isOpened ? "opened" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <span className="title">
              Are you sure you want to remove the task?
            </span>
            <span className="warning">
              This action cannot be undone once you delete.
            </span>
            <div className="bottom">
              <span className="delete" onClick={onDeleteConfirm}>
                Yes, Delete
              </span>
              <span className="cancel" onClick={handleClose}>
                No, Cancel
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
