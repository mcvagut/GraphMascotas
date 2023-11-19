import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import neo4j from "neo4j-driver";
import userRoutes from "./routes/user.js";
import petRoutes from "./routes/pet.js";
import rescueOrganizationRoutes from "./routes/rescueOrganization.js";
import { Server } from "socket.io";
import http from "http";


const app = express();

const server = http.createServer(app);
const io = new Server(server);

dotenv.config();

// Configura la conexión a Neo4j
const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);


// Configura Socket.io
io.on("connection", (socket) => {
  // Asigna el id del socket cuando se conecta un cliente
  socket.on("setSocketId", (data) => {
    socket.socketId = data.socketId;
  });
});

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




// Inicia el servidor
server.listen(8800, () => {
  console.log(`Servidor escuchando en el puerto 8800`);
});
