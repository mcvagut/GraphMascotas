import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import neo4j from "neo4j-driver";
import userRoutes from "./routes/user.js";
import petRoutes from "./routes/pet.js";
import rescueOrganizationRoutes from "./routes/rescueOrganization.js";
import categoriaRoutes from "./routes/categoria.js";

import http from 'http';
import { Server } from 'socket.io';



const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Cambia esto según tu URL de frontend
    methods: ['GET', 'POST'],
    credentials: true,
  }, // Habilita WebSocket
});
dotenv.config();

// Configura la conexión a Neo4j
const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const socketsPorUsuario = {};

io.on("connection", (socket) => {
  console.log(`Usuario conectado con ID: ${socket.id}`);
  
  socket.emit('prueba', 'Hola desde el backend');

  // Manejar el evento 'usuarioConectado'
  socket.on('identificador', (userIdentificador) => {
    console.log(`Usuario ${userIdentificador} conectado con el socket ${socket.id}`);
    
    // Mapear el ID del socket al identificador único del usuario
    socketsPorUsuario[userIdentificador] = socket.id;
  });

  // Resto del código de manejo de conexiones y eventos

  socket.on('disconnect', () => {
    // Eliminar el mapeo cuando un usuario se desconecta
    const usuario = Object.keys(socketsPorUsuario).find(key => socketsPorUsuario[key] === socket.id);
    if (usuario) {
      console.log(`Usuario ${usuario} desconectado`);
      delete socketsPorUsuario[usuario];
    }
  });
});
export { socketsPorUsuario };

// Asociar io al objeto app
app.set('io', io);

// Middleware para configurar una sesión de Neo4j
app.use((req, res, next) => {
  const session = driver.session();
  req.neo4jSession = session;
  res.on("finish", () => {
    session.close();
  });
  next();
});

// Otros middlewares
app.use(cookieParser());
app.use(express.json());
app.use(cors());

// Rutas para usuarios
app.use("/api/users", userRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/rescueOrganizations", rescueOrganizationRoutes);
app.use("/api/categorias", categoriaRoutes);




// Inicia el servidor
server.listen(8800, () => {
  console.log(`Servidor escuchando en el puerto 8800`);
});
