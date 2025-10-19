import "../styles/Toast.scss";

import TaskAltIcon from "@mui/icons-material/TaskAlt";

export default function Toast({ isVisible, message }) {
  return (
    <>
      <div className={`alert ${isVisible ? "opened" : ""}`}>
        <TaskAltIcon />
        {message}
      </div>
    </>
  );
}
