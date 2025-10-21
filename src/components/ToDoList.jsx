import { useState, useEffect, useMemo, useRef } from "react";
import { useTasks } from "../contexts/TodosContext";
import { useToast } from "../contexts/ToastContext";
import TasksReducer from "../reducers/TasksReducer";

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

const emptyListMessages = [
  "No tasks? That’s suspicious! 👀",
  "All done? You’re unstoppable! 💪",
  "Nothing to do? Take a nap, you earned it 😴",
  "No tasks… are you sure you’re okay? 😅",
  "Empty list, full peace of mind 🌿",
  "All clear! You’re basically a productivity ninja 🗡️",
  "Tasks? Never heard of them 😎",
  "You’re free! Go touch some grass 🌱",
  "Zero tasks — zero stress 💆‍♂️",
  "Did you just finish everything?! Teach me your ways 🙌",
  "An empty list today, a fresh start tomorrow 🌅",
  "Every big goal starts with one small task ✨",
  "You’ve earned your break — go celebrate 🎉",
  "Peace, calm, and no tasks in sight 🕊️",
  "Enjoy the quiet before the next storm of productivity ☕",
];

export default function ToDoList() {
  const theme = useTheme();
  const { tasks, dispatch } = useTasks();
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
  const [emptyMessage, setEmptyMessage] = useState("");

  useEffect(() => {
    localStorage.setItem("filter", JSON.stringify(activeFilter));
  }, [activeFilter]);

  useEffect(() => {
    dispatch({ type: "get" });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (tasks.length === 0)
      setEmptyMessage(
        emptyListMessages[Math.floor(Math.random() * emptyListMessages.length)]
      );
  }, [tasks.length]);

  function handleAddTaskBtn() {
    if (
      formInputs.taskTitle.trim() == "" &&
      formInputs.taskDetails.trim() == ""
    ) {
      return;
    } else {
      dispatch({
        type: "added",
        payload: {
          formInputs: {
            taskTitle: formInputs.taskTitle,
            taskDetails: formInputs.taskDetails,
          },
        },
      });
      setFormInputs({
        taskTitle: "",
        taskDetails: "",
      });
      showHideToast("Task added successfully.");
    }
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
    dispatch({
      type: "deleted",
      payload: {
        id: popupTodo.id,
      },
    });
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
    dispatch({
      type: "updated",
      payload: {
        id: popupTodo.id,
        newTitle: newTitle,
        newDetails: newDetails,
      },
    });
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
                icon={false}
                sx={{
                  fontSize: "25px",
                  width: "fit-content",
                  backgroundColor: "#03a9f4",
                  "& .MuiAlert-icon": { fontSize: "36px" },
                }}
              >
                <p>{emptyMessage}</p>
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
