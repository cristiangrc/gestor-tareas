import { useState, useEffect } from "react";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import Login from "./login";
import Registro from "./Registro";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";

function App() {
 
  const [tasks, setTasks] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token"));
  
  
  const [vista, setVista] = useState("login");

  // 2. CARGAR TAREAS AL INICIAR (Si hay token)
  useEffect(() => {
    if (token) {
      fetch('/api/tareas', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setTasks(data);
          }
        })
        .catch(err => console.log("Error al cargar tareas:", err));
    }
  }, [token]);

  
  const addTask = async (newTask) => {
    const res = await fetch('/api/tareas', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(newTask)
    });
    const data = await res.json();
    setTasks([data, ...tasks]);
  };

  const deleteTask = async (id) => {
    await fetch(`/api/tareas/${id}`, { 
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    setTasks(tasks.filter(task => task.id !== id));
  };

  const updateTask = async (id, updatedTask) => {
    const res = await fetch(`/api/tareas/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(updatedTask)
    });
    const data = await res.json();
    setTasks(tasks.map(task => task.id === id ? data : task));
  };

  // 4. CERRAR SESIÓN
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };


  // Si NO hay token: Mostramos la vista seleccionada
  if (!token) {
    return (
      <div className="App">
        {vista === "login" && (
          <>
            <Login />
            <p className="login-footer">
              <button className="link-button" onClick={() => setVista("registro")}>¿No tienes cuenta? Regístrate</button>
              <span> | </span>
              <button className="link-button" onClick={() => setVista("recuperar")}>¿Olvidaste tu contraseña?</button>
            </p>
          </>
        )}
        {vista === "registro" && (
          <>
            <Registro />
            <p className="login-footer">
              <button className="link-button" onClick={() => setVista("login")}>¿Ya tienes cuenta? Inicia sesión</button>
            </p>
          </>
        )}
        {vista === "recuperar" && (
          <>
            <ForgotPassword />
            <p className="login-footer">
              <button className="link-button" onClick={() => setVista("resetear")}>Ya tengo el token</button>
              <span> | </span>
              <button className="link-button" onClick={() => setVista("login")}>Volver</button>
            </p>
          </>
        )}
        {vista === "resetear" && (
          <>
            <ResetPassword />
            <p className="login-footer">
              <button className="link-button" onClick={() => setVista("login")}>Volver al Login</button>
            </p>
          </>
        )}
      </div>
    );
  }

  // Si HAY token: Mostramos el Gestor de Tareas
  return (
    <div className="App">
      <header>
        <h1>GESTOR DE TAREAS</h1>
        <button onClick={handleLogout} className="login-button2" >
          Cerrar Sesión
        </button>
      </header>

      <main>
        <TaskForm onAdd={addTask} />
        <TaskList 
          tasks={tasks} 
          onDelete={deleteTask}
          onUpdate={updateTask}
        />
      </main>
    </div>
  );
}

export default App;