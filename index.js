import express from "express";
import cors from "cors"
import pg from "pg"
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";


dotenv.config();
const app = express();
const port = 3000;

app.use(cors());
app.use(express.static("public"));
app.use(express.json());

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

db.connect()
  .then(()=>console.log("conectado exitosamente a la bd"))
  .catch(error => {
    console.error(" error al conectarse ", error.message);
    process.exit(1);
  });

  const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).json({ error: "Token requerido" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Token inválido" });
    req.user = decoded; // Aquí guardamos el ID del usuario para las rutas
    next();
  });
};

  app.post("/api/auth/registro", async (req, res) => {
  const { nombre, email, password } = req.body;
  try {
    // 1. Encriptar contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 2. Guardar en la DB
    const result = await db.query(
      "INSERT INTO usuarios (nombre, email, password) VALUES ($1, $2, $3) RETURNING id, email",
      [nombre, email, hashedPassword]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error al registrar usuario (posible email duplicado)" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // 1. Buscar al usuario
    const result = await db.query("SELECT * FROM usuarios WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const user = result.rows[0];

    // 2. Comparar la contraseña enviada con la encriptada
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // 3. Generar el Token (JWT)
    const token = jwt.sign(
      { id: user.id, email: user.email }, 
      process.env.JWT_SECRET, 
      { expiresIn: '2h' } // El token expira en 2 horas
    );

    res.json({ message: "Login exitoso", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/auth/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    // 1. Generar un token aleatorio
    const resetToken = crypto.randomBytes(32).toString("hex");

    // 2. Guardar el token en el usuario correspondiente
    const result = await db.query(
      "UPDATE usuarios SET token_recuperacion = $1 WHERE email = $2 RETURNING id",
      [resetToken, email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No existe un usuario con ese email" });
    }

    // 3. Configurar el envío de correo (Ejemplo con Gmail o Mailtrap)
    const transporter = nodemailer.createTransport({
       service: 'gmail', // O tu proveedor
       auth: {
         user: process.env.EMAIL_USER,
         pass: process.env.EMAIL_PASS
       }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Recuperación de Contraseña',
      text: `Usa este token para resetear tu clave: ${resetToken}`
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "Correo de recuperación enviado" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/auth/reset-password", async (req, res) => {
  const { token, newpassword } = req.body;
  try {
    // 1. Encriptar la nueva clave
    const hashedPassword = await bcrypt.hash(newpassword, 10);

    // 2. Buscar usuario con ese token y actualizar
    const result = await db.query(
      "UPDATE usuarios SET password = $1, token_recuperacion = NULL WHERE token_recuperacion = $2 RETURNING id",
      [hashedPassword, token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Token inválido o expirado" });
    }

    res.json({ message: "Contraseña actualizada con éxito" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



app.get("/api/tareas", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await db.query('SELECT * FROM tareas WHERE user_id = $1', [userId]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las tareas" });
  }
});

app.get("/api/tarea/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // Obtenemos el ID del usuario del token

    // Agregamos 'AND user_id = $2' para asegurar la privacidad
    const result = await db.query(
      'SELECT * FROM tareas WHERE id=$1 AND user_id=$2', 
      [id, userId]
    );
    
    if (result.rows.length === 0) {
      // Ocultamos si existe o no la tarea para mayor seguridad
      return res.status(404).json({ error: "Tarea no encontrada o no te pertenece" });
    }
    
    res.json(result.rows[0]); 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.post("/api/tareas", verifyToken, async (req, res) => { 
  try {
    const { title, descripcion } = req.body;
    
    // El 'user_id' viene del middleware verifyToken
    const userId = req.user.id; 

    const result = await db.query(
      'INSERT INTO tareas (title, descripcion, user_id) VALUES ($1, $2, $3) RETURNING *', 
      [title, descripcion, userId] 
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/tareas/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, descripcion } = req.body;
    const userId = req.user.id; // Obtenemos al dueño desde el token

    // Actualizamos solo si el ID de la tarea Y el user_id coinciden
    const result = await db.query(
      'UPDATE tareas SET title = $1, descripcion = $2 WHERE id = $3 AND user_id = $4 RETURNING *', 
      [title, descripcion, id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Tarea no encontrada o no tienes permiso para editarla" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/tareas/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // Obtenemos el dueño desde el token
    
    // Filtramos que la tarea pertenezca al usuario del token
    const result = await db.query(
      'DELETE FROM tareas WHERE id = $1 AND user_id = $2 RETURNING *', 
      [id, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Tarea no encontrada o no te pertenece" });
    }
    res.json({ message: "Tarea eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/", (req,res)=>{
  res.sendFile("index.html", { root: "public" });
});

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});