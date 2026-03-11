import { useState } from 'react';

function TaskForm({ onAdd }) {
  // Estados locales para capturar el texto del título y la descripción
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  // Función que maneja el envío del formulario
  const handleSubmit = (e) => {
    
    e.preventDefault();

    // Llama a la función onAdd recibida por props enviando el objeto con los datos
    onAdd({ title, descripcion: desc });

    // Limpia los campos del formulario después de agregar la tarea
    setTitle('');
    setDesc('');
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      {/* Campo de entrada para el título - es obligatorio (required) */}
      <input
        placeholder="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      {/* Campo de texto multilínea para la descripción opcional */}
      <textarea
        placeholder="Descripción"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />

      {/* El botón de tipo submit activa el evento onSubmit del formulario */}
      <button type="submit">Agregar</button>
    </form>
  );
}

export default TaskForm;


