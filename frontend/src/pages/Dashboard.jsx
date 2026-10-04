import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Dashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [message, setMessage] = useState("");

  const [darkMode, setDarkMode] = useState(
  localStorage.getItem("darkMode") === "true"
);

  useEffect(() => {
  document.body.classList.toggle("dark-body", darkMode);

  return () => {
    document.body.classList.remove("dark-body");
  };
}, [darkMode]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
  });

  const [editingTask, setEditingTask] = useState(null);

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.status === "COMPLETED"
    ).length;

  const pendingTasks = tasks.filter(
    (task) => task.status !== "COMPLETED"
    ).length;
  

  const filteredTasks = tasks.filter((task) => {
      if (filter === "COMPLETED") {
        return task.status === "COMPLETED";
      }

      if (filter === "PENDING") {
        return task.status !== "COMPLETED";
      }

      return true;
    });

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await API.get("/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTasks(response.data.tasks);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to load tasks"
      );
    }
  };
  
  useEffect(() => {
  const verifyToken = async () => {
    try {
      await API.get("/auth/me");
    } catch (error) {
      localStorage.removeItem("token");
      navigate("/login", { replace: true });
    }
  };

  verifyToken();
}, [navigate]);


  useEffect(() => {
    fetchTasks();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (editingTask) {
        await API.put(
          `/tasks/${editingTask.id}`,
          {
            title: formData.title,
            description: formData.description,
            priority: formData.priority,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setMessage("Task updated successfully!");
        setEditingTask(null);
      } else {
        await API.post("/tasks", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setMessage("Task created successfully!");
      }

      setFormData({
        title: "",
        description: "",
        priority: "MEDIUM",
      });

      fetchTasks();
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Operation failed"
      );
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);

    setFormData({
      title: task.title,
      description: task.description || "",
      priority: task.priority,
    });

    setMessage("");
  };

  const handleComplete = async (task) => {
    try {
      const token = localStorage.getItem("token");

      await API.put(
        `/tasks/${task.id}`,
        {
          status: "COMPLETED",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Task marked as completed!");
      fetchTasks();
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to complete task"
      );
    }
  };

  const handleDelete = async (taskId) => {
    try {
      const token = localStorage.getItem("token");

      await API.delete(`/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("Task deleted successfully!");
      fetchTasks();
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to delete task"
      );
    }
  };

  const handleCancelEdit = () => {
    setEditingTask(null);

    setFormData({
      title: "",
      description: "",
      priority: "MEDIUM",
    });

    setMessage("");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleDarkMode = () => {
  const newMode = !darkMode;

  setDarkMode(newMode);
  localStorage.setItem("darkMode", newMode);
};

  return (
    <div className={`app-container ${darkMode ? "dark-mode" : ""}`}>

      {/* NAVBAR */}
      <header className="navbar">
        <div className="logo">
            TaskFlow
        </div>

        <div className="nav-buttons">

        <button
            className="theme-button"
            onClick={toggleDarkMode}
        >
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>

        <button
            className="logout-button"
            onClick={handleLogout}
        >
            Logout
        </button>

      </div>
    </header>

      {/* MAIN CONTENT */}
      <main className="main-content">

        <div className="page-header">
          <div>
            <h1>My Tasks</h1>
            <p>Manage your tasks and stay productive.</p>
          </div>
        </div>

        {/* MESSAGE */}
        {message && (
          <div className="message">
            {message}
          </div>
        )}

        {/* TASK FORM */}
        <section className="task-form-card">

          <h2>
            {editingTask ? "Edit Task" : "Add New Task"}
          </h2>

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label>Task Title</label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter task title"
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your task"
              />
            </div>

            <div className="form-group">
              <label>Priority</label>

              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>

            <div className="form-buttons">

              <button
                type="submit"
                className="primary-button"
              >
                {editingTask ? "Update Task" : "Add Task"}
              </button>

              {editingTask && (
                <button
                  type="button"
                  className="secondary-button"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
              )}

            </div>

          </form>

        </section>

        <div className="task-stats">

          <div className="stat-card">
            <h3>Total</h3>
            <p>{totalTasks}</p>
          </div>

          <div className="stat-card">
            <h3>Pending</h3>
            <p>{pendingTasks}</p>
          </div>

          <div className="stat-card">
            <h3>Completed</h3>
            <p>{completedTasks}</p>
          </div>

        </div>

        <div className="task-filters">

          <button
            className={filter === "ALL" ? "active-filter" : ""}
            onClick={() => setFilter("ALL")}
          >     
            All
          </button>

          <button
            className={filter === "PENDING" ? "active-filter" : ""}
            onClick={() => setFilter("PENDING")}
          >
            Pending
          </button>

          <button
            className={filter === "COMPLETED" ? "active-filter" : ""}
            onClick={() => setFilter("COMPLETED")}
          >
            Completed
          </button>

        </div>

        {/* TASK LIST */}
        <section className="tasks-section">

          <div className="section-header">
            <h2>Your Tasks</h2>

            <span className="task-count">
              {tasks.length} tasks
            </span>
          </div>

          {tasks.length === 0 ? (

            <div className="empty-state">
              <h3>No tasks yet</h3>
              <p>
                Create your first task using the form above.
              </p>
            </div>

          ) : (

            <div className="task-grid">

              {filteredTasks.map((task) => (

                <div
                  className="task-card"
                  key={task.id}
                >

                  <div className="task-card-header">

                    <h3>{task.title}</h3>

                    <span
                      className={`priority ${task.priority.toLowerCase()}`}
                    >
                      {task.priority}
                    </span>

                  </div>

                  <p className="task-description">
                    {task.description || "No description"}
                  </p>

                  <div className="task-status">

                    <span>
                      Status:
                    </span>

                    <span
                      className={
                        task.status === "COMPLETED"
                          ? "completed"
                          : "pending"
                      }
                    >
                      {task.status}
                    </span>

                  </div>

                  <div className="task-actions">

                    {task.status !== "COMPLETED" && (
                      <button
                        className="complete-button"
                        onClick={() =>
                          handleComplete(task)
                        }
                      >
                        Complete
                      </button>
                    )}

                    <button
                      className="edit-button"
                      onClick={() =>
                        handleEdit(task)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="delete-button"
                      onClick={() =>
                        handleDelete(task.id)
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default Dashboard;