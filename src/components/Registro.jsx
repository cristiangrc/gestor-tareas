import { useState } from "react";

function Registro() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegistro = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/registro", {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("¡Usuario registrado con éxito! Ahora puedes iniciar sesión.");
         window.location.href = "/login";
      } else {
        
        alert(data.error || "Error al registrarse");
      }
    } catch (error) {
      console.error("Error al conectar con el servidor", error);
      alert("No se pudo conectar con el servidor");
    }
  };

  return (
    <form className="login-container" onSubmit={handleRegistro}>
      <h2 className="login-title">Crear Cuenta</h2>
      
      <input
        className="login-input"
        type="text"
        placeholder="Nombre completo"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />

      <input
        className="login-input"
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        className="login-input"
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit" className="login-button">
        Registrarse
      </button>
      
      <p>
        ¿Ya tienes cuenta? <a href="/login">Inicia sesión aquí</a>
      </p>
    </form>
  );
}

export default Registro;