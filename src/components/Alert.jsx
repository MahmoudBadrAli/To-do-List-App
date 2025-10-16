import { useEffect, useState } from "react";

import "../styles/Alert.scss";

import TaskAltIcon from "@mui/icons-material/TaskAlt";

export default function Alert({ message, isVisible }) {
  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => {
      setIsShown(true);
    }, 10);

    const hideTimer = setTimeout(() => {
      setIsShown(false);
    }, 2000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [isVisible]);

  return (
    <>
      <div className="alert" style={{ bottom: isShown ? "89%" : "100%" }}>
        <TaskAltIcon />
        {message}
      </div>
    </>
  );
}
