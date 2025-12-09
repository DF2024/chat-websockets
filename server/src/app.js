// IMPORTACIÓN PARA PODER USAR LOS .env
//-----------------------
import dotenv from 'dotenv';
dotenv.config()
// ----------------------

import express from 'express'
const app = express()

app.get('/', (req, res) => {
    res.send('<h1>Chat with WebSocket</h1>')
})

export default app;

