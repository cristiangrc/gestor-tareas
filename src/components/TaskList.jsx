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
              key={task.id} 
              task={task}   
              onDelete={onDelete} 
              onUpdate={onUpdate} 
            />
          ))
        )}
      </div>
    </div>
  );
}

export default TaskList;