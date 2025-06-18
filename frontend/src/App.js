import { useEffect, useState } from "react";
import "./App.css";
import { api } from "./service/apiService";

function App() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState(null);

  function getTasks() {
    api.get("tarefas").then((response) => {
      const tasks = response.data.map((task) => {
        return {
          _id: task._id,
          title: task.titulo,
          description: task.descricao,
          finished: task.status !== "ativo",
        };
      });
      setTasks(tasks);

      const value = sessionStorage.getItem("filter");

      if (value === "Todos" || value === null) {
        setFilteredTasks(null);
        return;
      }

      if (value === "Pendentes") {
        setFilteredTasks(tasks.filter((task) => !task.finished));
        return;
      }

      setFilteredTasks(tasks.filter((task) => task.finished));
    });
  }

  function createTask(title, description) {
    api
      .post("tarefas", {
        titulo: title,
        status: "ativo",
        descricao: description,
      })
      .then(() => {
        getTasks();
      });
  }

  function finishTask(id) {
    api.put(`mudarStatus/${id}`).then(() => {
      getTasks();
    });
  }

  function filter(e) {
    const value = e.target.value;
    sessionStorage.setItem("filter", e.target.value);
    if (value === "Todos") {
      setFilteredTasks(null);
      return;
    }

    if (value === "Pendentes") {
      setFilteredTasks(tasks.filter((task) => !task.finished));
      return;
    }

    setFilteredTasks(tasks.filter((task) => task.finished));
  }

  useEffect(() => {
    getTasks();
  }, []);

  return (
    <div>
      <div className="create-container">
        <input id="title"></input>
        <input id="description"></input>
        <button
          onClick={() =>
            createTask(
              document.getElementById("title").value,
              document.getElementById("description").value
            )
          }
        >
          Salvar
        </button>
        <select
          onChange={(e) => filter(e)}
          value={sessionStorage.getItem("filter")}
        >
          <option>Todos</option>
          <option>Concluídos</option>
          <option>Pendentes</option>
        </select>
      </div>
      <div className="card-layout">
        {(filteredTasks || tasks).map((task, idx) => (
          <div
            className={`card ${task.finished ? "finished" : ""}`}
            key={task._id}
          >
            <div className="header">
              {task.title}
              <div
                className={`checkbox`}
                onClick={() => {
                  finishTask(task._id);
                }}
              />
            </div>
            <div className="card-content">{task.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
