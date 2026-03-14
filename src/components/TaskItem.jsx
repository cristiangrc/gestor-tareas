import { useState } from "react";

function TaskItem({ task, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  
  // 1. Añadimos estados para ambos campos
  const [newTitle, setNewTitle] = useState(task.title);
  const [newDescription, setNewDescription] = useState(task.descripcion || "");

  const handleEliminar = () => {
    onDelete(task.id);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  // 2. Enviamos ambos campos al servidor al guardar
  const handleSave = () => {
    onUpdate(task.id, { 
      title: newTitle, 
      descripcion: newDescription 
    });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="task-item">
        <div className="task-info" >
          <input 
            className="login-input"
            value={newTitle} 
            placeholder="Título"
            onChange={(e) => setNewTitle(e.target.value)} 
          />
          <textarea 
            className="login-input"
            value={newDescription} 
            placeholder="Descripción"
            onChange={(e) => setNewDescription(e.target.value)} 
          />
        </div>
        <div className="task-actions" >
          <button onClick={handleSave} className="btn-edit">Save</button>
          <button onClick={() => setIsEditing(false)} className="btn-delete">Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="task-item">
      <div className="task-info">
        <h3>{task.title}</h3>

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