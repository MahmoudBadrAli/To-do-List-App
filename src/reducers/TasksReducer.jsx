import { v4 as uuidv4 } from "uuid";

export default function TasksReducer(currentTaks, action) {
  switch (action.type) {
    case "added": {
      const newTodo = {
        id: uuidv4(),
        title: action.payload.formInputs.taskTitle,
        details: action.payload.formInputs.taskDetails,
        isCompleted: false,
      };
      const updatedTodos = [...currentTaks, newTodo];
      localStorage.setItem("todos", JSON.stringify(updatedTodos));
      return updatedTodos;
    }
    case "deleted": {
      const updatedTodos = currentTaks.filter((t) => t.id != action.payload.id);
      localStorage.setItem("todos", JSON.stringify(updatedTodos));
      return updatedTodos;
    }
    case "updated": {
      const updatedTodos = currentTaks.map((t) => {
        if (t.id == action.payload.id) {
          t.title = action.payload.newTitle;
          t.details = action.payload.newDetails;
        }
        return t;
      });
      localStorage.setItem("todos", JSON.stringify(updatedTodos));
      return updatedTodos;
    }
    case "get": {
      const storageTodos = JSON.parse(localStorage.getItem("todos"));
      if (storageTodos) return storageTodos;

      const storageFilter = JSON.parse(localStorage.getItem("filter"));
      if (storageFilter) return storageFilter;
    }
    // eslint-disable-next-line no-fallthrough
    case "checkStatus": {
      const updatedTodos = currentTaks.map((t) => {
        if (t.id == action.payload.id) {
          const updatedTodo = { ...t, isCompleted: !t.isCompleted };
          return updatedTodo;
        }
        return t;
      });
      localStorage.setItem("todos", JSON.stringify(updatedTodos));
      return updatedTodos;
    }
    default: {
      throw Error("Unknown Action: " + action.type);
    }
  }
}
