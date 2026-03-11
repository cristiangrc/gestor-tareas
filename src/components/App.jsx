import { useState, useEffect } from "react";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";

function App() {
  
  // Estado para almacenar la lista de tareas
  const [tasks, setTasks] = useState([]);

  // useEffect que se ejecuta una sola vez al cargar el componente para traer las tareas
  useEffect(() => {
    fetch('/api/tareas')
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.log("Error al cargar tareas:", err));
  }, []);

  // Función para agregar una nueva tarea a la base de datos y al estado local
  const addTask = async (newTask) => {
    const res = await fetch('/api/tareas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask)
    });
    const data = await res.json();
    // Actualizamos el estado agregando la nueva tarea al principio de la lista
    setTasks([data, ...tasks]);
  };

  // Función para borrar una tarea por su ID
  const deleteTask = async (id) => {
    await fetch(`/api/tareas/${id}`, { method: 'DELETE' });
    // Filtramos el estado para quitar la tarea eliminada sin recargar la página
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Función para actualizar los datos de una tarea (como el título o descripción)
  const updateTask = async (id, updatedTask) => {
    const res = await fetch(`/api/tareas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTask)
    });
    const data = await res.json();
    // Recorremos las tareas y reemplazamos solo la que coincida con el ID actualizado
    setTasks(tasks.map(task => task.id === id ? data : task));
  };

  return (
    <div className="App">
      <h1>GESTOR DE TAREAS</h1>
      <TaskForm onAdd={addTask} />
      <TaskList 
        tasks={tasks} 
        onDelete={deleteTask}
        onUpdate={updateTask}
      />
    </div>
  );
}

export default App;