import { useContext } from "react";
import { TodosContext } from "../contexts/TodosContext";
import { useToast } from "../contexts/ToastContext";

import "../styles/Task.scss";

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

export default function Task({ todo, showDelete, showEdit }) {
  const { tasks, setTasks } = useContext(TodosContext);
  const { showHideToast } = useToast();

  function handleCheckClick() {
    let message = "";
    const updatedTodos = tasks.map((t) => {
      if (t.id == todo.id) {
        if (t.isCompleted) {
          t.isCompleted = false;
          message = "Task marked as pending";
        } else {
          t.isCompleted = true;
          message = "Task marked as completed";
        }
      }
      return t;
    });
    setTasks(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
    showHideToast(`${message}.`);
  }

  return (
    <>
      <div className={"task"}>
        <div className="task-title">
          <span
            className="title"
            style={{
              textDecoration: todo.isCompleted ? "line-through" : "none",
            }}
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
            <EditIcon onClick={() => showEdit(todo)} />
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
            <DeleteOutlineIcon onClick={() => showDelete(todo)} />
          </BootstrapTooltip>
        </div>
      </div>
    </>
  );
}
