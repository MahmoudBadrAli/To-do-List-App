import { useState, useEffect } from "react";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

export default function EditingPopup({
  title,
  details,
  isVisible,
  onClose,
  onConfirm,
}) {
  const [isOpened, setIsOpened] = useState(false);
  const [info, setInfo] = useState({
    title: title,
    details: details,
  });

  const mainColor = "#283593";
  const textFieldSx = {
    "& .MuiInputLabel-root.Mui-focused": { color: mainColor },
    "& .MuiInput-root:before": { borderBottomColor: "#ccc" },
    "& .MuiInput-root:hover:before": { borderBottomColor: mainColor },
    "& .MuiInput-root:after": { borderBottomColor: mainColor },
  };

  useEffect(() => {
    let timer;
    if (isVisible) {
      timer = setTimeout(() => setIsOpened(true), 10);
    } else {
      setIsOpened(false);
    }
    return () => clearTimeout(timer);
  }, [isVisible]);

  useEffect(() => {
    setInfo({
      title: title,
      details: details,
    });
  }, [title, details]);

  function handleClose() {
    setIsOpened(false);
    setTimeout(() => onClose(), 300);
  }

  function handlePopupEditing() {
    setIsOpened(false);
    onConfirm(info.title, info.details);
    setTimeout(() => {
      onClose();
    }, 300);
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
            <span className="title">Edit Task</span>
            <Box
              component="form"
              sx={{ "& > :not(style)": { m: 1, width: "100%" } }}
              noValidate
              autoComplete="off"
            >
              <TextField
                id="filled-basic"
                label="Title"
                variant="standard"
                fullWidth
                sx={textFieldSx}
                value={info.title}
                onChange={(e) => setInfo({ ...info, title: e.target.value })}
              />
              <TextField
                id="filled-basic"
                label="Details"
                variant="standard"
                fullWidth
                sx={textFieldSx}
                value={info.details}
                onChange={(e) => setInfo({ ...info, details: e.target.value })}
              />
            </Box>
            <div className="bottom">
              <span className="edit" onClick={handlePopupEditing}>
                Edit
              </span>
              <span className="cancel" onClick={handleClose}>
                Cancel
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
