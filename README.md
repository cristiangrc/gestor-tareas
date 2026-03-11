
Una API RESTful construida con Node.js, Express y PostgreSQL para la gestión de usuarios y tareas. Este backend incluye un sistema completo de autenticación (registro, login, recuperación de contraseña) y operaciones CRUD protegidas para que cada usuario solo pueda gestionar sus propias tareas.

 Tecnologías Utilizadas
Entorno de ejecución: Node.js

Framework: Express.js

Base de Datos: PostgreSQL (pg)

Autenticación y Seguridad: JSON Web Tokens (jsonwebtoken), bcrypt (hash de contraseñas), crypto

Manejo de Correos: nodemailer

Otros: cors, dotenv

Utilizar vite 
npm create vite@latest crean el proyecto
para inicializar el fronted npm run dev
y el backend node index.js

BASE DE DATOS 

-- Tabla de Usuarios
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(25) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    password TEXT NOT NULL, -- Aquí guardarás el hash de la contraseña
    token_recuperacion TEXT, -- Para la funcionalidad de recuperar contraseña
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Tareas Modificada
CREATE TABLE tareas (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE, -- Relación con el usuario
    title TEXT NOT NULL,
    descripcion TEXT,
    completed BOOLEAN DEFAULT FALSE,

);



