import { useState, useContext, useEffect, useMemo, useRef } from "react";
import { TodosContext } from "../contexts/TodosContext";
import { useToast } from "../contexts/ToastContext";

import "../styles/ToDoList.scss";

import "../styles/Popups.scss";

import Task from "./Task";

import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Alerting from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import { useTheme } from "@mui/material/styles";

import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import Fade from "@mui/material/Fade";

import AddCircleIcon from "@mui/icons-material/AddCircle";

import { v4 as uuidv4 } from "uuid";

import DeletingPopup from "./DeletingPopup";
import EditingPopup from "./EditingPopup";

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

export default function ToDoList() {
  const theme = useTheme();
  const { tasks, setTasks } = useContext(TodosContext);
  const { showHideToast } = useToast();
  const [formInputs, setFormInputs] = useState({
    taskTitle: "",
    taskDetails: "",
  });
  const [activeFilter, setActiveFilter] = useState(
    JSON.parse(localStorage.getItem("filter")) || "all"
  );
  const detailsInputRef = useRef(null);
  const [popupTodo, setPopupTodo] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);

  useEffect(() => {
    localStorage.setItem("filter", JSON.stringify(activeFilter));
  }, [activeFilter]);

  useEffect(() => {
    const storageTodos = JSON.parse(localStorage.getItem("todos"));
    if (storageTodos) setTasks(storageTodos);

    const storageFilter = JSON.parse(localStorage.getItem("filter"));
    if (storageFilter) setActiveFilter(storageFilter);
  }, []);

  function handleAddTaskBtn() {
    if (
      formInputs.taskTitle.trim() == "" &&
      formInputs.taskDetails.trim() == ""
    )
      return;

    const newTodo = {
      id: uuidv4(),
      title: formInputs.taskTitle,
      details: formInputs.taskDetails,
      isCompleted: false,
    };

    const updatedTodos = [...tasks, newTodo];

    setTasks(updatedTodos);

    localStorage.setItem("todos", JSON.stringify(updatedTodos));

    setFormInputs({
      taskTitle: "",
      taskDetails: "",
    });

    showHideToast("Task added successfully.");
  }

  const showTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (activeFilter == "all") return true;
      else if (activeFilter == "completed") return t.isCompleted;
      else if (activeFilter == "pending") return !t.isCompleted;
    });
  }, [tasks, activeFilter]);

  function handleDeleteClick(todo) {
    setPopupTodo(todo);
    setShowDeletePopup(true);
  }

  function handleDeletePopupClose() {
    setShowDeletePopup(false);
  }

  function handleDeleteConfirm() {
    const updatedTodos = tasks.filter((t) => t.id != popupTodo.id);
    setTimeout(() => setTasks(updatedTodos), 250);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
    showHideToast("Task deleted successfully.");
  }

  function handleEditClick(todo) {
    setPopupTodo(todo);
    setShowEditPopup(true);
  }

  function handleEditPopupClose() {
    setShowEditPopup(false);
  }

  function handleEditConfirm(newTitle, newDetails) {
    const updatedTodos = tasks.map((t) => {
      if (t.id == popupTodo.id) {
        t.title = newTitle;
        t.details = newDetails;
      }
      return t;
    });
    setTasks(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
    showHideToast("Task updated successfully.");
  }

  return (
    <>
      <DeletingPopup
        isVisible={showDeletePopup}
        onClose={handleDeletePopupClose}
        onConfirm={handleDeleteConfirm}
      />

      <EditingPopup
        title={popupTodo?.title || ""}
        details={popupTodo?.details || ""}
        isVisible={showEditPopup}
        onClose={handleEditPopupClose}
        onConfirm={handleEditConfirm}
      />

      <div className="main-container">
        <h1>My Tasks</h1>
        <hr />
        <div className="filter">
          <span
            className={`all ${activeFilter === "all" ? "active" : ""}`}
            onClick={() => setActiveFilter("all")}
          >
            All
          </span>
          <span
            className={`done ${activeFilter === "completed" ? "active" : ""}`}
            onClick={() => setActiveFilter("completed")}
          >
            Completed
          </span>
          <span
            className={`pending ${activeFilter === "pending" ? "active" : ""}`}
            onClick={() => setActiveFilter("pending")}
          >
            Pending
          </span>
        </div>
        <div className="tasks">
          {tasks.length === 0 ? (
            <Stack
              sx={{
                width: "100%",
                alignItems: "center",
              }}
              spacing={2}
            >
              <Alerting
                severity="info"
                sx={{
                  fontSize: "25px",
                  width: "fit-content",
                  "& .MuiAlert-icon": { fontSize: "36px" },
                }}
              >
                <p>No tasks? That’s suspicious!</p>
              </Alerting>
            </Stack>
          ) : (
            showTasks.map((t) => (
              <Task
                key={t.id}
                todo={t}
                showDelete={handleDeleteClick}
                showEdit={handleEditClick}
              />
            ))
          )}
        </div>
        <hr />
        <div className="add-task">
          <div className="top">
            <div>
              <BootstrapTooltip
                title={
                  formInputs.taskTitle.trim() !== "" &&
                  formInputs.taskDetails.trim() !== ""
                    ? "Click to add the task"
                    : "Please fill in both the title and details first"
                }
                placement="top"
                arrow
                slots={{
                  transition: Fade,
                }}
                slotProps={{
                  transition: { timeout: 600 },
                }}
              >
                <Stack spacing={2} direction="row">
                  <Button
                    variant="contained"
                    className={
                      formInputs.taskTitle.trim() !== "" &&
                      formInputs.taskDetails.trim() !== ""
                        ? "normal"
                        : "disabled"
                    }
                    onClick={handleAddTaskBtn}
                  >
                    <AddCircleIcon style={{ marginRight: "8px" }} />
                    Add
                  </Button>
                </Stack>
              </BootstrapTooltip>
            </div>
            <div>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  "& > :not(style)": { m: 1 },
                }}
              >
                <TextField
                  fullWidth
                  id="demo-helper-text-misaligned-no-helper"
                  label="Task Title"
                  value={formInputs.taskTitle}
                  onChange={(e) =>
                    setFormInputs({
                      ...formInputs,
                      taskTitle: e.target.value,
                    })
                  }
                  sx={{
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: theme.palette.primary.main,
                    },
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: theme.palette.primary.main,
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && detailsInputRef.current) {
                      detailsInputRef.current.focus();
                    }
                  }}
                />
              </Box>
            </div>
          </div>
          <div className="bottom">
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                "& > :not(style)": { m: 1 },
              }}
            >
              <TextField
                inputRef={detailsInputRef}
                fullWidth
                id="demo-helper-text-misaligned-no-helper"
                label="Task Details"
                value={formInputs.taskDetails}
                onChange={(e) =>
                  setFormInputs({
                    ...formInputs,
                    taskDetails: e.target.value,
                  })
                }
                sx={{
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: theme.palette.primary.main,
                  },
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: theme.palette.primary.main,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (
                      formInputs.taskTitle.trim() !== "" &&
                      formInputs.taskDetails.trim() !== ""
                    ) {
                      handleAddTaskBtn();
                    }
                  }
                }}
              />
            </Box>
          </div>
        </div>
      </div>
    </>
  );
}
