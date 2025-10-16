import { useState, useContext } from "react";
import { TodosContext } from "../contexts/TodosContext";

import "../styles/Task.scss";

import EditingPopup from "./EditingPopup";
import DeletingPopup from "./DeletingPopup";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import DangerousIcon from "@mui/icons-material/Dangerous";

import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import Fade from "@mui/material/Fade";

const BootstrapTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
    fontSize: "0.9rem",
  },
}));

export default function Task({ todo }) {
  const { tasks, setTasks } = useContext(TodosContext);

  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);

  function handleCheckClick() {
    const updatedTodos = tasks.map((t) => {
      if (t.id == todo.id) t.isCompleted = !t.isCompleted;
      return t;
    });
    setTasks(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  }

  function handleDeleteClick() {
    setShowDeletePopup(true);
  }

  function handleDeletePopupClose() {
    setShowDeletePopup(false);
  }

  function handleDeleteConfirm() {
    const updatedTodos = tasks.filter((t) => t.id != todo.id);
    setTimeout(() => setTasks(updatedTodos), 250);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  }

  function handleEditClick() {
    setShowEditPopup(true);
  }

  function handleEditPopupClose() {
    setShowEditPopup(false);
  }

  function handleEditConfirm(newTitle, newDetails) {
    const updatedTodos = tasks.map((t) => {
      if (t.id == todo.id) {
        t.title = newTitle;
        t.details = newDetails;
      }
      return t;
    });
    setTasks(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  }

  return (
    <>
      <DeletingPopup
        isVisible={showDeletePopup}
        onClose={handleDeletePopupClose}
        onConfirm={handleDeleteConfirm}
      />
      <EditingPopup
        title={todo.title}
        details={todo.details}
        isVisible={showEditPopup}
        onClose={handleEditPopupClose}
        onConfirm={handleEditConfirm}
      />
      <div className={"task"}>
        <div className="task-title">
          <span
            className="title"
            style={{ textDecoration: todo.isCompleted ? "line-through" : "none" }}
          >
            {todo.title}
          </span>
          <span className="details">{todo.details}</span>
        </div>
        <div className="task-actions">
          <BootstrapTooltip
            title="Mark as Completed"
            placement="top"
            arrow
            slots={{
              transition: Fade,
            }}
            slotProps={{
              transition: { timeout: 600 },
            }}
            sx={{
              display: todo.isCompleted ? "none" : "block",
            }}
          >
            <CheckIcon
              style={{ display: todo.isCompleted ? "none" : "block" }}
              onClick={handleCheckClick}
            />
          </BootstrapTooltip>

          <BootstrapTooltip
            title="Mark as Pending"
            placement="top"
            arrow
            slots={{
              transition: Fade,
            }}
            slotProps={{
              transition: { timeout: 600 },
            }}
            sx={{
              display: todo.isCompleted ? "block" : "none",
            }}
          >
            <DangerousIcon
              style={{ display: todo.isCompleted ? "block" : "none" }}
              onClick={handleCheckClick}
            />
          </BootstrapTooltip>

          <BootstrapTooltip
            title="Edit Task"
            placement="top"
            arrow
            slots={{
              transition: Fade,
            }}
            slotProps={{
              transition: { timeout: 600 },
            }}
          >
            <EditIcon onClick={handleEditClick} />
          </BootstrapTooltip>

          <BootstrapTooltip
            title="Delete Task"
            placement="top"
            arrow
            slots={{
              transition: Fade,
            }}
            slotProps={{
              transition: { timeout: 600 },
            }}
          >
            <DeleteOutlineIcon onClick={handleDeleteClick} />
          </BootstrapTooltip>
        </div>
      </div>
    </>
  );
}
