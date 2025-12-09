// server.js
import http from 'http'; // Importar el módulo nativo de Node
import { Server } from 'socket.io'; // Importar librería socket.io
import app from './app.js';
import socketEvents from './config/sockets.js'; // Importamos la función del paso 1

const port = process.env.PORT || 5000;

// 1. Crear el servidor HTTP usando Express
const server = http.createServer(app);

// 2. Configurar Socket.io sobre ese servidor
const io = new Server(server, {
    cors: {
        origin: "*", // Permitir conexión desde cualquier lado (Frontend)
        methods: ["GET", "POST"],
    }
});

// 3. Inicializar los eventos de Sockets (Le pasamos la instancia 'io')
socketEvents(io);

// 4. IMPORTANTE: Usar server.listen, NO app.listen
server.listen(port, () => {
    console.log(`Servidor (Express + Socket.io) corriendo en http://localhost:${port}`);
});