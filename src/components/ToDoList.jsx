import { useState, useContext, useEffect, useRef } from "react";
import { TodosContext } from "../contexts/TodosContext";

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

  const [formInputs, setFormInputs] = useState({
    taskTitle: "",
    taskDetails: "",
  });

  const [activeFilter, setActiveFilter] = useState(
    JSON.parse(localStorage.getItem("filter")) || "all"
  );

  const detailsInputRef = useRef(null);

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
  }

  const showTasks = tasks.filter((t) => {
    if (activeFilter == "all") return t;
    else if (activeFilter == "completed") return t.isCompleted == true;
    else if (activeFilter == "pending") return t.isCompleted == false;
  });

  return (
    <>
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
            showTasks.map((t) => <Task key={t.id} todo={t} />)
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
                  if (e.key === "Enter") handleAddTaskBtn();
                }}
              />
            </Box>
          </div>
        </div>
      </div>
    </>
  );
}
