// sockets.js
import prisma from './db.js'; // Asegúrate de que la ruta sea correcta

export default function (io) {
    io.on("connection", (socket) => {
        console.log(`Usuario conectado: ${socket.id}`);

        // Evento: Unirse a una sala
        socket.on("join_room", async (data) => {
            // 'data' es el ID de la sala que envía el frontend
            socket.join(data);
            console.log(`Usuario ${socket.id} entró a sala: ${data}`);

            try {
                const messages = await prisma.message.findMany({
                    where: {
                        room: data, // <--- CORRECCIÓN: usabas 'room' que no existía, es 'data'
                    },
                    orderBy: {
                        id: 'asc',
                    },
                });
                
                // Enviamos historial solo al que entró
                socket.emit("load_messages", messages); // <--- Ojo: en frontend pusiste 'load_messages' (plural) o 'load_message' (singular)? Revisa que coincidan.
            } catch (error) {
                console.error("Error al recuperar mensajes: ", error);
            }
        });

        // Evento: Enviar mensaje
        socket.on("send_message", async (data) => {
            try {
                // Guardar en DB
                await prisma.message.create({
                    data: {
                        room: data.room,
                        author: data.author,
                        message: data.message,
                        time: data.time
                    }
                });

                // Enviar a los demás
                socket.to(data.room).emit("receive_message", data);
            } catch (error) {
                console.error("Error al guardar mensaje:", error);
            }
        });

        socket.on("disconnect", () => {
            console.log("Usuario desconectado", socket.id);
        });
    });
}