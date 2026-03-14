import { useState } from "react";

function ResetPassword() {
  const [token, setToken] = useState("");
  const [newpassword, setNewPassword] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newpassword }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("¡Contraseña actualizada! Ya puedes iniciar sesión.");
       
        window.location.href = "/login";
      } else {
        alert(data.error || "Token inválido o error al actualizar");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form className="login-container" onSubmit={handleReset}>
      <h2 className="login-title">Nueva Contraseña</h2>
      
      <input
        className="login-input"
        type="text"
        placeholder="Introduce el Token que recibiste"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        required
      />

      <input
        className="login-input"
        type="password"
        placeholder="Tu nueva contraseña"
        value={newpassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
      />
      
      <button type="submit" className="login-button">Cambiar Contraseña</button>
    </form>
  );
}

export default ResetPassword;