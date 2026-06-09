import { useEffect, useState } from "react";
import "./App.css";

type Task = {
  id: number;
  title: string;
  completed: boolean;
  completedDate: string | null;
};

type TaskRequestDto = {
  title: string;
};

const API_URL = "https://todolist-backend-c81u.onrender.com/api/tasks";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState<string>("");
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [showCompleted, setShowCompleted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const activeTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  useEffect(() => {
    getTasks();
  }, []);

  const getTasks = async () => {
    try {
      setLoading(true);

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Ошибка при получении задач");
      }

      const data: Task[] = await response.json();
      setTasks(data);
    } catch (error) {
      console.error(error);
      alert("Не удалось загрузить задачи");
    } finally {
      setLoading(false);
    }
  };

  const createTask = async () => {
    if (newTaskTitle.trim() === "") return;

    const requestBody: TaskRequestDto = {
      title: newTaskTitle,
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Ошибка при создании задачи");
      }

      const createdTask: Task = await response.json();

      setTasks([createdTask, ...tasks]);
      setNewTaskTitle("");
      setIsAdding(false);
    } catch (error) {
      console.error(error);
      alert("Не удалось создать задачу");
    }
  };

  const completeTask = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/${id}/complete`, {
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error("Ошибка при выполнении задачи");
      }

      const updatedTask: Task = await response.json();

      setTasks(
        tasks.map((task) => (task.id === id ? updatedTask : task))
      );
    } catch (error) {
      console.error(error);
      alert("Не удалось выполнить задачу");
    }
  };

  const returnTaskBack = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/${id}/return`, {
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error("Ошибка при возврате задачи");
      }

      const updatedTask: Task = await response.json();

      setTasks(
        tasks.map((task) => (task.id === id ? updatedTask : task))
      );
    } catch (error) {
      console.error(error);
      alert("Не удалось вернуть задачу");
    }
  };

  const deleteTask = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Ошибка при удалении задачи");
      }

      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error(error);
      alert("Не удалось удалить задачу");
    }
  };

  return (
    <div className="page">
      <div className="todo-card">
        <div className="todo-header">
          <h1>Мои задачи</h1>
          <button className="menu-button">⋮</button>
        </div>

        <button className="add-button" onClick={() => setIsAdding(true)}>
          <span className="add-icon">☑</span>
          <span>Добавить задачу</span>
        </button>

        {isAdding && (
          <div className="add-box">
            <input
              type="text"
              placeholder="Название задачи"
              value={newTaskTitle}
              onChange={(event) => setNewTaskTitle(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  createTask();
                }
              }}
              autoFocus
            />

            <div className="add-actions">
              <button onClick={() => setIsAdding(false)}>Отмена</button>
              <button className="save-button" onClick={createTask}>
                Сохранить
              </button>
            </div>
          </div>
        )}

        {loading && <p className="loading-text">Загрузка...</p>}

        <div className="task-list">
          {activeTasks.map((task) => (
            <div className="task-item" key={task.id}>
              <button
                className="circle-button"
                onClick={() => completeTask(task.id)}
              />

              <span className="task-title">{task.title}</span>

              <button
                className="delete-button"
                onClick={() => deleteTask(task.id)}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div className="completed-header">
          <button
            className={showCompleted ? "arrow-button open" : "arrow-button"}
            onClick={() => setShowCompleted(!showCompleted)}
          >
            ▶
          </button>

          <span>{completedTasks.length} задач выполнено</span>
        </div>

        {showCompleted && (
          <div className="completed-list">
            {completedTasks.map((task) => (
              <div className="completed-item" key={task.id}>
                <button
                  className="check-button"
                  onClick={() => returnTaskBack(task.id)}
                >
                  ✓
                </button>

                <div className="completed-info">
                  <p className="completed-title">{task.title}</p>

                  {task.completedDate && (
                    <p className="completed-date">
                      Выполнена: {task.completedDate}
                    </p>
                  )}
                </div>

                <button
                  className="delete-button"
                  onClick={() => deleteTask(task.id)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;