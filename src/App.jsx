import "./App.css";
import ToDoList from "./components/ToDoList";
import { ToastProvider } from "./contexts/ToastContext";
import TodosProvider from "./contexts/TodosContext";
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
  return (
    <>
      <ThemeProvider theme={theme}>
        <TodosProvider>
          <ToastProvider>
            <ToDoList />
          </ToastProvider>
        </TodosProvider>
      </ThemeProvider>
    </>
  );
}
export default App;
