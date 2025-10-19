import { useState } from "react";
import "./App.css";
import ToDoList from "./components/ToDoList";
import { TodosContext } from "./contexts/TodosContext";
import { ToastProvider } from "./contexts/ToastContext";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "Quicksand, sans-serif",
  },
  palette: {
    primary: {
      main: "#283593",
    },
  },
});

function App() {
  const [tasks, setTasks] = useState([]);

  return (
    <>
      <ThemeProvider theme={theme}>
        <ToastProvider>
          <TodosContext.Provider value={{ tasks, setTasks }}>
            <ToDoList />
          </TodosContext.Provider>
        </ToastProvider>
      </ThemeProvider>
    </>
  );
}
export default App;
