import { useState,useEffect } from "react";


function Login () {

const [email,setEmail] = useState("")
const [password,setPassword] = useState("")

const handleLogin = async (e) => {
    e.preventDefault();

try {
    
    const res = await fetch ("/api/auth/login", {
        method: "post",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    const data = await res.json(); // Convertimos la respuesta a objeto

if (res.ok) {
    // Si el login es correcto, guardamos el token
    localStorage.setItem("token", data.token);
    alert("Login exitoso");
    window.location.href = "/"
} else {
   
    alert(data.error || "Error al iniciar sesión");
}

} catch (error) {
    console.error("error al conectar",error)
}

}


return (

    <form className="login-container" onSubmit={handleLogin}>
    <h2 className="login-title">Iniciar Sesión</h2>
        <input
            className="login-input"
            type="email" 
            placeholder="Correo electrónico" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            />

        <input 
            className="login-input"
            type="password" 
            placeholder="Contraseña" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
        />
        <button type="submit" className="login-button">Entrar</button>

    <div className = "forgot">
        <a href="/"></a>
       
        
    </div> 
    </form>
)

}


export default Login;

