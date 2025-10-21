import { createContext, useContext, useReducer } from "react";
import TasksReducer from "../reducers/TasksReducer";

const TodosContext = createContext([]);

const TodosProvider = ({ children }) => {
  const [tasks, todosDispatch] = useReducer(TasksReducer, []);
  return (
    <TodosContext.Provider value={{ tasks: tasks, dispatch: todosDispatch }}>
      {children}
    </TodosContext.Provider>
  );
};

// eslint-disable-next-line
export const useTasks = () => {
  return useContext(TodosContext);
};

export default TodosProvider;