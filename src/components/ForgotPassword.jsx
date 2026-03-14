import { useState } from "react";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSendEmail = async (e) => {
    e.preventDefault();
    
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("¡Éxito! Revisa tu correo para obtener el token de recuperación.");
      } else {
        alert(data.error || "Error al enviar el correo");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form className="login-container" onSubmit={handleSendEmail}>
      <h2 className="login-title">Recuperar Contraseña</h2>
      <p style={{textAlign: 'center', fontSize: '0.9rem'}}>Introduce tu email para enviarte un token.</p>
      
      <input
        className="login-input"
        type="email"
        placeholder="Tu correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      
      <button type="submit" className="login-button">Enviar Token</button>
    </form>
  );
}

export default ForgotPassword;