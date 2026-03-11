import { useState } from "react";

function TaskItem({ task, onDelete, onUpdate }) {
  // Estado para controlar si estamos viendo el texto o el input de edición
  const [isEditing, setIsEditing] = useState(false);
  // Estado para manejar el texto del input mientras el usuario edita
  const [newTitle, setNewTitle] = useState(task.title);

  // Aunque el botón no esté, esta función cambia el estado de completado en la DB
  const handleComplete = () => {
    onUpdate(task.id, { completed: !task.completed });
  };

  // Llama a la función de eliminar pasando el ID de esta tarea específica
  const handleEliminar = () => {
    onDelete(task.id);
  };

  // Activa el modo edición para mostrar el input
  const handleEdit = () => {
    setIsEditing(true);
  };

  // Guarda los cambios, envía el nuevo título al servidor y cierra el modo edición
  const handleSave = () => {
    onUpdate(task.id, { title: newTitle });
    setIsEditing(false);
  };

  // Renderizado condicional: Si isEditing es true, muestra el formulario de edición
  if (isEditing) {
    return (
      <div className="task-item">
        <div className="task-info">
          <input 
            className="edit-input"
            value={newTitle} 
            onChange={(e) => setNewTitle(e.target.value)} 
          />
        </div>
        <div className="task-actions">
          <button onClick={handleSave} className="btn-edit">Save</button>
          <button onClick={() => setIsEditing(false)} className="btn-delete">Cancel</button>
        </div>
      </div>
    );
  }

 // Muestra la información de la tarea
  return (
    <div className="task-item">
      <div className="task-info">
        <h3>{task.title}</h3>
        {/* Solo muestra el párrafo si existe una descripción */}
        {task.descripcion && <p>{task.descripcion}</p>}
      </div>
      <div className="task-actions">
        <button onClick={handleEdit} className="btn-edit">Edit</button>
        <button onClick={handleEliminar} className="btn-delete">Delete</button>
      </div>
    </div>
  );
}

export default TaskItem;