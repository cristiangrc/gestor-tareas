import React from 'react';
import TaskItem from './TaskItem';

function TaskList({ tasks, onDelete, onUpdate }) {
  return (
    <div className="task-container">
      <h2>MIS TAREAS</h2>
      <div className="task-list-wrapper">
        {tasks.length === 0 ? (
          <p className="empty-msg">No hay tareas pendientes</p>
        ) : (
          tasks.map(task => (
            <TaskItem 
              key={task.id} // Identificador único necesario para que React gestione bien la lista
              task={task}   // Pasamos el objeto completo de la tarea
              onDelete={onDelete} // Pasamos la función para eliminar hacia abajo
              onUpdate={onUpdate} // Pasamos la función para actualizar hacia abajo
            />
          ))
        )}
      </div>
    </div>
  );
}

export default TaskList;